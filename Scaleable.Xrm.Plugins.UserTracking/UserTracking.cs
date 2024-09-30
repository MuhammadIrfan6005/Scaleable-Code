using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scaleable.Xrm.Plugins.UserTracking
{
    public class UserTracking : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            ITracingService service = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IOrganizationService service2 = ((IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory))).CreateOrganizationService(new Guid?(context.UserId));
            try
            {
                int num1;
                if (!context.InputParameters.Contains("Target") || !(context.InputParameters["Target"] is Entity))
                {
                    num1 = !context.InputParameters.Contains("Target") ? 1 : ((int)!(context.InputParameters["Target"] is EntityReference));
                }
                else
                {
                    num1 = 0;
                }
                if (num1 == 0)
                {
                    Entity entity = new Entity();
                    EntityReference reference = new EntityReference();
                    if (context.MessageName != "Delete")
                    {
                        entity = (Entity)context.InputParameters["Target"];
                    }
                    if (context.MessageName == "Delete")
                    {
                        reference = (EntityReference)context.InputParameters["Target"];
                    }
                    string str = "";
                    Entity entity2 = new Entity("ss_usertracking");
                    string str2 = "";
                    string str3 = "";
                    DateTime now = new DateTime();
                    if (context.MessageName == "Create")
                    {
                        if (entity.LogicalName == "account")
                        {
                            if (entity.Attributes.Contains("name"))
                            {
                                str = entity["name"].ToString();
                            }
                            str2 = "account";
                            str3 = "Create";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (entity.LogicalName == "contact")
                        {
                            if (entity.Attributes.Contains("fullname"))
                            {
                                str = entity["fullname"].ToString();
                            }
                            str2 = "contact";
                            str3 = "Create";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (entity.LogicalName == "opportunity")
                        {
                            if (entity.Attributes.Contains("name"))
                            {
                                str = entity["name"].ToString();
                            }
                            str2 = "opportunity";
                            str3 = "Create";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (entity.LogicalName == "phonecall")
                        {
                            if (entity.Attributes.Contains("subject"))
                            {
                                str = entity["subject"].ToString();
                            }
                            str2 = "phonecall";
                            str3 = "Create";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (entity.LogicalName == "task")
                        {
                            if (entity.Attributes.Contains("subject"))
                            {
                                str = entity["subject"].ToString();
                            }
                            str2 = "task";
                            str3 = "Create";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (entity.LogicalName == "email")
                        {
                            int num4;
                            if (entity.Attributes.Contains("subject"))
                            {
                                str = entity["subject"].ToString();
                            }
                            if ((str.Contains("Notification - Email Posted") || (str.Contains("Notification - Email Assigned") || (str.Contains("Notification - Email Modified") || (str.Contains("Notification - Note Modified") || (str.Contains("Notification - Letter Modified") || (str.Contains("Notification - Notification Modified") || (str.Contains("Notification - Phone Call Modified") || (str.Contains("Notification - Task Modified") || (str.Contains("Notification - Phone Call Assigned") || (str.Contains("Notification - Task Assigned") || (str.Contains("Notification - Appointment Assigned") || (str.Contains("Notification - Account Assigned") || (str.Contains("Notification - Letter Posted") || (str.Contains("Notification - Letter Assigned") || (str.Contains("Notification - Notification Posted") || (str.Contains("Notification - Notification Assigned") || (str.Contains("Notification - Phone Call Posted") || (str.Contains("Notification - Phone Call Assigned") || (str.Contains("Notification - Task Posted") || (str.Contains("Notification - Task Assigned") || str.Contains("Notification - Account Assigned"))))))))))))))))))))) || str.Contains("Notification - Opportunity Created"))
                            {
                                num4 = 1;
                            }
                            else
                            {
                                num4 = (int)str.Contains("Notification - Opportunity Updated");
                            }
                            if (num4 == 0)
                            {
                                str2 = "email";
                                str3 = "Create";
                                now = DateTime.Now;
                                entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                                entity2["ss_entityname"] = str2;
                                entity2["ss_pluginmessage"] = str3;
                                entity2["ss_actiondate"] = now;
                                entity2["ss_name"] = str;
                                service2.Create(entity2);
                            }
                        }
                        if (entity.LogicalName == "appointment")
                        {
                            if (entity.Attributes.Contains("subject"))
                            {
                                str = entity["subject"].ToString();
                            }
                            str2 = "appointment";
                            str3 = "Create";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (entity.LogicalName == "letter")
                        {
                            if (entity.Attributes.Contains("subject"))
                            {
                                str = entity["subject"].ToString();
                            }
                            str2 = "letter";
                            str3 = "Create";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (entity.LogicalName == "ss_notification")
                        {
                            if (entity.Attributes.Contains("subject"))
                            {
                                str = entity["subject"].ToString();
                            }
                            str2 = "notification";
                            str3 = "Create";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                    }
                    if (context.MessageName == "Update")
                    {
                        if (entity.LogicalName == "account")
                        {
                            Entity entity3 = context.PreEntityImages["preImageAccountUpdate"];
                            if (entity3.Attributes.Contains("name"))
                            {
                                str = entity3["name"].ToString();
                            }
                            if (entity.Attributes.Contains("name"))
                            {
                                str = entity["name"].ToString();
                            }
                            str2 = "account";
                            str3 = "Update";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (entity.LogicalName == "contact")
                        {
                            Entity entity4 = context.PreEntityImages["preImageContactUpdate"];
                            if (entity4.Attributes.Contains("fullname"))
                            {
                                str = entity4["fullname"].ToString();
                            }
                            if (entity.Attributes.Contains("fullname"))
                            {
                                str = entity["fullname"].ToString();
                            }
                            str2 = "contact";
                            str3 = "Update";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (entity.LogicalName == "opportunity")
                        {
                            int num = 0;
                            while (true)
                            {
                                if (num >= entity.Attributes.Count)
                                {
                                    Entity entity5 = context.PreEntityImages["preImageOpportunityUpdate"];
                                    if (entity5.Attributes.Contains("name"))
                                    {
                                        str = entity5["name"].ToString();
                                    }
                                    if (entity.Attributes.Contains("name"))
                                    {
                                        str = entity["name"].ToString();
                                    }
                                    str2 = "opportunity";
                                    str3 = "Update";
                                    now = DateTime.Now;
                                    entity2["ss_user"] = new EntityReference("systemuser", context.InitiatingUserId);
                                    entity2["ss_entityname"] = str2;
                                    entity2["ss_pluginmessage"] = str3;
                                    entity2["ss_actiondate"] = now;
                                    entity2["ss_name"] = str;
                                    service2.Create(entity2);
                                    break;
                                }
                                service.Trace(entity.Attributes.Values.ToString(), new object[0]);
                                num++;
                            }
                        }
                        if (entity.LogicalName == "email")
                        {
                            int num5;
                            string str4 = "";
                            string str5 = "";
                            bool flag = false;
                            Entity entity6 = context.PreEntityImages["preImageEmailUpdate"];
                            if (entity6.Attributes.Contains("subject"))
                            {
                                str = entity6["subject"].ToString();
                                str4 = entity6["subject"].ToString();
                            }
                            if (entity.Attributes.Contains("subject"))
                            {
                                str = entity["subject"].ToString();
                                str5 = entity["subject"].ToString();
                            }
                            if ((str.Contains("Notification - Email Posted") || (str.Contains("Notification - Email Assigned") || (str.Contains("Notification - Email Modified") || (str.Contains("Notification - Note Modified") || (str.Contains("Notification - Letter Modified") || (str.Contains("Notification - Notification Modified") || (str.Contains("Notification - Phone Call Modified") || (str.Contains("Notification - Task Modified") || (str.Contains("Notification - Phone Call Assigned") || (str.Contains("Notification - Task Assigned") || (str.Contains("Notification - Appointment Assigned") || (str.Contains("Notification - Account Assigned") || (str.Contains("Notification - Letter Posted") || (str.Contains("Notification - Letter Assigned") || (str.Contains("Notification - Notification Posted") || (str.Contains("Notification - Notification Assigned") || (str.Contains("Notification - Phone Call Posted") || str.Contains("Notification - Phone Call Assigned")))))))))))))))))) || str.Contains("Notification - Task Posted"))
                            {
                                num5 = 1;
                            }
                            else
                            {
                                num5 = (int)str.Contains("Notification - Task Assigned");
                            }
                            if (num5 == 0)
                            {
                                if (str5 == "")
                                {
                                    service.Trace("inside check 3", new object[0]);
                                    flag = true;
                                }
                                else if (!str5.Contains("EQS"))
                                {
                                    service.Trace("inside else", new object[0]);
                                    flag = true;
                                }
                                else
                                {
                                    service.Trace("Eqs contains", new object[0]);
                                    int length = "EQS".Length;
                                    string str6 = str5.Substring(0, str5.IndexOf("EQS"));
                                    service.Trace("str1 " + str6, new object[0]);
                                    service.Trace("subjectFromPreImage " + str4, new object[0]);
                                    if (str6.ToLower().Trim().ToString() != str4.ToLower().Trim().ToString())
                                    {
                                        service.Trace("substring = preimmagedata", new object[0]);
                                        flag = true;
                                    }
                                }
                                if (flag)
                                {
                                    service.Trace("inside check 4", new object[0]);
                                    str2 = "email";
                                    str3 = "Update";
                                    now = DateTime.Now;
                                    entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                                    entity2["ss_entityname"] = str2;
                                    entity2["ss_pluginmessage"] = str3;
                                    entity2["ss_actiondate"] = now;
                                    entity2["ss_name"] = str;
                                    service2.Create(entity2);
                                }
                            }
                        }
                        if (entity.LogicalName == "phonecall")
                        {
                            Entity entity7 = context.PreEntityImages["preImagePhonecallUpdate"];
                            if (entity7.Attributes.Contains("subject"))
                            {
                                str = entity7["subject"].ToString();
                            }
                            if (entity.Attributes.Contains("subject"))
                            {
                                str = entity["subject"].ToString();
                            }
                            str2 = "phonecall";
                            str3 = "Update";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (entity.LogicalName == "task")
                        {
                            Entity entity8 = context.PreEntityImages["preImageTaskUpdate"];
                            if (entity8.Attributes.Contains("subject"))
                            {
                                str = entity8["subject"].ToString();
                            }
                            if (entity.Attributes.Contains("subject"))
                            {
                                str = entity["subject"].ToString();
                            }
                            str2 = "task";
                            str3 = "Update";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (entity.LogicalName == "appointment")
                        {
                            Entity entity9 = context.PreEntityImages["preImageAppoinmentUpdate"];
                            if (entity9.Attributes.Contains("subject"))
                            {
                                str = entity9["subject"].ToString();
                            }
                            if (entity.Attributes.Contains("subject"))
                            {
                                str = entity["subject"].ToString();
                            }
                            str2 = "appointment";
                            str3 = "Update";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (entity.LogicalName == "letter")
                        {
                            Entity entity10 = context.PreEntityImages["preImageLetterUpdate"];
                            if (entity10.Attributes.Contains("subject"))
                            {
                                str = entity10["subject"].ToString();
                            }
                            if (entity.Attributes.Contains("subject"))
                            {
                                str = entity["subject"].ToString();
                            }
                            str2 = "letter";
                            str3 = "Update";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (entity.LogicalName == "ss_notification")
                        {
                            Entity entity11 = context.PreEntityImages["preImageNotificationUpdate"];
                            if (entity11.Attributes.Contains("subject"))
                            {
                                str = entity11["subject"].ToString();
                            }
                            if (entity.Attributes.Contains("subject"))
                            {
                                str = entity["subject"].ToString();
                            }
                            str2 = "notification";
                            str3 = "Update";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.UserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                    }
                    if (context.MessageName == "Delete")
                    {
                        if (reference.LogicalName == "account")
                        {
                            Entity entity12 = context.PreEntityImages["preImageAccountDelete"];
                            if (entity12.Attributes.Contains("name"))
                            {
                                str = entity12["name"].ToString();
                            }
                            str2 = "account";
                            str3 = "Delete";
                            now = DateTime.Now;
                            service.Trace(context.UserId.ToString(), new object[0]);
                            entity2["ss_user"] = new EntityReference("systemuser", context.InitiatingUserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (reference.LogicalName == "contact")
                        {
                            Entity entity13 = context.PreEntityImages["preImageContactDelete"];
                            if (entity13.Attributes.Contains("fullname"))
                            {
                                str = entity13["fullname"].ToString();
                            }
                            str2 = "contact";
                            str3 = "Delete";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.InitiatingUserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (reference.LogicalName == "opportunity")
                        {
                            Entity entity14 = context.PreEntityImages["preImageOpportunityDelete"];
                            if (entity14.Attributes.Contains("name"))
                            {
                                str = entity14["name"].ToString();
                            }
                            str2 = "opportunity";
                            str3 = "Delete";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.InitiatingUserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (reference.LogicalName == "email")
                        {
                            Entity entity15 = context.PreEntityImages["preImageEmailDelete"];
                            if (entity15.Attributes.Contains("subject"))
                            {
                                str = entity15["subject"].ToString();
                            }
                            str2 = "email";
                            str3 = "Delete";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.InitiatingUserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (reference.LogicalName == "phonecall")
                        {
                            Entity entity16 = context.PreEntityImages["preImagePhonecallDelete"];
                            if (entity16.Attributes.Contains("subject"))
                            {
                                str = entity16["subject"].ToString();
                            }
                            str2 = "phonecall";
                            str3 = "Delete";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.InitiatingUserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (reference.LogicalName == "task")
                        {
                            Entity entity17 = context.PreEntityImages["preImageTaskDelete"];
                            if (entity17.Attributes.Contains("subject"))
                            {
                                str = entity17["subject"].ToString();
                            }
                            str2 = "task";
                            str3 = "Delete";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.InitiatingUserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (reference.LogicalName == "appointment")
                        {
                            Entity entity18 = context.PreEntityImages["preImageAppoinmentDelete"];
                            if (entity18.Attributes.Contains("subject"))
                            {
                                str = entity18["subject"].ToString();
                            }
                            str2 = "appointment";
                            str3 = "Delete";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.InitiatingUserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (reference.LogicalName == "letter")
                        {
                            Entity entity19 = context.PreEntityImages["preImageLetterDelete"];
                            if (entity19.Attributes.Contains("subject"))
                            {
                                str = entity19["subject"].ToString();
                            }
                            str2 = "letter";
                            str3 = "Delete";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.InitiatingUserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                        if (reference.LogicalName == "ss_notification")
                        {
                            Entity entity20 = context.PreEntityImages["preImageNotificationDelete"];
                            if (entity20.Attributes.Contains("subject"))
                            {
                                str = entity20["subject"].ToString();
                            }
                            str2 = "notification";
                            str3 = "Delete";
                            now = DateTime.Now;
                            entity2["ss_user"] = new EntityReference("systemuser", context.InitiatingUserId);
                            entity2["ss_entityname"] = str2;
                            entity2["ss_pluginmessage"] = str3;
                            entity2["ss_actiondate"] = now;
                            entity2["ss_name"] = str;
                            service2.Create(entity2);
                        }
                    }
                }
            }
            catch (Exception exception)
            {
                throw new InvalidPluginExecutionException("An error occurred in the Scaleable.Xrm.Plugins.UserTracking plug-in.", exception);
            }
        }
    }
}
