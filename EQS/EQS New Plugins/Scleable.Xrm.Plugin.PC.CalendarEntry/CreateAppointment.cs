using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Scleable.Xrm.Plugin.PC.CalendarEntry;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk;

namespace Scleable.Xrm.Plugin.PC.CalendarEntry
{
    public class CreateAppointment : IPlugin
    {
        private Guid oppointment_id;
        private object tracingService;

        public void Execute(IServiceProvider serviceProvider)
        {
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /// Plugin Name= Scalable.Xrm.Plugins.PC.CalendarEntry                                                                                                   ///
            /// Target Entity= PhoneCall                                                                                                                             ///
            /// Message= Pre-Create and Pre-Update                                                                                                                   ///
            /// Description: Plugin is fired on Phone Call when record is created or updated - As a result an new Appointmernt is Created according to Phone Call.   ///                                                                ///
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            string subject = string.Empty;
            int duration = 0;
            //string preFix = "Anruf -";
            DateTime dateTimeDue = DateTime.Now;
            bool calenderFlag = new bool();
            Entity RegardingName = new Entity();
            EntityReference nameField = new EntityReference();
            string description = null;
            EntityReference appointmentLookup = null;
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            ITracingService tracing = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);
            try
            {
                if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
                {

                    if(context.Depth > 1)
                    {
                        return;
                    }

                    //Targeted Entity
                    Entity entity = (Entity)context.InputParameters["Target"];

                    Guid initiatingUserId = context.InitiatingUserId;
                    EntityReference currentUser = new EntityReference("systemuser", initiatingUserId);


                    //Check - either entity is phone call or some one else
                    if (entity.LogicalName == "phonecall")
                    {
                        if (context.MessageName.ToUpper() == "CREATE")
                        {

                            if (entity.Attributes.Contains("description"))
                            {
                                description = (string)entity["description"];
                            }

                            if (entity.Attributes.Contains("regardingobjectid"))
                            {
                                EntityReference regardingobject = (Microsoft.Xrm.Sdk.EntityReference)entity.Attributes["regardingobjectid"];
                                if (regardingobject != null)
                                {
                                    //var actualregardingobject = service.Retrieve(regardingobject.LogicalName, regardingobject.Id, new ColumnSet(true));
                                    nameField = new EntityReference(regardingobject.LogicalName, regardingobject.Id);

                                    if (regardingobject.LogicalName == "contact")
                                    {
                                        ColumnSet attributes = new ColumnSet(new string[] { "fullname" });
                                        RegardingName = service.Retrieve(regardingobject.LogicalName, regardingobject.Id, attributes);
                                    }
                                    else if (regardingobject.LogicalName == "lead")
                                    {
                                        ColumnSet attributes = new ColumnSet(new string[] { "subject" });
                                        RegardingName = service.Retrieve(regardingobject.LogicalName, regardingobject.Id, attributes);
                                    }
                                    else if (regardingobject.LogicalName == "ss_visitreport")
                                    {
                                        ColumnSet attributes = new ColumnSet(new string[] { "ss_reportname" });
                                        RegardingName = service.Retrieve(regardingobject.LogicalName, regardingobject.Id, attributes);
                                    }
                                    else
                                    {
                                        ColumnSet attributes = new ColumnSet(new string[] { "name" });
                                        RegardingName = service.Retrieve(regardingobject.LogicalName, regardingobject.Id, attributes);
                                    }
                                }

                            }
                            //else if (post_image.Attributes.Contains("regardingobjectid"))
                            //{
                            //    EntityReference regardingobject = (Microsoft.Xrm.Sdk.EntityReference)post_image.Attributes["regardingobjectid"];
                            //    // var  actualregardingobject = service.Retrieve(regardingobject.LogicalName, regardingobject.Id, new ColumnSet(true));
                            //    nameField = new EntityReference(regardingobject.LogicalName, regardingobject.Id);
                            //}


                            if (entity.Attributes.Contains("subject"))
                            {
                                subject = entity["subject"].ToString();
                            }
                            if (entity.Attributes.Contains("scheduledend"))
                            {
                                dateTimeDue = (DateTime)entity["scheduledend"];
                            }
                            if (entity.Attributes.Contains("actualdurationminutes"))
                            {
                                duration = (int)entity["actualdurationminutes"];
                            }
                            if (entity.Attributes.Contains("ss_appointmentlookup"))
                            {
                                appointmentLookup = entity.GetAttributeValue<EntityReference>("ss_appointmentlookup");
                            }
                            if (entity.Attributes.Contains("ss_createcalendarentry"))
                            {
                                calenderFlag = (bool)entity["ss_createcalendarentry"];
                            }
                        }
                        else if (context.MessageName.ToUpper() == "UPDATE")
                        {

                            Entity phoneCallPostImage = context.PostEntityImages["PhoneCallPostImage"];
                            if (entity.Attributes.Contains("subject"))
                            {
                                subject = entity["subject"].ToString();
                            }
                            else if (phoneCallPostImage.Attributes.Contains("subject"))
                            {
                                subject = phoneCallPostImage["subject"].ToString();
                            }
                            if (entity.Attributes.Contains("description"))
                            {
                                description = (string)entity["description"];
                            }
                            else if (phoneCallPostImage.Attributes.Contains("description"))
                            {
                                description = (string)phoneCallPostImage["description"];
                            }


                            if (entity.Attributes.Contains("regardingobjectid"))
                            {

                                EntityReference regardingobject = (Microsoft.Xrm.Sdk.EntityReference)entity.Attributes["regardingobjectid"];
                                if (regardingobject != null)
                                {
                                    //var actualregardingobject = service.Retrieve(regardingobject.LogicalName, regardingobject.Id, new ColumnSet(true));
                                    nameField = new EntityReference(regardingobject.LogicalName, regardingobject.Id);

                                    if (regardingobject.LogicalName == "contact")
                                    {
                                        ColumnSet attributes = new ColumnSet(new string[] { "fullname" });
                                        RegardingName = service.Retrieve(regardingobject.LogicalName, regardingobject.Id, attributes);
                                    }
                                    else if (regardingobject.LogicalName == "lead")
                                    {
                                        ColumnSet attributes = new ColumnSet(new string[] { "subject" });
                                        RegardingName = service.Retrieve(regardingobject.LogicalName, regardingobject.Id, attributes);
                                    }
                                    else if (regardingobject.LogicalName == "ss_visitreport")
                                    {
                                        ColumnSet attributes = new ColumnSet(new string[] { "ss_reportname" });
                                        RegardingName = service.Retrieve(regardingobject.LogicalName, regardingobject.Id, attributes);
                                    }
                                    else
                                    {
                                        ColumnSet attributes = new ColumnSet(new string[] { "name" });
                                        RegardingName = service.Retrieve(regardingobject.LogicalName, regardingobject.Id, attributes);
                                    }
                                }

                            }
                            else if (phoneCallPostImage.Attributes.Contains("regardingobjectid"))
                            {
                                EntityReference regardingobject = (Microsoft.Xrm.Sdk.EntityReference)phoneCallPostImage.Attributes["regardingobjectid"];
                                if (regardingobject != null)
                                {
                                    // var  actualregardingobject = service.Retrieve(regardingobject.LogicalName, regardingobject.Id, new ColumnSet(true));
                                    nameField = new EntityReference(regardingobject.LogicalName, regardingobject.Id);

                                    if (regardingobject.LogicalName == "contact")
                                    {
                                        ColumnSet attributes = new ColumnSet(new string[] { "fullname" });
                                        RegardingName = service.Retrieve(regardingobject.LogicalName, regardingobject.Id, attributes);

                                    }
                                    else if (regardingobject.LogicalName == "lead")
                                    {
                                        ColumnSet attributes = new ColumnSet(new string[] { "subject" });
                                        RegardingName = service.Retrieve(regardingobject.LogicalName, regardingobject.Id, attributes);
                                    }
                                    else if (regardingobject.LogicalName == "ss_visitreport")
                                    {
                                        ColumnSet attributes = new ColumnSet(new string[] { "ss_reportname" });
                                        RegardingName = service.Retrieve(regardingobject.LogicalName, regardingobject.Id, attributes);
                                    }
                                    else
                                    {
                                        ColumnSet attributes = new ColumnSet(new string[] { "name" });
                                        RegardingName = service.Retrieve(regardingobject.LogicalName, regardingobject.Id, attributes);
                                    }
                                }

                            }


                            if (entity.Attributes.Contains("scheduledend"))
                            {
                                if (entity["scheduledend"] != null)
                                {
                                    dateTimeDue = (DateTime)entity["scheduledend"];
                                }
                            }
                            else if (phoneCallPostImage.Attributes.Contains("scheduledend"))
                            {
                                if (phoneCallPostImage["scheduledend"] != null)
                                {
                                    dateTimeDue = (DateTime)phoneCallPostImage["scheduledend"];
                                }
                            }
                            if (entity.Attributes.Contains("actualdurationminutes"))
                            {
                                if (entity["actualdurationminutes"] != null)
                                {
                                    duration = (int)entity["actualdurationminutes"];
                                }
                            }
                            else if (phoneCallPostImage.Attributes.Contains("actualdurationminutes"))
                            {
                                if (phoneCallPostImage["actualdurationminutes"] != null)
                                {
                                    duration = (int)phoneCallPostImage["actualdurationminutes"];
                                }
                            }
                            if (entity.Attributes.Contains("ss_appointmentlookup"))
                            {
                                if (entity["ss_appointmentlookup"] != null)
                                {
                                    appointmentLookup = entity.GetAttributeValue<EntityReference>("ss_appointmentlookup");
                                }
                            }
                            else if (phoneCallPostImage.Attributes.Contains("ss_appointmentlookup"))
                            {
                                if (phoneCallPostImage["ss_appointmentlookup"] != null)
                                {
                                    appointmentLookup = phoneCallPostImage.GetAttributeValue<EntityReference>("ss_appointmentlookup");
                                }
                            }
                            if (entity.Attributes.Contains("ss_createcalendarentry"))
                            {
                                if (entity["ss_createcalendarentry"] != null)
                                {
                                    calenderFlag = (bool)entity["ss_createcalendarentry"];
                                }
                            }
                            else if (phoneCallPostImage.Attributes.Contains("ss_createcalendarentry"))
                            {
                                calenderFlag = (bool)phoneCallPostImage["ss_createcalendarentry"];
                            }
                        }
                        tracing.Trace(calenderFlag.ToString());
                        if (calenderFlag)
                        {
                            string appoinmentDescription = "";
                            Entity appointment = new Entity("appointment");

                            //if (preFix != null && subject != null)
                            //{
                            //    appointment["subject"] = preFix + subject;
                            //}

                            if (subject != null)
                            {

                                if (RegardingName.Attributes.Count > 0)
                                {

                                    if (RegardingName.LogicalName == "account")
                                    {
                                        appointment["subject"] = subject + ", Regarding: [" + RegardingName["name"].ToString() + "]";
                                    }

                                    if (RegardingName.LogicalName == "contact")
                                    {
                                        appointment["subject"] = subject + ", Regarding: [" + RegardingName["fullname"].ToString() + "]";
                                    }

                                    if (RegardingName.LogicalName == "lead")
                                    {
                                        appointment["subject"] = subject + ", Regarding: [" + RegardingName["subject"].ToString() + "]";

                                    }
                                    if (RegardingName.LogicalName == "ss_visitreport")
                                    {
                                        appointment["subject"] = subject + ", Regarding: [" + RegardingName["ss_reportname"].ToString() + "]";

                                    }
                                }
                                else
                                {
                                    appointment["subject"] = subject;
                                }
                            }
                       
                            else
                            {
                                appointment["subject"] = "";
                            }


                            if (dateTimeDue != null)
                            {
                                appointment["scheduledstart"] = dateTimeDue;
                            }
                            else
                            {
                                appointment["scheduledstart"] = "";
                            }


                            if (RegardingName.Attributes.Count > 0 && description != null)
                            {
                                if (RegardingName.LogicalName == "account")
                                {
                                    appoinmentDescription = "Regarding: " + RegardingName["name"].ToString() + "\nPhone call Description : " + description;
                                }
                                if (RegardingName.LogicalName == "contact")
                                {
                                    appoinmentDescription = "Regarding: " + RegardingName["fullname"].ToString() + "\nPhone call Description : " + description;
                                }
                                if (RegardingName.LogicalName == "lead")
                                {
                                    appoinmentDescription = "Regarding: " + RegardingName["subject"].ToString() + "\nPhone call Description : " + description;
                                }
                                if (RegardingName.LogicalName == "ss_visitreport")
                                {
                                    appoinmentDescription = "Regarding: " + RegardingName["ss_reportname"].ToString() + "\nPhone call Description : " + description;
                                }

                            }
                            else if (RegardingName.Attributes.Count > 0 && description == null)
                            {
                                if (RegardingName.LogicalName == "account")
                                {
                                    appoinmentDescription = "Regarding: " + RegardingName["name"].ToString();
                                }
                                if (RegardingName.LogicalName == "contact")
                                {
                                    appoinmentDescription = "Regarding: " + RegardingName["fullname"].ToString();
                                }
                                if (RegardingName.LogicalName == "lead")
                                {
                                    appoinmentDescription = "Regarding: " + RegardingName["subject"].ToString();
                                }
                                if (RegardingName.LogicalName == "ss_visitreport")
                                {
                                    appoinmentDescription = "Regarding: " + RegardingName["ss_reportname"].ToString();
                                }
                            }


                            if (appoinmentDescription != null)
                            {
                                appointment["description"] = appoinmentDescription;
                            }
                            //if (description != null)
                            //{

                            //    appointment["description"] = description;
                            //}

                            if (nameField.Id != Guid.Empty)
                            {
                                appointment["regardingobjectid"] = nameField;
                            }


                            if (dateTimeDue != null)
                            {
                                appointment["scheduledend"] = dateTimeDue.AddMinutes((double)duration);
                            }
                            else
                            {
                                appointment["scheduledend"] = "";
                            }
                            Entity activityParty = new Entity("activityparty");
                            activityParty.Attributes["partyid"] = currentUser;
                            EntityCollection colAP = new EntityCollection();
                            colAP.Entities.Add(activityParty);

                            appointment["organizer"] = new EntityCollection();
                            appointment["organizer"] = colAP;

                            appointment["ss_createdthroughtaskorphone"] = true;
                            if (appointmentLookup == null)
                            {
                                oppointment_id = service.Create(appointment);
                                //entity["ss_appointmentlookup"] = new EntityReference("appointment", oppointment_id);

                                Entity pcToUpdate = new Entity("phonecall");
                                pcToUpdate.Id = entity.Id;
                                pcToUpdate["ss_appointmentlookup"] = new EntityReference("appointment", oppointment_id);
                                service.Update(pcToUpdate);

                                //var cols = new ColumnSet(new[] { "statecode", "statuscode" });

                                // //Check if it is Active or not
                                //var Entity = service.Retrieve(entity.LogicalName, entity.Id, cols);

                                //if (Entity != null && Entity.GetAttributeValue<OptionSetValue>("statecode").Value == 0)
                                //{
                                //    //StateCode = 2 and StatusCode = 3 for cancelling phone call
                                //    SetStateRequest setStateRequest = new SetStateRequest()
                                //    {
                                //        EntityMoniker = new EntityReference
                                //        {
                                //            Id = entity.Id,
                                //            LogicalName = entity.LogicalName,
                                //        },
                                //        State = new OptionSetValue(2),
                                //        Status = new OptionSetValue(3)
                                //    };
                                //    service.Execute(setStateRequest);
                                //}



                            }
                            else if (appointmentLookup != null)
                            {
                                appointment.Id = appointmentLookup.Id;
                                //var cols = new ColumnSet(new[] { "statecode", "statuscode" });

                                ////Check if it is Active or not
                                //var Entity = service.Retrieve(entity.LogicalName, entity.Id, cols);

                                //if (Entity != null && Entity.GetAttributeValue<OptionSetValue>("statecode").Value == 0)
                                //{
                                //    //StateCode = 2 and StatusCode = 3 for cancelling phone call
                                //    SetStateRequest setStateRequest = new SetStateRequest()
                                //    {
                                //        EntityMoniker = new EntityReference
                                //        {
                                //            Id = entity.Id,
                                //            LogicalName = entity.LogicalName,
                                //        },
                                //        State = new OptionSetValue(2),
                                //        Status = new OptionSetValue(3)
                                //    };
                                //    service.Execute(setStateRequest);
                                //}

                                service.Update(appointment);
                            }
                        }

                    }

                }
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException("An error occured in Scaleable.Xrm.Plugin.PC.CalendarEntry.CreateAppointment -" + ex);
            }

        }
    }
}
