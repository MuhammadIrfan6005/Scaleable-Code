function CheckForInformalAgreement(executionContext) {
    var formContext = executionContext.getFormContext();
    var proposeagreementsigned = formContext.getAttribute("ss_proposeagreementsigned").getValue();
    var sendoutpartnershipagreement = formContext.getAttribute("ss_sendoutpartnershipagreement").getValue();

    if(proposeagreementsigned === 0 && sendoutpartnershipagreement === 0) {
        var recordid = formContext.data.entity.getId();
        CheckNotes(recordid, formContext);
    }
}
function CheckNotes(recordid, formContext) {
    Xrm.WebApi.online.retrieveMultipleRecords("annotation", "?$select=_objectid_value,objecttypecode&$filter=notetext eq '%7B%7BNewPartner--' and  _objectid_value eq" + recordid + "").then(
        function success(results) {
            if (results.entities.length < 1) {
                ShowErrorDialog(formContext);
            }
        },
        function(error) {
            Showerror(error.message);
        }
    );
}
function ShowErrorDialog(formContext) {
                var alertStrings = { confirmButtonLabel: "Yes", text: "Please Upload the Agreement", title: "Information" };
                var alertOptions = { height: 120, width: 260 };
                parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function(success) {
                        var customParam = encodeURIComponent("\"" + 'Contract' + "\"");
                        var url = "/webresources/ss_AnnotationEdit.html?data="+customParam;
                        window.open(url, null, "width=970px,height=219px, fullscreen=no, resizable=no,scrollbars=no");
                    },
                    function (error){
                        Showerror(error.message);
                    }
                )
}
function Showerror(error) {
    var alertStrings = { confirmButtonLabel: "Yes", text: error.message, title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}