function quickCreateOnLoad(executionContext){
	var parentRecordReference = Xrm.Utility.getPageContext().input.createFromEntity;
    var formcontext = executionContext.getFormContext();
	if (parentRecordReference == null){
		return;
	}
    if(parentRecordReference.entityType === "lead")
    {
        GetLead(formcontext , parentRecordReference.id);
    }
    else if(parentRecordReference.entityType === "opportunity")
    {
        GetOpportunity(formcontext , parentRecordReference.id)
    }
    else if(parentRecordReference.entityType === "new_partner")
    {
        formcontext.getControl("parentcustomerid").setVisible(false);
    }

}
function GetLead(formcontext, leadid)
{
    Xrm.WebApi.online.retrieveRecord("lead", leadid, "?$select=_parentaccountid_value, ss_scoring_partner").then(
        function success(result) {
            var _parentaccountid_value = result["_parentaccountid_value"];
            var _parentaccountid_value_formatted = result["_parentaccountid_value@OData.Community.Display.V1.FormattedValue"];
            var _parentaccountid_value_lookuplogicalname = result["_parentaccountid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
            var ss_scoring_partner = result["ss_scoring_partner"];
            var ss_scoring_partner_formatted = result["ss_scoring_partner@OData.Community.Display.V1.FormattedValue"];
            if(ss_scoring_partner) {
                formcontext.getControl("parentcustomerid").setVisible(false);
            }
            else if(_parentaccountid_value){
            GetOppAccount(formcontext, _parentaccountid_value);
            }
        },
        function(error) {
            showerror(error);
        }
    );
}
function GetOpportunity(formcontext, oppid)
{
    Xrm.WebApi.online.retrieveRecord("opportunity", oppid, "?$select=_parentaccountid_value").then(
        function success(result) {
            var _parentaccountid_value = result["_parentaccountid_value"];
            var _parentaccountid_value_formatted = result["_parentaccountid_value@OData.Community.Display.V1.FormattedValue"];
            var _parentaccountid_value_lookuplogicalname = result["_parentaccountid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
            if(_parentaccountid_value){
            GetOppAccount(formcontext, _parentaccountid_value);
            }
        },
        function(error) {
            showerror(error);
        }
    );
}
function GetOppAccount(formcontext, accountid)
{
    Xrm.WebApi.online.retrieveRecord("account", accountid, "?$select=ss_countryiso").then(
        function success(result) {
            var ss_countryiso = result["ss_countryiso"];
            var ss_countryiso_formatted = result["ss_countryiso@OData.Community.Display.V1.FormattedValue"];
            var countryiso = formcontext.getAttribute("ss_countryiso");
            if(ss_countryiso && countryiso)
            {
                countryiso.setValue(ss_countryiso);
            }
        },
        function(error) {
            showerror(error);
        }
    );
}
function showerror(error)
{
    var alertStrings = { confirmButtonLabel: "Yes", text:error.message,title: "Error" };
								var alertOptions = { height: 120, width: 260 };
								parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}