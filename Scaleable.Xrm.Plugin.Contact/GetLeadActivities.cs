using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scaleable.Xrm.Plugin.Contact
{
    public class GetLeadActivities : IPlugin
    {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Plugin Name: Scaleable.Xrm.Plugin.Contact                                                                            ///
        /// Target Entity: Contact                                                                                              ///
        /// Message: Create                                                                                                    ///
        /// Description: This plugin will change the regarding/tp of all activites realted to a lead when lead will be qulified. ///
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);

            ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity entity = (Entity)context.InputParameters["Target"];

            try
            {
                if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
                {
                    if (entity.LogicalName == "contact")
                    {

                        if (entity.Attributes.Contains("originatingleadid"))
                        { 

                            EntityReference originatingLead = (EntityReference)entity["originatingleadid"];

                            List<Guid> guidList = new List<Guid>();

                            //defining activity party to set (contact)
                            Entity activityParty = new Entity("activityparty");
                            activityParty.Attributes["partyid"] = new EntityReference("contact", entity.Id);
                            EntityCollection colAP = new EntityCollection();

                            // Instantiate QueryExpression QEactivitypointer
                            var QEactivitypointer = new QueryExpression("activitypointer");

                            // Add columns to QEactivitypointer.ColumnSet
                            QEactivitypointer.ColumnSet.AddColumns("activityid", "activitytypecode");
                            QEactivitypointer.Criteria.AddCondition("statecode", ConditionOperator.NotIn, 1, 2);
                            QEactivitypointer.Criteria.AddCondition("activitytypecode", ConditionOperator.In, 4201, 4207, 4210, 4212, 4202);

                            // Add link-entity QEactivitypointer_activityparty
                            var QEactivitypointer_activityparty = QEactivitypointer.AddLink("activityparty", "activityid", "activityid");
                            
                            // Add columns to QEactivitypointer_activityparty.Columns
                            QEactivitypointer_activityparty.Columns.AddColumns("partyid", "participationtypemask");

                            // Define filter QEactivitypointer_activityparty.LinkCriteria
                            QEactivitypointer_activityparty.LinkCriteria.AddCondition("participationtypemask", ConditionOperator.In, 4, 3, 6, 8, 5, 1, 2);
                            QEactivitypointer_activityparty.LinkCriteria.AddCondition("partyid", ConditionOperator.Equal, originatingLead.Id);

                            EntityCollection activityPointer = service.RetrieveMultiple(QEactivitypointer);

                            foreach (var activity in activityPointer.Entities)
                            {
                                bool has = guidList.Any(s => s == activity.Id);

                                if (has == true)
                                {
                                    continue;
                                }

                                else
                                {
                                    guidList.Add(activity.Id);
                                }
                                    

                                string activityType = (string)activity["activitytypecode"];
                                Entity updatedActivity = new Entity(activityType);
                                updatedActivity.Id = activity.Id;

                                Entity activity1 = service.Retrieve(activityType, activity.Id, new ColumnSet(true));

                                if (activity1.Attributes.Contains("to"))
                                {
                                    EntityCollection to = activity1.GetAttributeValue<EntityCollection>("to");
                        

                                    if (to.Entities.Count != 0)
                                    {
                                        to.Entities.ToList().ForEach(party =>
                                        {
                                            EntityReference partyId = (EntityReference)party["partyid"];

                                           if((partyId.Id == originatingLead.Id) && originatingLead.LogicalName == partyId.LogicalName)
                                            {
                                                colAP = new EntityCollection();
                                                to.Entities.Remove(party);
                                                colAP = to;
                                                colAP.Entities.Add(activityParty);
                                                updatedActivity["to"] = colAP;
                                            }

                                        });
                                    }
                                }//to

                                if (activity1.Attributes.Contains("cc"))
                                {
                                    EntityCollection cc = activity1.GetAttributeValue<EntityCollection>("cc");

                                    if (cc.Entities.Count != 0)
                                    {
                                        cc.Entities.ToList().ForEach(party =>
                                        {
                                            EntityReference partyId = (EntityReference)party["partyid"];

                                            if ((partyId.Id == originatingLead.Id) && originatingLead.LogicalName == partyId.LogicalName)
                                            {
                                                colAP = new EntityCollection();
                                                cc.Entities.Remove(party);
                                                colAP = cc;
                                                colAP.Entities.Add(activityParty);
                                                updatedActivity["cc"] = colAP;
                                            }

                                        });
                                    }
                                }//cc

                                if (activity1.Attributes.Contains("bcc"))
                                {
                                    EntityCollection bcc = activity1.GetAttributeValue<EntityCollection>("bcc");

                                    if (bcc.Entities.Count != 0)
                                    {
                                        bcc.Entities.ToList().ForEach(party =>
                                        {
                                            EntityReference partyId = (EntityReference)party["partyid"];

                                            if ((partyId.Id == originatingLead.Id) && originatingLead.LogicalName == partyId.LogicalName)
                                            {
                                                colAP = new EntityCollection();
                                                bcc.Entities.Remove(party);
                                                colAP = bcc;
                                                colAP.Entities.Add(activityParty);
                                                updatedActivity["bcc"] = colAP;
                                              
                                            }

                                        });
                                    }
                                }//bcc

                                if (activity1.Attributes.Contains("requiredattendees"))
                                {
                                    EntityCollection required = activity1.GetAttributeValue<EntityCollection>("requiredattendees");

                                    if (required.Entities.Count != 0)
                                    {
                                        required.Entities.ToList().ForEach(party =>
                                        {
                                            EntityReference partyId = (EntityReference)party["partyid"];

                                            if ((partyId.Id == originatingLead.Id) && originatingLead.LogicalName == partyId.LogicalName)
                                            {
                                                colAP = new EntityCollection();
                                                required.Entities.Remove(party);
                                                colAP = required;
                                                colAP.Entities.Add(activityParty);
                                                updatedActivity["requiredattendees"] = colAP;
                                               
                                            }

                                        });
                                    }
                                }//required

                                if (activity1.Attributes.Contains("optionalattendees"))
                                {
                                    EntityCollection optional = activity1.GetAttributeValue<EntityCollection>("optionalattendees");

                                    if (optional.Entities.Count != 0)
                                    {
                                        optional.Entities.ToList().ForEach(party =>
                                        {
                                            EntityReference partyId = (EntityReference)party["partyid"];

                                            if ((partyId.Id == originatingLead.Id) && originatingLead.LogicalName == partyId.LogicalName)
                                            {
                                                colAP = new EntityCollection();
                                                optional.Entities.Remove(party);
                                                colAP = optional;
                                                colAP.Entities.Add(activityParty);
                                                updatedActivity["optionalattendees"] = colAP;
                                               
                                            }

                                        });
                                    }
                                }//optional

                                if (activity1.Attributes.Contains("from"))
                                {
                                    EntityCollection from = activity1.GetAttributeValue<EntityCollection>("from");

                                    if (from.Entities.Count != 0)
                                    {
                                        from.Entities.ToList().ForEach(party =>
                                        {
                                            EntityReference partyId = (EntityReference)party["partyid"];

                                            if ((partyId.Id == originatingLead.Id) && originatingLead.LogicalName == partyId.LogicalName)
                                            {
                                                colAP = new EntityCollection();
                                                colAP.Entities.Add(activityParty);
                                                updatedActivity["from"] = colAP;
                                               
                                            }

                                        });
                                    }
                                }//from

                                if (activity1.Attributes.Contains("regardingobjectid"))
                                {
                                    EntityReference reg = (EntityReference)activity1["regardingobjectid"];

                                    if ((reg != null) && (reg.LogicalName=="lead") && (reg.Id == originatingLead.Id))
                                    {
                                        updatedActivity["regardingobjectid"] = new EntityReference("contact", entity.Id);
                                    }
                                }//regarding 

                                service.Update(updatedActivity);
                            }
                        }
                    }
                }
            }

            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException("Ann Error occured in: Scaleable.Xrm.Plugin.Contact.GetLeadActivities", ex);
            }

        }

    }
}