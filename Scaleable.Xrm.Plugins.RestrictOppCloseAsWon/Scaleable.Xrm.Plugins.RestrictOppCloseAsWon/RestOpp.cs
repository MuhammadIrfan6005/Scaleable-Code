using log4net.Plugin;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scaleable.Xrm.Plugins.RestrictOppCloseAsWon
{
    public class RestOpp : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            #region Standard Initializations
            IPluginExecutionContext context =
                (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));


            IOrganizationServiceFactory factory =
                (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);

            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            #endregion Standard Initializations

            tracingService.Trace("traincing start");
            tracingService.Trace("Depth: "+ context.Depth);

            #region plugin start
            try
            {

                string stepname = null; 
                int status =0;
                Int32 count = 0;

                if (!(context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity))
                    return;
                Entity preEntity = new Entity();
                if (context.MessageName == "Update" && context.PreEntityImages.Contains("PreEntity"))
                {
                    preEntity = (Entity)context.PreEntityImages["PreEntity"];
                    tracingService.Trace("Image contains");
                }

                Entity entity = (Entity)context.InputParameters["Target"];
                if (entity.LogicalName != "opportunity" && context.MessageName != "Update")
                    return;
                Guid opportunityid = entity.Id;
                tracingService.Trace("ID " + opportunityid.ToString());

                if (entity.Attributes.Contains("statecode"))
                {
                    if(entity.Attributes["statecode"] != null)
                    {
                        status = entity.GetAttributeValue<OptionSetValue>("statecode").Value;
                        //status = )entity.Attributes["statecode"];
                        tracingService.Trace("Status " + status);
                    }
                }
                if(status == 1)
                {
                    if (entity.Attributes.Contains("stepname"))
                        stepname = (String)entity.Attributes["stepname"];
                    else
                        stepname = (String)preEntity.Attributes["stepname"];
                    tracingService.Trace("stepname " + stepname);


                    #region Query
                    var QEannotation_notetext = "%{{Contract--%";
                    var QEannotation_opportunity_opportunityid = opportunityid.ToString();

                    // Instantiate QueryExpression QEannotation
                    var QEannotation = new QueryExpression("annotation");

                    // Add columns to QEannotation.ColumnSet
                    QEannotation.ColumnSet.AddColumns("subject", "notetext", "filename", "annotationid");
                    QEannotation.AddOrder("subject", OrderType.Ascending);

                    // Define filter QEannotation.Criteria
                    QEannotation.Criteria.AddCondition("notetext", ConditionOperator.Like, QEannotation_notetext);

                    // Add link-entity QEannotation_opportunity
                    var QEannotation_opportunity = QEannotation.AddLink("opportunity", "objectid", "opportunityid");
                    QEannotation_opportunity.EntityAlias = "ag";

                    // Define filter QEannotation_opportunity.LinkCriteria
                    QEannotation_opportunity.LinkCriteria.AddCondition("opportunityid", ConditionOperator.Equal, QEannotation_opportunity_opportunityid);
                    #endregion end query 

                    EntityCollection entityCollection = service.RetrieveMultiple(QEannotation);
                    tracingService.Trace("Notes Count =" + entityCollection.Entities.Count);
                    count = entityCollection.Entities.Count;

                    if (stepname != "4-Close")
                    {
                        tracingService.Trace("Pipeline Phase does not Close");
                        throw new InvalidPluginExecutionException(OperationStatus.Failed, "Please complete all the Business Stages; ");
                    }
                    if (count < 1) 
                    {
                        tracingService.Trace("There is no contract");
                        throw new InvalidPluginExecutionException(OperationStatus.Failed, "Contract is missing, Please upload the Contract; ");
                    }

                }






            }
            catch (Exception ex)
            {
                if (ex.Message == "Please complete all the Business Stages; ")
                    throw new InvalidPluginExecutionException(OperationStatus.Failed, "Please complete all the Business Stages; ");
                else if(ex.Message == "Contract is missing, Please upload the Contract; ")
                    throw new InvalidPluginExecutionException(OperationStatus.Failed, "Contract is missing, Please upload the Contract; ");
                else
                    tracingService.Trace("something went other wrong :" + ex.Message);
            }
            #endregion
        }
    }
}
