function OpenPartnerOppOnLeadQualify(executionContext) {
    var formcontext = executionContext.getFormContext();
    var statuscode = formcontext.getAttribute("statuscode").getValue();
    var ss_scoring_partner = formcontext
        .getAttribute("ss_scoring_partner")
        .getValue();
    if ((statuscode === 3 || statuscode === "3") && ss_scoring_partner) {
        var leadid = formcontext.data.entity.getId();
        FindParnter(formcontext, leadid);
    }
}

function FindParnter(formcontext, leadid) {
        Xrm.WebApi.online.retrieveMultipleRecords("new_partner", "?$select=new_partnerid&$filter=_ss_partnerlead_value eq " + leadid +"&$top=1").then(
            function success(results) {
                for (var i = 0; i < results.entities.length; i++) {
                    var ss_partnerid = results.entities[i]["new_partnerid"];
                    OpenPartnerOppForm(formcontext, "new_partner", ss_partnerid)
                }
            },
            function(error) {
                showerror(error); 
            }
        );
}

function OpenPartnerOppForm(formcontext, entityname, ss_partnerid) {
    var entityFormOptions = {};
    entityFormOptions["entityName"] = entityname;
    entityFormOptions["entityId"] = ss_partnerid;
    // Open the form.
    Xrm.Navigation.openForm(entityFormOptions).then(
        function (success) {
            console.log(success);
        },
        function (error) {
            showerror(error);
        }
    );
}

function showerror(error) {
    var alertStrings = {
        confirmButtonLabel: "Yes",
        text: error.message,
        title: "Error",
    };
    var alertOptions = {
        height: 120,
        width: 260,
    };
    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
}