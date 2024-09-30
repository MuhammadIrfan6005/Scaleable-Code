using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;
using System.Collections.Generic;

namespace Scaleable.Xrm.Plugin.SetCurrentUser
{
    public class SetCurrentUser : CodeActivity
    {
        //[RequiredArgument]
        //[Input("Folder Title")]
        //public InArgument<string> FolderTitle { get; set; }

        //[Input("Description")]
        //public InArgument<string> Description { get; set; }

        ////[RequiredArgument]
        //[Input("Spaces Id")]
        //[ReferenceTarget("sswp_spaces")]
        //public InArgument<EntityReference> SpaceId { get; set; }

        ////[RequiredArgument]
        //[Input("Created By")]
        //[ReferenceTarget("systemuser")]
        //public InArgument<EntityReference> CreatedBy { get; set; }

        //[Input("Folder Id")]
        //[ReferenceTarget("sswp_folder")]
        //public InArgument<EntityReference> FId { get; set; }

        //[Input("State Date")]
        //public InArgument<DateTime> StartDate { get; set; }

        //[Input("End Date")]
        //public InArgument<DateTime> EndDate { get; set; }

        //[Output("Wrike Folder Id")]
        //public OutArgument<string> FolderId { get; set; }

        [Output("Current User")]
        public OutArgument<string> CurrentUser { get; set; }

        #region Standard Initialization
        ITracingService tracingService = null;
        IOrganizationService service = null;
        IWorkflowContext context = null;
        #endregion

        protected override void Execute(CodeActivityContext executionContext)
        {
            try
            {
                #region Standard Declaration
                tracingService = executionContext.GetExtension<ITracingService>();
                context = executionContext.GetExtension<IWorkflowContext>();
                IOrganizationServiceFactory serviceFactory = executionContext.GetExtension<IOrganizationServiceFactory>();
                service = serviceFactory.CreateOrganizationService(context.UserId);

                tracingService.Trace("Workflow has triggered.......");


                tracingService.Trace("Current User id is 1 :{0}", context.UserId);

                // Define Condition Values
                var query_systemuserid = context.UserId;
                // Instantiate QueryExpression query
                var query = new QueryExpression("systemuser");
                // Add columns to query.ColumnSet
                query.ColumnSet.AddColumns("fullname");
                // Define filter query.Criteria
                query.Criteria.AddCondition("systemuserid", ConditionOperator.Equal, query_systemuserid);
                #endregion
                Entity entity = service.Retrieve("systemuser", context.UserId, new ColumnSet ( "fullname" ));
                var userName=  entity["fullname"].ToString();
                CurrentUser.Set(executionContext,userName);
                tracingService.Trace("Name is => " + CurrentUser);
            }
            catch (Exception ex)
            {
                tracingService?.Trace(string.Format("An error occured while running OnCreate folder. \n Exception Message: {0}", ex.Message));
                throw new InvalidPluginExecutionException(ex.Message, ex);
            }
        }

    }
}