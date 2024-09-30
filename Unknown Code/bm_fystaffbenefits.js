var bm_finalsalaryforfy = "";
// Set name of the main form record to "Staff Benefits - Year" format.
function setName(executionContext) {
    var context = executionContext.getFormContext();
    context.data.entity.addOnSave(successCallbackMainForm);
}

function successCallbackMainForm(executionContext) {
    var context = executionContext.getFormContext();
    var formtype = context.ui.getFormType();
    var saveEvent = executionContext.getEventArgs();
    var EDITMODE = 2;
    // Check if the form is in edit mode
    if (formtype === EDITMODE || formtype === "2") {
        return;
    }
    try {
        var date = context.getAttribute("bm_fystartdateofstaff").getValue();
        var year = new Date(date).getFullYear().toString();
        var name = "Staff Benefits - " + year;
        var urlencodedname = name.replace(/\s/g, '%20');
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/bm_staffbenefits?$select=bm_name,bm_staffbenefitid&$filter=bm_name eq '" + urlencodedname + "'", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var results = JSON.parse(this.response);
                    for (var i = 0; i < results.value.length; i++) {
                        var bm_name = results.value[i]["bm_name"];
                        var bm_staffbenefitid = results.value[i]["bm_staffbenefitid"];
                        var recordUrl = "https://org9ed408a4.crm.dynamics.com/main.aspx?appid=4c49b7ba-ecdf-ec11-bb3d-000d3a8c2dc0&pagetype=entityrecord&etn=bm_staffbenefit&id=" + bm_staffbenefitid + "&" + bm_name;
                        if (bm_name === name) {
                            // Prevent save operation
                            openExistingRecord(executionContext, recordUrl);
                            saveEvent.preventDefault();
                        }
                    }
                } else {
                    showerror(this.statusText);
                }
            }
        };
        req.send();
        context.getAttribute("bm_name").setValue(name);
    } catch (error) {
        showerror(error.message);
    }
}

var incentive = "";
var previous403b = "";

function setFullnameofEmployeeStaffBenefit(executionContext) {
    var context = executionContext.getFormContext();
    context.data.entity.addOnSave(successCallback);
}

// Set name of Staff Benefits (detail entity) record name to the "Employee-Year" format.
function successCallback(executionContext) {
    var context = executionContext.getFormContext();
    var formtype = context.ui.getFormType();
    var saveEvent = executionContext.getEventArgs();
    // Check if the form is in edit mode

    //irf: even if form is in edit mood, user can update the employee, using below code, user is not able to update as code return the user

    // if(formtype === 2 || formtype === "2") {
    //     return;
    // }
    try {
        var bm_fystartdateofstaff = context.getAttribute("bm_fydate").getValue();
        var year = new Date(bm_fystartdateofstaff).getFullYear().toString();
        console.log(year);
        var employee = context.getAttribute("bm_employee").getValue();
        if (employee === null || employee === "") {
            clearAllFieldsIfEmployeeNull(context);
            return;
        }
        var name = employee[0].name + "-" + year;

        // Replacing white spaces with %20 to encode a valid URL
        var urlencodedname = name.replace(/\s/g, '%20');
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/bm_fystaffbenefitses?$select=bm_fystaffbenefitsid,bm_name&$filter=bm_name eq '" + urlencodedname + "'", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var results = JSON.parse(this.response);
                    for (var i = 0; i < results.value.length; i++) {
                        var bm_name = results.value[i]["bm_name"];
                        var bm_fystaffbenefitsid = results.value[i]["bm_fystaffbenefitsid"];
                        var recordUrl = "https://org9ed408a4.crm.dynamics.com/main.aspx?appid=4c49b7ba-ecdf-ec11-bb3d-000d3a8c2dc0&pagetype=entityrecord&etn=bm_fystaffbenefits&id=" + bm_fystaffbenefitsid + "&" + name;
                        if (bm_name === name) {
                            // Prevent the save operation
                            openExistingRecord(executionContext, recordUrl);
                            saveEvent.preventDefault();
                            return;
                        }

                    }
                    //if there is not any matching name then set the name
                    if (results.value.length === 0) {
                        context.getAttribute("bm_name").setValue(name);
                    }
                } else {
                    showerror(this.statusText);
                }
            }
        };
        req.send();
    } catch (error) {
        showerror(error.message);
    }
}

