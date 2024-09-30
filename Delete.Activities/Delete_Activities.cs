using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System.Activities;
using Microsoft.Xrm.Sdk.Workflow;

namespace Scleable.Xrm.Plugin.Delete.Activities
{


    public class Delete_Activities : CodeActivity
    {
        protected override void Execute(CodeActivityContext executionContext)
        {
            IWorkflowContext context = executionContext.GetExtension<IWorkflowContext>();
            IOrganizationServiceFactory serviceFactory = executionContext.GetExtension<IOrganizationServiceFactory>();
            IOrganizationService orgService = serviceFactory.CreateOrganizationService(context.InitiatingUserId);
            ITracingService tracing = executionContext.GetExtension<ITracingService>();          

            try
            {
                tracing.Trace("inside try");
                QueryExpression qe = new QueryExpression("task");
                qe.Criteria = new FilterExpression();
                qe.Criteria.AddCondition("ss_createcalendarentry", ConditionOperator.Equal, true);

                EntityCollection results = orgService.RetrieveMultiple(qe);

                foreach (Entity task in results.Entities)
                {
                    orgService.Delete(task.LogicalName, task.Id);
                }


                tracing.Trace("inside try");
                QueryExpression query = new QueryExpression("phonecall");
                query.Criteria = new FilterExpression();
                query.Criteria.AddCondition("ss_createcalendarentry", ConditionOperator.Equal, true);

                EntityCollection phoneCollection = orgService.RetrieveMultiple(query);

                foreach (Entity phone in phoneCollection.Entities)
                {
                    orgService.Delete(phone.LogicalName, phone.Id);
                }


            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException("An error occured in Delete.Activities.Delete_Activities -" + ex);
            }
        }
    }
}
