function SetPartnerInLead(executionContext) {
    var formContext = executionContext.getForContext();
    var parentaccountid = formContext.getAttribute("parentaccount").getValue();
    var accountid = parentaccountid ? parentaccountid[0].id : null;
    if (accountid) {
        Xrm.WebApi.online.retrieveRecord("account", accountid, "?$select=_ss_partner_value").then(
            function success(result) {
                var _ss_partner_value = result["_ss_partner_value"];
                var _ss_partner_value_formatted = result["_ss_partner_value@OData.Community.Display.V1.FormattedValue"];
                var _ss_partner_value_lookuplogicalname = result["_ss_partner_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                var lookupValue = new Array();
                lookupValue[0] = new Object();
                lookupValue[0].id = _ss_partner_value; // GUID of the lookup id
                lookupValue[0].name = _ss_partner_value_formatted; // Name of the lookup
                lookupValue[0].entityType = _ss_partner_value_lookuplogicalname; //Entity Type of the lookup entity
                formContext.getAttribute("ss_partnerlead").setValue(lookupValue); // You need to replace the lookup field Name..
            },
            function (error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );
    }
}