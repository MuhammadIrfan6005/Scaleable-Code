function setNameMarketAssessment(executionContext) {
    var context = executionContext.getFormContext();
    context.data.entity.addOnSave(successCallBack);
}

// Set Market Assessment name after checking for any duplicate record, if duplicate record exists then prevent the save operation and the notify the user.
function successCallBack(executionContext) {
    try{
        var context = executionContext.getFormContext();
        var saveEvent = executionContext.getEventArgs();
        var formtype = context.ui.getFormType();
        //irf: if user want to update market assesment period, this should be uncommented to update market assesment name

        // if(formtype === 2 || formtype === "2") {
        //     return;
        // }
        var effectivefrom = context.getAttribute("bm_effectivefrom").getValue();
        var effectiveto = context.getAttribute("bm_effectiveto").getValue();
        var partialUrl = "filter=bm_name eq '";
        var MAname = "";
        try {
            if((effectivefrom === null || effectivefrom === "") &&  (effectiveto === null || effectiveto === "")) {
                return;
            }
            if(effectivefrom !== null && effectiveto !== null) {
                MAname = "MA-" + new Date(effectivefrom).getFullYear() + "-" + new Date(effectiveto).getFullYear();
                partialUrl = "filter=bm_name eq '" + MAname + "'";
            }
            if(effectiveto === null) {
                MAname = "MA-" + new Date(effectivefrom).getFullYear();
                partialUrl = "filter=bm_effectiveto eq null";
            }
            context.getAttribute("bm_name").setValue(MAname);
        } catch(error) {
            showerror(error.message);
        }
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/bm_marketassessmentses?$select=bm_marketassessmentsid,bm_name&$" + partialUrl, false);
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
                    //if length > 0 then execute if part else retrun
                    for (var i = 0; i < results.value.length; i++) {
                        var bm_name = results.value[i]["bm_name"];
                        var bm_marketassessmentsid = results.value[i]["bm_marketassessmentsid"];
                        if(bm_name === MAname || effectiveto === null) {
                            openExistingRecord(executionContext, MAname, bm_marketassessmentsid);
                            saveEvent.preventDefault();
                            return;
                        }
                    }
                } else {
                    showerror(this.statusText);
                }
            }
        };
        req.send();
        //irf: due to below code, page gives "saved prompt" even after page content saved already.
        //context.data.refresh(false);
    } catch(error) {
        showerror(error.message);
    }
}

function openExistingRecord(executionContext, marketassesmentname, bm_marketassessmentsid) {
    var context = executionContext.getFormContext();
    var entityid = Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");
    // Replacing white spaces with %20 to encode a valid URL
    // var urlencodedname = name.replace(/\s/g, '%20');
    var recordURL = "https://org9ed408a4.crm.dynamics.com/main.aspx?appid=4c49b7ba-ecdf-ec11-bb3d-000d3a8c2dc0&pagetype=entityrecord&etn=bm_marketassessments&id=" + bm_marketassessmentsid + "&" + marketassesmentname;
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

// Utility function to display errors
function showerror(error) {
    var alertStrings = { confirmButtonLabel: "Ok", text: error, title: "Error" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
}