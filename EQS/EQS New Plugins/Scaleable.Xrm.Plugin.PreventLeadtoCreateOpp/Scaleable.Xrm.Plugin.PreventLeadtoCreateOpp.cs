using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Scaleable.Xrm.Plugin.PreventLeadtoCreateOpp
{
    public class Scaleable : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);
            try
            {
                if (context.MessageName != "QualifyLead")
                    return;
                EntityReference LeadRef = null;
                LeadRef = (EntityReference)context.InputParameters["LeadId"];
                if (LeadRef.LogicalName != "lead")
                {
                    return;
                }
                var isCreateAccount = (bool)context.InputParameters["CreateAccount"];
                var isCreateContact = (bool)context.InputParameters["CreateContact"];
                var isCreateOpportunity = (bool)context.InputParameters["CreateOpportunity"];
                string potentialcustomer = "";
                Entity lead = service.Retrieve("lead", LeadRef.Id, new ColumnSet(true));

                potentialcustomer = lead.Contains("ss_scoring_partner") ? lead.FormattedValues["ss_scoring_partner"].ToString() : "";
                tracingService.Trace("Customer Is => " + potentialcustomer);
                    if (potentialcustomer == "Yes")
                    {
                    context.InputParameters["CreateAccount"] = false;
                    context.InputParameters["CreateContact"] = false;
                    context.InputParameters["CreateOpportunity"] = false;
                    tracingService.Trace("Inside If 1st => ");

                    var partnername = lead.Contains("ss_hsparentpartner") ? lead.GetAttributeValue<string>("ss_hsparentpartner") : "";
                    tracingService.Trace("Partner Name is => " + partnername);
                    //This function will check the partner name & if partner name found then the new record of partner will not be created
                    CheckPartnerName(service, partnername, tracingService);
                    //Ends Here
                    EntityReference contact = lead.Contains("parentcontactid") ? lead.GetAttributeValue<EntityReference>("parentcontactid") : null;

                    OptionSetValue countryiso = lead.Contains("ss_countryiso") ? lead.GetAttributeValue<OptionSetValue>("ss_countryiso") : null;
                    tracingService.Trace("Country ISO Value is => " + countryiso?.Value);

                    //Guid contactid = contact.Id != null ? contact.Id : Guid.Empty;
                    //tracingService.Trace("Contact Id is => " + contactid);
                    //string contactlogicalname = contact.LogicalName ?? "";

                    Entity partner = new Entity("new_partner");
                    partner["new_name"] = partnername;
                    partner["ss_ss_countryiso"] = countryiso != null ? new OptionSetValue((int)(countryiso?.Value)) : new OptionSetValue(-1);
                    partner["ss_partnercontact"] = contact != null ? new EntityReference(contact.LogicalName, contact.Id) : null;
                    partner["ss_partnerlead"] = new EntityReference(lead.LogicalName, lead.Id);
                    tracingService.Trace("creating partner");
                    service.Create(partner);
                    
                    }
                    else
                    {
                    tracingService.Trace("End Plugin from Else Part");
                    }
                }
            catch (Exception ex)
            {
                tracingService.Trace("Original Exception is => " + ex.Message);
                throw new InvalidPluginExecutionException(ex.Message, ex);
            }
        }

        private void CheckPartnerName(IOrganizationService service, string name, ITracingService tracingService)
        {
            tracingService.Trace("In Check Partner Name");
            var query = new QueryExpression("new_partner");
            query.ColumnSet.AddColumns("new_name");
            query.Criteria.AddCondition("new_name", ConditionOperator.NotNull);
            EntityCollection result = service.RetrieveMultiple(query);
            foreach (var partnername in result.Entities)
            {
                string partner = partnername.GetAttributeValue<string>("new_name");
                bool b = partner.Contains(name);
                if (b)
                {
                    tracingService.Trace("Partner Already Contains => " + b);
                    throw new InvalidPluginExecutionException("Partner Name already Exists \n Please Write Unique Name! \n");
                }
            }
        }
    }
}