function openExistingRecord(executionContext, recordUrl) {
    var context = executionContext.getFormContext();
    var entityid = Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");
    // var recordURL = GetEntityRecordUrl(executionContext, false, true, employeeid);
    // Replacing white spaces with %20 to encode a valid URL
    // var urlencodedname = name.replace(/\s/g, '%20');
    var recordURL = recordUrl;
    var dialogParameters = {
        pageType: "webresource",//required 
        webresourceName: "bm_openexistingrecord",//Html Webresource that will be shown
        data: recordURL //optional
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

// Get base salary from the employee lookup and calculate the fields.
// Function is called on Employee change event.
function getEmployeeBaseSalary(executionContext) {
    var context = executionContext.getFormContext();

    try {
        var employee = context.getAttribute('bm_employee').getValue();
        if (employee === null || employee === "") {
            clearAllFieldsIfEmployeeNull(context);
            return;
        }
        var guid = employee[0].id.replace("{", "").replace("}", "");
        getIncentive(guid);
        Xrm.WebApi.online.retrieveMultipleRecords("bm_basepayincrease", "?$select=bm_finalsalaryforfy&$filter=_bm_employee_value eq " + guid + "").then(
            function success(results) {
                for (var i = 0; i < results.entities.length; i++) {
                     bm_finalsalaryforfy = results.entities[i]["bm_finalsalaryforfy"];
                    // bm_basesalary = result["bm_basesalary"];
                    context.getAttribute('bm_fyannualbasesalary').setValue(bm_finalsalaryforfy);
                    context.getAttribute('bm_incentive').setValue(incentive);
                    var _403b = "";
                    var bm_inlieupayment = "";
                    var inlieueligiblesalary = "";
                    var bm_457beligible = context.getAttribute("bm_457beligible").getValue();
                    if (incentive + bm_finalsalaryforfy <= 142800) {
                        var _403b = (incentive + bm_finalsalaryforfy) * (9.3 / 100);
                    } else if (incentive + bm_finalsalaryforfy <= 290000) {
                        _403b = ((incentive + bm_finalsalaryforfy - 142800) * (15 / 100)) + (142800 * (9.3 / 100));
                    } else {
                        _403b = (142800 * (9.3 / 100)) + ((290000 - 142800) * (15 / 100));
                    }
                    if (incentive + bm_finalsalaryforfy < 290000) {
                        inlieueligiblesalary = 0;
                    } else if (bm_457beligible) {
                       //if user is eligible for bm_457beligible then enable in-lieu payment if salary > 441666
                        if(bm_finalsalaryforfy > 441666 ){
                            inlieueligiblesalary = incentive + bm_finalsalaryforfy - 420000;
                            bm_inlieupayment = (inlieueligiblesalary * (15 / 100)) / (65 / 100);
                            context.getAttribute("bm_inlieupayment").setValue(bm_inlieupayment);
                            context.getAttribute("bm_inlieueligiblesalary").setValue(inlieueligiblesalary);
                        }
                    } else {
                        inlieueligiblesalary = incentive + bm_finalsalaryforfy - 290000;
                        //irf: salary in axcess of $305,000 will be eligible for in-Lieu Payments 
                        if (bm_finalsalaryforfy > 305000) {
                            bm_inlieupayment = (inlieueligiblesalary * (15 / 100)) / (65 / 100);
                            context.getAttribute("bm_inlieupayment").setValue(bm_inlieupayment);
                            context.getAttribute("bm_inlieueligiblesalary").setValue(inlieueligiblesalary);
                        }
                    }
                    context.getAttribute("bm_403b").setValue(_403b);
                    previous403b = _403b;
                    runOnPreSave(context);
                }
            },
            function (error) {
                showerror(error.message);
            }
        );
    } catch (error) {
        showerror(error.message);
    }
}

// Get incentive from the incentive detail entity and set the incentive field on the quick create form.
function getIncentive(guid) {
    try {
        Xrm.WebApi.online.retrieveMultipleRecords("bm_incentivedetail", "?$select=bm_finalawardroundedup&$filter=_bm_employee_value eq " + guid + "").then(
            function success(results) {
                for (var i = 0; i < results.entities.length; i++) {
                    var bm_finalawardroundedup = results.entities[i]["bm_finalawardroundedup"];
                    incentive = bm_finalawardroundedup;
                }
            },
            function (error) {
                showerror(error.message);
            }
        );
    } catch (error) {
        showerror(error.message);
    }
}

// To be run before saving the record.
function runOnPreSave(context) {
    context.data.entity.addOnSave(calculateTotalComp);
}

// Called on onSave of record.
function calculateTotalComp(executionContext) {
    var context = executionContext.getFormContext();
    //irf: if form type will be 2 then auto save the employee    
    var formtype = context.ui.getFormType();
    var edit = 2;
    try {
        if (context.getAttribute("bm_457beligible").getValue()) {
            var total_comp = context.getAttribute("bm_medical").getValue() + context.getAttribute("bm_dental").getValue() + context.getAttribute("bm_vision").getValue() +
                context.getAttribute("bm_std").getValue() + context.getAttribute("bm_ltd").getValue() + context.getAttribute("bm_life").getValue() +
                context.getAttribute("bm_add").getValue() + context.getAttribute("bm_telemed").getValue() + context.getAttribute("bm_idtheft").getValue() +
                context.getAttribute("bm_mdwaiver").getValue() + context.getAttribute("bm_403b").getValue() + 19500 + context.getAttribute("bm_inlieupayment").getValue() +
                context.getAttribute("bm_incentive").getValue() + context.getAttribute("bm_fyannualbasesalary").getValue() + context.getAttribute("bm_datacellphoneallowance").getValue();
            context.getAttribute("bm_totalcomp").setValue(total_comp);
            //irf: do not save when formtype create
            // if(formtype === edit || formtype === "2"){
            //     context.data.save();
            // }
            return;
        } else {
            var total_comp = context.getAttribute("bm_medical").getValue() + context.getAttribute("bm_dental").getValue() + context.getAttribute("bm_vision").getValue() +
                context.getAttribute("bm_std").getValue() + context.getAttribute("bm_ltd").getValue() + context.getAttribute("bm_life").getValue() +
                context.getAttribute("bm_add").getValue() + context.getAttribute("bm_telemed").getValue() + context.getAttribute("bm_idtheft").getValue() +
                context.getAttribute("bm_mdwaiver").getValue() + context.getAttribute("bm_403b").getValue() + context.getAttribute("bm_inlieupayment").getValue() +
                context.getAttribute("bm_incentive").getValue() + context.getAttribute("bm_fyannualbasesalary").getValue() + context.getAttribute("bm_datacellphoneallowance").getValue();
            context.getAttribute("bm_totalcomp").setValue(total_comp);
            //irf: do not save when formtype create
            // if(formtype === edit || formtype === "2"){
            //     context.data.save();
            // }
            return;
        }
    } catch (error) {
        showerror(error.message);
    }
}
//Irf: bm_457bplan on change'
function OnChange457bPlan(executionContext) {
    var context = executionContext.getFormContext();
    //not updating this field into total compensation yet
    context.data.save();
}
//Irf: dataCellPhoneAllowence on change'
function dataCellPhoneAllowenceChange(executionContext) {
    var context = executionContext.getFormContext();
    calculateTotalComp(executionContext);
}
// Called on change event of Taxes field.
function taxesOnChange(executionContext) {
    var context = executionContext.getFormContext();
    re403b(context);
    try {
        var taxes = context.getAttribute("bm_taxes").getValue();
        var _403b = context.getAttribute("bm_403b").getValue();
        if (_403b === null)
            return;
        if (taxes === 1 || taxes === "1") {
            _403b = previous403b + previous403b * 45 / 100;
        } else if (taxes === 2 || taxes === "2") {
            _403b = previous403b + previous403b * 42 / 100;
        } else if (taxes === 3 || taxes === "3") {
            _403b = previous403b + previous403b * 35 / 100;
        }
        context.getAttribute("bm_403b").setValue(_403b);
    } catch (error) {
        showerror(error.message);
    }
}

function re403b(context) {
    var _403b = "";
    var bm_inlieupayment = "";
    var inlieueligiblesalary = "";
    var bm_457beligible = context.getAttribute("bm_457beligible").getValue();
    var bm_finalsalaryforfy = context.getAttribute("bm_fyannualbasesalary").getValue();
    var incentive = context.getAttribute("bm_incentive").getValue();
    if (incentive + bm_finalsalaryforfy <= 142800) {
        var _403b = (incentive + bm_finalsalaryforfy) * (9.3 / 100);
    } else if (incentive + bm_finalsalaryforfy <= 290000) {
        _403b = ((incentive + bm_finalsalaryforfy - 142800) * (15 / 100)) + (142800 * (9.3 / 100));
    } else {
        _403b = (142800 * (9.3 / 100)) + ((290000 - 142800) * (15 / 100));
    }
    if (incentive + bm_finalsalaryforfy < 290000) {
        inlieueligiblesalary = 0;
    } else if (bm_457beligible) {
        inlieueligiblesalary = incentive + bm_finalsalaryforfy - 420000;
        //if user is eligible for bm_457beligible then enable in-lieu payment if salary > 441666
        if(bm_finalsalaryforfy > 441666 ){
            inlieueligiblesalary = incentive + bm_finalsalaryforfy - 420000;
            bm_inlieupayment = (inlieueligiblesalary * (15 / 100)) / (65 / 100);
            context.getAttribute("bm_inlieupayment").setValue(bm_inlieupayment);
            context.getAttribute("bm_inlieueligiblesalary").setValue(inlieueligiblesalary);
        }
    } else {
        inlieueligiblesalary = incentive + bm_finalsalaryforfy - 290000;
        //irf: salary in axcess of $305,000 will be eligible for in-Lieu Payments 
        if (bm_finalsalaryforfy > 305000) {
            bm_inlieupayment = (inlieueligiblesalary * (15 / 100)) / (65 / 100);
            context.getAttribute("bm_inlieupayment").setValue(bm_inlieupayment);
            context.getAttribute("bm_inlieueligiblesalary").setValue(inlieueligiblesalary);
        }
    }
    bm_inlieupayment = (inlieueligiblesalary * (15 / 100)) / (65 / 100);
    context.getAttribute("bm_inlieupayment").setValue(bm_inlieupayment);
    context.getAttribute("bm_inlieueligiblesalary").setValue(inlieueligiblesalary);
    context.getAttribute("bm_403b").setValue(_403b);
    previous403b = _403b;
}

// Clears all fields if employee field is null.
function clearAllFieldsIfEmployeeNull(context) {
    try {
        context.getAttribute("bm_medical").setValue(null);
        context.getAttribute("bm_dental").setValue(null);
        context.getAttribute("bm_vision").setValue(null);
        context.getAttribute("bm_std").setValue(null);
        context.getAttribute("bm_ltd").setValue(null);
        context.getAttribute("bm_life").setValue(null);
        context.getAttribute("bm_add").setValue(null);
        context.getAttribute("bm_telemed").setValue(null);
        context.getAttribute("bm_idtheft").setValue(null);
        context.getAttribute("bm_mdwaiver").setValue(null);
        context.getAttribute("bm_403b").setValue(null);
        context.getAttribute("bm_457bplan").setValue(null);
        context.getAttribute("bm_taxes").setValue(null);
        context.getAttribute("bm_datacellphoneallowance").setValue(null);
        context.getAttribute("bm_457beligible").setValue(null);
        context.getAttribute("bm_inlieupayment").setValue(null);
        context.getAttribute("bm_inlieueligiblesalary").setValue(null);
        context.getAttribute("bm_incentive").setValue(null);
        context.getAttribute("bm_fyannualbasesalary").setValue(null);
        context.getAttribute("bm_totalcomp").setValue(null);
    } catch (error) {
        showerror(error.message);
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
            } else if (attr.getName() === "bm_fydate") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_403b") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            }
            //irf: Make this field as editabel in subgrid
            // else if (attr.getName() === "bm_457bplan") {
            //     attr.controls.forEach(function (c) {
            //         c.setDisabled(true);
            //     })
            // }
            else if (attr.getName() === "bm_inlieupayment") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_inlieueligiblesalary") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_incentive") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_totalcomp") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            }
        });
    } catch (error) {
        showerror(error.message);
    }
}

