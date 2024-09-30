// Set full name of employee by concatenating first name and last name
function setFullnameofEmployee(executionContext) {
    var context = executionContext.getFormContext();
    context.data.entity.addOnSave(successCallback);
}

function successCallback(executionContext) {
    var context = executionContext.getFormContext();
    var formtype = context.ui.getFormType();
    var saveEvent = executionContext.getEventArgs();
    var EDITMODE = 2;
    // Check if the form is in edit mode
    if(formtype === EDITMODE || formtype === "2") {
        return;
    }
    try {
        if(context.getAttribute("bm_firstname") === null || context.getAttribute("bm_lastname") === null)
            return;
        var fname = context.getAttribute("bm_firstname").getValue();
        var lname = context.getAttribute("bm_lastname").getValue();
        var fullname = "";
        if(fname != null && lname != null && fname != "" && lname != "") {
            fullname = fname + " " + lname;
        }
        // Replacing white spaces with %20 to encode a valid URL
        var urlencodedname = fullname.replace(/\s/g, '%20');
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/bm_employees?$select=bm_employeeid,bm_name&$filter=bm_name eq '" + urlencodedname + "'", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Prefer", "odata.include-annotations=\"*\", odata.maxpagesize=1");
        req.onreadystatechange = function() {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var results = JSON.parse(this.response);
                    for (var i = 0; i < results.value.length; i++) {
                        var bm_name = results.value[0]["bm_name"];
                        var bm_employeeid = results.value[0]["bm_employeeid"];
                        if(bm_name === fullname) {
                            // Prevent the save operation
                            openExistingRecord(executionContext, fullname, bm_employeeid);
                            saveEvent.preventDefault();
                            break;
                        }
                    }
                    // If not found in Employee then set name of Employee
                    context.getAttribute("bm_name").setValue(fullname);
                } else {
                    showerror(this.statusText);
                }
            }
        };
        req.send();
    } catch(error) {
        showerror(error.message);
    }
}

function openExistingRecord(executionContext, fullname, bm_employeeid) {
    var context = executionContext.getFormContext();
    var entityid = Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");    
    // Replacing white spaces with %20 to encode a valid URL
    var urlencodedname = fullname.replace(/\s/g, '%20');
    var recordURL = 
    "https://org9ed408a4.crm.dynamics.com/main.aspx?appid=4c49b7ba-ecdf-ec11-bb3d-000d3a8c2dc0&newWindow=true&pagetype=entityrecord&etn=bm_employee&id=" + bm_employeeid + "&" + fullname;
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

function setManager(executionContext) {
    var context = executionContext.getFormContext();
    var manager = context.getAttribute("bm_managercoach").getValue();
    // var lookupValue = new Array();
    // lookupValue[0] = new Object();
    // lookupValue[0].id = guid;
    // lookupValue[0].name = "new name";
    // lookupValue[0].entityType = "account";
    // context.getAttribute('sp_primarycontact').setValue(lookupValue);
}

// Utility function to display errors
function showerror(error) {
    var urlParams = getUrlParameters();
    let uri = "https://org9ed408a4.crm.dynamics.com/main.aspx?appid=4c49b7ba-ecdf-ec11-bb3d-000d3a8c2dc0&newWindow=true&pagetype=entityrecord&etn=bm_employee&id=ceeee1ed-8827-ed11-9db1-00224823d877";
    let encoded = encodeURIComponent(uri);
    let decoded = decodeURIComponent(encoded);
    var linkrecord = "<a target='_blank' href="+ decoded +">Record Link</a>";
    var alertStrings = { confirmButtonLabel: "Ok", text: "Record for this employee-name-here already exists.</br> Please click the link to view existing record:"+ linkrecord +" ", title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
}

function getUrlParameters() {
    var queryString = location.search.substring(1);
    var paramsvalue = encodeURI(queryString).split("=")[1];
    return decodeURIComponent(decodeURIComponent(paramsvalue));
}