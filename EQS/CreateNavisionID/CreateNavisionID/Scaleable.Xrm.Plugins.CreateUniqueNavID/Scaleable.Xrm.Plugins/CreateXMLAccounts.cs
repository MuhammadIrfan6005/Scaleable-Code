using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scaleable.Xrm.Plugins
{
    public class CreateXMLAccounts : IPlugin
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

                if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity entity1)
                {
                    Entity entity = entity1;
                    Entity PostImage = (Entity)context.PostEntityImages["PostImage"];
                    int statecode;
                    bool createxmlaccount = false;
                    string officialcontractpartner = "";
                    if (entity.LogicalName != "opportunity" && context.MessageName != "Update")
                        return;

                    EntityReference accountid = new EntityReference();
                    EntityReference ownerid = new EntityReference();

                    if (entity.Attributes.Contains("statecode"))
                        statecode = ((OptionSetValue)entity.GetAttributeValue<OptionSetValue>("statecode")).Value;
                    else
                        statecode = ((OptionSetValue)PostImage.GetAttributeValue<OptionSetValue>("statecode")).Value;
                    if (statecode != 1)
                        return;
                    if (entity.Attributes.Contains("parentaccountid"))
                        accountid = (EntityReference)entity.Attributes["parentaccountid"];
                    else
                        accountid = (EntityReference)PostImage.Attributes["parentaccountid"];
                    if (entity.Attributes.Contains("ss_officialcontractpartner"))
                        officialcontractpartner = entity.GetAttributeValue<string>("ss_officialcontractpartner");
                    else
                        officialcontractpartner = PostImage.GetAttributeValue<string>("ss_officialcontractpartner");
                    if (entity.Contains("ss_createxmlaccount"))
                        createxmlaccount = entity.GetAttributeValue<bool>("ss_createxmlaccount");
                    else
                        createxmlaccount = PostImage.GetAttributeValue<bool>("ss_createxmlaccount");
                    if (entity.Attributes.Contains("ownerid"))
                        ownerid = entity.GetAttributeValue<EntityReference>("ownerid");
                    else
                        ownerid = PostImage.GetAttributeValue<EntityReference>("ownerid");
                    if (!createxmlaccount)
                        return;

                    EntityCollection navisionCollection = GetNavisionData(service);
                    tracingService.Trace("Navision count : " + navisionCollection.Entities.Count);
                    tracingService.Trace("ss_navisionidmappingid : " + navisionCollection.Entities[0].GetAttributeValue<Guid>("ss_navisionidmappingid").ToString());
                    var navision = navisionCollection.Entities;
                    var NavisionMapping = new Entity("ss_navisionidmapping", navisionCollection.Entities[0].GetAttributeValue<Guid>("ss_navisionidmappingid"));
                    int germany = (int)navision[0].Attributes["ss_eqsgermany"];
                    tracingService.Trace("Germany ID => " + germany);
                    int germanyAgency = (int)navision[0].Attributes["ss_eqsgermanyagency"];
                    int uk = (int)navision[0].Attributes["ss_eqsuk"];
                    int ukAgency = (int)navision[0].Attributes["ss_eqsukagency"];
                    int swtlnd = navision[0].GetAttributeValue<int>("ss_eqsswitzerland");
                    int swtlndAgency = navision[0].GetAttributeValue<int>("ss_eqsswitzerlandagency");
                    int france = navision[0].GetAttributeValue<int>("ss_eqsfrance");
                    int franceAgency = navision[0].GetAttributeValue<int>("ss_eqsfranceagency");
                    int rusia = (int)navision[0].Attributes["ss_eqsrussia"];
                    int us = navision[0].GetAttributeValue<int>("ss_eqsus");
                    int usagency = navision[0].GetAttributeValue<int>("ss_ss_eqsusagency");
                    int asia = navision[0].GetAttributeValue<int>("ss_eqsasia");
                    int asiaagency = navision[0].GetAttributeValue<int>("ss_eqsasiaagency");
                    int eqsdenmark = navision[0].GetAttributeValue<int>("ss_eqsdenmark");
                    int eqsitaly = navision[0].GetAttributeValue<int>("ss_eqsitaly");
                    var eqsaustria = navision[0].GetAttributeValue<int>("ss_eqsaustria");
                    var eqsspain = navision[0].GetAttributeValue<int>("ss_eqsspain");

                    tracingService.Trace("Nav ID => " + germany + " Opportunity ID => " + entity.Id + "Account ID => " + accountid.Id + "Official Contract Partner => " + officialcontractpartner);

                    if (officialcontractpartner == "EQS Germany")
                        RetrieveXmlAccounts(service, tracingService, germany, entity.Id, accountid.Id, officialcontractpartner, NavisionMapping, ownerid);
                    else if (officialcontractpartner == "EQS Austria")
                        RetrieveXmlAccounts(service, tracingService, eqsaustria, entity.Id, accountid.Id, officialcontractpartner, NavisionMapping, ownerid);
                    else if (officialcontractpartner == "EQS Spain")
                        RetrieveXmlAccounts(service, tracingService, eqsspain, entity.Id, accountid.Id, officialcontractpartner, NavisionMapping, ownerid);
                    else if (officialcontractpartner == "EQS Asia")
                        RetrieveXmlAccounts(service, tracingService, asia, entity.Id, accountid.Id, officialcontractpartner, NavisionMapping, ownerid);
                    else if (officialcontractpartner == "EQS Switzerland")
                        RetrieveXmlAccounts(service, tracingService, swtlnd, entity.Id, accountid.Id, officialcontractpartner, NavisionMapping, ownerid);
                    else if (officialcontractpartner == "EQS UK")
                        RetrieveXmlAccounts(service, tracingService, uk, entity.Id, accountid.Id, officialcontractpartner, NavisionMapping, ownerid);
                    else if (officialcontractpartner == "EQS France")
                        RetrieveXmlAccounts(service, tracingService, france, entity.Id, accountid.Id, officialcontractpartner, NavisionMapping, ownerid);
                    else if (officialcontractpartner == "EQS Russia")
                        RetrieveXmlAccounts(service, tracingService, rusia, entity.Id, accountid.Id, officialcontractpartner, NavisionMapping, ownerid);
                    else if (officialcontractpartner == "EQS Denmark")
                        RetrieveXmlAccounts(service, tracingService, eqsdenmark, entity.Id, accountid.Id, officialcontractpartner, NavisionMapping, ownerid);
                    else if (officialcontractpartner == "EQS US")
                        RetrieveXmlAccounts(service, tracingService, us, entity.Id, accountid.Id, officialcontractpartner, NavisionMapping, ownerid);
                    else if (officialcontractpartner == "EQS Italy")
                        RetrieveXmlAccounts(service, tracingService, eqsitaly, entity.Id, accountid.Id, officialcontractpartner, NavisionMapping, ownerid);
                    else
                        tracingService.Trace("Official Contract Parter not Matched");
                }

            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException(ex.Message);
            }
        }

        private void RetrieveXmlAccounts(IOrganizationService service, ITracingService tracingService, int navid, Guid opportunityid, Guid accountid, string officialcontractpartner, Entity navisionMapping, EntityReference ownerid)
        {
            Entity account = new Entity("account");
            // Define Condition Values
            var query_ss_account = accountid;
            var query_ss_opportunity = opportunityid;

            // Instantiate QueryExpression query
            var query = new QueryExpression("ss_xmlaccount");
            var query_ss_iscreated = false;
            // Add columns to query.ColumnSet
            query.ColumnSet.AddColumns("ss_xmlaccountid","ss_address1_line1", "ss_artdergesellschaft", "ss_emailaddress1", "ss_address1_postalcode", "ss_rechtsform", "ss_websiteurl", "ss_registrierungsnummer", "ss_address1_city", "ss_steuerschluessel", "ss_opportunity", "ss_firmenname", "ss_registergericht", "ss_account", "ownerid");

            // Define filter query.Criteria
            query.Criteria.AddCondition("ss_account", ConditionOperator.Equal, query_ss_account);
            query.Criteria.AddCondition("ss_opportunity", ConditionOperator.Equal, query_ss_opportunity);
            query.Criteria.AddCondition("ss_iscreated", ConditionOperator.Equal, query_ss_iscreated);

            EntityCollection xmlaccounts = service.RetrieveMultiple(query);

            foreach (var accounts in xmlaccounts.Entities)
            {
                account.Attributes["name"] = accounts?.GetAttributeValue<string>("ss_firmenname");
                tracingService.Trace("Firmenname => " + accounts.GetAttributeValue<string>("ss_firmenname"));

                account.Attributes["parentaccountid"] = new EntityReference(accounts?.GetAttributeValue<EntityReference>("ss_account")?.LogicalName, (Guid)(accounts?.GetAttributeValue<EntityReference>("ss_account")?.Id));
                account.Attributes["ss_salesrepxml"] = new EntityReference(ownerid?.LogicalName, (Guid)ownerid?.Id);
                tracingService?.Trace("Sales Rep Owner ID is => " + ownerid.Id);
                account.Attributes["ownerid"] = new EntityReference(ownerid?.LogicalName, (Guid)ownerid?.Id);
                tracingService?.Trace("Record Owner ID is => " + ownerid.Id);

                account.Attributes["address1_line1"] = accounts?.GetAttributeValue<string>("ss_address1_line1");
                tracingService.Trace("Address 1 => " + accounts.GetAttributeValue<string>("ss_address1_line1"));

                account.Attributes["address1_postalcode"] = accounts?.GetAttributeValue<string>("ss_address1_postalcode");
                tracingService.Trace("Address 1 Postol Code => " + accounts.GetAttributeValue<string>("ss_address1_postalcode"));

                account.Attributes["address1_city"] = accounts?.GetAttributeValue<string>("ss_address1_city");
                tracingService.Trace("Address 1 City => " + accounts.GetAttributeValue<string>("ss_address1_city"));

                account.Attributes["websiteurl"] = accounts?.GetAttributeValue<string>("ss_websiteurl");
                tracingService.Trace("Website => " + accounts.GetAttributeValue<string>("ss_websiteurl"));

                account.Attributes["emailaddress1"] = accounts?.GetAttributeValue<string>("ss_emailaddress1");
                tracingService.Trace("Email Address => " + accounts.GetAttributeValue<string>("ss_emailaddress1"));

                account.Attributes["ss_artdergesellschafttext"] = accounts?.GetAttributeValue<string>("ss_artdergesellschaft");

                //account.Attributes["new_registerart"] = accounts.GetAttributeValue<string>("ss_registergericht");
                //tracingService.Trace("Registerart => " + accounts.GetAttributeValue<string>("ss_registergericht"));

                account.Attributes["new_registrierungsnummer"] = accounts?.GetAttributeValue<string>("ss_registrierungsnummer");
                tracingService.Trace("Reg - Nr => " + accounts.GetAttributeValue<string>("ss_registrierungsnummer"));

                //account.Attributes["ss_amtsgerichtvalue"] = accounts.GetAttributeValue<string>("");
                account.Attributes["ss_rechtsform"] = accounts?.GetAttributeValue<string>("ss_rechtsform");
                tracingService.Trace("Rechtsform => " + accounts.GetAttributeValue<string>("ss_rechtsform"));

                account.Attributes["ss_steuerschluessel"] = accounts?.GetAttributeValue<string>("ss_steuerschluessel");
                tracingService.Trace("Steuerschluessel => " + accounts.GetAttributeValue<string>("ss_steuerschluessel"));

                account.Attributes["ownerid"] = new EntityReference(accounts?.GetAttributeValue<EntityReference>("ownerid")?.LogicalName, (Guid)accounts?.GetAttributeValue<EntityReference>("ownerid")?.Id);

                account.Attributes["bbo_navid"] = navid.ToString();
                tracingService.Trace("Nav ID => " + navid.ToString());

                account.Attributes["bbo_equitystoryid"] = navid.ToString() + "a";
                tracingService.Trace("Nav ID => " + navid.ToString() + "a");
                navid++;

                account.Attributes["ss_subsidiaryaccount"] = true;
                service.Create(account);
                //Entity xmlaccount = new Entity("ss_xmlaccount");
                accounts.Attributes["ss_iscreated"] = true;
                service.Update(accounts);
                tracingService.Trace("Created XML Account");
            }
            string navisionattribute = officialcontractpartner == "EQS Germany" ? "ss_eqsgermany" : officialcontractpartner == "EQS Austria" ? "ss_eqsaustria" : officialcontractpartner == "EQS Spain" ? "ss_eqsspain" : officialcontractpartner == "EQS Asia" ? "ss_eqsasia"  : officialcontractpartner == "EQS Switzerland" ? "ss_eqsswitzerland" : officialcontractpartner == "EQS UK" ? "ss_eqsuk" : officialcontractpartner == "EQS France" ? "ss_eqsfrance" : officialcontractpartner == "EQS France" ? "ss_eqsfrance" : officialcontractpartner == "EQS Russia" ? "ss_eqsrussia" : officialcontractpartner == "EQS Denmark" ? "ss_eqsdenmark" : officialcontractpartner == "EQS US" ? "ss_eqsus" : officialcontractpartner == "EQS Italy" ? "ss_eqsitaly" : "";
            navisionMapping.Attributes[navisionattribute] = navid;
            service.Update(navisionMapping);
            tracingService.Trace("Update NAvision");
        }

        private EntityCollection GetNavisionData(IOrganizationService service)
        {
            #region GET Navision Mapping

            var QEss_navisionidmapping = new QueryExpression("ss_navisionidmapping");

            //QEss_navisionidmapping.ColumnSet.AddColumns("ss_navisionidmappingid", "ss_name", "createdon", "ss_eqsswitzerlandagency", "ss_eqsswitzerland");

            //Production Query 
            QEss_navisionidmapping.ColumnSet.AddColumns("ss_navisionidmappingid", "ss_name", "createdon", "ss_eqsfrance", "ss_eqsfranceagency", "ss_eqsukagency", "ss_eqsuk", "ss_eqsswitzerlandagency", "ss_eqsswitzerland", "ss_eqsrussia", "ss_eqsgermanyagency", "ss_eqsgermany", "ss_eqsus", "ss_ss_eqsusagency", "ss_eqsasia", "ss_eqsasiaagency", "ss_eqsdenmark", "ss_eqsitaly", "ss_eqsgermanycn", "ss_eqsswitzerlandcn", "ss_eqsukcn", "ss_eqsusacn", "ss_eqsfrancecn", "ss_eqsaustria", "ss_eqsspain", "ss_eqsaustriacn", "ss_eqsspaincn", "ss_eqsdenmarkcn");

            //Sandbox Query
            //QEss_navisionidmapping.ColumnSet.AddColumns("ss_navisionidmappingid", "ss_name", "createdon", "ss_eqsfrance", "ss_eqsfranceagency", "ss_eqsukagency", "ss_eqsuk", "ss_eqsswitzerlandagency", "ss_eqsswitzerland", "ss_eqsrussia", "ss_eqsgermanyagency", "ss_eqsgermany", "ss_eqsus", "ss_ss_eqsusagency", "ss_eqsasia", "ss_eqsasiaagency", "ss_eqsdenmark", "ss_eqsitaly", "ss_eqsgermanycn", "ss_eqsswitzerlandcn", "ss_eqsukcn", "ss_eqsusacn", "ss_eqsfrancecn", "ss_eqsaustria", "ss_eqsaustriacn", "ss_eqsspaincn", "ss_eqsdenmarkcn");
            QEss_navisionidmapping.AddOrder("ss_name", OrderType.Ascending);


            EntityCollection navisionentity = service.RetrieveMultiple(QEss_navisionidmapping);
            return navisionentity;
            #endregion
        }
    }
}
