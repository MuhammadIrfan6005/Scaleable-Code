using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scaleable.Xrm.Plugins.Acc.TurnoverRange
{
    public class AccountTurnoverRange : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /// Plugin Name= Scalable.Xrm.Plugins.AccountTurnoverRange                                                            ///
            /// Target Entity= Account                                                                                            ///
            /// Message= Pre Update (synchronous)                                                                                 ///
            /// Description: It will calculate the sum of Invoice Turnover between a range of given date (ss_turnoverstartdate)   /// 
            /// and (ss_turnoverenddate) and display in (ss_turnoverdater                                                         ///
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



            // Obtain the execution context from the service provider.
            IPluginExecutionContext context =
                (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            ITracingService tracingService =
                  (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            // Obtain the organization service reference.
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);



            if (context.InputParameters.Contains("Target") &&
                  context.InputParameters["Target"] is Entity)
            {
                Entity entity = (Entity)context.InputParameters["Target"];
                //checking whether plugin is fired from Account Entity
                if (entity.LogicalName != "account")
                {
                    return;
                }
                
                //getting preImage of Entity
                Entity preEntityImage = (Entity)context.PreEntityImages["PreAcc"];

                try
                {
                    //Default Start Date
                    DateTime TurnoverStartDate = new DateTime(1754, 01, 01);

                    //Default End Date
                    DateTime TurnoverEndDate = new DateTime(1754, 01, 01);

                    //checking if start date changed
                    if (entity.Attributes.Contains("ss_turnoverstartdate"))
                    {
                        if (entity["ss_turnoverstartdate"] != null)
                        {
                            TurnoverStartDate = (DateTime)entity["ss_turnoverstartdate"];
                        }
                    }
                    else
                    {
                        if (preEntityImage.Attributes.Contains("ss_turnoverstartdate"))
                        {
                            TurnoverStartDate = (DateTime)preEntityImage["ss_turnoverstartdate"];
                        }
                    }


                    //Checking if end date changed
                    if (entity.Attributes.Contains("ss_turnoverenddate"))
                    {
                        if (entity["ss_turnoverenddate"] != null)
                        {
                            TurnoverEndDate = (DateTime)entity["ss_turnoverenddate"];
                        }
                    }
                    else
                    {
                        if (preEntityImage.Attributes.Contains("ss_turnoverenddate"))
                        {
                            TurnoverEndDate = (DateTime)preEntityImage["ss_turnoverenddate"];
                        }
                    }

                    
                    tracingService.Trace("Start Date in UTC" + TurnoverStartDate);
                    tracingService.Trace("End Date in UTC" + TurnoverEndDate);

                    //Getting Time Zone code of the current user
                    int TimeZoneCode = (int)RetrieveCurrentUsersTimeZoneSettings(service);

                    tracingService.Trace("Time Zone Code=" + TimeZoneCode);

                    //Getting Local Time of the current user
                    DateTime localStartDate = LocalFromUTC(TurnoverStartDate, TimeZoneCode, service);
                    DateTime localEndDate = LocalFromUTC(TurnoverEndDate, TimeZoneCode, service);

                    tracingService.Trace("Local Start Date=" + localStartDate.ToString());
                    tracingService.Trace("Local End Date=" + localEndDate.ToString());

                    //Checking if both dates are given
                    if (TurnoverStartDate.Equals(new DateTime(1754, 01, 01)) || TurnoverEndDate.Equals(new DateTime(1754, 01, 01)))
                    {
                        tracingService.Trace("One or both of the start and end date(s) are not provided. So setting Turnover Rnage as 0");
                        entity["ss_turnoverdaterange"] = new Money(0);
                        
                    }
                    else
                    {
                        tracingService.Trace("Before executing fetch Query");
                        //Fetch query
                        string query = @"<fetch aggregate='true' >"
                                        +"<entity name='invoice' >"
                                        +  "<attribute name='totalamount' alias='totalamount' aggregate='sum' />"
                                        +  "<filter>"
                                        +     "<condition attribute='customerid' operator='eq' value='" + entity.Id + "' />"
                                        +     "<condition attribute='ss_postingdate' operator='ge' value='" + localStartDate.Date + "' />"
                                        +     "<condition attribute='ss_postingdate' operator='le' value='" + localEndDate.Date + "' />"
                                        +  "</filter>"
                                        +"</entity>" 
                                       +"</fetch>";
                        tracingService.Trace(query);
                        EntityCollection result = service.RetrieveMultiple(new FetchExpression(query));
                        foreach (var c in result.Entities)
                        {
                            Money totalAmount = new Money();
                            tracingService.Trace("Inside Loop");
                            if (((Money)((AliasedValue)c["totalamount"]).Value) != null)
                            {
                                totalAmount = (Money)((AliasedValue)c["totalamount"]).Value;
                            }
                            tracingService.Trace("Sum of total ammount" + totalAmount.Value);

                            entity["ss_turnoverdaterange"] = new Money(totalAmount.Value); 
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw new InvalidPluginExecutionException("An error occurred in the Scalable.Xrm.Plugins.OP.AccountTurnoverRange plug-in.", ex);
                }
            }
        }

        //Obtain time zone code of the current user
        public int? RetrieveCurrentUsersTimeZoneSettings(IOrganizationService service)
        {
            var currentUserSettings = service.RetrieveMultiple(
                new QueryExpression("usersettings")
                {
                    ColumnSet = new ColumnSet("localeid", "timezonecode"),
                    Criteria = new FilterExpression
                    {
                        Conditions =
                        {
                            new ConditionExpression("systemuserid", ConditionOperator.EqualUserId)
                        }
                    }
                }).Entities[0].ToEntity<Entity>();
            return (int?)currentUserSettings.Attributes["timezonecode"];
        }

        //Obtain DateTime object from time zone code
        public DateTime LocalFromUTC(DateTime utcTime, int _timeZoneCode, IOrganizationService service)
        {
            var request = new LocalTimeFromUtcTimeRequest
            {
                TimeZoneCode = _timeZoneCode,
                UtcTime = utcTime.ToUniversalTime()
            };

            var response = (LocalTimeFromUtcTimeResponse)service.Execute(request);
            return response.LocalTime;
        }
    }
}