// Called when any of the editable fields of the Staff Benefits subgrid gets changed.
function onRecordUpdate(executionContext) {
    var context = executionContext.getFormContext();
    // Get the selected row from the subgrid
    var selected = executionContext.getFormContext().data.entity;
    var Id = selected.getId();
    try {
        var bm_medical = selected.attributes.getByName("bm_medical").getValue();
        var bm_dental = selected.attributes.getByName("bm_dental").getValue();
        var bm_vision = selected.attributes.getByName("bm_vision").getValue();
        var bm_std = selected.attributes.getByName("bm_std").getValue();
        var bm_ltd = selected.attributes.getByName("bm_ltd").getValue();
        var bm_life = selected.attributes.getByName("bm_life").getValue();
        var bm_add = selected.attributes.getByName("bm_add").getValue();
        var bm_telemed = selected.attributes.getByName("bm_telemed").getValue();
        var bm_idtheft = selected.attributes.getByName("bm_idtheft").getValue();
        var bm_mdwaiver = selected.attributes.getByName("bm_mdwaiver").getValue();
        var bm_403b = selected.attributes.getByName("bm_403b").getValue();
        var bm_457bplan = selected.attributes.getByName("bm_457bplan").getValue();
        var bm_inlieupayment = selected.attributes.getByName("bm_inlieupayment").getValue();
        var bm_inlieueligiblesalary = selected.attributes.getByName("bm_inlieueligiblesalary").getValue();
        var bm_incentive = selected.attributes.getByName("bm_incentive").getValue();
        var bm_fyannualbasesalary = selected.attributes.getByName("bm_fyannualbasesalary").getValue();
        //irf: data cell phone dataCellPhoneAllowence
        var bm_datacellphoneallowance = selected.attributes.getByName("bm_datacellphoneallowance").getValue();

        if (selected.attributes.getByName("bm_457beligible").getValue()) {
            var sum = bm_medical + bm_dental + bm_vision + bm_std + bm_ltd + bm_life + bm_add + bm_telemed + bm_idtheft
                + bm_mdwaiver + bm_datacellphoneallowance + bm_403b + 19500 /*bm_457bplan value, hard coded as there was no formula for calculation*/ + bm_inlieupayment + bm_inlieueligiblesalary +
                bm_incentive + bm_fyannualbasesalary;
        } else {
            // Sum all the fields and set the sum to Total Comp field
            var sum = bm_medical + bm_dental + bm_vision + bm_std + bm_ltd + bm_life + bm_add + bm_telemed + bm_idtheft
                + bm_mdwaiver + bm_datacellphoneallowance + bm_403b + bm_inlieupayment + bm_inlieueligiblesalary + bm_incentive + bm_fyannualbasesalary;
        }
        selected.attributes.getByName("bm_totalcomp").setValue(sum);
        context.data.save();
        // context.getControl("FYStaffBenefits").refresh();
    } catch (error) {
        showerror(error.message);
    }
}

