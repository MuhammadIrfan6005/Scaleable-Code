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
                if (context.InputParameters.ContainsKey("oppid") && context.InputParameters["oppid"] is string)
                {
                    var CurrentOppId = context.InputParameters["oppid"].ToString();
                    if (String.IsNullOrEmpty(CurrentOppId))
                    {
                        context.OutputParameters["error"] = "Opportunity id Is null";
                        return;
                    }
                    var currentRecordResult = GetCurrentRecord(service, CurrentOppId);
                    tracingService.Trace("Current Opp Record is => " + currentRecordResult.Entities.Count);
                    if (currentRecordResult.Entities.Count < 1)
                    {
                        context.OutputParameters["error"] = "Current Opportunity Does Not Containts Required Products.";
                        return;
                    }
                    var currentRecord = currentRecordResult.Entities[0];
                    var currentRecordBU = currentRecord.GetAttributeValue<string>("ss_officialcontractpartner").ToString();
                    var currentRecordOwner = (string)currentRecord.GetAttributeValue<AliasedValue>("opbu.fullname").Value;
                    var accountName = currentRecord.GetAttributeValue<EntityReference>("parentaccountid")?.Name?.ToString();
                    var AllExistingRecordsSet = GetAllRecordsData(service);
                    tracingService.Trace("All Opp Record is => " + AllExistingRecordsSet.Count);
                    //Get Specfic Partner Opp Function is used to Get the Current Opportunity With Specific Partner & Official Partner & PartnerShip Model Condition
                    var currentExistingPartnerOpportunities = GetSepecificParnterOpp(service, CurrentOppId);
                    var currentpartnerrecord = currentExistingPartnerOpportunities.Entities.Count > 0 ? currentExistingPartnerOpportunities.Entities[0] : null;
                    var currentopportunitypartner = "";
                    var currentpartnershipmodel = "";
                    if (currentpartnerrecord != null)
                    {
                        currentopportunitypartner = currentpartnerrecord.GetAttributeValue<EntityReference>("ss_opportunitypartner").Name;
                        currentpartnershipmodel = currentpartnerrecord.FormattedValues["ss_partnershipmodel"].ToString();
                    }

                    //This Function Is Used to Get All Opportunity With Partnership Model and Opportunity Partner & Official Contract Partner
                    var AllExistingPartnerOpportunities = GetAlLExistingParnterOpportunities(service);
                    tracingService.Trace("All Opp Partner Record is => " + AllExistingPartnerOpportunities.Count);
                    tracingService.Trace("Total No of Products against this Opp => " + AllExistingRecordsSet?.Count);
                    if (AllExistingRecordsSet.Count < 1)
                    {
                        context.OutputParameters["error"] = "Some error occured in PushNotificationOnWonOpp. Please try later.";
                        return;
                    }
                    //var ByEQSGermanyBUs = AllExistingRecordsSet.Where(x => ((EntityReference)x.GetAttributeValue<AliasedValue>("opbu.businessunitid").Value).Name == "EQS Germany").Select(x => (Guid)x.GetAttributeValue<EntityReference>("parentaccountid").Id).Distinct().ToList();

                    var ByEQSGermanyBUs = AllExistingRecordsSet.Where(x => x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Germany" || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Switzerland"
                    || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Austria" || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Deutschland").Select(x => (Guid)x.GetAttributeValue<EntityReference>("parentaccountid").Id).Distinct().ToList();
                    tracingService.Trace("EQS Germany BU's => " + ByEQSGermanyBUs.Count);
                    tracingService.Trace("Account ID's for Dach" + ByEQSGermanyBUs);
                    //var ByGlobalBUs = AllExistingRecordsSet.Where(x => ((EntityReference)x.GetAttributeValue<AliasedValue>("opbu.businessunitid").Value).Name != "EQS Germany").Select(x => (Guid)x.GetAttributeValue<EntityReference>("parentaccountid").Id).Distinct().ToList();

                    var ByGlobalBUs = AllExistingRecordsSet.Where(x => x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Russia" || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS UK" || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Spain"
                    || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Denmark" || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Italy" || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS France"
                    || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Asia" || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Poland" || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS US").Select(x => (Guid)x.GetAttributeValue<EntityReference>("parentaccountid").Id).Distinct().ToList();
                    tracingService.Trace("EQS Global BU's => " + ByGlobalBUs.Count);

                    var ByEQSGermayPartners = AllExistingPartnerOpportunities.Where(x => x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Germany" || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Switzerland"
                    || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Austria" || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Deutschland").Select(x => (Guid)x.GetAttributeValue<EntityReference>("parentaccountid").Id).Distinct().ToList();
                    tracingService.Trace("EQS Germany Partners BU's => " + ByEQSGermayPartners.Count);

                    var ByEQSGlobalPartners = AllExistingPartnerOpportunities.Where(x => x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Russia" || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS UK" || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Spain"
                    || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Denmark" || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Italy" || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS France"
                    || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Asia" || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS Poland" || x.GetAttributeValue<string>("ss_officialcontractpartner") == "EQS US").Select(x => (Guid)x.GetAttributeValue<EntityReference>("parentaccountid").Id).Distinct().ToList();
                    tracingService.Trace("EQS Global Partners BU's => " + ByEQSGlobalPartners.Count);

                    int NumberOfAccountsByEQSGermanyBU = ByEQSGermanyBUs.Count;
                    int NumberOfAccountsByGlobalBUs = ByGlobalBUs.Count;
                    int NumberofDACHPartners = ByEQSGermayPartners.Count;
                    int NumberofGlobalPartners = ByEQSGlobalPartners.Count;
                    context.OutputParameters["accountname"] = accountName;
                    context.OutputParameters["currentrecordbu"] = currentRecordBU;
                    context.OutputParameters["currentrecordowner"] = currentRecordOwner;
                    context.OutputParameters["eqsgermanygoals"] = NumberOfAccountsByEQSGermanyBU;
                    context.OutputParameters["globalgoals"] = NumberOfAccountsByGlobalBUs;
                    context.OutputParameters["opportunitypartner"] = currentopportunitypartner;
                    context.OutputParameters["partnershipmodel"] = currentpartnershipmodel;
                    context.OutputParameters["partnerdachgoals"] = NumberofDACHPartners;
                    context.OutputParameters["partnerglobalgoals"] = NumberofGlobalPartners;
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

        public static List<Entity> GetAlLExistingParnterOpportunities(IOrganizationService service)
        {
            EntityCollection RecordsCollection;
            List<Entity> RecordsCollectionList = new List<Entity>();

            int PageNumber = 1;
            // Define Condition Values
            var query_statecode = 1;
            var query_ownerid = "de43256b-f625-ec11-b6e5-000d3adf0ffa";
            var query_ownerid1 = "db43256b-f625-ec11-b6e5-000d3adf0ffa";
            var query_ownerid2 = "4544256b-f625-ec11-b6e5-000d3adf0ffa";
            var query_ownerid3 = "d943256b-f625-ec11-b6e5-000d3adf0ffa";
            var query_ownerid4 = "d843256b-f625-ec11-b6e5-000d3adf0ffa";
            var query_ownerid5 = "1456952f-0682-e911-a976-000d3ab799ec";
            var query_ownerid6 = "570bbb71-7c72-e511-8100-3863bb353cc0";
            var query_ownerid7 = "383ad27c-f84a-e511-80f1-3863bb359fb8";
            var query_ownerid8 = "49d4c35d-020b-ec11-b6e6-000d3adcd1f5";
            var query_ownerid9 = "f3dc7c5f-cfef-e711-8141-e0071b659e01";//Marian
            var query_ownerid10 = "49d4c35d-020b-ec11-b6e6-000d3adcd1f5";//Sven
            var query_ownerid11 = "f39ab5ff-9cda-ec11-bb3d-0022489a8f98";
            var pr_productnumber = "640050";
            var pr_productnumber1 = "640019a";
            var pr_productnumber2 = "640016a";
            var pr_productnumber3 = "640122";
            var pr_productnumber4 = "SP-50";
            var pr_productnumber5 = "640128";
            var pr_productnumber6 = "640120";
            var pr_productnumber7 = "640132";
            var pr_productnumber8 = "640100";
            var pr_productnumber9 = "640018a";
            var pr_productnumber10 = "SP-90";

            var pr_productnumber11 = "640060a";
            var pr_productnumber12 = "640101a";
            var pr_productnumber13 = "SP-48";
            var pr_productnumber14 = "640013a";
            var pr_productnumber15 = "640030";
            var pr_productnumber16 = "640032";
            // Instantiate QueryExpression query
            var query = new QueryExpression("opportunity");

            // Add columns to query.ColumnSet
            query.ColumnSet.AddColumns("name", "ss_opportunitypartner", "ss_partnershipmodel", "ss_officialcontractpartner", "opportunityid", "parentaccountid");

            // Define filter query.Criteria
            query.Criteria.AddCondition("ss_opportunitypartner", ConditionOperator.NotNull);
            query.Criteria.AddCondition("ss_partnershipmodel", ConditionOperator.NotNull);
            query.Criteria.AddCondition("actualclosedate", ConditionOperator.ThisYear);
            query.Criteria.AddCondition("statecode", ConditionOperator.Equal, query_statecode);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid1);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid2);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid3);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid4);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid5);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid6);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid7);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid8);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid9);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid10);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid11);

            var opr = query.AddLink("opportunityproduct", "opportunityid", "opportunityid");
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
            var opbu = query.AddLink("systemuser", "ownerid", "systemuserid");
            opbu.EntityAlias = "opbu";
            // Add columns to opbu.Columns
            opbu.Columns.AddColumns("businessunitid");
            query.PageInfo.Count = 5000;
            query.PageInfo.PageNumber = PageNumber;
            query.PageInfo.PagingCookie = null;
            do
            {

                RecordsCollection = service.RetrieveMultiple(query);

                if (RecordsCollection.Entities.Count > 0)
                {
                    RecordsCollectionList.AddRange(RecordsCollection.Entities);
                }

                if (RecordsCollection.MoreRecords)
                {
                    query.PageInfo.PageNumber++;
                    query.PageInfo.PagingCookie = RecordsCollection.PagingCookie;
                }
            } while (RecordsCollection.MoreRecords);
            return RecordsCollectionList;

        }

        public static EntityCollection GetSepecificParnterOpp(IOrganizationService service, string recorId)
        {
            // Define Condition Values
            var query_statecode = 1;
            var query_ownerid = "de43256b-f625-ec11-b6e5-000d3adf0ffa";
            var query_ownerid1 = "db43256b-f625-ec11-b6e5-000d3adf0ffa";
            var query_ownerid2 = "4544256b-f625-ec11-b6e5-000d3adf0ffa";
            var query_ownerid3 = "d943256b-f625-ec11-b6e5-000d3adf0ffa";
            var query_ownerid4 = "d843256b-f625-ec11-b6e5-000d3adf0ffa";
            var query_ownerid5 = "1456952f-0682-e911-a976-000d3ab799ec";
            var query_ownerid6 = "570bbb71-7c72-e511-8100-3863bb353cc0";
            var query_ownerid7 = "383ad27c-f84a-e511-80f1-3863bb359fb8";
            var query_ownerid8 = "49d4c35d-020b-ec11-b6e6-000d3adcd1f5";
            var query_ownerid9 = "f3dc7c5f-cfef-e711-8141-e0071b659e01";//Marian
            var query_ownerid10 = "49d4c35d-020b-ec11-b6e6-000d3adcd1f5";//Sven
            var query_ownerid11 = "f39ab5ff-9cda-ec11-bb3d-0022489a8f98";
            var query_opportunityid = recorId;

            var pr_productnumber = "640050";
            var pr_productnumber1 = "640019a";
            var pr_productnumber2 = "640016a";
            var pr_productnumber3 = "640122";
            var pr_productnumber4 = "SP-50";
            var pr_productnumber5 = "640128";
            var pr_productnumber6 = "640120";
            var pr_productnumber7 = "640132";
            var pr_productnumber8 = "640100";
            var pr_productnumber9 = "640018a";
            var pr_productnumber10 = "SP-90";

            var pr_productnumber11 = "640060a";
            var pr_productnumber12 = "640101a";
            var pr_productnumber13 = "SP-48";
            var pr_productnumber14 = "640013a";
            var pr_productnumber15 = "640030";
            var pr_productnumber16 = "640032";
            // Instantiate QueryExpression query
            var query = new QueryExpression("opportunity");

            // Add columns to query.ColumnSet
            query.ColumnSet.AddColumns("name", "ss_opportunitypartner", "ss_partnershipmodel", "parentaccountid");

            // Define filter query.Criteria
            query.Criteria.AddCondition("ss_opportunitypartner", ConditionOperator.NotNull);
            query.Criteria.AddCondition("ss_partnershipmodel", ConditionOperator.NotNull);
            query.Criteria.AddCondition("actualclosedate", ConditionOperator.ThisYear);
            query.Criteria.AddCondition("statecode", ConditionOperator.Equal, query_statecode);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid1);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid2);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid3);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid4);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid5);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid6);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid7);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid8);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid9);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid10);
            query.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid11);
            query.Criteria.AddCondition("opportunityid", ConditionOperator.Equal, query_opportunityid);

            var opr = query.AddLink("opportunityproduct", "opportunityid", "opportunityid");
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
            var opbu = query.AddLink("systemuser", "ownerid", "systemuserid");
            opbu.EntityAlias = "opbu";
            // Add columns to opbu.Columns
            opbu.Columns.AddColumns("businessunitid");


            return service.RetrieveMultiple(query);
        }


        public static List<Entity> GetAllRecordsData(IOrganizationService Service)
        {
            EntityCollection RecordsCollection;
            List<Entity> RecordsCollectionList = new List<Entity>();

            int PageNumber = 1;
            var query_statecode = 1;

            var query_ownerid = "de43256b-f625-ec11-b6e5-000d3adf0ffa";
            var query_ownerid1 = "db43256b-f625-ec11-b6e5-000d3adf0ffa";
            var query_ownerid2 = "4544256b-f625-ec11-b6e5-000d3adf0ffa";
            var query_ownerid3 = "d943256b-f625-ec11-b6e5-000d3adf0ffa";
            var query_ownerid4 = "d843256b-f625-ec11-b6e5-000d3adf0ffa";
            var query_ownerid5 = "1456952f-0682-e911-a976-000d3ab799ec";
            var query_ownerid6 = "570bbb71-7c72-e511-8100-3863bb353cc0";
            var query_ownerid7 = "383ad27c-f84a-e511-80f1-3863bb359fb8";
            var query_ownerid8 = "49d4c35d-020b-ec11-b6e6-000d3adcd1f5";
            var query_ownerid9 = "f39ab5ff-9cda-ec11-bb3d-0022489a8f98";
            //var query_0_ss_officialcontractpartner_1 = "EQS Russia";
            //var query_0_ss_officialcontractpartner_2 = "EQS UK";
            //var query_0_ss_officialcontractpartner_3 = "EQS Spain";
            //var query_0_ss_officialcontractpartner_4 = "EQS Denmark";
            //var query_0_ss_officialcontractpartner_5 = "EQS Italy";
            //var query_0_ss_officialcontractpartner_6 = "EQS France";
            //var query_0_ss_officialcontractpartner_7 = "EQS Asia";
            //var query_0_ss_officialcontractpartner_8 = "EQS Poland";
            var pr_productnumber = "640050";
            var pr_productnumber1 = "640019a";
            var pr_productnumber2 = "640016a";
            var pr_productnumber3 = "640122";
            var pr_productnumber4 = "SP-50";
            var pr_productnumber5 = "640128";
            var pr_productnumber6 = "640120";
            var pr_productnumber7 = "640132";
            var pr_productnumber8 = "640100";
            var pr_productnumber9 = "640018a";
            var pr_productnumber10 = "SP-90";

            var pr_productnumber11 = "640060a";
            var pr_productnumber12 = "640101a";
            var pr_productnumber13 = "SP-48";
            var pr_productnumber14 = "640013a";
            var pr_productnumber15 = "640030";
            var pr_productnumber16 = "640032";
            // Instantiate QueryExpression query
            var OPquery = new QueryExpression("opportunity");
            // Add columns to query.ColumnSet
            OPquery.ColumnSet.AddColumns("name", "parentaccountid", "estimatedclosedate", "ss_officialcontractpartner");
            // Define filter query.Criteria
            OPquery.Criteria.AddCondition("statecode", ConditionOperator.Equal, query_statecode);
            OPquery.Criteria.AddCondition("actualclosedate", ConditionOperator.ThisYear);
            OPquery.Criteria.AddCondition("ss_opportunitypartner", ConditionOperator.Null);
            OPquery.Criteria.AddCondition("ss_partnershipmodel", ConditionOperator.Null);
            OPquery.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid);
            OPquery.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid1);
            OPquery.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid2);
            OPquery.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid3);
            OPquery.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid4);
            OPquery.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid5);
            OPquery.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid6);
            OPquery.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid7);
            OPquery.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid8);
            OPquery.Criteria.AddCondition("ownerid", ConditionOperator.NotEqual, query_ownerid9);
            //var query_Criteria_0 = new FilterExpression();
            //OPquery.Criteria.AddFilter(query_Criteria_0);

            // Define filter query_Criteria_0
            //query_Criteria_0.AddCondition("ss_officialcontractpartner", ConditionOperator.In, query_0_ss_officialcontractpartner_1, query_0_ss_officialcontractpartner_2, query_0_ss_officialcontractpartner_3, query_0_ss_officialcontractpartner_4, query_0_ss_officialcontractpartner_5, query_0_ss_officialcontractpartner_6, query_0_ss_officialcontractpartner_7, query_0_ss_officialcontractpartner_8);

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
            var fetchData = new
            {
                opportunityid = OppId,
                ownerid = "de43256b-f625-ec11-b6e5-000d3adf0ffa",
                ownerid2 = "db43256b-f625-ec11-b6e5-000d3adf0ffa",
                ownerid3 = "4544256b-f625-ec11-b6e5-000d3adf0ffa",
                ownerid4 = "d943256b-f625-ec11-b6e5-000d3adf0ffa",
                ownerid5 = "d843256b-f625-ec11-b6e5-000d3adf0ffa",
                ownerid6 = "1456952f-0682-e911-a976-000d3ab799ec",
                ownerid7 = "570bbb71-7c72-e511-8100-3863bb353cc0",
                ownerid8 = "383ad27c-f84a-e511-80f1-3863bb359fb8",
                ownerid9 = "49d4c35d-020b-ec11-b6e6-000d3adcd1f5",
                ownerid10 = "f39ab5ff-9cda-ec11-bb3d-0022489a8f98",
                productnumber = "640050",
                productnumber2 = "640019a",
                productnumber3 = "640016a",
                productnumber4 = "640122",
                productnumber5 = "SP-50",
                productnumber6 = "640128",
                productnumber7 = "640120",
                productnumber8 = "640132",
                productnumber9 = "640100",
                productnumber10 = "640018a",
                productnumber11 = "SP-90",
                productnumber12 = "640060a",
                productnumber13 = "640101a",
                productnumber14 = "SP-48",
                productnumber15 = "640013a",
                productnumber16 = "640030",
                productnumber17 = "640032"
            };
            var fetchXml = $@"
        <fetch>
        <entity name='opportunity'>
        <attribute name='name' />
        <attribute name='parentaccountid' />
        <attribute name='estimatedclosedate' />
        <attribute name='ss_officialcontractpartner' />
        <filter type='and'>
        <condition attribute='opportunityid' operator='eq' value='{fetchData.opportunityid/*8a18892b-74ca-ea11-a812-000d3ab855d6*/}'/>
        <condition attribute='ownerid' operator='ne' value='{fetchData.ownerid/*de43256b-f625-ec11-b6e5-000d3adf0ffa*/}'/>
        <condition attribute='ownerid' operator='ne' value='{fetchData.ownerid2/*db43256b-f625-ec11-b6e5-000d3adf0ffa*/}'/>
        <condition attribute='ownerid' operator='ne' value='{fetchData.ownerid3/*4544256b-f625-ec11-b6e5-000d3adf0ffa*/}'/>
        <condition attribute='ownerid' operator='ne' value='{fetchData.ownerid4/*d943256b-f625-ec11-b6e5-000d3adf0ffa*/}'/>
        <condition attribute='ownerid' operator='ne' value='{fetchData.ownerid5/*d843256b-f625-ec11-b6e5-000d3adf0ffa*/}'/>
        <condition attribute='ownerid' operator='ne' value='{fetchData.ownerid6/*d843256b-f625-ec11-b6e5-000d3adf0ffa*/}'/>
        <condition attribute='ownerid' operator='ne' value='{fetchData.ownerid7/*d843256b-f625-ec11-b6e5-000d3adf0ffa*/}'/>
        <condition attribute='ownerid' operator='ne' value='{fetchData.ownerid8/*d843256b-f625-ec11-b6e5-000d3adf0ffa*/}'/>
        <condition attribute='ownerid' operator='ne' value='{fetchData.ownerid9/*d843256b-f625-ec11-b6e5-000d3adf0ffa*/}'/>
        <condition attribute='ownerid' operator='ne' value='{fetchData.ownerid10/*f39ab5ff-9cda-ec11-bb3d-0022489a8f98*/}'/>
        </filter>
        <link-entity name='opportunityproduct' from='opportunityid' to='opportunityid' link-type='inner' alias='aj'>
        <link-entity name='product' from='productid' to='productid' link-type='inner' alias='op'>
        <attribute name='name' />
        <filter type='and'>
        <filter type='or'>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber/*640050*/}'/>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber2/*640019a*/}'/>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber3/*640016a*/}'/>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber4/*640122*/}'/>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber5/*SP-50*/}'/>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber6/*640128*/}'/>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber7/*640120*/}'/>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber8/*640132*/}'/>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber9/*640100*/}'/>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber10/*640018a*/}'/>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber11/*SP-90*/}'/>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber12/*640060a*/}'/>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber13/*640101a*/}'/>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber14/*SP-48*/}'/>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber15/*640013a*/}'/>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber16/*640013a*/}'/>
        <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber17/*640013a*/}'/>
        </filter>
        </filter>
        </link-entity>
        </link-entity>
        <link-entity name='systemuser' from='systemuserid' to='ownerid' alias='opbu'>
        <attribute name='businessunitid' />
        <attribute name='fullname' />
        </link-entity>
        </entity>
        </fetch>";


            return Service.RetrieveMultiple(new FetchExpression(fetchXml));
        }
    }
}
