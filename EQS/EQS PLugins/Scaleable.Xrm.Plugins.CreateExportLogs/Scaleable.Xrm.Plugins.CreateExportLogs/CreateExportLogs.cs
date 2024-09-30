using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System.Linq;
using System.Xml.Linq;

namespace Scaleable.Xrm.Plugins.CreateExportLogs
{
    public class CreateExportLogs :IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {

            try
            {

                #region Standard Initialization

                IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
                ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
                IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
                IOrganizationService service = factory.CreateOrganizationService(context.UserId);
                #endregion
          
                if (context.Depth != 2)
                    return;


                var parentContext = context.ParentContext;
                if (!(context.MessageName.Equals("RetrieveMultiple") && parentContext != null))
                    return;
                
                if (!(parentContext.MessageName == "ExportToExcel" ||
                                  parentContext.MessageName == "ExportDynamicToExcel"))
                    return;
                tracingService.Trace("Data Export Log triggered");
                var fetchxml = parentContext.InputParameters.Contains("FetchXml") ? parentContext.InputParameters["FetchXml"].ToString() : "";
                // var QueryParameters = parentContext.InputParameters.Contains("QueryParameters") ? parentContext.InputParameters["QueryParameters"] : "";
                //var qp = QueryParameters as InputArgumentCollection;            

                //if (qp != null && qp.Arguments.Contains("otn"))
                //{
                //    entityName = qp?.Arguments?["otn"]?.ToString();
                //}
                var entityName = "";
                if (fetchxml != "" && fetchxml != null)
                {
                    var xDoc = XDocument.Parse(fetchxml);
                    var response = xDoc.Descendants("entity").Single();
                    entityName = response.Attribute("name").Value;
                    
                }
                tracingService.Trace("entityName => " + entityName);
                Guid userid = context.InitiatingUserId;
                EntityReference entityReference = new EntityReference("systemuser", userid);
                Entity user = service.Retrieve("systemuser", userid, new ColumnSet("fullname"));
                string username = user.GetAttributeValue<string>("fullname");
              
                Entity DataExportLog = new Entity("ss_dataexportlog");
                DataExportLog.Attributes["ss_name"] = entityName + " Records exported by " + username;
                DataExportLog.Attributes["ss_exportedby"] = new EntityReference("systemuser", userid);
                DataExportLog.Attributes["ss_exportedas"] = parentContext.MessageName;
                DataExportLog.Attributes["ss_entityname"] = entityName;
                DataExportLog.Attributes["ss_query"] = fetchxml;
                service.Create(DataExportLog);

            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException(ex.Message, ex);
            }
        }
    }
}
