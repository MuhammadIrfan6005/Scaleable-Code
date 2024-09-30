var marketassesmentname = "";
// Set the name of market assessment quick create record to the "Employee-effective from-effective to" format
function setMarketAssessmentQuickCreateName(executionContext) {
    try {
        var context = executionContext.getFormContext();
        var saveEvent = executionContext.getEventArgs();
        // var marketassesmentname = "";
        if(context.getAttribute('bm_employee').getValue() === null || context.getAttribute('bm_employee').getValue() === "") {
            clearAllFields(context);
            showerror("Please select Employee to proceed.");
            return;
        }
        var employee = context.getAttribute("bm_employee").getValue();
        if(context.getAttribute('bm_effectivefrom').getValue() === null) {
            clearAllFields(context);
            showerror("Please select Effective from date to proceed.");
            return;
        }
        var effectivefrom = context.getAttribute('bm_effectivefrom').getValue();
        if(context.getAttribute('bm_effectiveto').getValue() === null) {
            marketassesmentname = employee[0].name + "-" + new Date(effectivefrom).getFullYear();
            context.getAttribute("bm_name").setValue(marketassesmentname);
            clearAllFields(context);
            return;
        }
        var effectiveto = context.getAttribute('bm_effectiveto').getValue();
        marketassesmentname = employee[0].name + "-" + new Date(effectivefrom).getFullYear() + "-" + new Date(effectiveto).getFullYear();
        context.getAttribute("bm_name").setValue(marketassesmentname);
        var employeeid = employee[0].id.replace("{", "").replace("}", "");
        Xrm.WebApi.online.retrieveMultipleRecords("bm_employee", "?$select=bm_basesalary,bm_titles,bm_employelevel&$filter=bm_employeeid eq " + employeeid + "").then(
            function success(results) {
                for(var i = 0; i < results.entities.length; i++) {
                    var bm_basesalary = results.entities[i]["bm_basesalary"];
                    var bm_titles = results.entities[i]["bm_titles"];
                    var bm_employelevel = results.entities[i]["bm_employelevel"];
                    context.getAttribute("bm_basesalary").setValue(bm_basesalary);
                    context.getAttribute("bm_title").setValue(bm_titles);
                    context.getAttribute("bm_level").setValue(bm_employelevel);
                    getMarketAssessment(context, bm_basesalary, employeeid);
                }
            },
            function(error) {
                showerror(error.message);
            }
        );
    } catch(error) {
        showerror(error.message);
    }
}

// Get the market assessment of the selected employee
function getMarketAssessment(context, base_salary, empId) {
    try {
        var fetchData = {
            "bm_basesalary": base_salary,
            "bm_employee": empId
          };
          var fetchXml = [
          "<fetch>",
          "  <entity name='bm_marketassesmenttype'>",
          "    <attribute name='bm_employee'/>",
          "    <attribute name='bm_25thile'/>",
          "    <attribute name='bm_50thile'/>",
          "    <attribute name='bm_62_5thile'/>",
          "    <attribute name='bm_75thile'/>",
          "    <attribute name='bm_basesalary'/>",
          "    <attribute name='bm_25thpercentilecomp'/>",
          "    <attribute name='bm_50thpercentilecomp'/>",
          "    <attribute name='bm_62_5thpercentilecomp'/>",
          "    <attribute name='bm_75thpercentilecomp'/>",
          "    <filter type='and'>",
          "      <condition attribute='bm_basesalary' operator='eq' value='", fetchData.bm_basesalary, "'/>",
          "      <condition attribute='bm_employee' operator='eq' value='", fetchData.bm_employee, "'/>",
          "    </filter>",
          "  </entity>",
          "</fetch>"
          ].join("");
          fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
          Xrm.WebApi.online.retrieveMultipleRecords("bm_marketassesmenttype", fetchXml).then(
            function success(result) {
                for(var i = 0; i < result.entities.length; i++) {
                    var bm_25thile = result.entities[i].bm_25thile;
                    var bm_50thile = result.entities[i].bm_50thile;
                    var bm_62_5thile = result.entities[i].bm_62_5thile;
                    var bm_75thile = result.entities[i].bm_75thile;
                    var bm_25thpercentilecomp = result.entities[i].bm_25thpercentilecomp;
                    var bm_50thpercentilecomp = result.entities[i].bm_50thpercentilecomp;
                    var bm_62_5thpercentilecomp = result.entities[i].bm_62_5thpercentilecomp;
                    var bm_75thpercentilecomp = result.entities[i].bm_75thpercentilecomp;
                    // var bm_bsalary = result.entities[i].bm_basesalary;
                    // Set the percentile fields
                    context.getAttribute("bm_25thile").setValue(bm_25thile);
                    context.getAttribute("bm_50thile").setValue(bm_50thile);
                    context.getAttribute("bm_62_5thile").setValue(bm_62_5thile);
                    context.getAttribute("bm_75thile").setValue(bm_75thile);
                    context.getAttribute("bm_25thpercentilecomp").setValue(bm_25thpercentilecomp);
                    context.getAttribute("bm_50thpercentilecomp").setValue(bm_50thpercentilecomp);
                    context.getAttribute("bm_62_5thpercentilecomp").setValue(bm_62_5thpercentilecomp);
                    context.getAttribute("bm_75thpercentilecomp").setValue(bm_75thpercentilecomp);
                }
            },
            function(error) {
                showerror(error.message);
            }
        );
    } catch(error) {
        showerror(error.message);
    }
}

