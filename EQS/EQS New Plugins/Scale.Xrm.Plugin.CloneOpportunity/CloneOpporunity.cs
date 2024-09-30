using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Linq;

namespace Scale.Xrm.Plugin.CloneOpportunity
{
    public class CloneOpporunity : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            #region Standard Initializations
            IPluginExecutionContext executioncontext = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory servicefactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = servicefactory.CreateOrganizationService(executioncontext.UserId);
            ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            #endregion Standard Initializations
            //Main Operation
            if (executioncontext.InputParameters.Contains("Target") && executioncontext.InputParameters["Target"] is Entity)
            {
                Entity entity = (Entity)executioncontext.InputParameters["Target"];
                Entity PostImage = (Entity)executioncontext.PostEntityImages["PostImage"];
                try
                {
                    tracingService?.Trace("Start");
                    Entity cloneopportunity = new Entity();
                    Nullable<int> value = null;
                    Nullable<int> ss_contractstatus = null;
                    string createapproval = "";
                    Nullable<int> statecode = null;
                    int[] selectedOptionValues = null;
                    if (entity.LogicalName == "opportunity" && executioncontext.MessageName == "Update")
                    {
                        #region Validate Fields
                        if (!entity.Contains("ss_contractcancellationreason") && !PostImage.Contains("ss_contractcancellationreason"))
                            return;
                        if (!entity.Contains("ss_contractstatus") && !PostImage.Contains("ss_contractstatus"))
                            return;
                        if (!entity.Contains("ss_createapprovalchecklist") && !PostImage.Contains("ss_createapprovalchecklist"))
                            return;
                        if (!entity.Contains("statecode") && !PostImage.Contains("statecode"))
                            return;
                        if (entity.Contains("ss_contractcancellationreason"))
                            selectedOptionValues = entity.GetAttributeValue<OptionSetValueCollection>("ss_contractcancellationreason").Select(osv => osv.Value).ToArray();
                        else
                            selectedOptionValues = PostImage.GetAttributeValue<OptionSetValueCollection>("ss_contractcancellationreason").Select(osv => osv.Value).ToArray();
                        if (entity.Contains("ss_contractstatus"))
                            ss_contractstatus = entity.GetAttributeValue<OptionSetValue>("ss_contractstatus").Value;
                        else
                            ss_contractstatus = PostImage.GetAttributeValue<OptionSetValue>("ss_contractstatus").Value;
                        if (entity.Contains("ss_createapprovalchecklist"))
                            createapproval = entity.GetAttributeValue<bool>("ss_createapprovalchecklist").ToString();
                        else
                            createapproval = PostImage.GetAttributeValue<bool>("ss_createapprovalchecklist").ToString();
                        if (entity.Contains("statecode"))
                            statecode = entity.GetAttributeValue<OptionSetValue>("statecode").Value;
                        else
                            statecode = PostImage.GetAttributeValue<OptionSetValue>("statecode").Value;
                        //tracingService?.Trace($"Selected option values: {string.Join(", ", selectedOptionValues)}");
                        if (!selectedOptionValues.Contains(11))
                            return;
                        if (ss_contractstatus != 3)
                            return;
                        if (createapproval == "false" || createapproval == "False")
                            return;
                        if (statecode != 1)
                            return;
                        tracingService?.Trace($"Contract Cancellation Reason Is Validated => {value}" );
                        tracingService?.Trace($"Contract Status Is Validated =>  {ss_contractstatus}");
                        tracingService?.Trace($"Create Approval Checklist Is Validated => {createapproval}");
                        #endregion Validate Fields

                        //Retrieve Opportunity all fields
                        Entity Opportunity = service.Retrieve(entity.LogicalName, entity.Id, new ColumnSet(true));
                        //This function will Contract Termination, Cancelled At Date, Contract Expiry Date
                        //UpdateTriggerOpportunity(Opportunity, tracingService, service);
                        //This function will remove some attributes of opportunity and assign values and create opportunity and return the Guid of new Opportunity
                        Guid ClonedOppId = CreateOpportunityClone(Opportunity, tracingService, service, cloneopportunity);
                        //This function will retrieve previous opportunity products
                        EntityCollection OppProducts = GetOpportunityProducts(tracingService, service, ClonedOppId, entity.Id);
                        //This function will retrieve annotations from previous opportunity
                        EntityCollection annotations = GetOpportunityAnnotations(entity.Id, service, ClonedOppId, tracingService);
                        if (OppProducts.Entities.Count > 0)
                        {
                            //This function will create create opportunity products against new opportunity
                            CreateClonedOppProducts(OppProducts, service, ClonedOppId);
                            //This function will update a date field in newly created opportunity to create Record in sales opportunity products
                            UpdateOpportunity(ClonedOppId, entity.LogicalName, tracingService, service);
                        }
                        if (annotations.Entities.Count > 0)
                        {
                            //This function will create annotations against new opportunity
                            CreateCloneAnnotations(annotations, service, ClonedOppId);
                        }
                        //This function will retrieve the Active instance Business Process flow Details
                        Entity activeProcessInstance = GetActiveBPFDetails(entity, service, ClonedOppId);
                        //This function will retrieve the Business Process Flow based on name from function "GetActiveBPFDetails"
                        string bpf_logicalname = GetBPFLogicalName(activeProcessInstance.GetAttributeValue<string>("name"), service, tracingService);
                        if (activeProcessInstance != null)
                        {
                            Guid activeBPFId = activeProcessInstance.Id;
                            Guid activeStageId = activeProcessInstance.GetAttributeValue<Guid>("processstageid");
                            int currentStagePosition = -1;
                            string traversedpath = "";
                            //This function will retrieve the Active Business Process Flow Stages
                            RetrieveActivePathResponse pathResp = GetAllStagesOfSelectedBPF(activeBPFId, activeStageId, ref currentStagePosition, service, tracingService);
                            for (int i = 0; i < pathResp?.ProcessStages?.Entities?.Count; i++)
                            {
                                traversedpath += pathResp?.ProcessStages?.Entities[i]?.Attributes["processstageid"] + ",";
                                currentStagePosition++;
                            }
                            if (currentStagePosition > -1 && pathResp?.ProcessStages != null && pathResp?.ProcessStages?.Entities != null)
                            {
                                Entity entBPF = new Entity(bpf_logicalname)
                                {
                                    Id = activeBPFId
                                };
                                entBPF["traversedpath"] = traversedpath.TrimEnd(',');
                                service.Update(entBPF);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    tracingService?.Trace("stack trace is: " + ex.StackTrace);
                    tracingService?.Trace(string.Format("An error occurred in Cloning Opportunity. \n Exception Message: {0}", ex.Message));
                }
            }
        }

        private void UpdateOpportunity(Guid clonedOppId, string v, ITracingService tracingService, IOrganizationService service)
        {
            Entity opportunity = service.Retrieve(v, clonedOppId, new ColumnSet("ss_productselectortimestamp"));
            opportunity.Attributes["ss_productselectortimestamp"] = DateTime.UtcNow;
            service.Update(opportunity);
        }

        private Guid CreateOpportunityClone(Entity Opportunity, ITracingService tracingService, IOrganizationService service, Entity cloneopportunity)
        {
            int statecode = Opportunity.GetAttributeValue<OptionSetValue>("statecode").Value;
            if (statecode == 1)
            {
                Opportunity?.Attributes.Remove("statecode");
                Opportunity?.Attributes.Remove("statuscode");
                Opportunity["statecode"] = 0;
                Opportunity["statuscode"] = 1;
            }
            Opportunity?.Attributes?.Remove("opportunityid");
            Opportunity?.Attributes?.Remove("new_opportunitytype");
            Opportunity?.Attributes?.Remove("new_cockpitmigration");
            Opportunity?.Attributes?.Remove("ss_contractstatus");
            Opportunity?.Attributes?.Remove("new_wonoppflow");
            Opportunity?.Attributes?.Remove("new_excludefromreporting");
            Opportunity?.Attributes?.Remove("ss_createapprovalchecklist");
            Opportunity?.Attributes?.Remove("ss_modifycontractstatus");
            Opportunity?.Attributes?.Remove("ss_cancelledatdate");
            Opportunity?.Attributes?.Remove("ss_cancelledtodate");
            Opportunity?.Attributes?.Remove("ss_contractnumber");
            Opportunity?.Attributes?.Remove("ss_contractcancellationreason");
            Opportunity["new_cockpitmigration"] = true;
            Opportunity["ss_contractstatus"] = new OptionSetValue(1);
            Opportunity["new_wonoppflow"] = false;
            Opportunity["new_excludefromreporting"] = true;
            Opportunity["ss_createapprovalchecklist"] = false;
            Opportunity["ss_modifycontractstatus"] = false;
            Opportunity["ss_cancelledatdate"] = null;
            Opportunity["ss_cancelledtodate"] = null;
            Opportunity["ss_contractnumber"] = "";
            Opportunity["ss_contractcancellationreason"] = null;
            Opportunity["new_opportunitytype"] = new OptionSetValue(100000002);
            Opportunity.Id = Guid.NewGuid();
            cloneopportunity = Opportunity;
            Guid ClonedOppId = service.Create(cloneopportunity);
            return ClonedOppId;
        }

        private void CreateCloneAnnotations(EntityCollection annotations, IOrganizationService service, Guid clonedOppId)
        {
            foreach (var item in annotations.Entities)
            {
                Entity annotation = item;
                annotation?.Attributes?.Remove("annotationid");
                annotation?.Attributes?.Remove("objectid");
                annotation.Id = Guid.NewGuid();
                annotation.Attributes["objectid"] = new EntityReference("opportunity", clonedOppId);
                service.Create(annotation);
            }
        }

        private EntityCollection GetOpportunityAnnotations(Guid id, IOrganizationService service, Guid cloneopportunity, ITracingService tracingService)
        {
            // Set Condition Values
            var query_objectid = id;

            // Instantiate QueryExpression query
            var query = new QueryExpression("annotation");

            // Add columns to query.ColumnSet
            query.ColumnSet.AddColumns(
                "prefix",
                "createdonbehalfby",
                "owningbusinessunit",
                "filename",
                "filesize",
                "importsequencenumber",
                "objectid",
                "versionnumber",
                "modifiedby",
                "mimetype",
                "createdby",
                "stepid",
                "notetext",
                "subject",
                "modifiedon",
                "langid",
                "ownerid",
                "createdon",
                "documentbody",
                "isdocument",
                "modifiedonbehalfby",
                "objecttypecode",
                "overriddencreatedon",
                "annotationid");

            // Add conditions to query.Criteria
            query.Criteria.AddCondition("objectid", ConditionOperator.Equal, query_objectid);
            EntityCollection notes = service.RetrieveMultiple(query);
            return notes;
        }

        private string GetBPFLogicalName(string name, IOrganizationService service, ITracingService tracingService)
        {
            QueryExpression qe = new QueryExpression("workflow");
            qe.Criteria.AddCondition("name", ConditionOperator.Equal, name);
            qe.NoLock = true;
            qe.TopCount = 1;
            qe.ColumnSet.AddColumn("uniquename");
            EntityCollection bpfs = service.RetrieveMultiple(qe);

            string bpfUniqueName = bpfs.Entities[0].GetAttributeValue<string>("uniquename");
            return bpfUniqueName;
        }

        private RetrieveActivePathResponse GetAllStagesOfSelectedBPF(Guid activeBPFId, Guid activeStageId, ref int currentStagePosition, IOrganizationService service, ITracingService tracingService)
        {
            // Retrieve the process stages in the active path of the current process instance
            RetrieveActivePathRequest pathReq = new RetrieveActivePathRequest
            {
                ProcessInstanceId = activeBPFId
            };
            RetrieveActivePathResponse pathResp = (RetrieveActivePathResponse)service.Execute(pathReq);

            return pathResp;
        }

        private Entity GetActiveBPFDetails(Entity entity, IOrganizationService service, Guid clonedOppId)
        {
            Entity activeProcessInstance = null;
            RetrieveProcessInstancesRequest entityBPFsRequest = new RetrieveProcessInstancesRequest
            {
                EntityId = clonedOppId,
                EntityLogicalName = entity.LogicalName
            };
            RetrieveProcessInstancesResponse entityBPFsResponse = (RetrieveProcessInstancesResponse)service.Execute(entityBPFsRequest);
            if (entityBPFsResponse?.Processes != null && entityBPFsResponse?.Processes?.Entities != null)
            {
                activeProcessInstance = entityBPFsResponse?.Processes?.Entities[0];
            }
            return activeProcessInstance;
        }

        private void CreateClonedOppProducts(EntityCollection oppProducts, IOrganizationService service, Guid clonedOppId)
        {
            foreach (var item in oppProducts.Entities)
            {
                Entity CloneOppProduct = item;
                CloneOppProduct?.Attributes.Remove("opportunityproductid");
                CloneOppProduct?.Attributes.Remove("opportunityid");
                CloneOppProduct.Id = Guid.NewGuid();
                CloneOppProduct.Attributes["opportunityid"] = new EntityReference("opportunity", clonedOppId);
                service.Create(CloneOppProduct);
            }
        }

        private EntityCollection GetOpportunityProducts(ITracingService tracingService, IOrganizationService service, Guid clonedOppId, Guid id)
        {
            // Set Condition Values
            var query_opportunityid = id;

            // Instantiate QueryExpression query
            var query = new QueryExpression("opportunityproduct");

            // Add all columns to query.ColumnSet
            query.ColumnSet.AllColumns = true;

            // Add filter query.Criteria
            query.Criteria.AddCondition("opportunityid", ConditionOperator.Equal, query_opportunityid);
            EntityCollection OppProducts = service.RetrieveMultiple(query);
            return OppProducts;
        }
    }
}
