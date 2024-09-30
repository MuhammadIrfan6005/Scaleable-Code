using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scaleable.Xrm.Plugins.CalculateGoalCurrencyPlugin
{
    public class CalculateGoalCurrency : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            Entity entity;
            EntityReference reference;
            decimal num;
            decimal num2;
            decimal num3;
            decimal num4;
            decimal num5;
            ColumnSet set;
            Entity entity2;
            decimal num6;
            Exception exception;
            bool flag;
            string[] strArray;
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            ITracingService service = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IOrganizationService service2 = ((IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory))).CreateOrganizationService(new Guid?(context.UserId));
            if (!context.InputParameters.Contains("Target") || !(context.InputParameters["Target"] is Entity))
            {
                return;
            }
            else
            {
                flag = context.MessageName != "Create";
                if (!flag)
                {
                    try
                    {
                        entity = (Entity)context.InputParameters["Target"];
                        if (entity.LogicalName == "goal")
                        {
                            reference = new EntityReference();
                            num = 0M;
                            num2 = 0M;
                            num3 = 0M;
                            num4 = 0M;
                            num5 = 0M;
                            if (entity.Attributes.Contains("ss_currency"))
                            {
                                reference = (EntityReference)entity["ss_currency"];
                            }
                            if (entity.Attributes.Contains("ss_targetmoney"))
                            {
                                num2 = (decimal)entity["ss_targetmoney"];
                            }
                            if (entity.Attributes.Contains("actualmoney"))
                            {
                                num3 = ((Money)entity["actualmoney"]).Value;
                            }
                            if (entity.Attributes.Contains("inprogressmoney"))
                            {
                                num4 = ((Money)entity["inprogressmoney"]).Value;
                            }
                            if (entity.Attributes.Contains("computedtargetasoftodaymoney"))
                            {
                                num5 = ((Money)entity["computedtargetasoftodaymoney"]).Value;
                            }
                            if (reference.Id != Guid.Empty)
                            {
                                strArray = new string[] { "exchangerate" };
                                set = new ColumnSet(strArray);
                                entity2 = service2.Retrieve("transactioncurrency", reference.Id, set);
                                service.Trace("after query ", new object[0]);
                                flag = !entity2.Attributes.Contains("exchangerate");
                                if (!flag)
                                {
                                    num = (decimal)entity2["exchangerate"];
                                }
                                num6 = num2 / num;
                                entity["targetmoney"] = new Money(num6);
                                entity["ss_actualmoney"] = num3 * num;
                                entity["ss_inprogressmoney"] = num4 * num;
                                entity["ss_computedtargetasoftodaymoney"] = num5 * num;
                            }
                        }
                        else
                        {
                            return;
                        }
                    }
                    catch (Exception exception1)
                    {
                        exception = exception1;
                        throw new InvalidPluginExecutionException("An error occurred in the currency calculation plugin.", exception);
                    }
                }
            }
            if (context.MessageName == "Update")
            {
                Entity entity3 = context.PreEntityImages["goalPreimage"];
                entity = (Entity)context.InputParameters["Target"];
                flag = entity.LogicalName == "goal";
                if (flag)
                {
                    try
                    {
                        reference = new EntityReference();
                        num = 0M;
                        num2 = 0M;
                        num3 = 0M;
                        num4 = 0M;
                        num5 = 0M;
                        if (entity.Attributes.Contains("ss_currency"))
                        {
                            reference = (EntityReference)entity["ss_currency"];
                        }
                        else if (entity3.Attributes.Contains("ss_currency"))
                        {
                            reference = (EntityReference)entity3["ss_currency"];
                        }
                        if (entity.Attributes.Contains("ss_targetmoney"))
                        {
                            num2 = (decimal)entity["ss_targetmoney"];
                        }
                        else if (entity3.Attributes.Contains("ss_targetmoney"))
                        {
                            num2 = (decimal)entity3["ss_targetmoney"];
                        }
                        if (entity.Attributes.Contains("actualmoney"))
                        {
                            num3 = ((Money)entity["actualmoney"]).Value;
                        }
                        else if (entity3.Attributes.Contains("actualmoney"))
                        {
                            num3 = ((Money)entity3["actualmoney"]).Value;
                        }
                        if (entity.Attributes.Contains("inprogressmoney"))
                        {
                            num4 = ((Money)entity["inprogressmoney"]).Value;
                        }
                        else if (entity3.Attributes.Contains("inprogressmoney"))
                        {
                            num4 = ((Money)entity3["inprogressmoney"]).Value;
                        }
                        if (entity.Attributes.Contains("computedtargetasoftodaymoney"))
                        {
                            num5 = ((Money)entity["computedtargetasoftodaymoney"]).Value;
                        }
                        else if (entity3.Attributes.Contains("computedtargetasoftodaymoney"))
                        {
                            num5 = ((Money)entity3["computedtargetasoftodaymoney"]).Value;
                        }
                        if (reference.Id != Guid.Empty)
                        {
                            strArray = new string[] { "exchangerate" };
                            set = new ColumnSet(strArray);
                            entity2 = service2.Retrieve("transactioncurrency", reference.Id, set);
                            if (entity2.Attributes.Contains("exchangerate"))
                            {
                                num = (decimal)entity2["exchangerate"];
                            }
                            num6 = num2 / num;
                            entity["targetmoney"] = new Money(num6);
                            entity["ss_actualmoney"] = num3 * num;
                            entity["ss_inprogressmoney"] = num4 * num;
                            entity["ss_computedtargetasoftodaymoney"] = num5 * num;
                        }
                    }
                    catch (Exception exception2)
                    {
                        exception = exception2;
                        throw new InvalidPluginExecutionException("An error occurred in the currency calculation plugin.", exception);
                    }
                }
            }
        }
    }
}
