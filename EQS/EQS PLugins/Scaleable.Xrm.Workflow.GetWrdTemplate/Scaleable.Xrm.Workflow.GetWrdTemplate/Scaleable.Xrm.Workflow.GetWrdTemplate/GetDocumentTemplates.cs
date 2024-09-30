using System;
using System.Activities;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Crm.Sdk.Messages;
using System.ServiceModel;

namespace Scaleable.Xrm.Workflow.GetWrdTemplate
{
    
   public class GetDocumentTemplates : CodeActivity
    {
        [Output("DocumentOutput")]
        [ReferenceTarget("documenttemplate")]
        public OutArgument<EntityReference> DocumentOutputName { get; set; }

        //for EQS Test 2 
        //[Input("Template Language")]
        //[AttributeTarget("opportunity", "ss_precontraclanguage")]
        //[Default("1")]
        //public InArgument<OptionSetValue> TemplateLanguage { get; set; }

        //for Production
        [Input("Template Language")]
        [AttributeTarget("opportunity", "ss_precontractlanguage")]
        [Default("1")]
        public InArgument<OptionSetValue> TemplateLanguage { get; set; }


        [Input("Contract Type")]
        [AttributeTarget("opportunity", "ss_contracttype")]
        public InArgument<OptionSetValue> ContractType { get; set; }

        [Input("Active Form")]
        [AttributeTarget("opportunity", "ss_activeform")]
        public InArgument<string> ActiveForm { get; set; }




        //[Output("DocumentOutput")]
        //public OutArgument<string> DocumentOutputName { get; set; }

        protected override void Execute(CodeActivityContext executionContext)
        {
            IWorkflowContext context = executionContext.GetExtension<IWorkflowContext>();
            IOrganizationServiceFactory serviceFactory = executionContext.GetExtension<IOrganizationServiceFactory>();
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);
            

            //GUID of target record
            Guid recordId = context.PrimaryEntityId;
            
