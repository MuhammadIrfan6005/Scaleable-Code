function CloseParnterOppAsWON(primaryControl) {
    var count = 0;
    var formcontext = primaryControl;
    var iscompliancepartner = formcontext.getAttribute("ss_iscompliancepartner").getValue();
    var partnertype = formcontext.getAttribute("ss_partnertype").getValue();
    var clienttype = formcontext.getAttribute("ss_clienttype").getValue();
    var controlcenter = formcontext.getAttribute("ss_controlcenter").getValue();
    var countryiso = formcontext.getAttribute("ss_countryiso").getValue();
    var partnerlevel = formcontext.getAttribute("ss_partnerlevel").getValue();
    var partnershipmodel = formcontext.getAttribute("ss_partnershipmodel").getValue();

    if (iscompliancepartner === null || iscompliancepartner === undefined || iscompliancepartner === "") {
        formcontext.getAttribute("ss_iscompliancepartner").setRequiredLevel("required");
        count++;
    }
    if (partnertype === null || partnertype === undefined || partnertype === "") {
        formcontext.getAttribute("ss_partnertype").setRequiredLevel("required");
        count++;
    }
    if (clienttype === null || clienttype === undefined || clienttype === "") {
        formcontext.getAttribute("ss_clienttype").setRequiredLevel("required");
        count++;
    }
    if (controlcenter === null || controlcenter === undefined || controlcenter === "") {
        formcontext.getAttribute("ss_controlcenter").setRequiredLevel("required");
        count++;
    }
    if (countryiso === null || countryiso === undefined || countryiso === "") {
        formcontext.getAttribute("ss_countryiso").setRequiredLevel("required");
        count++;
    }
    if (partnerlevel === null || partnerlevel === undefined || partnerlevel === "") {
        formcontext.getAttribute("ss_partnerlevel").setRequiredLevel("required");
        count++;
    }
    if (partnershipmodel === null || partnershipmodel === undefined || partnershipmodel === "") {
        formcontext.getAttribute("ss_partnershipmodel").setRequiredLevel("required");
        count++;
    }
    if (partnershipmodel !== null && partnershipmodel !== undefined && partnershipmodel !== "" && partnershipmodel !== 0) {
        var partnerclient = formcontext.getAttribute("ss_partnerclient").getValue();
        if (partnerclient === null || partnerclient === undefined || partnerclient === "") {
            formcontext.getAttribute("ss_partnerclient").setRequiredLevel("required");
            count++;
        }
    }
    if (count > 0) {
        return;
    }
    else {
        checkparnteroppcontract(formcontext);
    }
}
function checkparnteroppcontract(formcontext) {
    var partneroppid = formcontext.data.entity.getId();
    Xrm.WebApi.online.retrieveMultipleRecords("annotation", "?$filter=_objectid_value eq " + partneroppid + "").then(
        function success(results) {
            if (results.entities.length > 0) {
                closepartneropp(formcontext);
            }
            else {
                var alertStrings = { confirmButtonLabel: "Yes", text: "Please Upload Contract First", title: "Information" };
                var alertOptions = { height: 120, width: 260 };
                parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
            }
        },
        function (error) {
            var alertStrings = { confirmButtonLabel: "Yes", text: error.message, title: "Error" };
            var alertOptions = { height: 120, width: 260 };
            parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
        }
    );
}
function closepartneropp(formcontext) {
    formcontext.getAttribute("statecode").setValue(1);
    formcontext.getAttribute("statuscode").setValue(717800001);
    formcontext.data.refresh(true);
}