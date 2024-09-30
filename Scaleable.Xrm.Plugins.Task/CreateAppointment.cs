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



            EntityReference currentUserID = new EntityReference("systemuser", initiatingUserId);
            if (!(entity.LogicalName == "task" || entity.LogicalName == "phonecall"))
            {

                return;

            }

            if (context.Depth > 1)
            {
                return;
            }


            
               if(entity.LogicalName == "task")
                {
                  if (context.MessageName.ToUpper() == "UPDATE")
                    {
                       post_image = context.PostEntityImages["task_postimg"];
                    }
                    prefix = "Task";

                }
                else if(entity.LogicalName == "phonecall")
                {
                if (context.MessageName.ToUpper() == "UPDATE")
                {
                    post_image = context.PostEntityImages["PhoneCallPostImage"];

                }
                prefix = "Phone Call";

                }
            

            try
            {
                if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
                {

                    if (context.MessageName.ToUpper() == "CREATE")
                    {

                        if (context.Depth > 1)
                        {
                            return;
                        }

                        if (entity.Attributes.Contains("subject"))
                        {
                            subject = (string)entity["subject"];
                        }


                        if (entity.Attributes.Contains("description"))
                        {
                            description = (string)entity["description"];
                        }


                        if (entity.Attributes.Contains("regardingobjectid"))
                        {
                            if (entity["regardingobjectid"] != null)
                            {
                                regardingLookup = (EntityReference)entity.Attributes["regardingobjectid"];
                            }
                        }

                        if (entity.Attributes.Contains("ss_createcalendarentry") && entity["ss_createcalendarentry"] != null)
                        {
                            createAppointmentFlag = (bool)entity["ss_createcalendarentry"];
                        }

                        if (entity.Attributes.Contains("ss_appointmentlookup"))
                        {

                            appointmentLookup = (EntityReference)entity["ss_appointmentlookup"];
                        }

                        if (entity.Attributes.Contains("scheduledend"))
                        {
                            dueDate = (DateTime)entity["scheduledend"];
                        }

                        if (entity.Attributes.Contains("actualdurationminutes"))
                        {
                            duration = (int)entity["actualdurationminutes"];
                        }

                    }//create request


                    if (context.MessageName.ToUpper() == "UPDATE")
                    {
                        if (entity.Attributes.Contains("description"))
                        {
                            description = (string)entity["description"];
                        }
                        else if (post_image.Attributes.Contains("description"))
                        {
                            description = (string)post_image["description"];
                        }

                        if (entity.Attributes.Contains("regardingobjectid"))
                        {
                            if (entity["regardingobjectid"] != null)
                            {
                                regardingLookup = (EntityReference)entity.Attributes["regardingobjectid"];
                            }
                        }
                        else if (post_image.Attributes.Contains("regardingobjectid"))
                        {
                            if (post_image["regardingobjectid"] != null)
                            {
                                regardingLookup = (EntityReference)post_image.Attributes["regardingobjectid"];
                            }

                        }

                        if (entity.Attributes.Contains("subject"))
                        {
                            subject = (string)entity["subject"];
                        }
                        else if (post_image.Attributes.Contains("subject"))
                        {
                            subject = (string)post_image["subject"];
                        }


                        if (entity.Attributes.Contains("ss_createcalendarentry"))
                        {
                            createAppointmentFlag = (bool)entity["ss_createcalendarentry"];
                        }

                        else if (post_image.Attributes.Contains("ss_createcalendarentry"))
                        {
                            createAppointmentFlag = (bool)post_image["ss_createcalendarentry"];
                        }

                        if (entity.Attributes.Contains("ss_appointmentlookup"))
                        {

                            appointmentLookup = (EntityReference)entity["ss_appointmentlookup"];
                        }
                        else if (post_image.Attributes.Contains("ss_appointmentlookup"))
                        {

                            appointmentLookup = (EntityReference)post_image["ss_appointmentlookup"];
                        }

                        if (entity.Attributes.Contains("scheduledend"))
                        {
                            if (entity["scheduledend"] != null)
                            {
                                dueDate = (DateTime)entity["scheduledend"];
                            }
                        }
                        else if (post_image.Attributes.Contains("scheduledend"))
                        {
                            if (post_image["scheduledend"] != null)
                            {
                                dueDate = (DateTime)post_image["scheduledend"];
                            }
                        }

                        if (entity.Attributes.Contains("actualdurationminutes"))
                        {
                            if (entity["actualdurationminutes"] != null)
                            {
                                duration = (int)entity["actualdurationminutes"];
                            }
                        }
                        else if (post_image.Attributes.Contains("actualdurationminutes"))
                        {
                            if (post_image["actualdurationminutes"] != null)
                            {
                                duration = (int)post_image["actualdurationminutes"];
                            }
                        }


                    }
                    if (regardingLookup != null)
                    {
                        if (regardingLookup.LogicalName == "contact")
                        {
                            ColumnSet attributes = new ColumnSet(new string[] { "fullname" });
                            RegardingEntity = service.Retrieve(regardingLookup.LogicalName, regardingLookup.Id, attributes);
                            if(RegardingEntity.Attributes.Contains("fullname") && RegardingEntity["fullname"] != null)
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
                        else
                        {
                            ColumnSet attributes = new ColumnSet(new string[] { "name" });
                            RegardingEntity = service.Retrieve(regardingLookup.LogicalName, regardingLookup.Id, attributes);
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

                        newAppointment["description"] = "Regarding: " + regardingName + "\n"+ prefix + " Description : " + description;


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
