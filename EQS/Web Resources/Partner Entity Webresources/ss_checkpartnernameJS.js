function CheckName(executionContext) {
    var formContext = executionContext.getFormContext();
    var fromtype = formContext.ui.getFormType();
    if(fromtype === 1) {
        try {
            var name = formContext.getAttribute("new_name").getValue();
            var req = new XMLHttpRequest();
            req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/new_partners?$select=new_name", false);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                        var results = JSON.parse(this.response);
                        for (var i = 0; i < results.value.length; i++) {
                            var new_name = results.value[i]["new_name"];
                            if (new_name != null && new_name.includes(name)) {
                                executionContext.getEventArgs().preventDefault();
                                ShowAlertDialog();
                                return;
                            }
                        }
                    } else {
                        ShowNameerror(this.statusText);
                    }
                }
            };
            req.send();
        }
        catch (error) {
            ShowNameerror(error);
        }
    }
}
function ShowAlertDialog() {
    var alertStrings = { confirmButtonLabel: "Yes", text: "Partner Name already Exists.\n Please Enter Different Name", title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}
function ShowNameerror(error) {
    var alertStrings = { confirmButtonLabel: "Yes", text: error, title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}