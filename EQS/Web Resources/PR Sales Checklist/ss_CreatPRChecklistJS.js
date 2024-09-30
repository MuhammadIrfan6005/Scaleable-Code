function CreatPRChecklist(PrimaryControl) {
    var entityFormOptions = {};
    entityFormOptions["entityName"] = "feedback";
    entityFormOptions["formId"] = "c3441013-3de5-414b-b41f-2f47261d5865";
    var formParameters = {};
    //formParameters ["formid"] = "9B9821E1-69D3-4679-B198-E64701475276";
    formParameters["ss_businessunit"] = "EQS PR";
    Xrm.Navigation.openForm(entityFormOptions, formParameters);
}
function UpdateNAVID(executionContext) {
    // var formContext = executionContext.getFormContext();
    // var accountid = formContext.getAttribute("ss_opportunityaccount") ? formContext.getAttribute("ss_opportunityaccount").getValue()[0].id.replace("{","").replace("}","") : null; 
    // if(accountid) {
    //     Xrm.WebApi.online.retrieveRecord("account", accountid, "?$select=bbo_navid").then(
    //         function success(result) {
    //             var bbo_navid = result["bbo_navid"];
    //             bbo_navid ? formContext.getAttribute("ss_accountnavid").setValue(bbo_navid) : null;
    //         },
    //         function(error) {
    //             showerror(error.message);
    //         }
    //     );
    // }
}
function showerror(error) {

    var alertStrings = { confirmButtonLabel: "Yes", text: error, title: "Error" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}