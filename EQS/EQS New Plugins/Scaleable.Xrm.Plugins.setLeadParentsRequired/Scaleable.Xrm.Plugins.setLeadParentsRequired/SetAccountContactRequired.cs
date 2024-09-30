using System;
using Microsoft.Xrm.Sdk;

namespace Scaleable.Xrm.Plugins.setLeadParentsRequired
{
    public class SetAccountContactRequired : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            try
            {

                #region Standard Initialization

                IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
                ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
                IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
                IOrganizationService service = factory.CreateOrganizationService(context.UserId);
                #endregion
                //if (context.Depth > 1)
                //    return;
                tracingService.Trace("setLeadParentsRequired triggered");
                if (!(context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity))
                    return;
                if (!(context.PreEntityImages.Contains("PreImage") && context.PreEntityImages["PreImage"] is Entity))
                    return;
                if (!context.MessageName.Equals("Update"))
                    return;
                Entity entity = (Entity)context.InputParameters["Target"];
                OptionSetValue statecode = entity.GetAttributeValue<OptionSetValue>("statecode");
                var statecodevalue = statecode?.Value;
                if (statecodevalue != 1)
                    return;
                Entity preImage = (Entity)context.PreEntityImages["PreImage"];
                bool potentialcustomer = entity.Contains("ss_scoring_partner") ? entity.GetAttributeValue<bool>("ss_scoring_partner") : preImage.GetAttributeValue<bool>("ss_scoring_partner");
                if (potentialcustomer)
                    return;
                EntityReference parentAccount = entity.Contains("parentaccountid")? entity.GetAttributeValue<EntityReference>("parentaccountid") : preImage.GetAttributeValue<EntityReference>("parentaccountid");
                EntityReference parentContact = entity.Contains("parentcontactid") ? entity.GetAttributeValue<EntityReference>("parentcontactid") : preImage.GetAttributeValue<EntityReference>("parentcontactid");                           
                if (parentAccount?.Name == null || parentContact?.Name == null)
                throw new InvalidPluginExecutionException("Please provide the Account and Contact first to Qualify Lead! \n");
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException(ex.Message, ex);
            }
        }
    }
}
