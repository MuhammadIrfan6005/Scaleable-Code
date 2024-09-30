using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Scaleable.Xrm.Plugin.SetPartnershipModel
{
    public class SetPartnerShipModel : IPlugin
    {
        /// <summary>
        /// This Plugin Will Get the Partnership Model From Opportunity
        /// Get The Account from Opportunity as well and check if the updated partnership model from Opportunity is available in 
        /// all the opportunities which are associated with the account and if available then it will check in Partner Entity As well.
        /// If the updated Partnership Model is available there then it will do nothing.
        /// Otherwise it will update the account and partner entity
        /// </summary>
        public void Execute(IServiceProvider serviceProvider)
        {
            try
            {
                #region standard initialization
                ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
                IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
                IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
                IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);
                tracingService.Trace("Start");
                #endregion
                if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
                {
                    Entity opportunity = (Entity)context.InputParameters["Target"];
                    Entity preimage = (Entity)context.PreEntityImages["PreImage"];
                    EntityReference accountid = null;
                    if (opportunity.LogicalName != "opportunity" && context.MessageName != "Update")
                        return;
                    #region Validate Fields
                    if (!opportunity.Contains("ss_partnershipmodel"))
                        return;
                    if (!opportunity.Contains("parentaccountid") && !preimage.Contains("parentaccountid"))
                        return;
                    #endregion
                    OptionSetValue optionSet = new OptionSetValue();
                    optionSet = opportunity.GetAttributeValue<OptionSetValue>("ss_partnershipmodel");
                    tracingService.Trace("Partner Ship Model is => " + optionSet.Value);
                    accountid = opportunity.Contains("parentaccountid") ? opportunity.GetAttributeValue<EntityReference>("parentaccountid") : preimage.GetAttributeValue<EntityReference>("parentaccountid");
                    tracingService.Trace("Account ID is => " + accountid.Id);
                    List<int> oppmodel = new List<int>();
                    List<int> accountmodel = new List<int>();
                    //Retrieving Account Entity
                    Entity account = service.Retrieve("account", accountid.Id, new ColumnSet("ss_partnershipmodel", "ss_partner"));

                    #region Account update
                    EntityCollection totalopportunitites = GetAllOpportunities(accountid.Id, service);
                    tracingService.Trace("Total Opportunities Count => " + totalopportunitites.Entities.Count);

                    foreach (var option in totalopportunitites.Entities)
                    {
                        oppmodel.Add(option.GetAttributeValue<OptionSetValue>("ss_partnershipmodel").Value);
                    }
                    //oppmodel = oppmodel.Distinct().ToList();
                    OptionSetValueCollection optionSetValues = new OptionSetValueCollection();
                    foreach (var item in oppmodel)
                    {
                        optionSetValues.Add(new OptionSetValue(item));
                    }
                    account["ss_partnershipmodel"] = optionSetValues;
                    service.Update(account);
                    #endregion Account update

                    #region Partner Update
                    //Retrieving Partner Entity
                    EntityReference partnerid = account.Contains("ss_partner") ? account.GetAttributeValue<EntityReference>("ss_partner") : null;
                    Entity partner = service.Retrieve("new_partner", partnerid.Id, new ColumnSet("ss_partnershipmodel"));
                    EntityCollection totalaccounts = GetAllAccoounts(partner.Id, service);
                    tracingService.Trace("Total Accounts Count => " + totalaccounts.Entities.Count);
                    OptionSetValueCollection optionSetValueCollection = new OptionSetValueCollection();
                    OptionSetValueCollection newcollection = new OptionSetValueCollection();
                    foreach (var item in totalaccounts.Entities)
                    {
                        optionSetValueCollection = item.GetAttributeValue<OptionSetValueCollection>("ss_partnershipmodel");
                        foreach (var accval in optionSetValueCollection.Select(opt => opt.Value).Distinct().ToList())
                        {
                            newcollection.Add(new OptionSetValue(accval));
                        }
                    }
                    partner["ss_partnershipmodel"] = newcollection;
                    service.Update(partner);
                }
                #endregion Partner Update
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException(ex.Message);
            }
        }

        public static EntityCollection GetAllAccoounts(Guid id, IOrganizationService service)
        {
            var query_ss_partner = id;
            var query = new QueryExpression("account");
            query.ColumnSet.AddColumns("ss_partnershipmodel", "accountid");
            query.Criteria.AddCondition("ss_partner", ConditionOperator.Equal, query_ss_partner);
            query.Criteria.AddCondition("ss_partnershipmodel", ConditionOperator.NotNull);
            EntityCollection entityCollection = service.RetrieveMultiple(query);
            return entityCollection;
        }

        public static EntityCollection GetAllOpportunities(Guid id, IOrganizationService service)
        {
            var query_parentaccountid = id;
            var query_new_productcategory = 100000000;
            var query = new QueryExpression("opportunity");
            query.ColumnSet.AddColumns("ss_partnershipmodel", "opportunityid");
            query.Criteria.AddCondition("parentaccountid", ConditionOperator.Equal, query_parentaccountid);
            query.Criteria.AddCondition("ss_partnershipmodel", ConditionOperator.NotNull);
            query.Criteria.AddCondition("new_productcategory", ConditionOperator.NotEqual, query_new_productcategory);
            query.Criteria.AddCondition("ss_opportunitypartner", ConditionOperator.NotNull);
            EntityCollection entityCollection = service.RetrieveMultiple(query);
            return entityCollection;
        }
    }
}
