var users = ["f5e9e341-7a1f-ec11-b6e6-000d3ade6068","107d2aa0-7f73-ec11-8943-000d3add6016","d1874169-d85f-e711-811f-e0071b667001","e76fa2df-6d4e-eb11-bb23-000d3ab71329","f3dc7c5f-cfef-e711-8141-e0071b659e01","3b51ecf3-7423-eb11-a813-000d3ab85fa8","e5817958-7a68-e711-8144-e0071b65e201", "C2AF418A-0D09-E511-810F-C4346BACCC0C", "49D4C35D-020B-EC11-B6E6-000D3ADCD1F5"];
function setpartnerfieldsrequired(executionContext) {
    var userId = Xrm.Utility.getGlobalContext().userSettings.userId.replace("{","").replace("}","");
    var formContext = executionContext.getFormContext();
    formContext.data.process.addOnStageChange(stagechange);
    formContext.data.process.addOnProcessStatusChange(StatusChange);
    if (formContext.data.process.getActiveStage()) {
        var activestage = formContext.data.process.getActiveStage().getName();
        if (activestage === "Live") {
            formContext.getControl("ss_partnerlevel").setDisabled(false);
            formContext.getControl("ss_commission").setDisabled(false);
            formContext.getAttribute("ss_partnerlevel").setRequiredLevel("required");
            formContext.getControl("ss_commisionper").setDisabled(false);
            // if(!users.includes(userId)) {
            //     formContext.getControl("ss_commisionper").setDisabled(true);
            // }
            //formContext.getAttribute("ss_commission").setRequiredLevel("required");
            formContext.data.refresh(true);
        }
        else {
            formContext.getControl("ss_partnerlevel").setDisabled(true);
            formContext.getControl("ss_commission").setDisabled(true);
            formContext.getControl("ss_commisionper").setDisabled(true)
        }
    }
}
function stagechange(executionContext) {
    var formContext = executionContext.getFormContext();
    var recordid = formContext.data.entity.getId();
    var activestage = formContext.data.process.getActiveStage().getName();
    if (activestage === "Live") {
        var proposeagreementsigned = formContext.getAttribute("ss_proposeagreementsigned").getValue();
        var sendoutproposedagreement = formContext.getAttribute("ss_sendoutpartnershipagreement").getValue();
        if (proposeagreementsigned === 2 && sendoutproposedagreement != 2) {
            formContext.data.process.movePrevious();
        }
        else if (proposeagreementsigned != 2 && sendoutproposedagreement === 2) {
            formContext.data.process.movePrevious();
        }
        else if (proposeagreementsigned === 0 && sendoutproposedagreement === 0) {
            Xrm.WebApi.online.retrieveMultipleRecords("annotation", "?$select=_objectid_value,objecttypecode&$filter=notetext eq '%7B%7BNewPartner--' and  _objectid_value eq" + recordid + "").then(
                function success(results) {
                    if (results.entities.length < 1) {
                        formContext.data.process.movePrevious();
                        ShowAlertDialogForInformal();
                    }
                    else {
                        formContext.getControl("ss_partnerlevel").setDisabled(false);
                        formContext.getControl("ss_commission").setDisabled(false);
                        formContext.getAttribute("ss_partnerlevel").setRequiredLevel("required");
                        formContext.getControl("ss_commisionper").setDisabled(false);
                        //formContext.getAttribute("ss_commission").setRequiredLevel("required");
                        // var userId = Xrm.Utility.getGlobalContext().userSettings.userId.replace("{","").replace("}","");;
                        // if(!users.includes(userId)) {
                        //     formContext.getControl("ss_commisionper").setDisabled(true);
                        // }
                        formContext.data.refresh(true);
                    }
                },
                function (error) {
                    Showerror(error.message);
                }
            );
        }
    }
    else {
        formContext.getControl("ss_partnerlevel").setDisabled(true);
        formContext.getControl("ss_commission").setDisabled(true);
        formContext.getControl("ss_commisionper").setDisabled(true);
    }
    if (activestage === "Presentation & Contract") {
        var recordid = formContext.data.entity.getId();
        Xrm.WebApi.online.retrieveMultipleRecords("annotation", "?$select=_objectid_value,objecttypecode&$filter=notetext eq '%7B%7BPartnerNDA--' and  _objectid_value eq" + recordid + "").then(
            function success(results) {
                if (results.entities.length < 1) {
                    formContext.data.process.movePrevious();
                    ShowAlertDialog();
                }
            },
            function (error) {
                Showerror(error.message);
            }
        );
    }
}
function StatusChange(executionContext) {
    var formContext = executionContext.getFormContext();
    var status = formContext.data.process.getStatus();
    var activestage = formContext.data.process.getActiveStage().getName();
    if (status === "finished") {
        //formContext.getControl("ss_partnerlevel").setDisabled(false);
        formContext.getControl("ss_commission").setDisabled(true);
    }
    // else if (activestage === "Presentation & Contract") {
    //     var recordid = formContext.data.entity.getId();
    //     Xrm.WebApi.online.retrieveMultipleRecords("annotation", "?$select=_objectid_value,objecttypecode&$filter=notetext eq '%7B%7BPartnerNDA--' and  _objectid_value eq" + recordid + "").then(
    //         function success(results) {
    //             if (results.entities.length < 1) {
    //                 formContext.getAttribute("ss_ndasigned").setValue(false);
    //                 ShowAlertDialog();
    //             }
    //         },
    //         function (error) {
    //             Showerror(error.message);
    //         }
    //     );
    // }
}
function ShowAlertDialog() {
    var alertStrings = { confirmButtonLabel: "Yes", text: "Please Upload the NDA Agreement", title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
        function (success) {
            var customParam = encodeURIComponent("\"" + 'ContractNDA' + "\"");
            var url = "/webresources/ss_AnnotationEdit.html?data=" + customParam;
            window.open(url, null, "width=970px,height=219px, fullscreen=no, resizable=no,scrollbars=no");
        },
        function (error) {
            Showerror(error.message);
        }
    )
}
function ShowAlertDialogForInformal() {
    var alertStrings = { confirmButtonLabel: "Yes", text: "Please Upload the Agreement", title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
        function (success) {
            var customParam = encodeURIComponent("\"" + 'Contract' + "\"");
            var url = "/webresources/ss_AnnotationEdit.html?data=" + customParam;
            window.open(url, null, "width=970px,height=219px, fullscreen=no, resizable=no,scrollbars=no");
        },
        function (error) {
            Showerror(error.message);
        }
    )
}
function Showerror(error) {
    var alertStrings = { confirmButtonLabel: "Yes", text: error, title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}