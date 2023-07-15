// Set the name of Incentives by Level and Performance (incentive rating) record to the "Emp. Level - BMP Org Score - Emp. Score" format
function setNameofIncentiveRating(executionContext) {
    var context = executionContext.getFormContext();
    context.data.entity.addOnSave(successCallBack);
}

// Called on save operation and check if any record with this name exists, if so then prevent the save operation
function successCallBack(executionContext) {
    var context = executionContext.getFormContext();
    var formtype = context.ui.getFormType();
    var saveEvent = executionContext.getEventArgs();
    var EDITMODE = 2;
    // Check if the form is in edit mode
    if(formtype === EDITMODE || formtype === "2") {
        return;
    }
    try {
        var level = context.getAttribute("bm_employeelevel").getText();
        var bmpscore = context.getAttribute("bm_bmpscore").getText();
        var empscore = context.getAttribute("bm_empscore").getText();
        if (level != null && level != "" && bmpscore != null && bmpscore != "" && empscore != null && empscore != "") {
            var name = "Emp. " + level + " - " + "BMP Org Score " + bmpscore + " - " + "Emp. Score " + empscore;
            context.getAttribute("bm_name").setValue(name);
            // Replacing white spaces with %20 to encode a valid URL
            var urlencodedname = name.replace(/\s/g, '%20');
            var req = new XMLHttpRequest();
            req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/bm_employeeincentiveratings?$select=bm_name&$filter=bm_name eq '" + urlencodedname + "'", false);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            req.onreadystatechange = function() {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                        var results = JSON.parse(this.response);
                        for (var i = 0; i < results.value.length; i++) {
                            var bm_name = results.value[i]["bm_name"];
                            var bm_employeeincentiveratingid = results.value[i]["bm_employeeincentiveratingid"];
                            if(bm_name === name) {
                                // Prevent the save operation
                                saveEvent.preventDefault();
                                openExistingRecord(executionContext, name, bm_employeeincentiveratingid);
                                return;
                            }
                        }
                        context.getAttribute("bm_name").setValue(name);
                    } else {
                        showerror(this.statusText);
                    }
                }
            };
            req.send();
        }
    } catch {
        showerror(error.message);
    }
}

function openExistingRecord(executionContext, name, bm_employeeincentiveratingid) {
    var context = executionContext.getFormContext();
    var entityid = Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");    
    // Replacing white spaces with %20 to encode a valid URL
    var urlencodedname = name.replace(/\s/g, '%20');
    var recordURL = 
    "https://org9ed408a4.crm.dynamics.com/main.aspx?appid=4c49b7ba-ecdf-ec11-bb3d-000d3a8c2dc0&pagetype=entityrecord&etn=bm_employeeincentiverating&id=" + bm_employeeincentiveratingid + "&" + name;
    var dialogParameters = {
        pageType: "webresource",//required 
        webresourceName: "bm_openexistingrecord",//Html Webresource that will be shown
        data:recordURL //optional
    };
    var navigationOptions = {
        target: 2,//use 1 if you want to open page inline or 2 to open it as dialog 
        width: 400,
        height: 250,
        position: 1,//1 to locate dialog in center and 2 to locate it on the side,
        title: "Duplicate record"
    };
    Xrm.Navigation.navigateTo(dialogParameters, navigationOptions).then(
    function (returnValue) {
        //returnValue is blank when "Cancel" button is clicked 
        if (!returnValue) {
            return;
        }
        //Add your processing logic here   
        // context.data.refresh(false); 
    },
    function (e) {
        //put your error handler here 
    });
}

function showerror(error) {
    var alertStrings = { confirmButtonLabel: "Ok", text: error, title: "Error" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);

}