var contractsCount = -1;
function hasAnyContract(OppID, primaryControl, formLable) {
    window.parent.Xrm.WebApi.retrieveMultipleRecords("annotation", "?$select=subject&$filter=_objectid_value eq " + OppID + " and notetext eq '{{Contract--'").then(
        function success(result) {
            contractsCount = result.entities.length;
            // if(formLable !=="XML - DE" && formLable !=="IR - DE" && contractsCount > 0)
            // {
            //     primaryControl.ui.refreshRibbon();
            //     return true;
            // }
            // else
            // {
            //     //primaryControl.ui.refreshRibbon();
            //     return true;
            // }
            if(contractsCount > 0) {
                primaryControl.ui.refreshRibbon();
                return true;
            }
            else
            {
                return false;
            }

        },
        function (error) {
            console.log("Error from Display Rule WR => " + error);
        }
    );
}
function CheckNotes(primaryControl) {
    debugger;
    //var formContext = primaryControl.getFormContext();
    var formContext = primaryControl;
    var OppID = formContext.data.entity.getId();
    var formLable = formContext.ui.formSelector.getCurrentItem().getLabel();
    var formid = formContext.ui.formSelector.getCurrentItem().getId();
    OppID = OppID.replace("{", "").replace("}", "");
    if (formLable === "IR - DE" || formid === "2f01c9d2-d446-408c-846f-e08f729aeb9d") {
        var value = false;
        var stepname = "";
        if (formContext.getAttribute('stepname')) {
            stepname = formContext.getAttribute('stepname').getValue();
        }
        if (contractsCount === -1) {
            hasAnyContract(OppID, primaryControl);
        }
        else {
            value = ((contractsCount <= 0 || stepname !== "4-Close") ? false : true);
        }

        return value;
    }
    else if (formLable !== "XML - DE") {
        var value = false;
        if (contractsCount === -1) {
            hasAnyContract(OppID, primaryControl);
        }
        else {
            value = ((contractsCount <= 0 || stepname !== "4-Close") ? false : true);
        }
        return value;
    }
    else {
        return false;
    }
}
