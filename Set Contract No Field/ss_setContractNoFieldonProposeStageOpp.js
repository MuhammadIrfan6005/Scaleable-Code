function setContractNoFieldonProposeStageOpp(executionContext) {
    var formcontext = executionContext.getFormContext();
    if (formcontext.data.process.getActiveStage()) {
        var name = formcontext.data.process.getActiveStage().getName();
        var ownerid = formcontext.getAttribute("ownerid").getValue()[0].id;
        if (name === "Propose") {
            GetUserBuniessUnit(formcontext, ownerid);
        }
        else if (name === "Close") {
            GetUserBuniessUnit(formcontext, ownerid);
        }
        else {
            console.log("BU stage not matched");
        }
        formcontext.data.process.addOnStageChange(stagechange);
    }
}
function stagechange(executionContext) {
    var formcontext = executionContext.getFormContext();
    var ownerid = formcontext.getAttribute("ownerid").getValue()[0].id;
    var stagename = formcontext.data.process.getSelectedStage()._stageStep.description;
    if (stagename === "Propose") {
        GetUserBuniessUnit(formcontext, ownerid);
    }
    else if (stagename === "Close") {
        GetUserBuniessUnit(formcontext, ownerid);
    }
    else {
        console.log("Stage Name is => " + stagename);
    }
}
function GetUserBuniessUnit(formcontext, userId) {
    parent.Xrm.WebApi.online.retrieveRecord("systemuser", userId, "?$select=_businessunitid_value").then(
        function success(result) {
            var _businessunitid_value = result["_businessunitid_value"];
            var BUSname = result["_businessunitid_value@OData.Community.Display.V1.FormattedValue"];
            var _businessunitid_value_lookuplogicalname = result["_businessunitid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
            GetContractNumber(formcontext, BUSname);
        },
        function (error) {
            parent.Xrm.Utility.alertDialog(error.message);
        }
    );
}
function GetContractNumber(formcontext, busname) {
    var eqsgermany = "";
    var eqsswitzerland = "";
    var eqsfrance = "";
    var eqsuk = "";
    var eqsus = "";
    var fetchXml = [
        "<fetch>",
        "  <entity name='ss_navisionidmapping'>",
        "    <attribute name='ss_eqsswitzerlandcn' />",
        "    <attribute name='ss_eqsfrancecn' />",
        "    <attribute name='ss_eqsukcn' />",
        "    <attribute name='ss_eqsusacn' />",
        "    <attribute name='ss_eqsgermanycn' />",
        "  </entity>",
        "</fetch>",
    ].join("");
    fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
    window.parent.Xrm.WebApi.online.retrieveMultipleRecords("ss_navisionidmapping", fetchXml).then(
        function success(results) {
            console.log(results);
            if (results.entities.length > 0) {
                for (var i = 0; i < results.entities.length; i++) {
                    eqsgermany = results.entities[i]["ss_eqsgermanycn"];
                    eqsswitzerland = results.entities[i]["ss_eqsswitzerlandcn"];
                    eqsfrance = results.entities[i]["ss_eqsfrancecn"];
                    eqsuk = results.entities[i]["ss_eqsukcn"];
                    eqsus = results.entities[i]["ss_eqsusacn"];
                }
                if (busname === "EQS Switzerland") {
                    formcontext.getAttribute("ss_contractnumber").setValue(eqsswitzerland);
                }
                else if (busname === "EQS Germany") {
                    formcontext.getAttribute("ss_contractnumber").setValue(eqsgermany);
                }
                else if (busname === "EQS US") {
                    formcontext.getAttribute("ss_contractnumber").setValue(eqsus);
                }
                else if (busname === "EQS France") {
                    formcontext.getAttribute("ss_contractnumber").setValue(eqsfrance);
                }
                else if (busname === "EQS UK") {
                    formcontext.getAttribute("ss_contractnumber").setValue(eqsuk);
                }
                else {
                    console.log("BU not matched");
                }
            }
        }
    );
}
