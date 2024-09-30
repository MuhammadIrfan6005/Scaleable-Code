using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;

namespace Scaleable.Xrm.Plugin.SetItegrityValuesInQuotes
{
    public class SetIntegritytoQuotes : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            // Obtain the tracing service
            ITracingService tracingService =
            (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            // Obtain the execution context from the service provider.  
            IPluginExecutionContext context = (IPluginExecutionContext)
                serviceProvider.GetService(typeof(IPluginExecutionContext));

            // Obtain the organization service reference which you will need for  
            // web service calls.  
            IOrganizationServiceFactory serviceFactory =
                (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);
            try
            {

        
            tracingService.Trace("SetIntegritytoQuotes Triggered => ");
            if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
            {
                Entity entity = (Entity)context.InputParameters["Target"];
                if (entity.LogicalName != "quote" && context.MessageName != "Create")
                    return;
                
                if (entity.Attributes.Contains("opportunityid"))
                {
                    EntityReference entityReference = entity.GetAttributeValue<EntityReference>("opportunityid");
                    var lookupid = entityReference.Id;
                    tracingService.Trace("Lookup id => " + lookupid);
                        var fetchData = new
                        {
                            opportunityid = lookupid,
                            productnumber = "640100",
                            productnumber2 = "640101",
                            productnumber3 = "640050",
                            productnumber4 = "640060",
                            productnumber5 = "640080",
                            productnumber6 = "640081",
                            productnumber7 = "640070",
                            productnumber8 = "640071",
                            productnumber9 = "640052a",
                            productnumber10 = "640052",
                            productnumber11 = "640120",
                            productnumber12 = "640121",
                            productnumber13 = "640126",
                            productnumber14 = "640127"
                        };
                        var fetchXml = $@"
                        <fetch>
                          <entity name='opportunityproduct'>
                            <all-attributes />
                            <filter type='and'>
                              <condition attribute='opportunityid' operator='eq' value='{fetchData.opportunityid/*00000000-0000-0000-0000-000000000000*/}'/>
                            </filter>
                            <link-entity name='product' from='productid' to='productid' link-type='inner' alias='ac'>
                              <attribute name='productnumber' />
                              <attribute name='producttypecode' />
                              <filter type='and'>
                                <filter type='or'>
                                  <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber/*640100*/}'/>
                                  <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber2/*640101*/}'/>
                                  <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber3/*640050*/}'/>
                                  <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber4/*640060*/}'/>
                                  <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber5/*640080*/}'/>
                                  <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber6/*640081*/}'/>
                                  <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber7/*640070*/}'/>
                                  <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber8/*640071*/}'/>
                                  <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber9/*640052a*/}'/>
                                  <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber10/*640052*/}'/>
                                  <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber11/*640120*/}'/>
                                  <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber12/*640121*/}'/>
                                  <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber13/*640126*/}'/>
                                  <condition attribute='productnumber' operator='eq' value='{fetchData.productnumber14/*640127*/}'/>
                                </filter>
                              </filter>
                            </link-entity>
                          </entity>
                        </fetch>";



                        EntityCollection fetchResult = service.RetrieveMultiple(new FetchExpression(fetchXml));
                    int languages = 0;
                    var productname = "";
                    decimal ss_setupfee = 0;
                    decimal monthlyfee = 0;
                    int employee = 0;
                    var CM = 0;
                    var AU = 0;
                    var CMAU = 0;
                    string IntegrityAddOnSetupDetails = "";
                    string IntegrityLineSetupDetails = "";
                    string IntegrityLineLicenceDetails = "";
                    string IntegrityAddOnSetupFeeDetails = "";
                    string IntegrityAddOnMLicenceFeeDetails = "";
                    string ss_integaototalsfdetails_q = "";
                    string ss_integaototalmfdetails_q = "";
                    decimal ss_integtotalsfee_q = 0;
                    decimal ss_integtotalmfee_q = 0;
                    string ss_integaosname_q = "";
                    string ss_integsname_q = "";
                    string ss_integlname_q = "";
                    //ac.producttypecode 100000003
                    tracingService.Trace("Total Products => " + fetchResult?.Entities?.Count);
                    foreach (var oppProduct in fetchResult.Entities)
                    {
                            //EQS Integrity Line Details Setup
                            if (((OptionSetValue)oppProduct.GetAttributeValue<AliasedValue>("ac.producttypecode").Value).Value == 100000003 && oppProduct.GetAttributeValue<AliasedValue>("ac.productnumber").Value.ToString() == "640100")
                            {
                                ss_integsname_q = "EQS Integrity Line \n";
                                ss_setupfee = oppProduct.GetAttributeValue<Money>("ss_setupfee").Value;
                                entity["ss_integsfee_q"] = ss_setupfee;

                                if (oppProduct.GetAttributeValue<bool>("ss_integritybestpractice") == true)
                                {
                                    ss_integsname_q += "Professional \n";
                                    entity["ss_checklabel"] = "Professional";
                                    tracingService.Trace("Basic => " + entity["ss_checklabel"].ToString());
                                }
                                else if (oppProduct.GetAttributeValue<bool>("ss_integrityessential") == true)
                                {
                                    ss_integsname_q += "Essential \n";
                                    entity["ss_checklabel"] = "Essential";
                                    tracingService.Trace("Basic => " + entity["ss_checklabel"].ToString());
                                }
                                else if (oppProduct.GetAttributeValue<bool>("ss_integrityenterprise") == true)
                                {
                                    ss_integsname_q += "BKMS Professional \n";
                                    entity["ss_checklabel"] = "BKMS Professional";
                                    tracingService.Trace("Basic => " + entity["ss_checklabel"].ToString());
                                }
                                else
                                {
                                    entity["ss_checklabel"] = "";
                                    tracingService.Trace("Empty => " + entity["ss_checklabel"]);
                                }
                                IntegrityLineSetupDetails = "\r\n Including up to " + oppProduct.GetAttributeValue<int>("ss_includedimphours_ps") + "\r\n hours implementation \n - Online kickoff \r\n- System configuration \r\n - Testing \r\n - Online user training";
                            }
                            
                            //EQS Integrity Line License Details
                            else if (((OptionSetValue)oppProduct.GetAttributeValue<AliasedValue>("ac.producttypecode").Value).Value == 100000001 && oppProduct.GetAttributeValue<AliasedValue>("ac.productnumber").Value.ToString() == "640101")
                            {
                                ss_integlname_q = "EQS Integrity Line";
                                IntegrityLineLicenceDetails = oppProduct.GetAttributeValue<string>("ss_eqsintegrityldata_ps");
                                monthlyfee = oppProduct.GetAttributeValue<Money>("ss_monthlylicensefee").Value;
                                entity["ss_integmfee_q"] = monthlyfee;

                            }
                            
                            //BKMS System Setup Details 
                            else if (((OptionSetValue)oppProduct.GetAttributeValue<AliasedValue>("ac.producttypecode").Value).Value == 100000003 && oppProduct.GetAttributeValue<AliasedValue>("ac.productnumber").Value.ToString() == "640120")
                            {
                                ss_integsname_q = "BKMS System \n";
                                ss_setupfee = oppProduct.GetAttributeValue<Money>("ss_setupfee").Value;
                                entity["ss_integsfee_q"] = ss_setupfee;
                            }
                            
                            //BKMS System License Details 
                            else if (((OptionSetValue)oppProduct.GetAttributeValue<AliasedValue>("ac.producttypecode").Value).Value == 100000001 && oppProduct.GetAttributeValue<AliasedValue>("ac.productnumber").Value.ToString() == "640121")
                            {
                                ss_integlname_q = "BKMS System License \n";
                                IntegrityLineLicenceDetails = oppProduct.GetAttributeValue<string>("ss_eqsintegrityldata_ps");
                                monthlyfee = oppProduct.GetAttributeValue<Money>("ss_monthlylicensefee").Value;
                                entity["ss_integmfee_q"] = monthlyfee;
                                
                            }
                            
                            //BKMS System Add-On Setup Details 
                            else if (((OptionSetValue)oppProduct.GetAttributeValue<AliasedValue>("ac.producttypecode").Value).Value == 100000003 && oppProduct.GetAttributeValue<AliasedValue>("ac.productnumber").Value.ToString() == "640126")
                            {
                                ss_integaosname_q = "BKMS System Add - On \n";
                                if (oppProduct.GetAttributeValue<int>("ss_bkmsadditionallanguagecredits") > 0)
                                {
                                    IntegrityAddOnSetupDetails += "BKMS addtl. Language credits: " + oppProduct.GetAttributeValue<int>("ss_bkmsadditionallanguagecredits") + "\n";
                                    IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_bkmsadditionallanguagesetupfee").Value.ToString("0.00") + "\n";
                                    ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_bkmsadditionallanguagesetupfee").Value;
                                    tracingService.Trace("Integrity Add On Setup Details => " + IntegrityAddOnSetupDetails);
                                    tracingService.Trace("Integrity Add On Setup Fee Details => " + IntegrityAddOnSetupFeeDetails);
                                    tracingService.Trace("Integrity Add On Setup Fee Total Details => " + ss_integtotalsfee_q);
                                }
                                if (oppProduct.GetAttributeValue<int>("ss_casemanager") > 0)
                                {
                                    IntegrityAddOnSetupDetails += "Case Manager - Examiner Named: " + oppProduct.GetAttributeValue<int>("ss_casemanager") + "\n";
                                    IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_casemanagersetup").Value.ToString("0.00") + "\n";
                                    ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_casemanagersetup").Value;
                                    tracingService.Trace("Integrity Add On Setup Details => " + IntegrityAddOnSetupDetails);
                                    tracingService.Trace("Integrity Add On Setup Fee Details => " + IntegrityAddOnSetupFeeDetails);
                                    tracingService.Trace("Integrity Add On Setup Fee Total Details => " + ss_integtotalsfee_q);
                                }
                                if (oppProduct.GetAttributeValue<int>("ss_casemanagerfloatinguser") > 0)
                                {
                                    IntegrityAddOnSetupDetails += "Case Manager - Examiner Floating: " + oppProduct.GetAttributeValue<int>("ss_casemanagerfloatinguser") + "\n";
                                    IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_casemanagerfloatusersetupfee").Value.ToString("0.00") + "\n";
                                    ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_casemanagerfloatusersetupfee").Value;
                                    tracingService.Trace("Integrity Add On Setup Details => " + IntegrityAddOnSetupDetails);
                                    tracingService.Trace("Integrity Add On Setup Fee Details => " + IntegrityAddOnSetupFeeDetails);
                                    tracingService.Trace("Integrity Add On Setup Fee Total Details => " + ss_integtotalsfee_q);
                                }
                                if (oppProduct.GetAttributeValue<bool>("ss_bkmsincidentreportingchannelpagecheck"))
                                {
                                    IntegrityAddOnSetupDetails += "BKMS Incident Reporting Channel Page\n";
                                    IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_bkmsincidentreportingchannelpagesetupfee").Value.ToString("0.00") + "\n";
                                    ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_bkmsincidentreportingchannelpagesetupfee").Value;
                                    tracingService.Trace("Integrity Add On Setup Details => " + IntegrityAddOnSetupDetails);
                                    tracingService.Trace("Integrity Add On Setup Fee Details => " + IntegrityAddOnSetupFeeDetails);
                                    tracingService.Trace("Integrity Add On Setup Fee Total Details => " + ss_integtotalsfee_q);
                                }
                                if (oppProduct.GetAttributeValue<bool>("ss_bkmsincidentreportingtranslationactcheck"))
                                {
                                    IntegrityAddOnSetupDetails += "BKMS Incident Reporting Translation Module ACT\n";
                                    IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_bkmsincidentreportingtranslationactsetupf").Value.ToString("0.00") + "\n";
                                    ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_bkmsincidentreportingtranslationactsetupf").Value;
                                    tracingService.Trace("Integrity Add On Setup Details => " + IntegrityAddOnSetupDetails);
                                    tracingService.Trace("Integrity Add On Setup Fee Details => " + IntegrityAddOnSetupFeeDetails);
                                    tracingService.Trace("Integrity Add On Setup Fee Total Details => " + ss_integtotalsfee_q);
                                }
                                if (oppProduct.GetAttributeValue<bool>("ss_bkmsincidentreportingwbprocesscheck"))
                                {
                                    IntegrityAddOnSetupDetails += "BKMS Incident Reporting WB Process\n";
                                    IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_bkmsincidentreportingwbprocesssetupfee").Value.ToString("0.00") + "\n";
                                    ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_bkmsincidentreportingwbprocesssetupfee").Value;
                                    tracingService.Trace("Integrity Add On Setup Details => " + IntegrityAddOnSetupDetails);
                                    tracingService.Trace("Integrity Add On Setup Fee Details => " + IntegrityAddOnSetupFeeDetails);
                                    tracingService.Trace("Integrity Add On Setup Fee Total Details => " + ss_integtotalsfee_q);
                                }

                            }
                            
                            //BKMS System Add - On License Details
                            else if (((OptionSetValue)oppProduct.GetAttributeValue<AliasedValue>("ac.producttypecode").Value).Value == 100000001 && oppProduct.GetAttributeValue<AliasedValue>("ac.productnumber").Value.ToString() == "640127")
                            {
                                ss_integaosname_q = "BKMS System Add - On \n";
                                if (oppProduct.GetAttributeValue<int>("ss_bkmsadditionallanguagecredits") > 0)
                                {
                                    IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_bkmsadditionallanguagemonthlyfee").Value.ToString("0.00") + "\n";
                                    ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_bkmsadditionallanguagemonthlyfee").Value;
                                    tracingService.Trace("1");
                                    tracingService.Trace("Integrity Add On Monthly License fee Details => " + IntegrityAddOnMLicenceFeeDetails);
                                    tracingService.Trace("Integrity Add On Monthly Total License Fee Details => " + ss_integtotalmfee_q);
                                }
                                if (oppProduct.GetAttributeValue<int>("ss_casemanager") > 0)
                                {
                                    IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_casemanagermfee").Value.ToString("0.00") + "\n";
                                    ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_casemanagermfee").Value;
                                    tracingService.Trace("2");
                                    tracingService.Trace("Integrity Add On Monthly License fee Details => " + IntegrityAddOnMLicenceFeeDetails);
                                    tracingService.Trace("Integrity Add On Monthly Total License Fee Details => " + ss_integtotalmfee_q);
                                }
                                if (oppProduct.GetAttributeValue<int>("ss_casemanagerfloatinguser") > 0)
                                {
                                    IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_casemanagerfloatusermonthlyfee").Value.ToString("0.00") + "\n";
                                    ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_casemanagerfloatusermonthlyfee").Value;
                                    tracingService.Trace("3");
                                    tracingService.Trace("Integrity Add On Monthly License fee Details => " + IntegrityAddOnMLicenceFeeDetails);
                                    tracingService.Trace("Integrity Add On Monthly Total License Fee Details => " + ss_integtotalmfee_q);
                                }
                                if (oppProduct.GetAttributeValue<bool>("ss_bkmsincidentreportingchannelpagecheck"))
                                {
                                    IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_bkmsincidentreportingchannelpagemonthlyfe").Value.ToString("0.00") + "\n";
                                    ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_bkmsincidentreportingchannelpagemonthlyfe").Value;
                                    tracingService.Trace("4");
                                    tracingService.Trace("Integrity Add On Monthly License fee Details => " + IntegrityAddOnMLicenceFeeDetails);
                                    tracingService.Trace("Integrity Add On Monthly Total License Fee Details => " + ss_integtotalmfee_q);
                                }
                                if (oppProduct.GetAttributeValue<bool>("ss_bkmsincidentreportingtranslationactcheck"))
                                {
                                    IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_bkmsincidentreportingtranslationactmonthl").Value.ToString("0.00") + "\n";
                                    ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_bkmsincidentreportingtranslationactmonthl").Value;
                                    tracingService.Trace("5");
                                    tracingService.Trace("Integrity Add On Monthly License fee Details => " + IntegrityAddOnMLicenceFeeDetails);
                                    tracingService.Trace("Integrity Add On Monthly Total License Fee Details => " + ss_integtotalmfee_q);
                                }
                                if (oppProduct.GetAttributeValue<bool>("ss_bkmsincidentreportingwbprocesscheck"))
                                {
                                    IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_bkmsincidentreportingwbprocessmonthlyfee").Value.ToString("0.00") + "\n";
                                    ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_bkmsincidentreportingwbprocessmonthlyfee").Value;
                                    tracingService.Trace("6");
                                    tracingService.Trace("Integrity Add On Monthly License fee Details => " + IntegrityAddOnMLicenceFeeDetails);
                                    tracingService.Trace("Integrity Add On Monthly Total License Fee Details => " + ss_integtotalmfee_q);
                                }
                            }
                            
                            //EQS Integrity Line Classic Details Setup
                            else if (((OptionSetValue)oppProduct.GetAttributeValue<AliasedValue>("ac.producttypecode").Value).Value == 100000003 && oppProduct.GetAttributeValue<AliasedValue>("ac.productnumber").Value.ToString() == "640050")
                            {
                                ss_integsname_q = "EQS Integrity Line Classic";


                                ss_setupfee = oppProduct.GetAttributeValue<Money>("ss_setupfee").Value;
                                entity["ss_integsfee_q"] = ss_setupfee;
                                IntegrityLineSetupDetails = "\r\n Including up to " + oppProduct.GetAttributeValue<int>("ss_includedimphours_ps") + "\r\n hours implementation \n - Online kickoff \r\n- System configuration \r\n - Testing \r\n - Online user training";
                            }
                            
                            // EQS Integrity Line Classic Details License
                            else if (((OptionSetValue)oppProduct.GetAttributeValue<AliasedValue>("ac.producttypecode").Value).Value == 100000001 && oppProduct.GetAttributeValue<AliasedValue>("ac.productnumber").Value.ToString() == "640060")
                            {
                                ss_integlname_q = "EQS Integrity Line Classic";
                                IntegrityLineLicenceDetails = oppProduct.GetAttributeValue<string>("ss_eqsintegrityldata_ps");
                                monthlyfee = oppProduct.GetAttributeValue<Money>("ss_monthlylicensefee").Value;
                                entity["ss_integmfee_q"] = monthlyfee;
                            }
                            
                            //EQS Integrity Line Addon Setup Details
                            else if (((OptionSetValue)oppProduct.GetAttributeValue<AliasedValue>("ac.producttypecode").Value).Value == 100000003 && oppProduct.GetAttributeValue<AliasedValue>("ac.productnumber").Value.ToString() == "640052a")
                            {
                                //Boolean Fields
                                ss_integaosname_q = "EQS Integrity Line Add on \n";
                                if (oppProduct.GetAttributeValue<bool>("ss_integritylineclassiccheck"))
                                {
                                    ss_integaosname_q += "Integrity\n";

                                }
                                if (oppProduct.GetAttributeValue<bool>("ss_newintegritylineclassiccheck"))
                                {
                                    ss_integaosname_q += "Classic\n";

                                }
                                if (oppProduct.GetAttributeValue<bool>("ss_integritylineclassiccheck"))
                                {
                                    if (oppProduct.GetAttributeValue<bool>("ss_admintab_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "Admin Tab\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_admintabsfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_admintabsfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_journaltab_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "Journal Tab\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_journaltabsfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_journaltabsfee_ps").Value;

                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_reportingstat_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "Reporting & Statistics (Charts)\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_reportingstatsfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_reportingstatsfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_reminderalert_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "Reminders & Alerts\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_reminderalertsfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_reminderalertsfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_casechat_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "Case Chat\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_casechatsfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_casechatsfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_deepsearch_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "Deep Search (in all cases and case details)\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_deepsearchsfee_ps").Value.ToString("0.00") + "\n\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_deepsearchsfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_anonymizationpdf_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "Anonymization in PDFs (add on to anoymization function\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_anonymizationpdfsfee_ps").Value.ToString("0.00") + "\n\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_anonymizationpdfsfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_translationto_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "Translation (translation office)\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_translationtosfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_translationtosfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_translationmt_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "Translation (machine translation)\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_translationmtsfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_translationmtsfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_2factorauth_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "2 factor Authentication (Backend)\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_2factorauthsfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_2factorauthsfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_ipwhitelisting_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "IP Whitelisting (Backend)\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_ipwhitelistingsfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_ipwhitelistingsfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_caseimporterfun_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "Case Importer function (via xls upload)\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_caseimporterfunsfee_ps").Value.ToString("0.00") + "\n\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_caseimporterfunsfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_customdomainurl_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "Custom Domain/URL\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_customdomainurlsfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_customdomainurlsfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_ssointegration_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "SSO integration (single sign on via SAML2)\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_ssointegrationsfee_ps").Value.ToString("0.00") + "\n\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_ssointegrationsfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_apiintegration_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "API integration (via RESTful)\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_apiintegrationsfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_apiintegrationsfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_phoneintakecc_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "Phone Intake (call center)\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_phoneintakeccsfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_phoneintakeccsfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_phoneintakeams_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "Phone Intake (automated message service)\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_phoneintakeamssfee_ps").Value.ToString("0.00") + "\n\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_phoneintakeamssfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_emailintake_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "Email Intake\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_emailintakesfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_emailintakesfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_securecommunicationcftp_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "Secure communication channel for third parties\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_securecommunicationcftpsfee_ps").Value.ToString("0.00") + "\n\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_securecommunicationcftpsfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<int>("ss_languages") > 0)
                                    {
                                        IntegrityAddOnSetupDetails += "Languages : " + oppProduct.GetAttributeValue<int>("ss_languages") + "\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_languagessetup").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_languagessetup").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<int>("ss_casemanager") > 0)
                                    {
                                        IntegrityAddOnSetupDetails += "Case Manager - Named User : " + oppProduct.GetAttributeValue<int>("ss_casemanager") + "\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_casemanagersetup").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_casemanagersetup").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<int>("ss_admin") > 0)
                                    {
                                        IntegrityAddOnSetupDetails += "Admin - Named User : " + oppProduct.GetAttributeValue<int>("ss_admin") + "\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_adminsetup").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_adminsetup").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<int>("ss_phonelang") > 0)
                                    {
                                        IntegrityAddOnSetupDetails += "Phone Number/Language : " + oppProduct.GetAttributeValue<int>("ss_phonelang") + "\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_phonelangsfee").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_phonelangsfee").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<bool>("ss_additionalfeatures_ps"))
                                    {
                                        IntegrityAddOnSetupDetails += "Additional Features\n";
                                        IntegrityAddOnSetupDetails += oppProduct.GetAttributeValue<string>("ss_additionalfeaturesaddon_ps") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_additionalfeaturessfee_ps").Value;
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_additionalfeaturessfee_ps").Value.ToString("0.00") + "\n";
                                    }
                                }

                                //new fields for integrity line addon 
                                else if (oppProduct.GetAttributeValue<bool>("ss_newintegritylineclassiccheck"))
                                {
                                    if (oppProduct.GetAttributeValue<bool>("ss_fullfeaturepack"))
                                    {
                                        IntegrityAddOnSetupDetails += "Full Feature Pack\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_fullfeaturepacksetup").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_fullfeaturepacksetup").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<bool>("ss_singlesignon"))
                                    {
                                        IntegrityAddOnSetupDetails += "Single Sign On\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_singlesignonsetup").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_singlesignonsetup").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<bool>("ss_additionalfrontends"))
                                    {
                                        IntegrityAddOnSetupDetails += "Additional Frontends\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_additionalfrontendssetup").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_additionalfrontendssetup").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<bool>("ss_additionalreportingform"))
                                    {
                                        IntegrityAddOnSetupDetails += "Additional Reporting Form\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_additionalreportingformsetup").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_additionalreportingformsetup").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<bool>("ss_emailintakeintegrity"))
                                    {
                                        IntegrityAddOnSetupDetails += "Email Intake (Integrity)\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_emailintakeintegritysetup").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_emailintakeintegritysetup").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<bool>("ss_automatedmessageservice"))
                                    {
                                        IntegrityAddOnSetupDetails += "Automated Message Service / Voice Intake\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_automatedmessageservicesetup").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_automatedmessageservicesetup").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<bool>("ss_professionalsupportinc"))
                                    {
                                        IntegrityAddOnSetupDetails += "Professional Support (inc. 10)\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_professionalsupportincsetup").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_professionalsupportincsetup").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<bool>("ss_callcenterintakephone"))
                                    {
                                        IntegrityAddOnSetupDetails += "Call Center Intake / Phone Interview\n";
                                        IntegrityAddOnSetupFeeDetails += oppProduct.GetAttributeValue<Money>("ss_callcenterintakephonesetup").Value.ToString("0.00") + "\n";
                                        ss_integtotalsfee_q += oppProduct.GetAttributeValue<Money>("ss_callcenterintakephonesetup").Value;
                                    }
                                }

                            }
                            
                            //EQS Integrity Line Addon License Details
                            else if (((OptionSetValue)oppProduct.GetAttributeValue<AliasedValue>("ac.producttypecode").Value).Value == 100000001 && oppProduct.GetAttributeValue<AliasedValue>("ac.productnumber").Value.ToString() == "640052")
                            {
                                //Boolean Fields
                                ss_integaosname_q = "EQS Integrity Line Add on\n";
                                if (oppProduct.GetAttributeValue<bool>("ss_integritylineclassiccheck"))
                                {
                                    ss_integaosname_q += "Integrity\n";

                                }
                                if (oppProduct.GetAttributeValue<bool>("ss_newintegritylineclassiccheck"))
                                {
                                    ss_integaosname_q += "Classic\n";

                                }
                                if (oppProduct.GetAttributeValue<bool>("ss_integritylineclassiccheck"))
                                {
                                    if (oppProduct.GetAttributeValue<bool>("ss_admintab_ps"))
                                    {
                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_admintabmfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_admintabmfee_ps").Value;
                                    }


                                    if (oppProduct.GetAttributeValue<bool>("ss_journaltab_ps"))
                                    {
                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_journaltabmfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_journaltabmfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_reportingstat_ps"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_reportingstatmfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_reportingstatmfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_reminderalert_ps"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_reminderalertmfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_reminderalertmfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_casechat_ps"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_casechatmfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_casechatmfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_deepsearch_ps"))
                                    {
                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_deepsearchmfee_ps").Value.ToString("0.00") + "\n\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_deepsearchmfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_anonymizationpdf_ps"))
                                    {
                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_anonymizationpdfmfee_ps").Value.ToString("0.00") + "\n\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_anonymizationpdfmfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_translationto_ps"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_translationtomfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_translationtomfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_translationmt_ps"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_translationmtmfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_translationmtmfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_2factorauth_ps"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_2factorauthmfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_2factorauthmfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_ipwhitelisting_ps"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_ipwhitelistingmfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_ipwhitelistingmfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_caseimporterfun_ps"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_caseimporterfunmfee_ps").Value.ToString("0.00") + "\n\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_caseimporterfunmfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_customdomainurl_ps"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_customdomainurlmfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_customdomainurlmfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_ssointegration_ps"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_ssointegrationmfee_ps").Value.ToString("0.00") + "\n\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_ssointegrationmfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_apiintegration_ps"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_apiintegrationmfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_apiintegrationmfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_phoneintakecc_ps"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_phoneintakeccmfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_phoneintakeccmfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_phoneintakeams_ps"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_phoneintakeamsmfee_ps").Value.ToString("0.00") + "\n\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_phoneintakeamsmfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_emailintake_ps"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_emailintakemfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_emailintakemfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<bool>("ss_securecommunicationcftp_ps"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_securecommunicationcftpmfee_ps").Value.ToString("0.00") + "\n\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_securecommunicationcftpmfee_ps").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<int>("ss_languages") > 0)
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_languagesmfee").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_languagesmfee").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<int>("ss_casemanager") > 0)
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_casemanagermfee").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_casemanagermfee").Value;
                                    }

                                    if (oppProduct.GetAttributeValue<int>("ss_admin") > 0)
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_adminmfee").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_adminmfee").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<int>("ss_phonelang") > 0)
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_phonelangmfee").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_phonelangmfee").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<bool>("ss_additionalfeatures_ps"))
                                    {
                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_additionalfeaturesmfee_ps").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_additionalfeaturesmfee_ps").Value;

                                    }
                                }
                                //new integrity line add on fields
                                else if (oppProduct.GetAttributeValue<bool>("ss_newintegritylineclassiccheck"))
                                {
                                    if (oppProduct.GetAttributeValue<bool>("ss_fullfeaturepack"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_fullfeaturepackmonthly").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_fullfeaturepackmonthly").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<bool>("ss_singlesignon"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_singlesignonmonthly").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_singlesignonmonthly").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<bool>("ss_additionalfrontends"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_additionalfrontendsmonthly").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_additionalfrontendsmonthly").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<bool>("ss_additionalreportingform"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_additionalreportingformmonthly").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_additionalreportingformmonthly").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<bool>("ss_emailintakeintegrity"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_emailintakeintegritymonthly").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_emailintakeintegritymonthly").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<bool>("ss_automatedmessageservice"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_automatedmessageservicemonthly").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_automatedmessageservicemonthly").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<bool>("ss_professionalsupportinc"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_professionalsupportincmonthly").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_professionalsupportincmonthly").Value;
                                    }
                                    if (oppProduct.GetAttributeValue<bool>("ss_callcenterintakephone"))
                                    {

                                        IntegrityAddOnMLicenceFeeDetails += oppProduct.GetAttributeValue<Money>("ss_callcenterintakephonemonthly").Value.ToString("0.00") + "\n";
                                        ss_integtotalmfee_q += oppProduct.GetAttributeValue<Money>("ss_callcenterintakephonemonthly").Value;
                                    }
                                }

                            }
                            
                            //EQS Approval Manager
                            else if (((OptionSetValue)oppProduct.GetAttributeValue<AliasedValue>("ac.producttypecode").Value).Value == 100000003 && oppProduct.GetAttributeValue<AliasedValue>("ac.productnumber").Value.ToString() == "640080")
                            {
                                entity["ss_amsfee"] = oppProduct.GetAttributeValue<Money>("ss_setupfee").Value;
                                entity["ss_amemployees"] = oppProduct.GetAttributeValue<int>("ss_employees");
                                entity["ss_amadmin"] = oppProduct.GetAttributeValue<int>("ss_admin");
                                entity["ss_amlanguages"] = oppProduct.GetAttributeValue<int>("ss_languages");
                            }
                            
                            //EQS Approval Manager Licence
                            else if (((OptionSetValue)oppProduct.GetAttributeValue<AliasedValue>("ac.producttypecode").Value).Value == 100000001 && oppProduct.GetAttributeValue<AliasedValue>("ac.productnumber").Value.ToString() == "640081")
                            {
                                entity["ss_ammfee"] = oppProduct.GetAttributeValue<Money>("ss_monthlylicensefee").Value;
                            }
                            
                            //EQS Policy Manager
                            else if (((OptionSetValue)oppProduct.GetAttributeValue<AliasedValue>("ac.producttypecode").Value).Value == 100000003 && oppProduct.GetAttributeValue<AliasedValue>("ac.productnumber").Value.ToString() == "640070")
                            {
                                entity["ss_pmsfee"] = oppProduct.GetAttributeValue<Money>("ss_setupfee").Value;
                                entity["ss_pmemployees"] = oppProduct.GetAttributeValue<int>("ss_employees");
                                entity["ss_pmadmin"] = oppProduct.GetAttributeValue<int>("ss_admin");
                                entity["ss_pmlanguages"] = oppProduct.GetAttributeValue<int>("ss_languages");
                            }
                            
                            //EQS Policy Manager Licence
                            else if (((OptionSetValue)oppProduct.GetAttributeValue<AliasedValue>("ac.producttypecode").Value).Value == 100000001 && oppProduct.GetAttributeValue<AliasedValue>("ac.productnumber").Value.ToString() == "640071")
                            {
                                entity["ss_pmmfee"] = oppProduct.GetAttributeValue<Money>("ss_monthlylicensefee").Value;
                            }
                    }//End of For loo
                    entity["ss_integsdetails_q"] = IntegrityLineSetupDetails;
                    entity["ss_integldetails_q"] = IntegrityLineLicenceDetails;
                    entity["ss_integaosdetails_q"] = IntegrityAddOnSetupDetails;
                    entity["ss_integldetails_de"] = IntegrityLineLicenceDetails.Replace("Employees", "Mitarbeiter").Replace("Languages", "Sprachen").Replace("Case Manager - Named User", "Fallbearbeiter – Named User").Replace("Countries", "Länder");
                    entity["ss_integaosname_q"] = ss_integaosname_q;
                    entity["ss_integsname_q"] = ss_integsname_q;
                        tracingService.Trace("Total Products name are => " + entity["ss_integsname_q"].ToString());
                    entity["ss_integlname_q"] = ss_integlname_q;
                       
                    entity["ss_integaototalsfdetails_q"] = IntegrityAddOnSetupFeeDetails;
                    entity["ss_integaototalmfdetails_q"] = IntegrityAddOnMLicenceFeeDetails;
                    entity["ss_integtotalsfee_q"] = ss_integtotalsfee_q + ss_setupfee;
                    entity["ss_integtotalmfee_q"] = ss_integtotalmfee_q + monthlyfee;

                    //=============================
                   
                    
                    //entity["ss_integlang_q"] = languages;
                  
                    //entity["ss_integemp_q"] = employee;
                   
                    //entity["ss_integ_cmau_q"] = CMAU;
                
                }
            }
            }
            catch (Exception ex)
            {

                tracingService.Trace("Error Message => " + ex.Message);
                tracingService.Trace("Stack Trace => " + ex.StackTrace);
            }
        }


          


    }
}