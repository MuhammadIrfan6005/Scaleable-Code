using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scaleable.Xrm.Plugins.ActAccData.SyncActParties
{
    public class createRetrieveActivityParties : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {

            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            ITracingService tracingservice = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            // Obtain the organization service reference.
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

            if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is EntityReference && context.MessageName.ToUpper() == "DELETE")
            {
                return;
            }

            else if ((context.InputParameters.Contains("Target")) && (context.InputParameters["Target"] is Entity) && ((context.MessageName.ToUpper() == "UPDATE") || (context.MessageName.ToUpper() == "CREATE")))
            {
                Entity entity = (Entity)context.InputParameters["Target"];

                if (entity.LogicalName != "ss_activitiesaccountdata")
                {
                    return;
                }
                if (context.Depth > 2)
                {
                    return;
                }

                try
                {
                    string activityId = null;
                    Entity partiesImage = new Entity();

                    if (entity.Attributes.Contains("ss_activityid"))
                    {
                        if (entity["ss_activityid"] != null)
                        {
                            activityId = (string)(entity["ss_activityid"]);
                        }
                    }
                    else if (context.MessageName.ToUpper() == "UPDATE")
                    {
                        partiesImage = (Entity)context.PreEntityImages["partiesImage"];


                        if (partiesImage.Attributes.Contains("ss_activityid"))
                        {
                            activityId = partiesImage.GetAttributeValue<string>("ss_activityid");
                        }
                    }

                    deleteActivityParties(service, tracingservice, activityId);

                    var QEactivityparty = new QueryExpression("activityparty");
                    QEactivityparty.ColumnSet.AddColumns("partyid", "activitypartyid", "ispartydeleted", "activityid");
                    QEactivityparty.Criteria.AddCondition("activityid", ConditionOperator.Equal, activityId);
                    //QEactivityparty.Criteria.AddCondition("participationtypemask", ConditionOperator.NotEqual, 8);
                    EntityCollection activityParties = service.RetrieveMultiple(QEactivityparty);

                    EntityReference party = new EntityReference();

                    foreach (Entity activityparty in activityParties.Entities)
                    {
                        if (activityparty.Attributes.Contains("partyid") && activityparty["partyid"] != null)
                        {

                            party = (EntityReference)activityparty["partyid"];
                            Entity activitiesAccountParties = new Entity("ss_activityaccountparties");
                            activitiesAccountParties.Attributes["ss_activityid"] = activityId;
                            activitiesAccountParties.Attributes["ss_partyid"] = party.Id.ToString();
                            activitiesAccountParties.Attributes["ss_partylogicalname"] = party.LogicalName;

                            EntityReference activityaccountdata = new EntityReference("ss_activitiesaccountdata");
                            activityaccountdata.Id = entity.Id;

                            activitiesAccountParties.Attributes["ss_activityaccountdata"] = activityaccountdata;

                            try
                            {
                                service.Create(activitiesAccountParties);
                            }
                            catch (Exception e)
                            {
                                tracingservice.Trace(e.ToString());
                            }

                        }

                    }
                }
                catch (Exception ex)
                {
                    throw new InvalidPluginExecutionException("An error occurred in the Scalable.Xrm.Plugins.ActivitiesAccountData plug-in.", ex);
                }
            }
        }

        public void deleteActivityParties(IOrganizationService service, ITracingService tracingservice, string activityId)
        {
            var ss_activityaccountparties = new QueryExpression("ss_activityaccountparties");
            ss_activityaccountparties.ColumnSet.AddColumns("ss_activityid");
            ss_activityaccountparties.Criteria.AddCondition("ss_activityid", ConditionOperator.Equal, activityId);

            EntityCollection partiescollection = service.RetrieveMultiple(ss_activityaccountparties);

            foreach (Entity partyentity in partiescollection.Entities)
            {
                try
                {
                    service.Delete(partyentity.LogicalName, partyentity.Id);
                }
                catch (Exception e)
                {
                    tracingservice.Trace(e.ToString());
                }
            }
        }
    }
}
