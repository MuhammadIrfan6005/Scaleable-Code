using System;
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
                    var PreNavId = "";
                    DateTime actualclosedate;

                    if (entity.LogicalName != "opportunity" && context.MessageName != "Update")
                        return;
                    EntityReference accountid = new EntityReference();
                    EntityReference ownerid = new EntityReference();
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
                    #endregion

                    #region Main Operation
                    if (accountid != null && ownerid != null)
                    {
                        Entity account = service.Retrieve("account", accountid.Id, new ColumnSet(true));
                        Entity user = service.Retrieve("systemuser", ownerid.Id, new ColumnSet(true));
                        EntityReference bunit = (EntityReference)user.Attributes["businessunitid"];

                        var BUName = bunit.Name;
                        tracingService.Trace("BU Name =>" + BUName);

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
                        QEss_navisionidmapping.ColumnSet.AddColumns("ss_navisionidmappingid", "ss_name", "createdon", "ss_eqsfrance", "ss_eqsfranceagency", "ss_eqsukagency", "ss_eqsuk", "ss_eqsswitzerlandagency", "ss_eqsswitzerland", "ss_eqsrussia", "ss_eqsgermanyagency", "ss_eqsgermany", "ss_eqsus", "ss_ss_eqsusagency", "ss_eqsasia", "ss_eqsasiaagency");
                        QEss_navisionidmapping.AddOrder("ss_name", OrderType.Ascending);


                        EntityCollection navisionCollection = service.RetrieveMultiple(QEss_navisionidmapping);
                       
                        tracingService.Trace("Navision count : " + navisionCollection.Entities.Count);
                        tracingService.Trace("ss_navisionidmappingid : " + navisionCollection.Entities[0].GetAttributeValue<Guid>("ss_navisionidmappingid").ToString());
                        var navision = navisionCollection.Entities;
                        var NavisionMapping = new Entity("ss_navisionidmapping", navisionCollection.Entities[0].GetAttributeValue<Guid>("ss_navisionidmappingid"));
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
                        if (String.IsNullOrWhiteSpace(navid1) && String.IsNullOrWhiteSpace(navid2) && String.IsNullOrWhiteSpace(navid3) && String.IsNullOrWhiteSpace(equitystoryid) && String.IsNullOrWhiteSpace(equitystoryid2) && ((compareDate > 0) || (compareDate == 0)))
                        {
                            #region BU Germany
                            if ((BUName == "EQS Germany") && (isagency == false))
                            {
                                account.Attributes["bbo_navid"] = germany.ToString();
                                account.Attributes["bbo_equitystoryid"] = germany.ToString() + "a";
                                NavisionMapping.Attributes["ss_eqsgermany"] = germany + 1;
                                tracingService.Trace("Business Unit is EQS Germany");

                                updatedBU += "EQS - Germany " + account.Attributes["bbo_navid"].ToString();
                            }

                            else if ((BUName == "EQS Germany") && (isagency == true))
                            {
                                account.Attributes["bbo_navid"] = germanyAgency.ToString();
                                account.Attributes["bbo_equitystoryid"] = germanyAgency.ToString() + "a";
                                NavisionMapping.Attributes["ss_eqsgermanyagency"] = germanyAgency + 1;
                                tracingService.Trace("Business Unit is EQS Germany");
                                updatedBU += "EQS - Germany " + account.Attributes["bbo_navid"].ToString();
                            }
                            #endregion
                            else if ((BUName == "EQS Asia") && (isagency == false))
                            {
                                account.Attributes["bbo_navid"] = asia.ToString();
                                account.Attributes["bbo_equitystoryid"] = asia.ToString() + "a";
                                NavisionMapping.Attributes["ss_eqsasia"] = asia + 1;
                                tracingService.Trace("Business Unit is EQS Asia");
                                updatedBU += "EQS - Asia " + account.Attributes["bbo_navid"].ToString();
                            }

                            else if ((BUName == "EQS Asia") && (isagency == true))
                            {
                                account.Attributes["bbo_navid"] = asiaagency.ToString();
                                account.Attributes["bbo_equitystoryid"] = asiaagency.ToString() + "a";
                                NavisionMapping.Attributes["ss_eqsasiaagency"] = asiaagency + 1;
                                tracingService.Trace("Business Unit is EQS Asia");
                                updatedBU += "EQS - Asia " + account.Attributes["bbo_navid"].ToString();
                            }
                            #region BU Switzerland
                            else if ((BUName == "EQS Switzerland") && (isagency == false))
                            {
                                account.Attributes["bbo_navid"] = swtlnd.ToString();
                                account.Attributes["bbo_equitystoryid"] = swtlnd.ToString() + "a";
                                NavisionMapping.Attributes["ss_eqsswitzerland"] = swtlnd + 1;
                                tracingService.Trace("Business Unit is EQS Switzerland");
                                updatedBU += "EQS - Switzerland " + account.Attributes["bbo_navid"].ToString();
                            }
                            else if ((BUName == "EQS Switzerland") && (isagency == true))
                            {
                                account.Attributes["bbo_navid"] = swtlndAgency.ToString();
                                account.Attributes["bbo_equitystoryid"] = swtlndAgency.ToString() + "a";
                                NavisionMapping.Attributes["ss_eqsswitzerlandagency"] = swtlndAgency + 1;
                                tracingService.Trace("Business Unit is EQS Switzerland");
                                updatedBU += "EQS - Switzerland " + account.Attributes["bbo_navid"].ToString();
                            }
                            #endregion
                            //New BU Condition for EQS Italy
                            #region BU UK
                            else if ((BUName == "EQS UK") || (BUName == "EQS Italy") && (isagency == false))
                            {
                                account.Attributes["bbo_navid"] = uk.ToString();
                                account.Attributes["bbo_equitystoryid"] = uk.ToString() + "a";
                                NavisionMapping.Attributes["ss_eqsuk"] = uk + 1;
                                tracingService.Trace("Business Unit is EQS UK");
                                updatedBU += "EQS - UK " + account.Attributes["bbo_navid"].ToString();
                            }
                            else if ((BUName == "EQS UK") || (BUName == "EQS Italy") && (isagency == true))
                            {
                                account.Attributes["bbo_navid"] = ukAgency.ToString();
                                account.Attributes["bbo_equitystoryid"] = ukAgency.ToString() + "a";
                                NavisionMapping.Attributes["ss_eqsukagency"] = ukAgency + 1;
                                tracingService.Trace("Business Unit is EQS UK");
                                updatedBU += "EQS - UK " + account.Attributes["bbo_navid"].ToString();
                            }
                            #endregion

                            #region BU France
                            else if ((BUName == "EQS France" || (BUName == "EQS Spain")) && (isagency == false))
                            {
                                account.Attributes["bbo_navid"] = france.ToString();
                                account.Attributes["bbo_equitystoryid"] = france.ToString() + "a";
                                NavisionMapping.Attributes["ss_eqsfrance"] = france + 1;
                                tracingService.Trace("Business Unit is EQS France");
                            }
                            else if ((BUName == "EQS France" || (BUName == "EQS Spain")) && (isagency == true))
                            {
                                account.Attributes["bbo_navid"] = franceAgency.ToString();
                                account.Attributes["bbo_equitystoryid"] = franceAgency.ToString() + "a";
                                NavisionMapping.Attributes["ss_eqsfranceagency"] = franceAgency + 1;
                                tracingService.Trace("Business Unit is EQS France");
                            }
                            #endregion

                            else if (BUName == "EQS Russia")
                            {
                                account.Attributes["bbo_navid"] = rusia.ToString();
                                account.Attributes["bbo_equitystoryid"] = rusia.ToString() + "a";
                                NavisionMapping.Attributes["ss_eqsrussia"] = rusia + 1;
                                tracingService.Trace("Business Unit is EQS Russia");
                                updatedBU += "EQS - Russia " + account.Attributes["bbo_navid"].ToString();
                            }
                            else if ((BUName == "EQS US") && (isagency == false))
                            {
                                account.Attributes["bbo_navid"] = us.ToString();
                                account.Attributes["bbo_equitystoryid"] = us.ToString() + "a";
                                NavisionMapping.Attributes["ss_eqsus"] = us + 1;
                                tracingService.Trace("Business Unit is EQS US");
                            }
                            else if ((BUName == "EQS US") && (isagency == true))
                            {
                                account.Attributes["bbo_navid"] = usagency.ToString();
                                account.Attributes["bbo_equitystoryid"] = usagency.ToString() + "a";
                                NavisionMapping.Attributes["ss_ss_eqsusagency"] = usagency + 1;
                                tracingService.Trace("Business Unit is EQS US");
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
                        }
                        else
                        {
                            tracingService.Trace("Validations False");
                        }
                        //tracingService.Trace("Pre Nav ID : " + swtlnd);
                        tracingService.Trace("Actual Date : " + actualclosedate);
                        tracingService.Trace("Date2 : " + closedate);
                        tracingService.Trace("compare : " + compareDate);


                    }
                    #endregion
                }
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException(ex.Message);
            }
        }
    }
}
