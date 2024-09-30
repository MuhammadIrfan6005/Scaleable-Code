function CheckNotesAfterUploaded(executioncontext) {
    var formContext = executioncontext.getFormContext();
    var formtype = formContext.ui.getFormType();
    var recordid = formContext.data.entity.getId();
    if (formtype != 1) {
        Xrm.WebApi.online.retrieveMultipleRecords("annotation", "?$select=_objectid_value,objecttypecode&$filter=notetext eq '%7B%7BPartnerNDA--' and _objectid_value eq" + recordid + "").then(
            function success(results) {
                if (results.entities.length >= 1) {
                    formContext.getAttribute("ss_ndaagreement").setValue("NDA Contract Has Been Uploaded");
                    formContext.getControl("ss_ndaagreement").setVisible(true);
                    CheckNDAContract(recordid, formContext);
                }
                else {
                    formContext.getAttribute("ss_ndaagreement").setValue(null);
                    formContext.getControl("ss_ndaagreement").setVisible(false);
                }
            },
            function (error) {
                Showerror(error.message);
            }
        );
    }
}
function CheckNDAContract(recordid, formContext) {
    Xrm.WebApi.online.retrieveMultipleRecords("annotation", "?$select=_objectid_value,objecttypecode&$filter=notetext eq '%7B%7BNewPartner--' and _objectid_value eq" + recordid + "").then(
        function success(results) {
            if (results.entities.length >= 1) {
                formContext.getAttribute("ss_proposeagreement").setValue("Proposed Agreement Has Been Uploaded");
                formContext.getControl("ss_proposeagreement").setVisible(true);
            }
            else {
                formContext.getAttribute("ss_proposeagreement").setValue(null);
                formContext.getControl("ss_proposeagreement").setVisible(false);
            }
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


//This Function is used when user try to save the record with same name
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
                                ShowNameAlertDialog();
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
function ShowNameAlertDialog() {
    var alertStrings = { confirmButtonLabel: "Yes", text: "Partner Name already Exists.\n Please Enter Different Name", title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}
function ShowNameerror(error) {
    var alertStrings = { confirmButtonLabel: "Yes", text: error, title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}