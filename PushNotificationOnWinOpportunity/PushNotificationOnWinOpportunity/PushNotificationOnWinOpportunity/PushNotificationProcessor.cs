using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
namespace PushNotificationOnWinOpportunity
{
    public class PushNotificationProcessor : IPlugin
    {
        /// <summary>
        ///     Push Notifications On Won Opportunity
        ///     Registered on action (PushNotificationOnWonOpp)
        /// </summary>      
        /// <param> 
        ///   <param name="oppid">                       Input :   string - Opportunity Id  
        ///   <param name="currentrecordbu">            Output :   Integer - Invoice Id
        ///   <param name="currentrecordowner">         Output :   Integer - Invoice Id
        ///   <param name="eqsgermanygoals">            Output :   string - Invoice Id
        ///   <param name="globalgoals">                Output :   string - Invoice Id
        ///   <param name="error">                      Output :   string - Invoice Id
        /// </param>
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
                tracingService.Trace("PushNotificationOnWonOpp Triggered");
                if (context.InputParameters.ContainsKey("oppid") && context.InputParameters["oppid"] is string)
                {
                    var CurrentOppId = context.InputParameters["oppid"].ToString();
                    tracingService.Trace("CurrentOppId => " + CurrentOppId);
                    if(String.IsNullOrEmpty(CurrentOppId))
                    {
                        context.OutputParameters["error"] = "Opportunity id Is null";
                        return;
                    }
                    var currentRecordResult = GetCurrentRecord(service, CurrentOppId);
                    if(currentRecordResult.Entities.Count < 1)
                    {
                        context.OutputParameters["error"] = "Current Opportunity Does Not Containts Required Products.";
                        return;
                    }
                    var currentRecord = currentRecordResult.Entities[0];
                    var currentRecordBU = ((EntityReference)currentRecord.GetAttributeValue<AliasedValue>("opbu.businessunitid").Value).Name;
                    var currentRecordOwner = (string)currentRecord.GetAttributeValue<AliasedValue>("opbu.fullname").Value;
                    var accountName = currentRecord.GetAttributeValue<EntityReference>("parentaccountid")?.Name?.ToString();
                    var AllExistingRecordsSet = GetAllRecordsData(service);
                    tracingService.Trace("Total No of Products against this Opp => " + AllExistingRecordsSet?.Count);
                    if (AllExistingRecordsSet.Count < 1)
                    {
                        context.OutputParameters["error"] = "Some error occured in PushNotificationOnWonOpp. Please try later.";
                        return;
                    }
                    var ByEQSGermanyBUs = AllExistingRecordsSet.Where(x => ((EntityReference)x.GetAttributeValue<AliasedValue>("opbu.businessunitid").Value).Name == "EQS Germany").Select(x => (Guid)x.GetAttributeValue<EntityReference>("parentaccountid").Id).Distinct().ToList();
                    var ByGlobalBUs = AllExistingRecordsSet.Where(x => ((EntityReference)x.GetAttributeValue<AliasedValue>("opbu.businessunitid").Value).Name != "EQS Germany").Select(x => (Guid)x.GetAttributeValue<EntityReference>("parentaccountid").Id).Distinct().ToList();
                    int NumberOfAccountsByEQSGermanyBU = ByEQSGermanyBUs.Count;
                    int NumberOfAccountsByGlobalBUs = ByGlobalBUs.Count;
                    context.OutputParameters["accountname"] = accountName;
                    context.OutputParameters["currentrecordbu"] = currentRecordBU;
                    context.OutputParameters["currentrecordowner"] = currentRecordOwner;
                    context.OutputParameters["eqsgermanygoals"] = NumberOfAccountsByEQSGermanyBU;
                    context.OutputParameters["globalgoals"] = NumberOfAccountsByGlobalBUs;
                }
                else
                {
                    context.OutputParameters["error"] = "Some error occured in PushNotificationOnWonOpp. Please try later.";
                    return;
                }
            }
            catch (Exception ex)
            {

                tracingService?.Trace("stack trace is: " + ex.StackTrace);

                tracingService?.Trace(string.Format("An error occurred in your PushNotificationOnWonOpp. \n Exception Message: {0}", ex.Message));
                context.OutputParameters["error"] = string.Format("An error occurred in your PushNotificationOnWonOpp. \n Exception Message: {0}", ex.Message);
                return;
            }
        }
        public static List<Entity> GetAllRecordsData(IOrganizationService Service)
        {
            EntityCollection RecordsCollection;
            List<Entity> RecordsCollectionList = new List<Entity>();

            int PageNumber = 1;
            var query_statecode = 1;
            var query_ownerid = "de43256b-f625-ec11-b6e5-000d3adf0ffa"; // Germany Navision
            var pr_productnumber = "640050";
            var pr_productnumber1 = "640060";
            var pr_productnumber2 = "LP-50";
            var pr_productnumber3 = "LP-51";
            var pr_productnumber4 = "SP-50";
            var pr_productnumber5 = "SP-51";
            var pr_productnumber6 = "SP-49";
            var pr_productnumber7 = "100001";
            var pr_productnumber8 = "100002";
            var pr_productnumber9 = "640100";
            var pr_productnumber10 = "640101";
            var pr_productnumber11 = "640018";
            var pr_productnumber12 = "640018a";
            var pr_productnumber13 = "640120";
            var pr_productnumber14 = "640121";
            var pr_productnumber15 = "640030";
            var pr_productnumber16 = "640032";
            // Instantiate QueryExpression query
            var OPquery = new QueryExpression("opportunity");
            // Add columns to query.ColumnSet
            OPquery.ColumnSet.AddColumns("name", "parentaccountid", "estimatedclosedate");
            // Define filter query.Criteria
            OPquery.Criteria.AddCondition("statecode", ConditionOperator.Equal, query_statecode);
            OPquery.Criteria.AddCondition("actualclosedate", ConditionOperator.ThisYear);
            OPquery.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid);
            // Add link-entity opr
            var opr = OPquery.AddLink("opportunityproduct", "opportunityid", "opportunityid");
            opr.EntityAlias = "opr";
            // Add columns to opr.Columns
            opr.Columns.AddColumns("productid", "opportunityproductid", "opportunityproductname");
            // Add link-entity pr
            var pr = opr.AddLink("product", "productid", "productid");
            pr.EntityAlias = "pr";
            // Add columns to pr.Columns
            pr.Columns.AddColumns("name");
            // Define filter pr.LinkCriteria
            pr.LinkCriteria.FilterOperator = LogicalOperator.Or;
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber);
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber1);
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber2);
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber3);
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber4);
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber5);
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber6);
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber7);
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber8);
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber9);
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber10);
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber11);
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber12);
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber13);
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber14);
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber15);
            pr.LinkCriteria.AddCondition("productnumber", ConditionOperator.Equal, pr_productnumber16);


            // Add link-entity opbu
            var opbu = OPquery.AddLink("systemuser", "ownerid", "systemuserid");
            opbu.EntityAlias = "opbu";
            // Add columns to opbu.Columns
            opbu.Columns.AddColumns("businessunitid");
            OPquery.PageInfo.Count = 5000;
            OPquery.PageInfo.PageNumber = PageNumber;
            OPquery.PageInfo.PagingCookie = null;
            do
            {

                RecordsCollection = Service.RetrieveMultiple(OPquery);

                if (RecordsCollection.Entities.Count > 0)
                {
                    RecordsCollectionList.AddRange(RecordsCollection.Entities);
                }

                if (RecordsCollection.MoreRecords)
                {
                    OPquery.PageInfo.PageNumber++;
                    OPquery.PageInfo.PagingCookie = RecordsCollection.PagingCookie;
                }
            } while (RecordsCollection.MoreRecords);
            return RecordsCollectionList;          
        }
        public static EntityCollection GetCurrentRecord(IOrganizationService Service, string recordId)
        {
            Guid OppId = Guid.Parse(recordId);
            var fetchxml = "<fetch>" +
                          "<entity name='opportunity' >" +
                            "<attribute name='name' />" +
                            "<attribute name='parentaccountid' />" +
                            "<attribute name='estimatedclosedate' />" +
                            "<filter type='and' >" +
                              "<condition attribute='opportunityid' operator='eq' value='" + OppId  + "' />" +
                              "<condition attribute='ownerid' operator='ne' uiname='Germany Navision' value='de43256b-f625-ec11-b6e5-000d3adf0ffa' />" +
                            "</filter>" +
                            "<link-entity name='opportunityproduct' from='opportunityid' to='opportunityid' link-type='inner' alias='aj' >" +
                              "<link-entity name='product' from='productid' to='productid' link-type='inner' alias='op' >" +
                                "<attribute name='name' />" +
                                "<filter type='and' >" +
                                  "<filter type='or' >" +
                                    "<condition attribute='productnumber' operator='eq' value='640050' />" +
                                    "<condition attribute='productnumber' operator='eq' value='640060' />" +
                                    "<condition attribute='productnumber' operator='eq' value='LP-50' />" +
                                    "<condition attribute='productnumber' operator='eq' value='LP-51' />" +
                                    "<condition attribute='productnumber' operator='eq' value='SP-50' />" +
                                    "<condition attribute='productnumber' operator='eq' value='SP-51' />" +
                                    "<condition attribute='productnumber' operator='eq' value='SP-49' />" +
                                    "<condition attribute='productnumber' operator='eq' value='100001' />" +
                                    "<condition attribute='productnumber' operator='eq' value='100002' />" +
                                    "<condition attribute='productnumber' operator='eq' value='640100' />" +
                                    "<condition attribute='productnumber' operator='eq' value='640101' />" +
                                     "<condition attribute='productnumber' operator='eq' value='640018' />" +
                                    "<condition attribute='productnumber' operator='eq' value='640018a' />" +
                                    "<condition attribute='productnumber' operator='eq' value='640120' />" +
                                    "<condition attribute='productnumber' operator='eq' value='640121' />" +
                                    "<condition attribute='productnumber' operator='eq' value='640030' />" +
                                    "<condition attribute='productnumber' operator='eq' value='640032' />" +
                                  "</filter>" +
                                "</filter>" +
                              "</link-entity>" +
                            "</link-entity>" +
                            "<link-entity name='systemuser' from='systemuserid' to='ownerid' alias='opbu' >" +
                              "<attribute name='businessunitid' />" +
                              "<attribute name='fullname' />" +
                            "</link-entity>" +
                          "</entity>" +
                        "</fetch>";

            return Service.RetrieveMultiple(new FetchExpression(fetchxml));
        }
    }
}
