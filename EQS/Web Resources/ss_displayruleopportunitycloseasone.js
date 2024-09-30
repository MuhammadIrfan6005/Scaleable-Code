//var contractsCount = -1;
function hasAnyContract(OppID, primaryControl) {
    window.parent.Xrm.WebApi.retrieveMultipleRecords("annotation", "?$select=subject&$filter=_objectid_value eq " + OppID + " and notetext eq '{{Contract--'").then(
        function success(result) {
            contractsCount = result.entities.length;
            primaryControl.ui.refreshRibbon();
        },
        function (error) {
            // console.error("Some error occured while retreiving contracts. Here is it's detail");
            console.log("Error from Display Rule WR => "+error);
        }
    );
}
function CheckNotes(primaryControl) {
    console.log("ribbon");
    //var formContext = primaryControl.getFormContext();
    var formContext = primaryControl;
    debugger; //-
    var OppID = formContext.data.entity.getId();
    console.log("Opportunity ID is => " + OppID);
    var formLable = formContext.ui.formSelector.getCurrentItem().getLabel();
    console.log("Form Lable is => " + formLable);
    OppID = OppID.replace("{", "").replace("}", "");
    if (formLable === "IR - DE") {
        var value = false;
        var stepname = "";
        if(formContext.getAttribute('stepname'))
        {
            stepname = formContext.getAttribute('stepname').getValue();
        }
        // if (contractsCount === -1) {
        //     hasAnyContract(OppID, primaryControl);
        // }
        // else {
        //     value = ((contractsCount <= 0 || stepname !== "4-Close") ? false : true);
        // }
        var contractsCount = hasAnyContract1(OppID, primaryControl);
        console.log("after");
        //return (contractsCount <= 0 || stepname !== "4-Close") ? false : true;
        return false;
    }
    else
        return true;
}
function hasAnyContract1(OppID, primaryControl) {
    window.parent.Xrm.WebApi.retrieveMultipleRecords("annotation", "?$select=subject&$filter=_objectid_value eq " + OppID + " and notetext eq '{{Contract--'").then(
        function success(result) {
            console.log("success");
            //return = result.entities.length;
            return true;
            //primaryControl.ui.refreshRibbon();
        },
        function (error) {
            // console.error("Some error occured while retreiving contracts. Here is it's detail");
            console.log("Error from Display Rule WR => "+error);
            return false;
        }
    );
}
