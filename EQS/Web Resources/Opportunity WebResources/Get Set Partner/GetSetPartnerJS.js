function GetSetPartner(executionContext) {
    var formContext = executionContext.getFormContext();
    var productcategory = formContext.getAttribute("new_productcategory").getValue();
    if (productcategory === "100000000" || productcategory === 100000000) {
        var account = formContext.getAttribute("parentaccountid").getValue();
        if (account) {
            var accountid = account[0].id.replace("{", "").replace("}", "");
            GetAccountsPartner(formContext, accountid);
        }
    }
    else {
        formContext.getAttribute("ss_opportunitypartner").setValue(null);
    }
}
function GetAccountsPartner(formContext, account) {
    Xrm.WebApi.online.retrieveRecord("account", account, "?$select=_ss_partner_value").then(
        function success(result) {
            var _ss_partner_value = result["_ss_partner_value"];
            var _ss_partner_value_formatted = result["_ss_partner_value@OData.Community.Display.V1.FormattedValue"];
            var _ss_partner_value_lookuplogicalname = result["_ss_partner_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
            var partner = new Array();
            var partnerrecord = new Object();
            partnerrecord.id = _ss_partner_value;
            partnerrecord.name = _ss_partner_value_formatted;
            partnerrecord.entityType = _ss_partner_value_lookuplogicalname;
            partner[0] = partnerrecord;
            formContext.getAttribute("ss_opportunitypartner").setValue(partner);
        },
        function (error) {
            Showerror(error.message);
        }
    );
}
function Showerror(error) {
    var alertStrings = { confirmButtonLabel: "Yes", text: error, title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}