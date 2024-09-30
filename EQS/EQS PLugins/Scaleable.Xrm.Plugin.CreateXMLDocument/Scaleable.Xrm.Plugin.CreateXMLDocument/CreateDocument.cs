using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System.Xml;
////////////////////////////////////////////////////////////////////
///  Plugin-Name: Create XML Document                            ///
///  Target-Entity: Opportunity                                       ///
///  Message: Update                                                 ///
///  Stage:   Post Operation                                          ///
///  Developer:   Muhammad Bilal                                      ///
///  Description:  Create XML Document with following entities data   ///
///  (Opportunity, Account, Contact, Product, Sales Opp Products,Segment, Product Group)///
//////////////////////////////////////////////////////////////////

namespace Scaleable.Xrm.Plugin.CreateXMLDocument
{
    public class CreateDocument : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            #region Standard Initializations
            IPluginExecutionContext context =
                (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

            IOrganizationServiceFactory factory =
                (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);

            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            #endregion Standard Initializations

            tracingService.Trace("Plugin Started");
            #region plugin start
            try
            {
                #region Stardard Validations

                if (!(context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity))
                    return;

                if (!(context.PreEntityImages.Contains("PreImage")))
                    return;
                
                if (context.Depth > 1)
                    return;
                
                Entity oppEntity = (Entity)context.InputParameters["Target"];
                if (oppEntity.LogicalName != "opportunity")
                    return;

                Entity preImage = (Entity)context.PreEntityImages["PreImage"];
                
                if (context.MessageName != "Update")
                    return;
                
                string state = "";
                //if (oppEntity.Contains("statecode"))
                //{
                //    state = oppEntity.FormattedValues["statecode"];
                //}
                //else
                //{
                //    tracingService.Trace("State not contain");
                //    return;
                //}

                //if (state != "Won")
                //    return;

                tracingService.Trace("After validation");
                #endregion
                var sb = new StringBuilder();
                var settings = new XmlWriterSettings();
                using (var writer = XmlWriter.Create(sb, settings))
                {
                    writer.WriteStartDocument(true);
                    //writer.Formatting = Formatting.Indented;
                    //writer.Indentation = 2;
                    writer.WriteStartElement("Opportunity");
                    #region Opp Data
                    Guid oppid = oppEntity.Id;
                    DateTime? closedate = null;

                    string oppName = oppEntity.Contains("name") ? (string)oppEntity.Attributes["name"] 
                            : preImage.GetAttributeValue<string>("name");
                    Money actualvalue = oppEntity.Contains("actualvalue_base") ? (Money)oppEntity.Attributes["actualvalue_base"]
                            : preImage.GetAttributeValue<Money>("actualvalue_base");
                    Guid owner = oppEntity.Contains("ownerid") ? ((EntityReference)oppEntity.Attributes["ownerid"]).Id
                            : (preImage.GetAttributeValue<EntityReference>("ownerid")).Id;
                    string ownername = oppEntity.Contains("ownerid") ? ((EntityReference)oppEntity.Attributes["ownerid"]).Name
                            : (preImage.GetAttributeValue<EntityReference>("ownerid")).Name;
                    string invoiveEmail = oppEntity.Contains("ss_einvoiceemail") ? (string)oppEntity.Attributes["ss_einvoiceemail"]
                            : preImage.GetAttributeValue<string>("ss_einvoiceemail");
                    if (oppEntity.Contains("actualclosedate"))
                        closedate = (DateTime)oppEntity.Attributes["actualclosedate"];
                    else if(preImage.Contains("actualclosedate"))
                        closedate = (DateTime)preImage.Attributes["actualclosedate"];

                    
                    writer.WriteStartElement("Opportunity_data");
                    createNode("Opportunity_name", oppName, writer);
                    createNode("Owner", ownername, writer);
                    if(actualvalue != null)
                        createNode("Actual_value_base", actualvalue.Value.ToString(), writer);
                    else
                        createNode("Actual_value_base", "0.00", writer);

                    createNode("Actual_close_date", closedate.ToString(), writer);
                    createNode("Invoice_email", invoiveEmail, writer);
                    writer.WriteEndElement();
                    #endregion

                    #region Account info
                    Guid parentAccount = Guid.Empty;
                    if (oppEntity.Contains("parentaccountid"))
                        parentAccount = ((EntityReference)oppEntity["parentaccountid"]).Id;
                    else if(preImage.Contains("parentaccountid"))
                        parentAccount = ((EntityReference)preImage["parentaccountid"]).Id;

                    if (parentAccount != null)
                    {
                        ColumnSet accountAttributes = new ColumnSet(new string[] { "name", "bbo_navid", "address1_line1", "address1_postalcode", "address1_city", "ss_countryiso" });
                        Entity account = service.Retrieve("account", parentAccount, accountAttributes);
                        string accountname = account.GetAttributeValue<string>("name");
                        string bbo_navid = account.GetAttributeValue<string>("bbo_navid");
                        string address1_line1 = account.GetAttributeValue<string>("address1_line1");
                        string address1_postalcode = account.GetAttributeValue<string>("address1_postalcode");
                        string address1_city = account.GetAttributeValue<string>("address1_city");
                        OptionSetValue ss_countryiso = account.GetAttributeValue<OptionSetValue>("ss_countryiso");
                        string ss_countryisoText = account.Contains("ss_countryiso") ? account.FormattedValues["ss_countryiso"] : string.Empty;

                        writer.WriteStartElement("Account_data");
                        createNode("NavID", bbo_navid, writer);
                        createNode("Name", accountname, writer);
                        createNode("Address", address1_line1, writer);
                        createNode("Postal_code", address1_postalcode, writer);
                        createNode("City", address1_city, writer);
                        createNode("CountryISO", ss_countryisoText, writer);
                        writer.WriteEndElement(); 
                        tracingService.Trace("Acc "+accountname);
                    }

                    #endregion Account info

                    #region Contact info
                    Guid parentContantGuid = Guid.Empty;
                    if (oppEntity.Contains("parentcontactid"))
                        parentContantGuid = ((EntityReference)oppEntity["parentcontactid"]).Id;
                    else if (preImage.Contains("parentcontactid"))
                        parentContantGuid = ((EntityReference)preImage["parentcontactid"]).Id;

                    if (parentContantGuid != null)
                    {
                        Entity contact = service.Retrieve("contact", parentContantGuid, new ColumnSet("address1_telephone1"));
                        string contactTelephone = contact.GetAttributeValue<string>("address1_telephone1");

                        writer.WriteStartElement("Contact_data");
                        createNode("Telefonnr", contactTelephone, writer);
                        writer.WriteEndElement();
                    }
                    #endregion

                    #region Sales Opp Products
                    //variables for Sales products
                    string prodname = "";
                    Guid productGuid = Guid.Empty;
                    Money licensefee = null;
                    Money licensefee_base = null;
                    Money setupfee = null;
                    Money setupfee_base = null;
                    string productnumber = "";
                    DateTime? termStartDate = null;
                    DateTime? termEndDate = null;
                    string bbo_segment = "";
                    string bbo_description = "";
                    string prodGroup_bbo_description = "";
                    string prodGroup_bbo_codeproductgroup = "";

                    ConditionExpression condition1 = new ConditionExpression();
                    condition1.AttributeName = "opportunityid";
                    condition1.Operator = ConditionOperator.Equal;
                    condition1.Values.Add(oppid);

                    FilterExpression filter1 = new FilterExpression();
                    filter1.Conditions.Add(condition1);

                    QueryExpression query = new QueryExpression("opportunityproduct");
                    query.ColumnSet.AddColumns("productdescription", "productid", "opportunityid", "ss_licensefee", "ss_licensefee_base", "ss_setupfee", "ss_setupfee_base", "ss_startdate", "ss_termenddate");
                    query.Criteria.AddFilter(filter1);

                    EntityCollection oppProds = service.RetrieveMultiple(query);
                    Console.WriteLine("Total " + oppProds.Entities.Count);


                    if (oppProds.Entities.Count > 0)
                    {
                        foreach (var oppProd in oppProds.Entities)
                        {
                            licensefee = oppProd.GetAttributeValue<Money>("ss_licensefee");
                            //decimal p = prod.GetAttributeValue<decimal>("ss_licensefee");
                            licensefee_base = oppProd.GetAttributeValue<Money>("ss_licensefee_base");
                            setupfee = oppProd.GetAttributeValue<Money>("ss_setupfee");
                            setupfee_base = oppProd.GetAttributeValue<Money>("ss_setupfee_base");
                            if (oppProd.Contains("ss_startdate")) termStartDate = (DateTime)oppProd.Attributes["ss_startdate"];
                            if (oppProd.Contains("ss_termenddate")) termEndDate = (DateTime)oppProd.Attributes["ss_termenddate"];

                            string prodDescription = oppProd.GetAttributeValue<string>("productdescription");
                            if (oppProd.Contains("productid"))
                            {
                                productGuid = ((EntityReference)oppProd.Attributes["productid"]).Id;
                                prodname = ((EntityReference)oppProd.Attributes["productid"]).Name;
                                Entity productentity = service.Retrieve("product", productGuid, new ColumnSet("productnumber", "bbo_productgroup", "bbo_segment"));
                                productnumber = (string)productentity.Attributes["productnumber"];

                                if (productentity.Contains("bbo_segment"))
                                {
                                    Guid segmentGuid = ((EntityReference)productentity.Attributes["bbo_segment"]).Id;
                                    Entity segmentEntity = service.Retrieve("bbo_segment", segmentGuid, new ColumnSet("bbo_segmentcode", "bbo_description"));
                                    bbo_segment = segmentEntity.GetAttributeValue<string>("bbo_segment");
                                    bbo_description = segmentEntity.GetAttributeValue<string>("bbo_description");

                                    Console.WriteLine("segment " + bbo_segment + "--- desc " + bbo_description);
                                }
                                if (productentity.Contains("bbo_productgroup"))
                                {
                                    Guid productGroupGuid = ((EntityReference)productentity.Attributes["bbo_productgroup"]).Id;
                                    //Guid productGroupGuid = (productentity.GetAttributeValue<EntityReference>("bbo_productgroup")).Id;
                                    Entity productGroup = service.Retrieve("bbo_productgroup", productGroupGuid, new ColumnSet("bbo_description", "bbo_codeproductgroup"));
                                    prodGroup_bbo_description = productGroup.GetAttributeValue<string>("bbo_description");
                                    prodGroup_bbo_codeproductgroup = productGroup.GetAttributeValue<string>("bbo_codeproductgroup");

                                    Console.WriteLine("Prod Description: " + prodGroup_bbo_description + " -code-  " + prodGroup_bbo_codeproductgroup);
                                }
                            }
                            else
                            {
                                prodname = oppProd.GetAttributeValue<string>("productdescription");
                            }
                            
                            //Create Document
                            writer.WriteStartElement("Product_data");
                            createNode("Product_name", prodname, writer);
                            createNode("Product_number", productnumber, writer);
                            if(licensefee != null)
                                createNode("License_fee", licensefee.Value.ToString(), writer);
                            else
                                createNode("License_fee", "0.00", writer);

                            if(licensefee_base != null)
                                createNode("License_fee_base", licensefee_base.Value.ToString(), writer);
                            else
                                createNode("License_fee_base", "0.00", writer);

                            if(setupfee != null)
                                createNode("Setup_fee", setupfee.Value.ToString(), writer);
                            else
                                createNode("Setup_fee", "0.00", writer);

                            if(setupfee_base != null)
                                createNode("Setup_fee_base", setupfee_base.Value.ToString(), writer);
                            else
                                createNode("Setup_fee_base","0.00", writer);

                            createNode("Term_start_date", termStartDate.ToString(), writer);
                            createNode("Term_end_date", termEndDate.ToString(), writer);
                            createNode("Segment", bbo_segment, writer);
                            createNode("Segment_description", bbo_description, writer);
                            createNode("Product_group_description", prodGroup_bbo_description, writer);
                            createNode("Code_product_group", prodGroup_bbo_codeproductgroup, writer);
                            writer.WriteEndElement(); //product end

                            ///Opportunity Products
                            //Entity OppProducts = service.Retrieve("opportunityproduct", oppid, new ColumnSet(""));
                            

                        }// oppProd entities 
                    }


                    #endregion
                    //tracingService.Trace("Acc Name "+acc);
                    //tracingService.Trace();
                    tracingService.Trace(closedate.ToString());
                    tracingService.Trace(invoiveEmail);
                    tracingService.Trace("Acc Done");

                    writer.WriteEndElement();// end table
                    writer.WriteEndDocument();

                    writer.Close();
                    var encoding = new UnicodeEncoding();
                    string s = Convert.ToBase64String(encoding.GetBytes(sb.ToString()));

                    Entity note = new Entity("annotation");
                    var strMessage = sb;
                    //Console.WriteLine(s);
                    //Console.ReadLine();
                    byte[] filename = Encoding.ASCII.GetBytes(strMessage.ToString());
                    Console.WriteLine("Filename " + strMessage.ToString());

                    string encodedData = System.Convert.ToBase64String(filename);
                    Console.WriteLine("File " + encodedData);
                    Console.ReadLine();

                    //note.Attributes["objectid"] = new EntityReference("EntityName", GUID);
                    //note.Attributes["objecttypecode"] = "EntityNAME";
                    note.Attributes["subject"] = "XML Document";
                    note.Attributes["documentbody"] = encodedData;
                    note.Attributes["mimetype"] = @"application/xml";
                    note.Attributes["notetext"] = "XML document created from opportunity won";
                    note.Attributes["filename"] = oppName + ".xml";
                    Guid noteid = service.Create(note);
                    if (noteid != null)
                    {
                        tracingService.Trace("Note Created");
                    }
                } // end using xml writer
                
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException(OperationStatus.Failed, ex.Message);
            }
            #endregion

        }
        public void createNode(string heading, string text, XmlWriter writer)
        {
            writer.WriteStartElement(heading);
            writer.WriteString(text);
            writer.WriteEndElement();
        }
    }
}
