using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;

namespace Scaleable.Xrm.Plugins.Task
{
    public class CreateAppointment : IPlugin
    {
        private object organizationService;
        private object regardingobjectImage;

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Plugin Name: Scaleable.Xrm.Plugins.Task.CreateAppointment                                                                                           ///
        /// Target Entity: Task                                                                                                                                 ///
        /// Message: Pre-Update, Create                                                                                                                         ///
        /// Description: This plugin will create an appointment entity when task is created. And it will update the appointment entity when task is updated.    ///
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        public void Execute(IServiceProvider serviceProvider)
        {
            bool createAppointmentFlag = false;
            EntityReference appointmentLookup = null;
            string subject = "";
            Entity post_image = new Entity();
            DateTime dueDate = DateTime.Now;
            EntityReference regardingLookup = null;

            string prefix = "";

            int duration = 0;
            string description = null;

            string regardingName = "";
            Entity RegardingEntity = new Entity();

            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);

            ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity entity = (Entity)context.InputParameters["Target"];

            Guid initiatingUserId = context.InitiatingUserId;


            tracingService.Trace("Start");
            EntityReference currentUserID = new EntityReference("systemuser", initiatingUserId);
            tracingService.Trace("Current User => " + currentUserID.Name, currentUserID.Id);
            tracingService.Trace("Entity => " + entity.LogicalName);
            tracingService.Trace("Operation => " + context.MessageName);
            if (!(entity.LogicalName == "task" || entity.LogicalName == "phonecall"))
            {

                return;

            }

            if (context.Depth > 1)
            {
                return;
            }


            tracingService.Trace("Checking Entities");
            if (entity.LogicalName == "task")
            {
                if (context.MessageName.ToUpper() == "UPDATE")
                {
                    tracingService.Trace("Update Message Inner Task");
                    post_image = context.PostEntityImages["task_postimg"];
                }
                prefix = "Task";
                tracingService.Trace("Prefix is => " + prefix);

            }
            else if (entity.LogicalName == "phonecall")
            {
                if (context.MessageName.ToUpper() == "UPDATE")
                {
                    tracingService.Trace("Update Message Inner Phone Call");
                    post_image = context.PostEntityImages["PhoneCallPostImage"];
                    tracingService.Trace("After Getting Post Image");
                }
                prefix = "Phone Call";
                tracingService.Trace("Prefix is => " + prefix);
            }


