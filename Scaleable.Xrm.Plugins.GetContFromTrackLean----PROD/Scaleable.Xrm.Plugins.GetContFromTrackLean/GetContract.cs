using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System.Net;
using System.IO;
using System.Web.Script.Serialization;

namespace Scaleable.Xrm.Plugins.GetContFromTrackLean
{
    public class GetContract : IPlugin
    {
        // scaleable API Key
        //private static string apikey = "19ssjeifmvg7nj7nda5t9cusd90semunvjr99k0jqkgf9v4hoj60";
        //private static string creator = "m.bilal@scaleablesolutions.com";

        // EQS API Key
        private static string apikey = "j244hge3idt2csc9f4786lgspb4jru089tt8a0l95heupd2lpuq";
        private static string creator = "marian.quandt@eqs.com";

        public void Execute(IServiceProvider serviceProvider)
        {
            #region Standard Initialization
            IPluginExecutionContext context =
                (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

            IOrganizationServiceFactory factory =
                (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));

            IOrganizationService service = factory.CreateOrganizationService(context.UserId);

            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            #endregion Standard Initialization

            #region Plugin Start
            try
            {
                tracingService.Trace("TrackLean Plugin Called");

                #region Stardard Validations

                if (!(context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity))
                    return;

                if (context.Depth > 1)
                    return;

                Entity entity = (Entity)context.InputParameters["Target"];
                if (entity.LogicalName != "ss_trackleanresponse")
                    return;

                #endregion

                #region validate fields

                //Create Case
                //if (context.MessageName != "Create" || !entity.Contains("ss_trackleancontractid"))
                    //return;

                #endregion

                #region filling vairables
                int contractID = 0;
                string message = null;
                string fileName = "";
                int idPosition = 0;
                string oppID = "";

                if (entity.Attributes.ContainsKey("ss_ss_trackleancontractid"))
                    contractID = (int)entity.Attributes["ss_ss_trackleancontractid"];
                if (entity.Attributes.ContainsKey("ss_message"))
                    message = (string)entity.Attributes["ss_message"];
                if (entity.Attributes.ContainsKey("ss_name"))
                    fileName = (string)entity.Attributes["ss_name"];

                tracingService.Trace("File Name :" + fileName);
                if (fileName.Contains("_@/"))
                {
                    idPosition = fileName.IndexOf("_@/");
                    oppID = fileName.Substring(idPosition + 3, 36);
                    fileName = fileName.Substring(0, idPosition);
                }
                
                #endregion

                //temp

                tracingService.Trace("File Name :" + fileName);
                tracingService.Trace("Message :" + message);
                tracingService.Trace("ID :" + contractID);
                tracingService.Trace("OppID :" + oppID);

                if (!String.IsNullOrWhiteSpace(message) && message == "AGREEMENT_SUCCEEDED" && contractID != 0)
                {
                    
                    Entity notes = new Entity("annotation");
                    
                    string base64String="";
                    try
                    {
                        using (WebClient client = new WebClient())
                        {
                            tracingService.Trace("IN API Calling Area");
                            tracingService.Trace("web client");
                            var bytes = client.DownloadData("https://api.tracklean.com/trackleanapi/v1/agreements/" + contractID + "/downloadPdf?apikey="+apikey);
                            base64String = Convert.ToBase64String(bytes);
                            tracingService.Trace("after");
                        }
                    }
                    catch(Exception ex)
                    {
                        throw new InvalidPluginExecutionException(OperationStatus.Failed, "Couldn't get the Agreement; "+ex.Message);
                    }
                    
                    notes["documentbody"] = base64String;
                    notes["filename"] = fileName;
                    notes["subject"] = fileName;
                    notes["mimetype"] = "application/pdf";
                    notes["notetext"] = "This is Signed Contract from TrackLean";
                    notes["objecttypecode"] = "opportunity";
                    notes["objectid"] = new EntityReference("opportunity",Guid.Parse(oppID));
                    service.Create(notes);
                }

                //string agreementId = "10166";
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException("Something went Wrong! " + ex.Message);
            }
            #endregion Plugin Start  

        }

        #region API Call
        
        #endregion API Call
    }
}
