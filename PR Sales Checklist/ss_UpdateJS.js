function UpdateNAVID(executionContext) {
    var formContext = executionContext.getFormContext();
    var accountid = formContext.getAttribute("ss_opportunityaccount").getValue() ? formContext.getAttribute("ss_opportunityaccount").getValue()[0].id.replace("{","").replace("}","") : null; 
    if(accountid) {
        Xrm.WebApi.online.retrieveRecord("account", accountid, "?$select=bbo_navid").then(
            function success(result) {
                var bbo_navid = result["bbo_navid"];
                if(bbo_navid !== null) {
                    formContext.getAttribute("ss_accountnavid").setValue(parseInt(bbo_navid));
                }
            },
            function(error) {
                showerror(error.message);
            }
        );
    }
}
function showerror(error) {

    var alertStrings = { confirmButtonLabel: "Yes", text: error, title: "Error" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}