            try
            {
                if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
                {

                    if (context.MessageName.ToUpper() == "CREATE")
                    {
                        tracingService.Trace("Create Case");
                        if (context.Depth > 1)
                        {
                            return;
                        }

                        if (entity.Attributes.Contains("subject"))
                        {
                            subject = (string)entity["subject"];
                            tracingService.Trace("Subject => " + subject);
                        }


                        if (entity.Attributes.Contains("description"))
                        {
                            description = (string)entity["description"];
                            tracingService.Trace("Description => " + description);
                        }


                        if (entity.Attributes.Contains("regardingobjectid"))
                        {
                            if (entity["regardingobjectid"] != null)
                            {
                                regardingLookup = (EntityReference)entity.Attributes["regardingobjectid"];
                                tracingService.Trace("Regarding ID => " + regardingLookup.Id);
                                tracingService.Trace("Regarding Entity => " + regardingLookup.LogicalName);
                            }
                        }

                        if (entity.Attributes.Contains("ss_createcalendarentry") && entity["ss_createcalendarentry"] != null)
                        {
                            createAppointmentFlag = (bool)entity["ss_createcalendarentry"];
                            tracingService.Trace("Calender Entry => " + createAppointmentFlag);
                        }

                        if (entity.Attributes.Contains("ss_appointmentlookup"))
                        {

                            appointmentLookup = (EntityReference)entity["ss_appointmentlookup"];
                            tracingService.Trace("Appointment => " + appointmentLookup);
                        }

                        if (entity.Attributes.Contains("scheduledend"))
                        {
                            dueDate = (DateTime)entity["scheduledend"];
                            tracingService.Trace("Due Date => " + dueDate);
                        }

                        if (entity.Attributes.Contains("actualdurationminutes"))
                        {
                            duration = (int)entity["actualdurationminutes"];
                            tracingService.Trace("Duration =>" + duration);
                        }

                    }//create request


                    if (context.MessageName.ToUpper() == "UPDATE")
                    {
                        tracingService.Trace("Update Case");
                        if (entity.Attributes.Contains("description"))
                        {
                            description = (string)entity["description"];
                            tracingService.Trace("Description => " + description);
                        }
                        else if (post_image.Attributes.Contains("description"))
                        {
                            description = (string)post_image["description"];
                            tracingService.Trace("Description => " + description);
                        }

                        if (entity.Attributes.Contains("regardingobjectid"))
                        {
                            if (entity["regardingobjectid"] != null)
                            {
                                regardingLookup = (EntityReference)entity.Attributes["regardingobjectid"];
                                tracingService.Trace("Regarding ID => " + regardingLookup.Id);
                                tracingService.Trace("Regarding Entity => " + regardingLookup.LogicalName);
                            }
                        }
                        else if (post_image.Attributes.Contains("regardingobjectid"))
                        {
                            if (post_image["regardingobjectid"] != null)
                            {
                                regardingLookup = (EntityReference)post_image.Attributes["regardingobjectid"];
                                tracingService.Trace("Regarding ID => " + regardingLookup.Id);
                                tracingService.Trace("Regarding Entity => " + regardingLookup.LogicalName);
                            }

                        }

                        if (entity.Attributes.Contains("subject"))
                        {
                            subject = (string)entity["subject"];
                            tracingService.Trace("Subject => " + subject);
                        }
                        else if (post_image.Attributes.Contains("subject"))
                        {
                            subject = (string)post_image["subject"];
                            tracingService.Trace("Subject => " + subject);
                        }


                        if (entity.Attributes.Contains("ss_createcalendarentry"))
                        {
                            createAppointmentFlag = (bool)entity["ss_createcalendarentry"];
                            tracingService.Trace("Calender Entry => " + createAppointmentFlag);
                        }

                        else if (post_image.Attributes.Contains("ss_createcalendarentry"))
                        {
                            createAppointmentFlag = (bool)post_image["ss_createcalendarentry"];
                            tracingService.Trace("Calender Entry => " + createAppointmentFlag);
                        }

                        if (entity.Attributes.Contains("ss_appointmentlookup"))
                        {

                            appointmentLookup = (EntityReference)entity["ss_appointmentlookup"];
                            tracingService.Trace("Appointment Lookup => " + appointmentLookup.Id);
                            tracingService.Trace("Appointment Lookup => " + appointmentLookup.Name);

                        }
                        else if (post_image.Attributes.Contains("ss_appointmentlookup"))
                        {

                            appointmentLookup = (EntityReference)post_image["ss_appointmentlookup"];
                            tracingService.Trace("Appointment Lookup => " + appointmentLookup.Id);
                            tracingService.Trace("Appointment Lookup => " + appointmentLookup.Name);
                        }

                        if (entity.Attributes.Contains("scheduledend"))
                        {
                            if (entity["scheduledend"] != null)
                            {
                                dueDate = (DateTime)entity["scheduledend"];
                                tracingService.Trace("Due Date => " + dueDate);
                            }
                        }
                        else if (post_image.Attributes.Contains("scheduledend"))
                        {
                            if (post_image["scheduledend"] != null)
                            {
                                dueDate = (DateTime)post_image["scheduledend"];
                                tracingService.Trace("Due Date => " + dueDate);
                            }
                        }

                        if (entity.Attributes.Contains("actualdurationminutes"))
                        {
                            if (entity["actualdurationminutes"] != null)
                            {
                                duration = (int)entity["actualdurationminutes"];
                                tracingService.Trace("Duration =>" + duration);
                            }
                        }
                        else if (post_image.Attributes.Contains("actualdurationminutes"))
                        {
                            if (post_image["actualdurationminutes"] != null)
                            {
                                duration = (int)post_image["actualdurationminutes"];
                                tracingService.Trace("Duration =>" + duration);
                            }
                        }


                    }
                    if (regardingLookup != null)
                    {
                        tracingService.Trace("Regarding Cases");
                        if (regardingLookup.LogicalName == "contact")
                        {
                            ColumnSet attributes = new ColumnSet(new string[] { "fullname" });
                            RegardingEntity = service.Retrieve(regardingLookup.LogicalName, regardingLookup.Id, attributes);
                            if (RegardingEntity.Attributes.Contains("fullname") && RegardingEntity["fullname"] != null)
                            {
                                regardingName = (string)RegardingEntity["fullname"];
                            }
                        }
                        else if (regardingLookup.LogicalName == "lead")
                        {
                            ColumnSet attributes = new ColumnSet(new string[] { "subject" });
                            RegardingEntity = service.Retrieve(regardingLookup.LogicalName, regardingLookup.Id, attributes);
                            if (RegardingEntity.Attributes.Contains("subject") && RegardingEntity["subject"] != null)
                            {
                                regardingName = (string)RegardingEntity["subject"];
                            }
                        }
                        else if (regardingLookup.LogicalName == "ss_visitreport")
                        {
                            ColumnSet attributes = new ColumnSet(new string[] { "ss_reportname" });
                            RegardingEntity = service.Retrieve(regardingLookup.LogicalName, regardingLookup.Id, attributes);
                            if (RegardingEntity.Attributes.Contains("ss_reportname") && RegardingEntity["ss_reportname"] != null)
                            {
                                regardingName = (string)RegardingEntity["ss_reportname"];
                            }
                        }
                        else if (regardingLookup.LogicalName == "new_partner")
                        {
                            tracingService.Trace("Partner Case");
                            ColumnSet attributes = new ColumnSet(new string[] { "new_name" });
                            RegardingEntity = service.Retrieve(regardingLookup.LogicalName, regardingLookup.Id, attributes);
                            tracingService.Trace("Partner name => " + RegardingEntity.GetAttributeValue<string>("new_name"));
                            if (RegardingEntity.GetAttributeValue<string>("new_name") != null)
                            {
                                regardingName = RegardingEntity.GetAttributeValue<string>("new_name");
                                tracingService.Trace("Regarding Name => " + regardingName);
                            }
                        }
                        else
                        {
                            ColumnSet attributes = new ColumnSet(new string[] { "name" });
                            RegardingEntity = service.Retrieve(regardingLookup.LogicalName, regardingLookup.Id, attributes);
                            tracingService.Trace("Partner name => " + RegardingEntity.GetAttributeValue<string>("name"));
                            if (RegardingEntity.Attributes.Contains("name") && RegardingEntity["name"] != null)
                            {
                                regardingName = (string)RegardingEntity["name"];
                            }
                        }
                    }





                    if (createAppointmentFlag)
                    {
                        Entity newAppointment = new Entity("appointment");



                        if (subject == null)
                        {
                            subject = "";
                        }

                        newAppointment["subject"] = subject + ", Regarding: [" + regardingName + "]";


                        if (dueDate != null)
                        {
                            newAppointment["scheduledstart"] = dueDate;
                            newAppointment["scheduledend"] = dueDate.AddMinutes(duration);
                        }
                        else
                        {
                            newAppointment["scheduledstart"] = null;
                            newAppointment["scheduledend"] = null;
                        }


                        if (currentUserID != null)
                        {
                            newAppointment["organizer"] = currentUserID;
                        }
                        else
                        {
                            newAppointment["organizer"] = null;
                        }

                        if (description == null)
                        {
                            description = "";
                        }

                        newAppointment["description"] = "Regarding: " + regardingName + "\n" + prefix + " Description : " + description;


                        if (regardingLookup != null)
                        {

                            newAppointment["regardingobjectid"] = regardingLookup;
                        }


                        Entity activityParty = new Entity("activityparty");
                        activityParty.Attributes["partyid"] = currentUserID;
                        EntityCollection colAP = new EntityCollection();
                        colAP.Entities.Add(activityParty);

                        newAppointment.Attributes["organizer"] = new EntityCollection();
                        newAppointment.Attributes["organizer"] = colAP;
                        newAppointment.Attributes["ss_createdthroughtaskorphone"] = true;

                        if (appointmentLookup == null)
                        {

                            Guid newAppointmentId = service.Create(newAppointment);

                            tracingService.Trace("Appointment Created");

                            Entity taskToUpdate = new Entity(entity.LogicalName);
                            taskToUpdate.Id = entity.Id;
                            taskToUpdate["ss_appointmentlookup"] = new EntityReference("appointment", newAppointmentId);
                            service.Update(taskToUpdate);


                        }

                        else if (appointmentLookup != null)

                        {
                            newAppointment.Id = appointmentLookup.Id;

                            tracingService.Trace("Appointment Updated");
                            service.Update(newAppointment);
                        }
                    }

                }
            }


            catch (Exception ex)
            {
                tracingService.Trace(ex.Message.ToString());
                throw new InvalidPluginExecutionException("An error occured in Scaleable.Xrm.Plugins.Task.CreateAppointment: ", ex.InnerException);
            }

        }

        private ColumnSet newColumnSet(bool v)
        {
            throw new NotImplementedException();
        }
    }
}
