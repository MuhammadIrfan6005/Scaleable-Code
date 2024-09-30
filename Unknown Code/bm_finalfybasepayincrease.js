// Set the name of FY Incentive Calculation entity to "Incentive-(selected year)" format.
function setNameFinalBasePayIncrease(executionContext) {
    var context = executionContext.getFormContext();
    context.data.entity.addOnSave(SuccessCallBack);
}

// Called before saving the record after checking for the duplicate record, if found then prevent the save operation
function SuccessCallBack(executionContext) {
    var context = executionContext.getFormContext();
    var formtype = context.ui.getFormType();
    var saveEvent = executionContext.getEventArgs();
    // Check if the form is in edit mode
    if(formtype === 2 || formtype === "2") {
        return;
    }
    try {
        var saveEvent = executionContext.getEventArgs();
        //var employee = context.getAttribute("bm_employee").getValue();
        var year =  new Date(new Date().setFullYear(new Date(context.getAttribute("bm_fiscalyearstartdate").getValue()).getFullYear() + 1)).getFullYear();
        var fiscalyear = context.getAttribute("bm_fiscalyearstartdate").getValue();
        var day = new Date(fiscalyear).getDay();
        var month = new Date(fiscalyear).getMonth();
        var date = new Date(month + "/" + day + "/" + year);
        context.getAttribute("bm_fiscalyearstartdate").setValue(date);
        var name = "FY" +  "-" + year;
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/bm_finalfy22basepayincreases?$select=bm_finalfy22basepayincreaseid,bm_name&$filter=bm_name eq '" + name + "'", false);
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
                        var basepayincreaseid = results.value[i]["bm_finalfy22basepayincreaseid"];
                        if(bm_name === name) {
                            // Prevent the save operation
                            openExistingRecord(executionContext, name, basepayincreaseid);
                            saveEvent.preventDefault();
                            // showerror("Record already exists.");
                            return;
                        }
                    }
                } else {
                    showerror(this.statusText);
                }
            }
        };
        req.send();
        context.getAttribute("bm_name").setValue(name);
    } catch(error) {
        showerror(error.message);
    }
}

function openExistingRecord(executionContext, name, basepayincreaseid) {
    var context = executionContext.getFormContext();
    var entityid = Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");
    // var recordURL = GetEntityRecordUrl(executionContext, false, true, employeeid);
    // Replacing white spaces with %20 to encode a valid URL
    var urlencodedname = name.replace(/\s/g, '%20');
    var recordURL = 
    "https://org9ed408a4.crm.dynamics.com/main.aspx?appid=4c49b7ba-ecdf-ec11-bb3d-000d3a8c2dc0&pagetype=entityrecord&etn=bm_finalfy22basepayincrease&id=" + basepayincreaseid + "&" + name;
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

function onload(executionContext) {
    var context = executionContext.getFormContext();
    var formtype = context.ui.getFormType();
    var saveEvent = executionContext.getEventArgs();
    if(formtype === 1 || formtype === "1") {
        context.getControl("bm_fiscalyearstartdate").setDisabled(false);
        return;
    }
    else if(formtype === 2 || formtype === "2") {
        context.getControl("bm_fiscalyearstartdate").setDisabled(true);
        return;
    }
}

// Set editable subgrid specific columns to read only.
function setSubgridColumnsReadOnly(executionContext) {
    var context = executionContext.getFormContext();    
    try {
        context.getData().getEntity().attributes.forEach(function (attr) {
            if (attr.getName() === "bm_fyannualbasesalary") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_name") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_employee") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_percentof50thpercentile") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_percentof625thpercentile") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_25thpercentile") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_50thpercentile") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_62_5thpercentile") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_75thpercentile") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_dateoflastincrease") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_yearssincelastincrease") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_reasonforlastincrease") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_amountoflastincrease") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_percentchangeoflastincrease") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_finalsalaryforfy") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_percentchangeofincrease") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_percentofbenchmark50thpercentile") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_percentofbenchmark625thpercentile") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_retro") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            }
        });        
    } catch(error) {
        showerror(error.message);
    }
}

