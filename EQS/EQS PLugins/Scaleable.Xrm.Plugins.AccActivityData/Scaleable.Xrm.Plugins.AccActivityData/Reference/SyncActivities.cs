using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using System.ServiceModel;
using Microsoft.Xrm.Sdk.Query;

namespace Scaleable.Xrm.Plugins.AccActivityData
{
    public class SyncActivities : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /// Plugin Name= Scalable.Xrm.Plugins.AccActivityData                                                                 ///                                                                                ///
            /// Message=     Create/Update/Delete                                                                                ///
            /// Description: It manipulates Activities Account Data Entity Record                                                 ///
            /// Image Name:   prePhoneCallImage                                                                                   ///
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Obtain the execution context from the service provider.
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            // Obtain the organization service reference.
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

            tracingService.Trace("Plugin started");
            tracingService.Trace("Message name = "+context.MessageName.ToUpper());

            #region delete_case_of_activities_account_data

            if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is EntityReference && context.MessageName.ToUpper() == "DELETE")
            {
                EntityReference deleteReference = (EntityReference)context.InputParameters["Target"];
                
                var QEss_activitiesaccountdata = new QueryExpression("ss_activitiesaccountdata");
                QEss_activitiesaccountdata.ColumnSet.AddColumns("ss_activityid", "ss_activitiesaccountdataid");
                QEss_activitiesaccountdata.Criteria.AddCondition("ss_activityid", ConditionOperator.Equal, deleteReference.Id.ToString());
                QEss_activitiesaccountdata.Criteria.AddCondition("ss_activitylogicalname", ConditionOperator.Equal, deleteReference.LogicalName);
                EntityCollection collection = service.RetrieveMultiple(QEss_activitiesaccountdata);

                foreach (Entity entity in collection.Entities)
                {
                    service.Delete(entity.LogicalName, entity.Id);
                }

                return;
            }
            #endregion

            #region create_and_update_case_of_activities_account_data

            else if ((context.InputParameters.Contains("Target")) && (context.InputParameters["Target"] is Entity) && ((context.MessageName.ToUpper() == "UPDATE") || (context.MessageName.ToUpper() == "CREATE")))
            {
                Entity entity = (Entity)context.InputParameters["Target"];

                tracingService.Trace("Entity Name = "+entity.LogicalName);

                if ((entity.LogicalName != "phonecall") && (entity.LogicalName != "task") && (entity.LogicalName != "appointment") && (entity.LogicalName != "email") && (entity.LogicalName != "letter") && (entity.LogicalName != "campaignresponse") && (entity.LogicalName != "campaignactivity") && (entity.LogicalName != "ss_notification"))
                {
                    return;
                }
                if (context.Depth > 1)
                {
                    tracingService.Trace("Depth > 1");
                    //return;
                }

                try
                {
                    string activityId = entity.Id.ToString();
                    string activityLogicalName = entity.LogicalName;
                    EntityReference regarding = new EntityReference();
                    string regardingId = null;
                    string regardingLogicalName = null;
                    string regardingName = null;
                    DateTime? dueDate = null;
                    DateTime? createdOn = null;
                    DateTime? modifiedOn = null;
                    string subject = null;
                    OptionSetValue productCategory = new OptionSetValue(0);
                    OptionSetValue activityStatus = new OptionSetValue(10);

                    int? accAmountLei = null;
                    int? accAmountChar = null;
                    AliasedValue amountLei = null;
                    AliasedValue amountChar = null;

                    Entity preActivityImage = new Entity();

                    EntityReference ownerReference = new EntityReference();

                    if (context.MessageName.ToUpper() == "CREATE")
                    {
                        if (entity.Attributes.Contains("ownerid"))
                        {
                            ownerReference = entity.GetAttributeValue<EntityReference>("ownerid");
                        }

                        if (entity.Attributes.Contains("regardingobjectid"))
                        {
                            if (entity["regardingobjectid"] != null)
                            {
                                regarding = entity.GetAttributeValue<EntityReference>("regardingobjectid");
                                regardingId = regarding.Id.ToString();
                                regardingLogicalName = regarding.LogicalName;
                                regardingName = regarding.Name;
                            }
                        }

                        if (entity.Attributes.Contains("scheduledend"))
                        {
                            if (entity["scheduledend"] != null)
                            {
                                dueDate = (DateTime)entity["scheduledend"];
                            }
                        }

                        if (entity.Attributes.Contains("subject"))
                        {
                            if (entity["subject"] != null)
                            {
                                subject = (string)(entity["subject"]);
                            }
                        }

                        if (entity.Attributes.Contains("ss_productcategories"))
                        {
                            if (entity["ss_productcategories"] != null)
                            {
                                productCategory.Value = ((OptionSetValue)entity["ss_productcategories"]).Value;
                            }
                        }

                        if (entity.Attributes.Contains("statecode"))
                        {
                            if (entity["statecode"] != null)
                            {
                                activityStatus.Value = ((OptionSetValue)entity["statecode"]).Value;
                            }
                        }
                        
                        if (entity.Attributes.Contains("createdon"))
                        {
                            if (entity["createdon"] != null)
                            {
                                createdOn = (DateTime)entity["createdon"];
                            }
                        }

                        if (entity.Attributes.Contains("modifiedon"))
                        {
                            if (entity["modifiedon"] != null)
                            {
                                modifiedOn = (DateTime)entity["modifiedon"];
                            }
                        }
                    }
                    else if (context.MessageName.ToUpper() == "UPDATE")
                    {
                        preActivityImage = (Entity)context.PreEntityImages["preActivityImage"];
                        if (entity.Attributes.Contains("ownerid"))
                        {
                            if (entity["ownerid"] != null)
                            {
                                ownerReference = entity.GetAttributeValue<EntityReference>("ownerid");
                            }
                        }
                        else if (preActivityImage.Attributes.Contains("ownerid"))
                        {
                            ownerReference = preActivityImage.GetAttributeValue<EntityReference>("ownerid");
                        }

                        if (entity.Attributes.Contains("regardingobjectid"))
                        {
                            if (entity["regardingobjectid"] != null)
                            {
                                regarding = entity.GetAttributeValue<EntityReference>("regardingobjectid");
                                regardingId = regarding.Id.ToString();
                                regardingLogicalName = regarding.LogicalName;
                                regardingName = regarding.Name;
                            }
                        }
                        else if (preActivityImage.Attributes.Contains("regardingobjectid"))
                        {
                            regarding = preActivityImage.GetAttributeValue<EntityReference>("regardingobjectid");
                            regardingId = regarding.Id.ToString();
                            regardingLogicalName = regarding.LogicalName;
                            regardingName = regarding.Name;
                        }

                        if (entity.Attributes.Contains("scheduledend"))
                        {
                            if (entity["scheduledend"] != null)
                            {
                                dueDate = (DateTime)entity["scheduledend"];
                            }
                        }
                        else if (preActivityImage.Attributes.Contains("scheduledend"))
                        {
                            dueDate = (DateTime)preActivityImage.Attributes["scheduledend"];
                        }

                        if (entity.Attributes.Contains("subject"))
                        {
                            if (entity["subject"] != null)
                            {
                                subject = (string)(entity["subject"]);
                            }
                        }
                        else if (preActivityImage.Attributes.Contains("subject"))
                        {
                            subject = (string)(preActivityImage.Attributes["subject"]);
                        }

                        if (entity.Attributes.Contains("ss_productcategories"))
                        {
                            if (entity["ss_productcategories"] != null)
                            {
                                productCategory.Value = ((OptionSetValue)entity["ss_productcategories"]).Value;
                            }
                        }
                        else if (preActivityImage.Attributes.Contains("ss_productcategories"))
                        {
                            productCategory.Value = ((OptionSetValue)preActivityImage["ss_productcategories"]).Value;
                        }

                        if (entity.Attributes.Contains("statecode"))
                        {
                            if (entity["statecode"] != null)
                            {
                                activityStatus.Value = ((OptionSetValue)entity["statecode"]).Value;
                            }
                        }
                        else if (preActivityImage.Attributes.Contains("statecode"))
                        {
                            activityStatus.Value = ((OptionSetValue)preActivityImage["statecode"]).Value;
                        }

                        if (entity.Attributes.Contains("createdon"))
                        {
                            if (entity["createdon"] != null)
                            {
                                createdOn = (DateTime)entity["createdon"];
                            }
                        }
                        else if (preActivityImage.Attributes.Contains("createdon"))
                        {
                            createdOn = (DateTime)preActivityImage.Attributes["createdon"];
                        }

                        if (entity.Attributes.Contains("modifiedon"))
                        {
                            if (entity["modifiedon"] != null)
                            {
                                modifiedOn = (DateTime)entity["modifiedon"];
                            }
                        }
                        else if (preActivityImage.Attributes.Contains("modifiedon"))
                        {
                            modifiedOn = (DateTime)preActivityImage.Attributes["modifiedon"];
                        }
                    }

                    #region AmountFieldsRetrieval

                    var fetchData = new
                    {
                        ownerid = ownerReference.Id,
                        activityid = entity.Id,
                        statecode = "0",
                        statecode2 = "3"
                    };
                    var fetchXml = $@"<fetch>
                                      <entity name='activitypointer'>
                                        <attribute name='subject' />
                                        <attribute name='regardingobjectid' />
                                        <attribute name='scheduledend' />
                                        <attribute name='instancetypecode' />
                                        <attribute name='community' />
                                        <attribute name='activitytypecode' />
                                        <attribute name='activityid' />
                                        <attribute name='statecode' />
                                        <filter type='and'>
                                          <condition attribute='ownerid' operator='eq' value='{fetchData.ownerid}'/>
                                          <condition attribute='regardingobjectid' operator='not-null' />
                                          <condition attribute='activityid' operator='eq' value='{fetchData.activityid/*8c408931-05d4-e711-8120-e0071b66d071*/}'/>
                                          <condition attribute='statecode' operator='in' >
                                            <value>{fetchData.statecode/*0*/}</value>
                                            <value>{fetchData.statecode2/*3*/}</value>
                                          </condition>
                                          <condition attribute='isregularactivity' operator='eq' value='1' />
                                        </filter>
                                        <link-entity name='account' from='accountid' to='regardingobjectid' link-type='outer' alias='account'>
                                          <attribute name='ss_amountlei' />
                                          <attribute name='new_xmlamountchar' />
                                        </link-entity>
                                        <link-entity name='contact' from='contactid' to='regardingobjectid' link-type='outer' alias='contact'>
                                          <link-entity name='account' from='accountid' to='parentcustomerid' link-type='outer' alias='contactaccount'>
                                            <attribute name='new_xmlamountchar' />
                                            <attribute name='ss_amountlei' />
                                          </link-entity>
                                        </link-entity>
                                        <link-entity name='opportunity' from='opportunityid' to='regardingobjectid' link-type='outer' alias='opportunity'>
                                          <link-entity name='account' from='accountid' to='customerid' link-type='outer' alias='opportunityaccount'>
                                            <attribute name='new_xmlamountchar' />
                                            <attribute name='ss_amountlei' />
                                          </link-entity>
                                        </link-entity>
                                        <link-entity name='ss_visitreport' from='ss_visitreportid' to='regardingobjectid' link-type='outer' alias='visitreport'>
                                          <link-entity name='account' from='accountid' to='ss_accountid' link-type='outer' alias='visitreportaccount'>
                                            <attribute name='new_xmlamountchar' />
                                            <attribute name='ss_amountlei' />
                                          </link-entity>
                                        </link-entity>
                                      </entity>
                                    </fetch>";

                    var fetchExp = new FetchExpression(fetchXml);
                    EntityCollection activityEntity = service.RetrieveMultiple(fetchExp);
                    foreach (Entity actEntity in activityEntity.Entities)
                    {
                        if (actEntity.Attributes.Contains("regardingobjectid"))
                        {
                            EntityReference reg = (EntityReference)actEntity["regardingobjectid"];
                            if (reg.LogicalName.ToUpper() == "ACCOUNT")
                            {
                                amountLei = actEntity.GetAttributeValue<AliasedValue>(reg.LogicalName + ".ss_amountlei");
                                if (amountLei != null)
                                {
                                    accAmountLei = (int)amountLei.Value;
                                }
                                
                                amountChar = actEntity.GetAttributeValue<AliasedValue>(reg.LogicalName + ".new_xmlamountchar");
                                if (amountChar != null)
                                {
                                    accAmountChar = (int)amountChar.Value;
                                }
                            }
                            else if (reg.LogicalName.ToUpper() == "CONTACT" || reg.LogicalName.ToUpper() == "OPPORTUNITY" || reg.LogicalName.ToUpper() == "VISITREPORT")
                            {
                                amountLei = actEntity.GetAttributeValue<AliasedValue>(reg.LogicalName + "account.ss_amountlei");
                                if (amountLei != null)
                                {
                                    accAmountLei = (int)amountLei.Value;
                                }

                                amountChar = actEntity.GetAttributeValue<AliasedValue>(reg.LogicalName + "account.new_xmlamountchar");
                                if (amountChar != null)
                                {
                                    accAmountChar = (int)amountChar.Value;
                                }
                            }
                        }
                    }
                    #endregion


                    if (context.MessageName.ToUpper() == "CREATE")
                    {
                        Entity activitiesAccountData = new Entity("ss_activitiesaccountdata");
                        activitiesAccountData.Attributes["ss_activityid"] = activityId;
                        activitiesAccountData.Attributes["ss_activitylogicalname"] = activityLogicalName;
                        activitiesAccountData.Attributes["ss_duedate"] = dueDate;
                        activitiesAccountData.Attributes["ss_createdon"] = createdOn;
                        activitiesAccountData.Attributes["ss_modifiedon"] = modifiedOn;
                        activitiesAccountData.Attributes["ss_regardingid"] = regardingId;
                        activitiesAccountData.Attributes["ss_regardinglogicalname"] = regardingLogicalName;
                        activitiesAccountData.Attributes["ss_regardingname"] = regardingName;
                        activitiesAccountData.Attributes["ss_subject"] = subject;
                        activitiesAccountData.Attributes["ss_amountlei"] = accAmountLei;
                        activitiesAccountData.Attributes["ss_amountcharsxml"] = accAmountChar;


                        if (productCategory.Value == 0)
                        {
                            activitiesAccountData.Attributes["ss_productcategories"] = null;
                        }
                        else
                        {
                            activitiesAccountData.Attributes["ss_productcategories"] = productCategory;
                        }

                        if (activityStatus.Value == 10)
                        {
                            activitiesAccountData.Attributes["ss_activitystatus"] = null;
                        }
                        else
                        {
                            activitiesAccountData.Attributes["ss_activitystatus"] = activityStatus;
                        }

                        if (entity.Attributes.Contains("ownerid"))
                        {
                            if (ownerReference.LogicalName == "systemuser")
                            {
                                activitiesAccountData.Attributes["ss_owneruser"] = ownerReference;
                                activitiesAccountData.Attributes["ss_ownerteam"] = null;
                            }
                            else
                            {
                                activitiesAccountData.Attributes["ss_ownerteam"] = ownerReference;
                                activitiesAccountData.Attributes["ss_owneruser"] = null;
                            }
                            
                        }
                        tracingService.Trace("Activity status in create case = "+activityStatus.Value);
                        tracingService.Trace("Create query is running at "+DateTime.Now.ToString());
                        Guid activityAccountDataGuid = service.Create(activitiesAccountData);
                    }

                    else if (context.MessageName.ToUpper() == "UPDATE")
                    {
                        var QEss_activitiesaccountdata = new QueryExpression("ss_activitiesaccountdata");
                        QEss_activitiesaccountdata.ColumnSet.AddColumns("ss_activityid", "ss_duedate", "ss_regardingid", "ss_regardingname", "ss_regardinglogicalname", "ss_subject");
                        QEss_activitiesaccountdata.Criteria.AddCondition("ss_activityid", ConditionOperator.Equal, entity.Id.ToString());

                        EntityCollection collection = service.RetrieveMultiple(QEss_activitiesaccountdata);
                        foreach (Entity activitiesAccountData in collection.Entities)
                        {
                            activitiesAccountData.Attributes["ss_activityid"] = activityId;
                            activitiesAccountData.Attributes["ss_activitylogicalname"] = activityLogicalName;
                            activitiesAccountData.Attributes["ss_duedate"] = dueDate;
                            activitiesAccountData.Attributes["ss_createdon"] = createdOn;
                            activitiesAccountData.Attributes["ss_modifiedon"] = modifiedOn;
                            activitiesAccountData.Attributes["ss_regardingid"] = regardingId;
                            activitiesAccountData.Attributes["ss_regardinglogicalname"] = regardingLogicalName;
                            activitiesAccountData.Attributes["ss_regardingname"] = regardingName;
                            activitiesAccountData.Attributes["ss_subject"] = subject;
                            activitiesAccountData.Attributes["ss_amountlei"] = accAmountLei;
                            activitiesAccountData.Attributes["ss_amountcharsxml"] = accAmountChar;


                            if (productCategory.Value == 0)
                            {
                                activitiesAccountData.Attributes["ss_productcategories"] = null;
                            }
                            else
                            {
                                activitiesAccountData.Attributes["ss_productcategories"] = productCategory;
                            }

                            if (activityStatus.Value == 10)
                            {
                                activitiesAccountData.Attributes["ss_activitystatus"] = null;
                            }
                            else
                            {
                                activitiesAccountData.Attributes["ss_activitystatus"] = activityStatus;
                            }

                            if (entity.Attributes.Contains("ownerid"))
                            {
                                if (ownerReference.LogicalName == "systemuser")
                                {
                                    activitiesAccountData.Attributes["ss_owneruser"] = ownerReference;
                                    activitiesAccountData.Attributes["ss_ownerteam"] = null;
                                }
                                else
                                {
                                    activitiesAccountData.Attributes["ss_ownerteam"] = ownerReference;
                                    activitiesAccountData.Attributes["ss_owneruser"] = null;
                                }
                                
                            }
                            tracingService.Trace("Activity status in update case = " + activityStatus.Value);
                            tracingService.Trace("Update query is running at "+DateTime.Now.ToString());
                            service.Update(activitiesAccountData);
                        }

                    }

                }
                catch (Exception ex)
                {
                    throw new InvalidPluginExecutionException("An error occurred in the Scalable.Xrm.Plugins.ActivitiesAccountData plug-in.", ex);
                }
            }

            #endregion
        }
    }
}
