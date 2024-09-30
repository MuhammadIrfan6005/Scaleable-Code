function CheckSharepointField(executionContext) {
    var formContext = executionContext.getFormContext();
    var check = formContext.getAttribute("ss_sharepointaccountfolder").getValue();
    if(check) {
        showconfirmationdialogue(formContext);
    }
    //GetAccountData(formContext);
}
function showconfirmationdialogue(formContext) {
    var confirmStrings = { text: "Would you like to create Client Folder Security?", title: "Confirmation Dialog" };
    var confirmOptions = { height: 200, width: 450 };
    Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
        function (success) {
            if (success.confirmed)
            GetAccountData(formContext);
            else
            formContext.getAttribute("ss_sharepointaccountfolder").setValue(false);
                console.log("Dialog closed using Cancel button or X.");
        });
}
function GetAccountData(formContext) {
    var accountid = formContext.data.entity.getId().replace("{","").replace("}","");
    var fullname = formContext.getAttribute("name").getValue();
    var firstletterofname = fullname.substring(0,1);
    var navid = formContext.getAttribute("bbo_navid").getValue();
    CallFlowToCreateAccountFolers(formContext, accountid, fullname,firstletterofname,navid);
}
function  CallFlowToCreateAccountFolers(formContext, accountid, fullname,firstletterofname,navid) {
    var flowurl = "https://prod-24.westeurope.logic.azure.com:443/workflows/2cc5605e2b9c49eaa01462f291b2542b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=cBZsSi-tQXSz9CBB5JTceOiSi-jfZl5hT2ni1DA9sas";
    var input = JSON.stringify({
        "accountid" : accountid,
        "accountfullname" : fullname,
        "accountfirstletter":firstletterofname,
        "navid" : navid
    });
    var req = new XMLHttpRequest();
    req.open("PUT", flowurl, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(input);
}