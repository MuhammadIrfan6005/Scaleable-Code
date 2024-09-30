using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using System.ServiceModel;
using Microsoft.Xrm.Sdk.Query;

namespace Scaleable.Xrm.Plugins.SalesOppProducts
{
    public class SyncProducts:IPlugin

    {
        public static decimal licensefeevalue;
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext executioncontext = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory servicefactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = servicefactory.CreateOrganizationService(executioncontext.UserId);
            ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            if (executioncontext.InputParameters.Contains("Target") && executioncontext.InputParameters["Target"] is Entity)
            {
                Entity entity = (Entity)executioncontext.InputParameters["Target"];

                try
                {
                    if(entity.LogicalName== "opportunity")
                    {
                        if(entity.Attributes.Contains("ss_productselectortimestamp"))
                        {
                            // Instantiate QueryExpression QEopportunityproduct
                            var QEopportunityproduct = new QueryExpression("opportunityproduct");

                            // Add columns to QEopportunityproduct.ColumnSet
                            QEopportunityproduct.ColumnSet.AddColumns("productid", "baseamount", "extendedamount_base", "extendedamount");

                            // Define filter QEopportunityproduct.Criteria
                            QEopportunityproduct.Criteria.AddCondition("opportunityid", ConditionOperator.Equal, entity.Id.ToString());

                            // Add link-entity QEopportunityproduct_product
                            var QEopportunityproduct_product = QEopportunityproduct.AddLink("product", "productid", "productid");
                            QEopportunityproduct_product.EntityAlias = "Product";

                            // Add columns to QEopportunityproduct_product.Columns
                            QEopportunityproduct_product.Columns.AddColumns("name","ss_relatedlicencefee", "ss_issalesproduct", "producttypecode", "productnumber");

                            // Define filter QEopportunityproduct_product.LinkCriteria
                            QEopportunityproduct_product.LinkCriteria.AddCondition("ss_issalesproduct", ConditionOperator.Equal, true);
                            QEopportunityproduct_product.LinkCriteria.AddCondition("producttypecode", ConditionOperator.In, 100000001, 100000003);


                            // enitity collection:

                            EntityCollection entityCollection = service.RetrieveMultiple(QEopportunityproduct);
                            tracingService.Trace("Count" + entityCollection.Entities.Count);

                            DeleteSalesoppProducts(serviceProvider, service, entity.Id.ToString());
                            foreach (var queryexpdata in entityCollection.Entities)
                            {
                                OptionSetValue productTypeCode = (OptionSetValue)((queryexpdata.Attributes["Product.producttypecode"] as AliasedValue).Value);
                                EntityReference licPro = null;
                                
                                if (productTypeCode.Value.ToString() == "100000003")
                                {
                                    EntityReference productid = (EntityReference)queryexpdata.Attributes["productid"];
                                   // tracingService.Trace("productid :  is" + productid.Id.ToString());


                                    Money extendedamount = (Money)queryexpdata.Attributes["extendedamount"];
                                    //tracingService.Trace("Extended ammount is : " + extendedamount.Value.ToString());
                                    Money licenseFee = new Money(0);

      #region ss_JawaD Changes

                                    //EntityReference opProdCur = queryexpdata.GetAttributeValue<EntityReference>("transactioncurrencyid");
                                    EntityReference opProdCur = queryexpdata.Attributes["transactioncurrencyid"] as EntityReference;
                                    //currencyLookUp = new EntityReference(opProdCur.LogicalName, opProdCur.Id);
                                    tracingService.Trace("Currency" + opProdCur.Id);
                                    //entity.Attributes["new_preowner"] = prLookUp;

      #endregion ss_JawaD Changes


                                    if (queryexpdata.Attributes.Contains("Product.ss_relatedlicencefee"))
                                    {
                                        AliasedValue relatedlicensefee = ((queryexpdata.Attributes["Product.ss_relatedlicencefee"] as AliasedValue));
                                        licPro = (EntityReference)relatedlicensefee.Value;
                                    //    tracingService.Trace("relatedlicensefee :  is" + licPro.Id.ToString());

                                        Entity liscenseProd = (Entity)entityCollection.Entities.Where(x => x.GetAttributeValue<EntityReference>("productid")?.Id.ToString().Trim().ToLower() == licPro?.Id.ToString().Trim().ToLower()).FirstOrDefault();
                                        //_tracingService.Trace("liscenseProd :is  " + liscenseProd.ToString());
                                        if (liscenseProd != null)
                                        {
                                            licenseFee = (Money)liscenseProd.Attributes["extendedamount"];
                                        }
                                    }
                                

                                    // Create the Object of Sales Opportunity Products
                                    if (licenseFee == null)
                                        licenseFee = new Money(0);
                                    if (extendedamount == null)
                                        extendedamount = new Money(0);

                                    Entity salesoppProductentity = new Entity("ss_salesopportunityproducts");
                                   
                                    salesoppProductentity.Attributes["ss_opportunity"] =new EntityReference("opportunity",entity.Id);
                                    salesoppProductentity.Attributes["ss_product"] = productid;

#region ss_JawaD Changes

                                    //salesoppProductentity.Attributes["transactioncurrencyid"] = new EntityReference("currency", opProdCur.Id);
                                    if (opProdCur != null){ 
                                    salesoppProductentity.Attributes["transactioncurrencyid"] = opProdCur;
                                    }
#endregion end ss_JawaD Changes
                                    salesoppProductentity.Attributes["ss_licensefee"] = licenseFee;
                                    salesoppProductentity.Attributes["ss_setupfee"] = extendedamount;
                                    AliasedValue name= queryexpdata.Attributes["Product.name"] as AliasedValue;
                                    salesoppProductentity.Attributes["ss_name"] = name.Value;
                                   service.Create(salesoppProductentity);

                                }
                            }
                            
                        }

                    }

                }
                catch(FaultException<OrganizationServiceFault> ex)
                {
                    throw new InvalidPluginExecutionException("There is an error in Organization service" + ex);
                }

            }
        }

        public void DeleteSalesoppProducts(IServiceProvider serviceProvider, IOrganizationService service, string oppId)
        {
            
            // Instantiate QueryExpression QEss_salesopportunityproducts
            var QEss_salesopportunityproducts = new QueryExpression("ss_salesopportunityproducts");

            // Add columns to QEss_salesopportunityproducts.ColumnSet
            QEss_salesopportunityproducts.ColumnSet.AddColumns("ss_salesopportunityproductsid");
            // Define filter QEss_salesopportunityproducts.Criteria
            QEss_salesopportunityproducts.Criteria.AddCondition("ss_opportunity", ConditionOperator.Equal, oppId);

            EntityCollection entitycollection = service.RetrieveMultiple(QEss_salesopportunityproducts);
            foreach(var queryexpression in entitycollection.Entities)
            {
                service.Delete(queryexpression.LogicalName, queryexpression.Id);
            }

        }
    }
}
