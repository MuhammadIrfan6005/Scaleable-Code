using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System.Web.Script.Serialization;
using Microsoft.Xrm.Sdk.Messages;

namespace XMLQuoteDocumentGenerator
{
    public class CreateXMLQuotePDFDocument : IPlugin
    {
        /// <summary>
        ///     Generating XML Quote Document Template
        ///     Registered on action (XML Quote Document Generator)
        /// </summary>      
        /// <param> 
        ///   <param name="recordid">       Input :   string - Account Id     
        ///   <param name="documentname">       Input :   string - Document Name to download
        ///   <param name="notedescription">       Input :   string - notetext 
        ///   <param name="entitytype">       Input :   string - Entityname 
        ///   <param name="result">       Output :   string - result of the Process 
        ///</param>summary>
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = null;
            ITracingService tracingService = null;
            try
            {
                #region Standard Initization

                context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
                IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
                IOrganizationService service = factory.CreateOrganizationService(context.UserId);
                tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

                #endregion
                tracingService.Trace("XML Quote Document Generator Triggered");
                if (context.InputParameters.ContainsKey("recordid") && context.InputParameters["recordid"] is string)
                {
                    tracingService.Trace("Into Account id check and GUID is ==> " + context.InputParameters["recordid"]);
                    string globalrecordid = context.InputParameters["recordid"]?.ToString();
                    string Document_Name = context.InputParameters["documentname"]?.ToString();
                    string Note_Dec = context.InputParameters["notedescription"]?.ToString();
                    string entitytype = context.InputParameters["entitytype"]?.ToString();
                    tracingService.Trace("Global Record ID ==> {0} <=> Document_Name ==> {1} <=> Note_Dec <==> {2} EntityName<==> {3}", globalrecordid, Document_Name, Note_Dec, entitytype);
                    var Firma_Field = Note_Dec == "{--XMLQuoteParentFirma" ? "ss_parentfirmaid" : "ss_firmaid";
                    var globalfield = entitytype == "opportunity" ? "ss_xmlopportunityid" : Firma_Field;
                    EntityCollection XmlQuotesCollection = GetAllXMLQuotesofCurrentAccount(service, Guid.Parse(globalrecordid), globalfield);
                    Money totalErspanis = (XmlQuotesCollection.Entities.Count > 0) ? new Money(XmlQuotesCollection.Entities.Sum(item => item.GetAttributeValue<Money>("ss_ersparnis").Value)) : new Money(0);
                    Entity CurrentEntity = new Entity(entitytype, Guid.Parse(globalrecordid));
                    CurrentEntity["ss_xmlquotesersparnis"] = totalErspanis;
                    service.Update(CurrentEntity);
                    List<EntityReference> entityReferences = new List<EntityReference>();
                    EntityCollection existingDocs = getExistingDocument(service, Guid.Parse(globalrecordid), Note_Dec);
                    foreach (var entity in existingDocs.Entities)
                    {
                        entityReferences.Add(new EntityReference("annotation", entity.GetAttributeValue<Guid>("annotationid")));
                    }

                    BulkDelete(service, entityReferences);                 
                    var DocQuery = GetDocumentQueryExpression(Document_Name);
                    var documents = service.RetrieveMultiple(DocQuery);
                    var document = documents.Entities[0];
                    Guid documentTemplateId = document.GetAttributeValue<Guid>("documenttemplateid");
                    int entityTypeCode = entitytype == "account" ? 1 : 3; 
                    CreateWordandPDFNoteAttachments(service, documentTemplateId, Guid.Parse(globalrecordid), entityTypeCode, Note_Dec);
                    context.OutputParameters["result"] = "Document generated successfully";
                }
            }
            catch (Exception ex)
            {
                context.OutputParameters["result"] = ex.Message;
                tracingService?.Trace("stack trace is: " + ex.StackTrace);

                tracingService?.Trace(string.Format("An error occurred in XML Quote Document Generator. \n Exception Message: {0}", ex.Message));
            }
        }
        //Creating PDF Note
        public static void CreateWordandPDFNoteAttachments(IOrganizationService _service, Guid documentTemplateId, Guid recordId, int entityTypeCode, string noteDescription)
        {
            // Create new Organization service with admin user to call "ExportPdfDocument" message 

            try
            {
                OrganizationRequest request = new OrganizationRequest("ExportPdfDocument");
                request["EntityTypeCode"] = entityTypeCode;
                request["SelectedTemplate"] = new EntityReference("documenttemplate", documentTemplateId);
                List<Guid> records = new List<Guid> { recordId };
                request["SelectedRecords"] = new JavaScriptSerializer().Serialize(records);
                //request["SelectedRecords"] = serializer.Serialize(records);

                OrganizationResponse pdfResponse = (OrganizationResponse)_service.Execute(request);

                //Write to file
                string b64File = Convert.ToBase64String((byte[])pdfResponse["PdfFile"]);

                // Create note by using the above base 64 string.
                // Creating PDF Attachment
                Entity Annotation = new Entity("annotation");
                Annotation.Attributes["subject"] = "PDF note using Document template";
                Annotation.Attributes["documentbody"] = b64File;
                Annotation.Attributes["objectid"] = new EntityReference(entityTypeCode == 1 ? "account" : "opportunity", recordId);
                Annotation.Attributes["mimetype"] = @"application/pdf";
                Annotation.Attributes["notetext"] = noteDescription;
                Annotation.Attributes["filename"] = "XML Quote Price Calculations Document.pdf";
                _service.Create(Annotation);

                // Creating Word Document Attachment
                OrganizationRequest req = new OrganizationRequest("SetWordTemplate");
                
                req["Target"] = new EntityReference(entityTypeCode == 1 ? "account" : "opportunity", recordId);
                req["SelectedTemplate"] = new EntityReference("documenttemplate", documentTemplateId);
               var id =  _service.Execute(req);
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException("An error occured in Creation of Document " + ex.Message, ex);
            }
        }
        //
        public static EntityCollection getExistingDocument(IOrganizationService service, Guid recordid, string Note_Dec)
        {
            var fetchData = new
            {
                objectid = recordid,
                notetext = Note_Dec
            };
            var fetchXml = $@"<fetch top='2'>
                          <entity name='annotation'>
                            <attribute name='subject' />
                            <attribute name='annotationid' />
                            <filter type='and'>
                              <condition attribute='objectid' operator='eq' value='{fetchData.objectid}'/>
                              <condition attribute='notetext' operator='like' value='{fetchData.notetext}'/>
                            </filter>
                          </entity>
                        </fetch>";
            EntityCollection fetchResult = service.RetrieveMultiple(new FetchExpression(fetchXml));
            return fetchResult;
        }
        // Document Query Expression
        public static QueryExpression GetDocumentQueryExpression(string name)
        {
            QueryExpression qeDocument = new QueryExpression("documenttemplate");

            qeDocument.ColumnSet.AddColumns("documenttype");
            qeDocument.ColumnSet.AddColumns("content");
            qeDocument.ColumnSet.AddColumns("documenttemplateid");
            qeDocument.ColumnSet.AddColumn("name");
            qeDocument.Criteria = new FilterExpression();
            qeDocument.Criteria.FilterOperator = LogicalOperator.And;
            qeDocument.Criteria.AddCondition(new ConditionExpression("name", ConditionOperator.Equal, name));
            return qeDocument;
        }
        // Get All XML Quotes Related to the current Account 
        public static EntityCollection GetAllXMLQuotesofCurrentAccount(IOrganizationService service, Guid recordid, string globalfield)
        {
            var fetchData = new
            {
                ss_isxmlquote_q = "1",
                AccountId = recordid,
                FirmaField = globalfield
            };
            var fetchXml = $@"
                <fetch>
                  <entity name='quote'>
                    <attribute name='ss_parentfirmaid' />
                    <attribute name='quoteid' />
                    <attribute name='ss_firmaid' />
                    <attribute name='ss_ersparnis' />
                    <filter type='and'>
                      <condition attribute='ss_isxmlquote_q' operator='eq' value='{fetchData.ss_isxmlquote_q}'/>
                      <condition attribute='{fetchData.FirmaField}' operator='eq' value='{fetchData.AccountId}'/>
                    </filter>
                  </entity>
                    </fetch>";
            EntityCollection XmlQuotesCollection = service.RetrieveMultiple(new FetchExpression(fetchXml));
            return XmlQuotesCollection;
        }
        // Bulk Delete
        public static void BulkDelete(IOrganizationService service, List<EntityReference> entityReferences)
        {
            for (int i = 0; i < entityReferences.Count; i += 300)
            {
                // Create an ExecuteMultipleRequest object.
                var multipleRequest = new ExecuteMultipleRequest()
                {
                    // Assign settings that define execution behavior: continue on error, return responses. 
                    Settings = new ExecuteMultipleSettings()
                    {
                        ContinueOnError = false,
                        ReturnResponses = true
                    },
                    // Create an empty organization request collection.
                    Requests = new OrganizationRequestCollection()
                };

                // Add a DeleteRequest for each entity to the request collection.
                foreach (var entityRef in entityReferences.Skip(i).Take(300).ToList())
                {
                    DeleteRequest deleteRequest = new DeleteRequest { Target = entityRef };
                    multipleRequest.Requests.Add(deleteRequest);
                }
                if (multipleRequest.Requests.Count > 0)
                {
                    // Execute all the requests in the request collection using a single web method call.
                    ExecuteMultipleResponse multipleResponse = (ExecuteMultipleResponse)service.Execute(multipleRequest);
                }
            }
        }
    }
}
