var opportunityid = "";
var approvalid = "";
var modifiedbyid = "";
var officialcontractpartner = "";
var accountid = "";
var accountidname = "";
var modifiedbyidname = "";

function checkentity(executionContext) {
    var formContext = executionContext.getFormContext();
    var entityname = formContext.data.entity.getEntityName();
    if(entityname === "ss_irsaleschecklist") {
        checkcomplianceprojectcharter(formContext)
    }
    else {
        checkprorate(formContext)
    }
}
function checkcomplianceprojectcharter(formContext) {
    var value = formContext.getAttribute("ss_compliaceprojectcharter").getValue();
    if(value) {
        showconfirmationdialogue(formContext)
    }
}
function checkprorate(formContext) {
    //var formContext = executionContext.getFormContext();
    var prorate = formContext.getAttribute("ss_projectcharter").getValue();
    if (prorate) {
        showconfirmationdialogue(formContext);
    }
}
function showconfirmationdialogue(formContext) {
    var confirmStrings = { text: "Would you like to create Jira Epic?", title: "Confirmation Dialog" };
    var confirmOptions = { height: 200, width: 450 };
    Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
        function (success) {
            if (success.confirmed)
                GetApprovalData(formContext);
            else
                console.log("Dialog closed using Cancel button or X.");
        });
}
function GetApprovalData(formContext) {
    var opportunity = formContext.getAttribute("ss_relatedopportunity").getValue();
    var modifiedby = formContext.getAttribute("modifiedby").getValue();
    var account = formContext.getAttribute("ss_opportunityaccount").getValue();
    if(opportunity !== null && modifiedby !== null && account !== null) {
        opportunityid = opportunity[0].id;
        modifiedbyid = modifiedby[0].id;
        accountid = account[0].id;
        approvalid = formContext.data.entity.getId();
        accountidname = account[0].name;
        modifiedbyidname = modifiedby[0].name;
        GetOfficialContratPartner(formContext, opportunityid, modifiedbyid, accountid, approvalid, accountidname, modifiedbyidname);
    }
}
function GetOfficialContratPartner(formContext, opportunityid, modifiedbyid, accountid, approvalid, accountidname, modifiedbyidname) {
    Xrm.WebApi.online.retrieveRecord("opportunity", opportunityid, "?$select=ss_officialcontractpartner").then(
        function success(result) {
            var ss_officialcontractpartner = result["ss_officialcontractpartner"];
            CallFlowToCreateJiraEpic(formContext, opportunityid, modifiedbyid, accountid, approvalid, ss_officialcontractpartner, accountidname, modifiedbyidname);
        },
        function(error) {
            Xrm.Utility.alertDialog(error.message);
        }
    );
}
function CallFlowToCreateJiraEpic(formContext, opportunityid, modifiedbyid, accountid, approvalid, ss_officialcontractpartner, accountidname, modifiedbyidname) {
    var flowurl = "https://prod-118.westeurope.logic.azure.com:443/workflows/0255f5a262ed47599b059aefc779eaf0/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=atQuy0qfBCO8Kg3JKyLr9XqII_Q5_sZD4zUfA9EhNKQ";
    var input = JSON.stringify({
        "OpportunityId" : opportunityid.replace("{","").replace("}",""),
        "ModifiedBy" : modifiedbyid.replace("{","").replace("}",""),
        "OfficialContractPartner" : ss_officialcontractpartner,
        "AccountId" : accountid.replace("{","").replace("}",""),
        "ApprovalId" : approvalid.replace("{","").replace("}",""),
        "ModifiedByUsername" : modifiedbyidname,
        "AccountName" : accountidname
    });
    var req = new XMLHttpRequest();
    req.open("PUT", flowurl, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(input);
}