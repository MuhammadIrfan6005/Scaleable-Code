
function CheckNDAContractFinishStage(executionContext) {
    var formcontext = executionContext.getFormContext();
    var ndasigned = formcontext.getAttribute("ss_ndasigned").getValue();
    if(ndasigned) {
        CheckNote(formcontext);
    }
}
function CheckNote(formcontext) {
        var recordid = formcontext.data.entity.getId();
        Xrm.WebApi.online.retrieveMultipleRecords("annotation", "?$select=_objectid_value,objecttypecode&$filter=notetext eq '%7B%7BPartnerNDA--' and  _objectid_value eq" + recordid + "").then(
            function success(results) {
                if (results.entities.length < 1) {
                    //formcontext.getAttribute("ss_ndasigned").setValue(false);
                    ShowAlertDialog();
                }
            },
            function (error) {
                Showerror(error.message);
            }
        );
}
function ShowAlertDialog() {
    var alertStrings = { confirmButtonLabel: "Yes", text: "Please Upload the NDA Agreement", title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
        function(success) {
            var customParam = encodeURIComponent("\"" + 'ContractNDA' + "\"");
            var url = "/webresources/ss_AnnotationEdit.html?data="+customParam;
            window.open(url, null, "width=970px,height=219px, fullscreen=no, resizable=no,scrollbars=no");
        },
        function (error){
            Showerror(error.message);
        }
    )
}
function Showerror(error) {
    var alertStrings = { confirmButtonLabel: "Yes", text: error, title: "Information EQS" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}