            //ITracingService tracingService = (ITracingService)executionContext.GetService(typeof(ITracingService));
            ITracingService tracingService = executionContext.GetExtension<ITracingService>();
            tracingService.Trace("Language => " + TemplateLanguage.Get<OptionSetValue>(executionContext).Value);
            tracingService.Trace("Active form is => " + ActiveForm.Get<string>(executionContext));
            int Language = TemplateLanguage.Get<OptionSetValue>(executionContext).Value;
            string activeform = ActiveForm.Get<string>(executionContext);
            int contractType = ContractType.Get<OptionSetValue>(executionContext).Value;
            tracingService.Trace("Contract Type is => " + contractType);
            //if (ContractType.Get<OptionSetValue>(executionContext) != null && activeform == "swiss")
            //{
            //    contractType = ContractType.Get<OptionSetValue>(executionContext).Value;
            //    tracingService.Trace("Contract Language is => " + Language.ToString());
            //    tracingService.Trace("Active form is => " + activeform.ToString());
            //    tracingService.Trace("Contract Types is => " + contractType.ToString());
            //}
            //else
            //{
            //    contractType = 1;
            //}
           

           
            QueryExpression qe = GetTemplateQueryExpression(context, Language, contractType,tracingService, activeform);
            tracingService.Trace("QE Result is => " + qe);
            tracingService.Trace("After 1st  Query Expression:");
            tracingService.Trace("Contract Type is => " + contractType);
            EntityCollection opertunities = service.RetrieveMultiple(qe);
            tracingService.Trace("Count:" + opertunities.Entities.Count);
            if (opertunities.Entities.Count > 0)
            {
                tracingService.Trace("in If Statement");
                    var opertunity = opertunities.Entities[0];
                
                    // opertunity.Id
                    var name = opertunity.GetAttributeValue<string>("ss_templatename");
                    tracingService.Trace("Name:"+name.ToString());

                    QueryExpression qeDocument = GetDocumentQueryExpression(name, tracingService);
                    
                    var documents = service.RetrieveMultiple(qeDocument);
                    tracingService.Trace("Documents are => " + documents.Entities.Count());
                    var document = documents.Entities[0];
                tracingService.Trace("Single Document is => " + document.LogicalName);

                    //tracingService.Trace("Document:"+document);

                    string encodedData = document.GetAttributeValue<string>("content"); //System.Convert.ToBase64string(filename);
                    //tracingService.Trace("encodedData:" + encodedData);
                    Guid docId = document.GetAttributeValue<Guid>("documenttemplateid");
                    tracingService.Trace("DocGuid:" + docId);
                    #region Generate Word

                    // Guid customEntityDataGuid = new Guid("F85DF784-F534-E911-A98C-000D3AB2924F");
                    // Guid DocumentTemplateDataGuid = new Guid("4249cb4c-cd34-e911-a98c-000d3ab2924f");

                    //tracingService.Trace("customEntityDataGuid:" + customEntityDataGuid);
                    //tracingService.Trace("DocumentTemplateDataGuid:" + DocumentTemplateDataGuid);
                    if (docId != null)
                    {
                        DocumentOutputName.Set(executionContext, new EntityReference("documenttemplate", docId));
                    }
                    //DocumentOutputName.Set(executionContext, name);
                    //OrganizationRequest req = new OrganizationRequest("SetWordTemplate");
                    //req["Target"] = new EntityReference("ss_opportunitytemplatemapping", customEntityDataGuid);
                    //req["SelectedTemplate"] = new EntityReference("documenttemplate", DocumentTemplateDataGuid);

                    //try
                    //{
                    //    var response=service.Execute(req);
                    //    tracingService.Trace(response.ToString());
                    //}
                    //catch (FaultException<OrganizationServiceFault> ex)
                    //{
                    //    string message = "An error occurred while creating template document";
                    //    throw new InvalidPluginExecutionException(
                    //        message + "    ....   " + ex.Message + "..." + ex.InnerException);
                    //}

                    //tracingService.Trace("Req:" + req);

                    #endregion Generate word
                    //public Microsoft.Xrm.Sdk.OrganizationResponse ExecuteCrmOrganizationRequest(Microsoft.Xrm.Sdk.OrganizationRequest req, string logMessageTag = "User Defined");
                    //Entity Annotation = new Entity("annotation");


                    //Annotation.Attributes["objectid"] = new EntityReference("opportunity", recordId);
                    //tracingService.Trace("opportunity:" + recordId);

                    ////Annotation.Attributes["objecttypecode"] = new OptionSetValue(3);
                    //Annotation.Attributes["subject"] = "Demo";
                    //Annotation.Attributes["documentbody"] = encodedData;
                    //tracingService.Trace("After Document Body"); 
                    //Annotation.Attributes["mimetype"] = @"application/vnd.openxmlformats-officedocument.wordprocessingml.document"; //@"application/vnd.openxmlformats-officedocument.wordprocessingml.document";//document.GetAttributeValue<string>("documenttype");
                    //tracingService.Trace("After mimetype");
                    //Annotation.Attributes["notetext"] = "Sample attachment.";
                    //Annotation.Attributes["filename"] = name+ ".docx";
                    //tracingService.Trace("End of Plugin before service.create");
                    //service.Create(Annotation);
                
            }
            

        }//End of Execute fun
        public QueryExpression GetTemplateQueryExpression(IWorkflowContext context, int Language, int contractType, ITracingService tracingService, string activeform)
        {
            QueryExpression qe = new QueryExpression("ss_opportunitytemplatemapping");

            qe.ColumnSet.AddColumns("ss_templatename", "ss_contractlanguage");
            qe.Criteria = new FilterExpression();
            qe.Criteria.FilterOperator = LogicalOperator.And;
            qe.Criteria.AddCondition(new ConditionExpression("ss_contracttype", ConditionOperator.Equal, contractType));
            qe.Criteria.AddCondition(new ConditionExpression("ss_contractlanguage", ConditionOperator.Equal, Language));
            //if (activeform == "swiss")
            //{
            //    qe.Criteria.AddCondition(new ConditionExpression("ss_businessunit_name", ConditionOperator.Equal, context.BusinessUnitId.ToString()));
            //}
            var BUNAME = context.BusinessUnitId.ToString();
            tracingService.Trace("BU Name is => " + BUNAME);
            return qe;
        }
        public QueryExpression GetDocumentQueryExpression(string name, ITracingService tracingService)
        {
            try
            {
                QueryExpression qeDocument = new QueryExpression("documenttemplate");

                qeDocument.ColumnSet.AddColumns("documenttype");
                qeDocument.ColumnSet.AddColumns("content");
                qeDocument.ColumnSet.AddColumns("documenttemplateid");
                qeDocument.Criteria = new FilterExpression();
                qeDocument.Criteria.FilterOperator = LogicalOperator.And;
                qeDocument.Criteria.AddCondition(new ConditionExpression("name", ConditionOperator.Equal, name));
                return qeDocument;
            }
            catch (Exception ex)
            {
                throw  new Exception(ex.Message);
            }
           
        }
    }

}
