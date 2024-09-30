function checkpartnernameLead(executionContext) {
    var formContext = executionContext.getFormContext();
    var hspartnername = formContext.getAttribute("ss_hsparentpartner").getValue();
    var partner = formContext.getAttribute("ss_partnerlead").getValue();
    if (partner === null || partner === undefined || partner === "") {
        //get all partner names from Partner Entity

        Xrm.WebApi.online.retrieveMultipleRecords("new_partner", "?$select=new_name&$filter=new_name ne null").then(
            function success(results) {
                for (var i = 0; i < results.entities.length; i++) {
                    var new_name = results.entities[i]["new_name"];
                    if (new_name.includes(hspartnername)) {
                        ShowAlerDialog();
                        return; 
                    }
                }
            },
            function(error) {
                //Xrm.Utility.alertDialog(error.message);
                Showerror(error.message);
            }
        );
    }
}
function ShowAlerDialog() {
    var alertStrings = { confirmButtonLabel: "Yes", text: "HS Partner Name Already Exists!\nPlease Enter Different Name.", title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}
function Showerror(error) {
    var alertStrings = { confirmButtonLabel: "Yes", text: error.message, title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}