function setfieldstozeroOnload(executionContext) {
    var context = executionContext.getFormContext();
    try {
        context.getAttribute("bm_medical").setValue(0);
        context.getAttribute("bm_dental").setValue(0);
        context.getAttribute("bm_vision").setValue(0);
        context.getAttribute("bm_std").setValue(0);
        context.getAttribute("bm_ltd").setValue(0);
        context.getAttribute("bm_life").setValue(0);
        context.getAttribute("bm_add").setValue(0);
        context.getAttribute("bm_telemed").setValue(0);
        context.getAttribute("bm_idtheft").setValue(0);
        context.getAttribute("bm_mdwaiver").setValue(0);
        context.getAttribute("bm_403b").setValue(0);
        context.getAttribute("bm_457bplan").setValue(0);
        context.getAttribute("bm_datacellphoneallowance").setValue(0);
        context.getAttribute("bm_457beligible").setValue(null);
        context.getAttribute("bm_inlieupayment").setValue(0);
        context.getAttribute("bm_inlieueligiblesalary").setValue(0);
        context.getAttribute("bm_incentive").setValue(0);
        context.getAttribute("bm_fyannualbasesalary").setValue(null);
        context.getAttribute("bm_totalcomp").setValue(0);
    } catch (error) {
        showerror(error.message);
    }
}

// Utility function to display errors
function showerror(error) {
    var alertStrings = { confirmButtonLabel: "Ok", text: error, title: "Error" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
}