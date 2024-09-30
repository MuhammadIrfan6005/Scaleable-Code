using System;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace Scaleable.Xrm.Plugins
{
    /// <summary>      
    /// •	Entity Opportunity – (Field) Status – equals - won
    //•	Entity Account – (Field) NAV ID   – does not contain data
    //•	Entity Account – (Field) NAV ID2 – does not contain data
    //•	Entity Account – (Field) NAV ID3 – does not contain data
    //•	Entity Account – (Field) Equity Story ID      – does not contain data
    //•	Entity Account – (Field) Equity Story ID 2 – does not contain data
    //•	Entity Opportunity –(Field) Actual Close Date – On or after – 22.07.2019

    //If Business Unit(related to owner opportunity) :
    //EQS Germany: create NAV ID – starting with 51001
    //EQS Germany and Account is agency: create NAV ID – starting with 65801
    //EQS Russia: create NAV ID – starting with 10301
    //EQS Switzerland: create NAV ID – starting with 11501
    //EQS Switzerland and Account is agency: create NAV ID – starting with 124001
    //EQS UK: create NAV ID – starting with 243001
    //EQS UK and Account is agency: create NAV ID – starting with 248201
    /////testing
    /// </summary>  
    /// 
    public class CreateUniqueNavID : IPlugin
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

                if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
                {
                    Entity entity = (Entity)context.InputParameters["Target"];
                    Entity PostImage = (Entity)context.PostEntityImages["PostImage"];
                    int statecode;
                    OptionSetValue ss_partnershipmodel;
                    //var PreNavId = "";
                    string officialcontractpartner = "";
                    DateTime actualclosedate;
                    var contractnumber = "";
                    var wonoppflow = "";

                    if (entity.LogicalName != "opportunity" && context.MessageName != "Update")
                        return;
                    EntityReference accountid = new EntityReference();
                    EntityReference ownerid = new EntityReference();
                    EntityReference ss_opportunitypartner = null;
                    tracingService.Trace("Opp iD =>" + entity.Id.ToString());

                    #region validate fields
                    if (!entity.Contains("parentaccountid") && !PostImage.Contains("parentaccountid"))
                        return;
                    if (!entity.Contains("ownerid") && !PostImage.Contains("ownerid"))
                        return;
                    if (!entity.Contains("statecode") && !PostImage.Contains("statecode"))
                        return;
                    #endregion

                    #region filling variables
                    if (entity.Attributes.Contains("statecode"))
                        statecode = ((OptionSetValue)entity.Attributes["statecode"]).Value;
                    else
                        statecode = ((OptionSetValue)PostImage.Attributes["statecode"]).Value;
                    if (statecode != 1)
                        return;
                    if (entity.Attributes.Contains("parentaccountid"))
                        accountid = (EntityReference)entity.Attributes["parentaccountid"];
                    else
                        accountid = (EntityReference)PostImage.Attributes["parentaccountid"];
                    if (entity.Attributes.Contains("ownerid"))
                        ownerid = (EntityReference)entity.Attributes["ownerid"];
                    else
                        ownerid = (EntityReference)PostImage.Attributes["ownerid"];
                    if (entity.Attributes.Contains("actualclosedate"))
                        actualclosedate = entity.GetAttributeValue<DateTime>("actualclosedate");
                    else
                        actualclosedate = PostImage.GetAttributeValue<DateTime>("actualclosedate");
                    if (entity.Attributes.Contains("ss_officialcontractpartner"))
                        officialcontractpartner = entity.GetAttributeValue<string>("ss_officialcontractpartner");
                    else
                        officialcontractpartner = PostImage.GetAttributeValue<string>("ss_officialcontractpartner");
                    if (entity.Attributes.Contains("ss_contractnumber"))
                        contractnumber = entity.GetAttributeValue<string>("ss_contractnumber");
                    else
                        contractnumber = PostImage.GetAttributeValue<string>("ss_contractnumber");
                    if (entity.Attributes.Contains("new_wonoppflow"))
                        wonoppflow = entity.FormattedValues["new_wonoppflow"] != null && entity.FormattedValues["new_wonoppflow"] != "" ? entity.FormattedValues["new_wonoppflow"].ToString() : "";
                    else
                        wonoppflow = PostImage.FormattedValues["new_wonoppflow"] != null && PostImage.FormattedValues["new_wonoppflow"] != "" ? PostImage.FormattedValues["new_wonoppflow"].ToString() : "";
                    if (entity.Contains("ss_opportunitypartner"))
                        ss_opportunitypartner = entity.Contains("ss_opportunitypartner") ? entity.GetAttributeValue<EntityReference>("ss_opportunitypartner") : null;
                    else
                        ss_opportunitypartner = PostImage.Contains("ss_opportunitypartner") ? PostImage.GetAttributeValue<EntityReference>("ss_opportunitypartner") : null;
                    if (entity.Contains("ss_partnershipmodel"))
                        ss_partnershipmodel = entity.GetAttributeValue<OptionSetValue>("ss_partnershipmodel");
                    else
                        ss_partnershipmodel = PostImage.Contains("ss_partnershipmodel") ? PostImage.GetAttributeValue<OptionSetValue>("ss_partnershipmodel") : new OptionSetValue(-1);
                    #endregion
                    tracingService.Trace("After Getting Required Fields");
                        #region Main Operation
                    if (accountid != null && ownerid != null)
                    {
                        Entity account = service.Retrieve("account", accountid.Id, new ColumnSet(true));
                        Entity user = service.Retrieve("systemuser", ownerid.Id, new ColumnSet(true));
                        EntityReference bunit = (EntityReference)user.Attributes["businessunitid"];
                        Entity partner = new Entity();
                        if (ss_opportunitypartner != null)
                        {
                            //sandbox
                            //partner = service.Retrieve("ss_partner", ss_opportunitypartner.Id, new ColumnSet("new_navid"));
                            //production
                            partner = service.Retrieve("new_partner", ss_opportunitypartner.Id, new ColumnSet("new_navid"));
                        }
                        

                        var BUName = bunit.Name;
                        tracingService.Trace("BU Name =>" + BUName);
                        var Oppownername = user.GetAttributeValue<string>("fullname");
                        tracingService.Trace("BU Name =>" + Oppownername);
                        string[] users = { "Thuan Duong", "Olga Just", "Diana Chavarro", "Nicolai Elsner" };
                        #region Query Expression Get Account's Data, it is commented

                        //// Instantiate QueryExpression QEopportunity
                        //var QEopportunity = new QueryExpression("opportunity");

                        //// Add columns to QEopportunity.ColumnSet
                        //QEopportunity.ColumnSet.AddColumns("actualclosedate");
                        //QEopportunity.AddOrder("name", OrderType.Ascending);

                        //// Define filter QEopportunity.Criteria/ "2f1dcf6a-a8c4-e911-a830-000d3ab713ee"
                        //QEopportunity.Criteria.AddCondition("opportunityid", ConditionOperator.Equal, entity.Id);

                        //// Add link-entity QEopportunity_systemuser
                        //var QEopportunity_systemuser = QEopportunity.AddLink("systemuser", "owninguser", "systemuserid", JoinOperator.LeftOuter);
                        //QEopportunity_systemuser.EntityAlias = "a_d92c12f78e5a474cbc1a39ed130438af";

                        //// Add columns to QEopportunity_systemuser.Columns
                        //QEopportunity_systemuser.Columns.AddColumns("businessunitid");

                        //// Add link-entity QEopportunity_account
                        //var QEopportunity_account = QEopportunity.AddLink("account", "parentaccountid", "accountid", JoinOperator.LeftOuter);
                        //QEopportunity_account.EntityAlias = "a_76946cd0245c4349bbb98a1ed211155a";

                        //// Add columns to QEopportunity_account.Columns
                        //QEopportunity_account.Columns.AddColumns("name", "ss_navid3", "bbo_agency", "ss_navid2", "bbo_navid", "ss_equitystoryid2", "bbo_equitystoryid");



                        //EntityCollection result = service.RetrieveMultiple(QEopportunity);
                        //tracingService.Trace("total count : " + result.Entities.Count);
                        #endregion

                        #region GET Navision Mapping

                        var QEss_navisionidmapping = new QueryExpression("ss_navisionidmapping");

                        //QEss_navisionidmapping.ColumnSet.AddColumns("ss_navisionidmappingid", "ss_name", "createdon", "ss_eqsswitzerlandagency", "ss_eqsswitzerland");

                        //Production Query 
                        QEss_navisionidmapping.ColumnSet.AddColumns("ss_navisionidmappingid", "ss_name", "createdon", "ss_eqsfrance", "ss_eqsfranceagency", "ss_eqsukagency", "ss_eqsuk", "ss_eqsswitzerlandagency", "ss_eqsswitzerland", "ss_eqsrussia", "ss_eqsgermanyagency", "ss_eqsgermany", "ss_eqsus", "ss_ss_eqsusagency", "ss_eqsasia", "ss_eqsasiaagency", "ss_eqsdenmark", "ss_eqsitaly", "ss_eqsgermanycn", "ss_eqsswitzerlandcn", "ss_eqsukcn", "ss_eqsusacn", "ss_eqsfrancecn", "ss_eqsaustria", "ss_eqsspain", "ss_eqsaustriacn","ss_eqsspaincn","ss_eqsdenmarkcn");

                        //Sandbox Query
                        //QEss_navisionidmapping.ColumnSet.AddColumns("ss_navisionidmappingid", "ss_name", "createdon", "ss_eqsfrance", "ss_eqsfranceagency", "ss_eqsukagency", "ss_eqsuk", "ss_eqsswitzerlandagency", "ss_eqsswitzerland", "ss_eqsrussia", "ss_eqsgermanyagency", "ss_eqsgermany", "ss_eqsus", "ss_ss_eqsusagency", "ss_eqsasia", "ss_eqsasiaagency", "ss_eqsdenmark", "ss_eqsitaly", "ss_eqsgermanycn", "ss_eqsswitzerlandcn", "ss_eqsukcn", "ss_eqsusacn", "ss_eqsfrancecn", "ss_eqsaustria", "ss_eqsaustriacn", "ss_eqsspaincn", "ss_eqsdenmarkcn");
                        QEss_navisionidmapping.AddOrder("ss_name", OrderType.Ascending);


                        EntityCollection navisionCollection = service.RetrieveMultiple(QEss_navisionidmapping);
                       
                        tracingService.Trace("Navision count : " + navisionCollection.Entities.Count);
                        tracingService.Trace("ss_navisionidmappingid : " + navisionCollection.Entities[0].GetAttributeValue<Guid>("ss_navisionidmappingid").ToString());
                        var navision = navisionCollection.Entities;
                        var NavisionMapping = new Entity("ss_navisionidmapping", navisionCollection.Entities[0].GetAttributeValue<Guid>("ss_navisionidmappingid"));
                        int germany = (int)navision[0].Attributes["ss_eqsgermany"];
                        tracingService.Trace("Germany");
                        int germanyAgency = (int)navision[0].Attributes["ss_eqsgermanyagency"];
                        tracingService.Trace("Germany Agency");
                        int uk = (int)navision[0].Attributes["ss_eqsuk"];
                        tracingService.Trace("UK Navision ID is => " + uk);
                        int ukAgency = (int)navision[0].Attributes["ss_eqsukagency"];
                        int swtlnd = navision[0].GetAttributeValue<int>("ss_eqsswitzerland");
                        tracingService.Trace("Switzerland Navision ID is  => " + swtlnd);
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
                        tracingService.Trace("EQS Austria => " + eqsaustria);
                        #endregion

                        string navid1 = account.GetAttributeValue<string>("bbo_navid"); //navid1 = "";
                        string navid2 = account.GetAttributeValue<string>("ss_navid2");
                        string navid3 = account.GetAttributeValue<string>("ss_navid3");
                        string equitystoryid = account.GetAttributeValue<string>("bbo_equitystoryid");
                        string equitystoryid2 = account.GetAttributeValue<string>("ss_equitystoryid2");
                        bool isagency = account.GetAttributeValue<bool>("bbo_agency");
                        tracingService.Trace("navid1 : " + navid1);
                        tracingService.Trace("navid2 : " + navid2);
                        tracingService.Trace("navid3 : " + navid3);
                        tracingService.Trace("equity : " + equitystoryid);
                        tracingService.Trace("equity2 : " + equitystoryid2);
                        tracingService.Trace("Account name : " + account.GetAttributeValue<string>("name"));
                        DateTime closedate = new DateTime(2020, 7, 8, 0, 0, 0);
                        int compareDate = DateTime.Compare(actualclosedate, closedate);
                        string updatedBU = "";

                        if (wonoppflow == "No" && !users.Contains(Oppownername) && string.IsNullOrEmpty(contractnumber))
                        {
                            Checkcontractnumber(officialcontractpartner, navision, NavisionMapping, tracingService, contractnumber, entity, service);
                        }
                        if(ss_opportunitypartner != null && (ss_partnershipmodel.Value == 0 || ss_partnershipmodel.Value == 3 || ss_partnershipmodel.Value == 2))
                        {
                            CheckandUpdatePartnerEntity(officialcontractpartner, navision, NavisionMapping, tracingService, service, partner, compareDate, BUName);
                        }
                        else
                        {
                            if (officialcontractpartner == "EQS Austria" && String.IsNullOrWhiteSpace(navid1) && String.IsNullOrWhiteSpace(navid2) && String.IsNullOrWhiteSpace(navid3) && String.IsNullOrWhiteSpace(equitystoryid) && String.IsNullOrWhiteSpace(equitystoryid2) && ((compareDate > 0) || (compareDate == 0)))
                            {
                                tracingService.Trace("Updating EQS Austria");
                                account.Attributes["bbo_navid"] = eqsaustria.ToString();
                                account.Attributes["bbo_equitystoryid"] = eqsaustria.ToString() + "a";
                                NavisionMapping.Attributes["ss_eqsaustria"] = eqsaustria + 1;
                                service.Update(account);
                                service.Update(NavisionMapping);
                                tracingService.Trace("End Here For EQS Austria");
                            }
                            else if (officialcontractpartner == "EQS Spain" && String.IsNullOrWhiteSpace(navid1) && String.IsNullOrWhiteSpace(navid2) && String.IsNullOrWhiteSpace(navid3) && String.IsNullOrWhiteSpace(equitystoryid) && String.IsNullOrWhiteSpace(equitystoryid2) && ((compareDate > 0) || (compareDate == 0)))
                            {
                                tracingService.Trace("Updating EQS Spain");
                                account.Attributes["bbo_navid"] = eqsspain.ToString();
                                account.Attributes["bbo_equitystoryid"] = eqsspain.ToString() + "a";
                                NavisionMapping.Attributes["ss_eqsspain"] = eqsspain + 1;
                                service.Update(account);
                                service.Update(NavisionMapping);
                                tracingService.Trace("End Here For EQS Spain");
                            }
                            else if (String.IsNullOrWhiteSpace(navid1) && String.IsNullOrWhiteSpace(navid2) && String.IsNullOrWhiteSpace(navid3) && String.IsNullOrWhiteSpace(equitystoryid) && String.IsNullOrWhiteSpace(equitystoryid2) && ((compareDate > 0) || (compareDate == 0)))
                            {
                                #region BU Germany
                                if ((officialcontractpartner == "EQS Germany") && (isagency == false))
                                {
                                    account.Attributes["bbo_navid"] = germany.ToString();
                                    account.Attributes["bbo_equitystoryid"] = germany.ToString() + "a";
                                    NavisionMapping.Attributes["ss_eqsgermany"] = germany + 1;
                                    tracingService.Trace("Business Unit is EQS Germany");

                                    updatedBU += "EQS - Germany " + account.Attributes["bbo_navid"].ToString();
                                }

                                else if ((officialcontractpartner == "EQS Germany") && (isagency == true))
                                {
                                    account.Attributes["bbo_navid"] = germanyAgency.ToString();
                                    account.Attributes["bbo_equitystoryid"] = germanyAgency.ToString() + "a";
                                    NavisionMapping.Attributes["ss_eqsgermanyagency"] = germanyAgency + 1;
                                    tracingService.Trace("Business Unit is EQS Germany");
                                    updatedBU += "EQS - Germany " + account.Attributes["bbo_navid"].ToString();
                                }
                                #endregion
                                else if ((officialcontractpartner == "EQS Asia") && (isagency == false))
                                {
                                    account.Attributes["bbo_navid"] = asia.ToString();
                                    account.Attributes["bbo_equitystoryid"] = asia.ToString() + "a";
                                    NavisionMapping.Attributes["ss_eqsasia"] = asia + 1;
                                    tracingService.Trace("Business Unit is EQS Asia");
                                    updatedBU += "EQS - Asia " + account.Attributes["bbo_navid"].ToString();
                                }

                                else if ((officialcontractpartner == "EQS Asia") && (isagency == true))
                                {
                                    account.Attributes["bbo_navid"] = asiaagency.ToString();
                                    account.Attributes["bbo_equitystoryid"] = asiaagency.ToString() + "a";
                                    NavisionMapping.Attributes["ss_eqsasiaagency"] = asiaagency + 1;
                                    tracingService.Trace("Business Unit is EQS Asia");
                                    updatedBU += "EQS - Asia " + account.Attributes["bbo_navid"].ToString();
                                }
                                #region BU Switzerland
                                else if ((officialcontractpartner == "EQS Switzerland") && (isagency == false))
                                {
                                    account.Attributes["bbo_navid"] = swtlnd.ToString();
                                    account.Attributes["bbo_equitystoryid"] = swtlnd.ToString() + "a";
                                    NavisionMapping.Attributes["ss_eqsswitzerland"] = swtlnd + 1;
                                    tracingService.Trace("Business Unit is EQS Switzerland");
                                    updatedBU += "EQS - Switzerland " + account.Attributes["bbo_navid"].ToString();
                                }
                                else if ((officialcontractpartner == "EQS Switzerland") && (isagency == true))
                                {
                                    account.Attributes["bbo_navid"] = swtlndAgency.ToString();
                                    account.Attributes["bbo_equitystoryid"] = swtlndAgency.ToString() + "a";
                                    NavisionMapping.Attributes["ss_eqsswitzerlandagency"] = swtlndAgency + 1;
                                    tracingService.Trace("Business Unit is EQS Switzerland");
                                    updatedBU += "EQS - Switzerland " + account.Attributes["bbo_navid"].ToString();
                                }
                                #endregion

                                #region BU UK
                                else if ((officialcontractpartner == "EQS UK") && (isagency == false))
                                {
                                    account.Attributes["bbo_navid"] = uk.ToString();
                                    account.Attributes["bbo_equitystoryid"] = uk.ToString() + "a";
                                    NavisionMapping.Attributes["ss_eqsuk"] = uk + 1;
                                    tracingService.Trace("Business Unit is EQS UK");
                                    updatedBU += "EQS - UK " + account.Attributes["bbo_navid"].ToString();
                                }
                                else if ((officialcontractpartner == "EQS UK") && (isagency == true))
                                {
                                    account.Attributes["bbo_navid"] = ukAgency.ToString();
                                    account.Attributes["bbo_equitystoryid"] = ukAgency.ToString() + "a";
                                    NavisionMapping.Attributes["ss_eqsukagency"] = ukAgency + 1;
                                    tracingService.Trace("Business Unit is EQS UK");
                                    updatedBU += "EQS - UK " + account.Attributes["bbo_navid"].ToString();
                                }
                                #endregion

                                #region BU France
                                else if (officialcontractpartner == "EQS France" && (isagency == false))
                                {
                                    account.Attributes["bbo_navid"] = france.ToString();
                                    account.Attributes["bbo_equitystoryid"] = france.ToString() + "a";
                                    NavisionMapping.Attributes["ss_eqsfrance"] = france + 1;
                                    tracingService.Trace("Business Unit is EQS France");
                                }
                                else if (officialcontractpartner == "EQS France" && (isagency == true))
                                {
                                    account.Attributes["bbo_navid"] = franceAgency.ToString();
                                    account.Attributes["bbo_equitystoryid"] = franceAgency.ToString() + "a";
                                    NavisionMapping.Attributes["ss_eqsfranceagency"] = franceAgency + 1;
                                    tracingService.Trace("Business Unit is EQS France");
                                }
                                #endregion

                                else if (officialcontractpartner == "EQS Russia")
                                {
                                    account.Attributes["bbo_navid"] = rusia.ToString();
                                    account.Attributes["bbo_equitystoryid"] = rusia.ToString() + "a";
                                    NavisionMapping.Attributes["ss_eqsrussia"] = rusia + 1;
                                    tracingService.Trace("Business Unit is EQS Russia");
                                    updatedBU += "EQS - Russia " + account.Attributes["bbo_navid"].ToString();
                                }
                                else if (officialcontractpartner == "EQS Denmark")
                                {
                                    account.Attributes["bbo_navid"] = eqsdenmark.ToString();
                                    account.Attributes["bbo_equitystoryid"] = eqsdenmark.ToString() + "a";
                                    NavisionMapping.Attributes["ss_eqsdenmark"] = eqsdenmark + 1;
                                    tracingService.Trace("Business Unit is EQS Denmark");
                                    updatedBU += "EQS - Russia " + account.Attributes["bbo_navid"].ToString();
                                }
                                else if ((officialcontractpartner == "EQS US") && (isagency == false))
                                {
                                    account.Attributes["bbo_navid"] = us.ToString();
                                    account.Attributes["bbo_equitystoryid"] = us.ToString() + "a";
                                    NavisionMapping.Attributes["ss_eqsus"] = us + 1;
                                    tracingService.Trace("Business Unit is EQS US");
                                }
                                else if ((officialcontractpartner == "EQS US") && (isagency == true))
                                {
                                    account.Attributes["bbo_navid"] = usagency.ToString();
                                    account.Attributes["bbo_equitystoryid"] = usagency.ToString() + "a";
                                    NavisionMapping.Attributes["ss_ss_eqsusagency"] = usagency + 1;
                                    tracingService.Trace("Business Unit is EQS US");
                                }
                                else if ((officialcontractpartner == "EQS Italy"))
                                {
                                    account.Attributes["bbo_navid"] = eqsitaly.ToString();
                                    account.Attributes["bbo_equitystoryid"] = eqsitaly.ToString() + "a";
                                    NavisionMapping.Attributes["ss_eqsitaly"] = eqsitaly + 1;
                                    tracingService.Trace("Business Unit is EQS Italy");
                                }
                                tracingService.Trace("Validations True");
                                tracingService.Trace(updatedBU);
                                service.Update(account);
                                service.Update(NavisionMapping);
                                tracingService.Trace("End Here");
                            }
                            else if (!String.IsNullOrEmpty(navid1) && String.IsNullOrEmpty(equitystoryid) && String.IsNullOrEmpty(equitystoryid2) && ((compareDate > 0) || (compareDate == 0)))
                            {
                                account.Attributes["bbo_equitystoryid"] = navid1 + "a";
                                service.Update(account);
                                service.Update(NavisionMapping);
                            }
                            else
                            {
                                service.Update(NavisionMapping);
                                tracingService.Trace("Validations False");
                            }
                            //tracingService.Trace("Pre Nav ID : " + swtlnd);
                            tracingService.Trace("Actual Date : " + actualclosedate);
                            tracingService.Trace("Date2 : " + closedate);
                            tracingService.Trace("compare : " + compareDate);
                        }

                    }
                    #endregion
                }
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException(ex.Message);
            }
        }

        private void CheckandUpdatePartnerEntity(string officialcontractpartner, DataCollection<Entity> navision, Entity navisionMapping, ITracingService tracingService, IOrganizationService service, Entity partner, int compareDate, string bUName)
        {
            int germany = (int)navision[0].Attributes["ss_eqsgermany"];
            int germanyAgency = (int)navision[0].Attributes["ss_eqsgermanyagency"];
            int uk = (int)navision[0].Attributes["ss_eqsuk"];
            tracingService.Trace("UK Navision ID is => " + uk);
            int ukAgency = (int)navision[0].Attributes["ss_eqsukagency"];
            int swtlnd = navision[0].GetAttributeValue<int>("ss_eqsswitzerland");
            tracingService.Trace("Switzerland Navision ID is  => " + swtlnd);
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
            tracingService.Trace("EQS Austria => " + eqsaustria);

            var BUName = bUName;
            string new_navid = partner.GetAttributeValue<string>("new_navid");


            if (officialcontractpartner == "EQS Austria" && String.IsNullOrWhiteSpace(new_navid)  && ((compareDate > 0) || (compareDate == 0)))
            {
                tracingService.Trace("Updating EQS Austria");
                partner.Attributes["new_navid"] = eqsaustria.ToString();
                navisionMapping.Attributes["ss_eqsaustria"] = eqsaustria + 1;
                service.Update(partner);
                service.Update(navisionMapping);
                tracingService.Trace("End Here For EQS Austria");
            }
            else if (officialcontractpartner == "EQS Spain" && String.IsNullOrWhiteSpace(new_navid)  && ((compareDate > 0) || (compareDate == 0)))
            {
                tracingService.Trace("Updating EQS Spain");
                partner.Attributes["new_navid"] = eqsspain.ToString();
                navisionMapping.Attributes["ss_eqsspain"] = eqsspain + 1;
                service.Update(partner);
                service.Update(navisionMapping);
                tracingService.Trace("End Here For EQS Spain");
            }
            else if (String.IsNullOrWhiteSpace(new_navid) && ((compareDate > 0) || (compareDate == 0)))
            {
                #region BU Germany
                if (officialcontractpartner == "EQS Germany")
                {
                    partner.Attributes["new_navid"] = germany.ToString();
                    navisionMapping.Attributes["ss_eqsgermany"] = germany + 1;
                    tracingService.Trace("Business Unit is EQS Germany");
                }
                #endregion
                else if (officialcontractpartner == "EQS Asia")
                {
                    partner.Attributes["new_navid"] = asia.ToString();
                    navisionMapping.Attributes["ss_eqsasia"] = asia + 1;
                    tracingService.Trace("Business Unit is EQS Asia");
                }
                #region BU Switzerland
                else if (officialcontractpartner == "EQS Switzerland")
                {
                    partner.Attributes["new_navid"] = swtlnd.ToString();
                    navisionMapping.Attributes["ss_eqsswitzerland"] = swtlnd + 1;
                    tracingService.Trace("Business Unit is EQS Switzerland");
                }
                else if (officialcontractpartner == "EQS Switzerland")
                {
                    partner.Attributes["new_navid"] = swtlndAgency.ToString();
                    navisionMapping.Attributes["ss_eqsswitzerlandagency"] = swtlndAgency + 1;
                    tracingService.Trace("Business Unit is EQS Switzerland");
                }
                #endregion

                #region BU UK
                else if (officialcontractpartner == "EQS UK")
                {
                    partner.Attributes["new_navid"] = uk.ToString();
                    navisionMapping.Attributes["ss_eqsuk"] = uk + 1;
                    tracingService.Trace("Business Unit is EQS UK");
                }
                #endregion

                #region BU France
                else if (officialcontractpartner == "EQS France")
                {
                    partner.Attributes["new_navid"] = france.ToString();
                    navisionMapping.Attributes["ss_eqsfrance"] = france + 1;
                    tracingService.Trace("Business Unit is EQS France");
                }
                #endregion

                else if (officialcontractpartner == "EQS Russia")
                {
                    partner.Attributes["new_navid"] = rusia.ToString();
                    navisionMapping.Attributes["ss_eqsrussia"] = rusia + 1;
                    tracingService.Trace("Business Unit is EQS Russia");
                }
                else if (officialcontractpartner == "EQS Denmark")
                {
                    partner.Attributes["new_navid"] = eqsdenmark.ToString();
                    navisionMapping.Attributes["ss_eqsdenmark"] = eqsdenmark + 1;
                    tracingService.Trace("Business Unit is EQS Denmark");
                }
                else if (officialcontractpartner == "EQS US")
                {
                    partner.Attributes["new_navid"] = us.ToString();
                    navisionMapping.Attributes["ss_eqsus"] = us + 1;
                    tracingService.Trace("Business Unit is EQS US");
                }
                else if ((officialcontractpartner == "EQS Italy"))
                {
                    partner.Attributes["new_navid"] = eqsitaly.ToString();
                    navisionMapping.Attributes["ss_eqsitaly"] = eqsitaly + 1;
                    tracingService.Trace("Business Unit is EQS Italy");
                }
                service.Update(partner);
                service.Update(navisionMapping);
                tracingService.Trace("End Here");
            }
            //else if (!String.IsNullOrEmpty(navid1) && String.IsNullOrEmpty(equitystoryid) && String.IsNullOrEmpty(equitystoryid2) && ((compareDate > 0) || (compareDate == 0)))
            //{
            //    account.Attributes["bbo_equitystoryid"] = navid1 + "a";
            //    service.Update(account);
            //    service.Update(NavisionMapping);
            //}
            else
            {
                service.Update(navisionMapping);
                tracingService.Trace("Validations False");
            }
        }

        private void Checkcontractnumber(string officialcontractpartner, DataCollection<Entity> navision, Entity navisionMapping, ITracingService tracingService, string contractnumber, Entity entity, IOrganizationService service)
        {
            tracingService.Trace("Update Contract Function");
            string result = "";
            string eqsgermancycn = navision[0].GetAttributeValue<string>("ss_eqsgermanycn");
            tracingService.Trace("EQS Germany Contract Number is => " + eqsgermancycn);
            string eqsswitzerlandcn = navision[0].GetAttributeValue<string>("ss_eqsswitzerlandcn");
            tracingService.Trace("EQS Switzerland Contract Number is => " + eqsswitzerlandcn);
            string eqsukcn = navision[0].GetAttributeValue<string>("ss_eqsukcn");
            tracingService.Trace("EQS UK Contract Number is => " + eqsukcn);
            string eqsusa = navision[0].GetAttributeValue<string>("ss_eqsusacn");
            tracingService.Trace("EQS US Contract Number is => " + eqsusa);
            string eqsfrancecn = navision[0].GetAttributeValue<string>("ss_eqsfrancecn");
            tracingService.Trace("EQS France Contract Number is => " + eqsfrancecn);
            string eqsaustriacn = navision[0].GetAttributeValue<string>("ss_eqsaustriacn");
            string eqsspaincn = navision[0].GetAttributeValue<string>("ss_eqsspaincn");
            string eqsdenmark = navision[0].GetAttributeValue<string>("ss_eqsdenmarkcn");

            if(string.IsNullOrEmpty(contractnumber))
            {
                if (officialcontractpartner == "EQS Germany")
                {
                    tracingService.Trace("In");
                    var prefix = Regex.Match(eqsgermancycn, "^\\D+").Value;
                    var number = Regex.Replace(eqsgermancycn, "^\\D+", "");
                    var increment = int.Parse(number) + 1;
                    result = prefix + increment.ToString(new string('0', number.Length));
                    navisionMapping.Attributes["ss_eqsgermanycn"] = result.ToString();
                    entity.Attributes["ss_contractnumber"] = result.ToString();
                    tracingService.Trace("Germany");
                }
                else if (officialcontractpartner == "EQS Switzerland")
                {
                    var splitString = eqsswitzerlandcn.Split('-');
                    var prefix = splitString[0];

                    // complete string with preleading zeros 
                    string FullNumber = splitString[1].ToString();
                    string PreLeadingZeros = ""; // only preleading zeros 
                    var number = int.Parse(FullNumber); // only the number part without preleading zeros

					foreach (var character in FullNumber)
					{
						if (string.Equals(character.ToString(), "0"))
						{
                            PreLeadingZeros = PreLeadingZeros + "0";
						}
						else
						{
                            break;
						}
					}

                    number++;
					tracingService.Trace("EQS Switzerland is => " + prefix + "-" +PreLeadingZeros+ number);
                    result = prefix + "-" + PreLeadingZeros.ToString()+number.ToString();
                    navisionMapping.Attributes["ss_eqsswitzerlandcn"] = result.ToString();
                    entity.Attributes["ss_contractnumber"] = result.ToString();
                    tracingService.Trace("EQS Switzerland");
                }
                else if (officialcontractpartner == "EQS US")
                {
                    var prefix = Regex.Match(eqsusa, "^\\D+").Value;
                    var number = Regex.Replace(eqsusa, "^\\D+", "");
                    var increment = int.Parse(number) + 1;
                    result = prefix + increment.ToString(new string('0', number.Length));
                    navisionMapping.Attributes["ss_eqsusacn"] = result.ToString();
                    entity.Attributes["ss_contractnumber"] = result.ToString();
                    tracingService.Trace("EQS US");
                }
                else if (officialcontractpartner == "EQS France")
                {
                    var prefix = Regex.Match(eqsfrancecn, "^\\D+").Value;
                    var number = Regex.Replace(eqsfrancecn, "^\\D+", "");
                    var i = int.Parse(number) + 1;
                    result = prefix + i.ToString(new string('0', number.Length));
                    navisionMapping.Attributes["ss_eqsfrancecn"] = result.ToString();
                    entity.Attributes["ss_contractnumber"] = result.ToString();
                    tracingService.Trace("EQS France");
                }
                else if (officialcontractpartner == "EQS UK")
                {
                    var prefix = Regex.Match(eqsukcn, "^\\D+").Value;
                    var number = Regex.Replace(eqsukcn, "^\\D+", "");
                    var increment = int.Parse(number) + 1;
                    result = prefix + increment.ToString(new string('0', number.Length));
                    navisionMapping.Attributes["ss_eqsukcn"] = result.ToString();
                    entity.Attributes["ss_contractnumber"] = result.ToString();
                    tracingService.Trace("EQS UK");
                }
                else if (officialcontractpartner == "EQS Austria")
                {
                    var prefix = Regex.Match(eqsaustriacn, "^\\D+").Value;
                    var number = Regex.Replace(eqsaustriacn, "^\\D+", "");
                    var increment = int.Parse(number) + 1;
                    result = prefix + increment.ToString(new string('0', number.Length));
                    navisionMapping.Attributes["ss_eqsaustriacn"] = result.ToString();
                    entity.Attributes["ss_contractnumber"] = result.ToString();
                    tracingService.Trace("EQS Austria");
                }
                else if (officialcontractpartner == "EQS Spain")
                {
                    var prefix = Regex.Match(eqsspaincn, "^\\D+").Value;
                    var number = Regex.Replace(eqsspaincn, "^\\D+", "");
                    var increment = int.Parse(number) + 1;
                    result = prefix + increment.ToString(new string('0', number.Length));
                    navisionMapping.Attributes["ss_eqsspaincn"] = result.ToString();
                    entity.Attributes["ss_contractnumber"] = result.ToString();
                    tracingService.Trace("EQS Spain");
                }
                else if(officialcontractpartner == "EQS Denmark")
                {
                    var prefix = Regex.Match(eqsdenmark, "^\\D+").Value;
                    var number = Regex.Replace(eqsdenmark, "^\\D+", "");
                    var increment = int.Parse(number) + 1;
                    result = prefix + increment.ToString(new string('0', number.Length));
                    navisionMapping.Attributes["ss_eqsdenmarkcn"] = result.ToString();
                    entity.Attributes["ss_contractnumber"] = result.ToString();
                    tracingService.Trace("EQS Spain");
                }
                else
                {
                    tracingService.Trace("No Official Contract Owner Matched");
                }
            }
            if(result != "")
            {
                tracingService.Trace("Update Opp Entity");
                service.Update(entity);
            }
        }
    }
}