// Run before the save operation
function runOnPreSave(executionContext) {
    var context = executionContext.getFormContext();
    context.data.entity.addOnSave(checkDuplicateRecord);
}

// Set Market Assessment name after checking for any duplicate record, if duplicate record exists then prevent the save operation and the notify the user.
function checkDuplicateRecord(executionContext) {
    var context = executionContext.getFormContext();
    var saveEvent = executionContext.getEventArgs();
    try {
        // Replacing any white space in the market assessment name with %20 to encode it into a valid URL 
        var marketassesmenturlname = context.getAttribute("bm_name").getValue().replace(/\s/g, '%20');
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/bm_marketassesmenttypes?$select=bm_marketassesmenttypeid,bm_name&$filter=bm_name eq '"  + marketassesmenturlname   + "'", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
        req.onreadystatechange = function() {
            if(this.readyState === 4) {
                req.onreadystatechange = null;
                if(this.status === 200) {
                    var results = JSON.parse(this.response);
                    for(var i = 0; i < results.value.length; i++) {
                        var bm_name = results.value[i]["bm_name"];
                        var bm_marketassesmenttypeid = results.value[i]["bm_marketassesmenttypeid"];
                        if(bm_name === marketassesmentname) {
                            // Prevent the save operation
                            openExistingRecord(executionContext, bm_marketassesmenttypeid, bm_name);
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
    } catch(error) {
        showerror(error.message);
    }
}

function openExistingRecord(executionContext, bm_marketassessmentsid, bm_marketassesmentname) {
    var context = executionContext.getFormContext();
    var entityid = Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");
    // Replacing white spaces with %20 to encode a valid URL
    var urlencodedname = bm_marketassesmentname.replace(/\s/g, '%20');
    var recordURL = "https://org9ed408a4.crm.dynamics.com/main.aspx?appid=4c49b7ba-ecdf-ec11-bb3d-000d3a8c2dc0&pagetype=entityrecord&etn=bm_marketassesmenttype&id=" + bm_marketassessmentsid + "&" + urlencodedname;
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

// Clears all fields if employee field is null.
function clearAllFields(context) {
    try {
        context.getAttribute("bm_name").setValue(null);
        context.getAttribute("bm_basesalary").setValue(null);
        context.getAttribute("bm_title").setValue(null);
        context.getAttribute("bm_level").setValue(null);
        context.getAttribute("bm_25thile").setValue(null);
        context.getAttribute("bm_50thile").setValue(null);
        context.getAttribute("bm_62_5thile").setValue(null);
        context.getAttribute("bm_75thile").setValue(null);
        context.getAttribute("bm_25thpercentilecomp").setValue(null);
        context.getAttribute("bm_50thpercentilecomp").setValue(null);
        context.getAttribute("bm_62_5thpercentilecomp").setValue(null);
        context.getAttribute("bm_75thpercentilecomp").setValue(null);
    } catch(error) {
        showerror(error.message);
    }
}

// Utility function to display errors
function showerror(error) {
    var alertStrings = { confirmButtonLabel: "Ok", text: error, title: "Error" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
}