// Called on Discretionary Award change event.
function onDiscretionaryChange(executionContext) {
    var context = executionContext.getFormContext();
    // Get the selected row from the subgrid
    var selected = executionContext.getFormContext().data.entity;
    var bm_amountofincrese = selected.attributes.getByName("bm_amountofincrease").getValue();
    var _50thpc = selected.attributes.getByName("bm_50thpercentile").getValue();
    var _62_5thpc = selected.attributes.getByName("bm_62_5thpercentile").getValue();
    var Id = selected.getId();
    try {
        var bm_discretionaryaward = selected.attributes.getByName("bm_discretionaryaward").getValue();
        var bm_fyannualbasesalary = selected.attributes.getByName("bm_fyannualbasesalary").getValue();
        var bm_finalsalaryforfy = context.getAttribute("bm_finalsalaryforfy").getValue();
        // If Discretionary Award is null/0 then add FY Annual base salary to the amount of increase and set this sum to Final Salary for FY
        if(bm_discretionaryaward === null || bm_discretionaryaward === "" || bm_discretionaryaward === 0 || bm_discretionaryaward === 0.0) {
            selected.attributes.getByName("bm_finalsalaryforfy").setValue(bm_fyannualbasesalary + selected.attributes.getByName("bm_amountofincrease").getValue());
            return;
        }
        // If Discretionary Award is nonzero then add Discretionary Award to FY Annual base salary and set this sum to Final Salary for FY
        var bm_percentofbenchmark50thpercentile = bm_finalsalaryforfy / _50thpc * 100;
        var bm_percentofbenchmark625thpercentile = bm_finalsalaryforfy / _62_5thpc * 100;
        
        selected.attributes.getByName("bm_percentofbenchmark50thpercentile").setValue(bm_percentofbenchmark50thpercentile);
        selected.attributes.getByName("bm_percentofbenchmark625thpercentile").setValue(bm_percentofbenchmark625thpercentile);
        selected.attributes.getByName("bm_finalsalaryforfy").setValue(bm_fyannualbasesalary + bm_discretionaryaward);
        bm_finalsalaryforfy = context.getAttribute("bm_finalsalaryforfy").getValue();
        var bm_percentchangeofincrease = bm_discretionaryaward / (bm_finalsalaryforfy - bm_discretionaryaward) * 100;
        selected.attributes.getByName("bm_percentchangeofincrease").setValue(bm_percentchangeofincrease);
        selected.attributes.getByName("bm_retro").setValue(((selected.attributes.getByName("bm_finalsalaryforfy").getValue() / 24) - (bm_fyannualbasesalary/ 24)) * 3);
        context.data.save();
        // context.Page.getControl("finalyearbasepay").refresh();
    } catch(error) {
        showerror(error.message);
    }
}

// Called on Amount of Increase change event.
function onAmountofIncreaseChange(executionContext) {
    var context = executionContext.getFormContext();
    // Get the selected row from the subgrid
    var selected = executionContext.getFormContext().data.entity;
    var amountofincrese = selected.attributes.getByName("bm_amountofincrease").getValue();
    var _50thpc = selected.attributes.getByName("bm_50thpercentile").getValue();
    var _62_5thpc = selected.attributes.getByName("bm_62_5thpercentile").getValue();
    var Id = selected.getId();
    try {
        var bm_amountofincrease = selected.attributes.getByName("bm_amountofincrease").getValue();
        var bm_fyannualbasesalary = selected.attributes.getByName("bm_fyannualbasesalary").getValue();
        // If Amount of increase is null/0 then add Discretionary Award to FY Annual base salary and set this sum to Final Salary for FY
        if(bm_amountofincrease === null || bm_amountofincrease === "" || bm_amountofincrease === 0 || bm_amountofincrease === 0.0) {
            selected.attributes.getByName("bm_finalsalaryforfy").setValue(bm_fyannualbasesalary + selected.attributes.getByName("bm_discretionaryaward").getValue());
            return;
        }
        // If Amount of increase is nonzero then add Amount of increase to FY Annual base salary and set this sum to Final Salary for FY
        selected.attributes.getByName("bm_finalsalaryforfy").setValue(bm_fyannualbasesalary + bm_amountofincrease);
        // var basesalary = selected.attributes.getByName("bm_fyannualbasesalary").getValue();
        selected.attributes.getByName("bm_finalsalaryforfy").setValue(bm_fyannualbasesalary + bm_amountofincrease);
        var bm_finalsalaryforfy = selected.attributes.getByName("bm_finalsalaryforfy").getValue();
        selected.attributes.getByName("bm_percentchangeofincrease").setValue((bm_amountofincrease / bm_fyannualbasesalary) * 100);
        context.getAttribute("bm_finalsalaryforfy").setValue(bm_amountofincrease + bm_finalsalaryforfy);
        var bm_percentofbenchmark50thpercentile = bm_finalsalaryforfy / _50thpc * 100;
        var bm_percentofbenchmark625thpercentile = bm_finalsalaryforfy / _62_5thpc * 100;
        // var bm_percentchangeofincrease = bm_amountofincrease / (bm_finalsalaryforfy - bm_amountofincrease);
        selected.attributes.getByName("bm_percentofbenchmark50thpercentile").setValue(bm_percentofbenchmark50thpercentile);
        selected.attributes.getByName("bm_percentofbenchmark625thpercentile").setValue(bm_percentofbenchmark625thpercentile);
        selected.attributes.getByName("bm_retro").setValue(((bm_amountofincrease + bm_finalsalaryforfy) / 24 - (bm_finalsalaryforfy / 24)) * 3);
        context.data.save();
        // context.Page.getControl("finalyearbasepay").refresh();
    } catch(error) {
        showerror(error.message);
    }
}

function onNotesCommentsChange(executionContext) {
    var context = executionContext.getFormContext();
    context.data.save();
}

// Utility function to display errors
function showerror(error) {
    var alertStrings = { confirmButtonLabel: "Ok", text: error, title: "Error" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
}