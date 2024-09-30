var prev_salary = "";

// Called on form onload to change the name of the section fysalary
function basePayIncreaseOnload(executionContext) {
    var context = executionContext.getFormContext();
    try {
        // context.getControl("fysalary").setLabel("FY Salary 2023");
        // var tabObj = context.ui.tabs.get("general");
        // var sectionObj = tabObj.sections.get("fysalary");
        // var  bm_name= context.getAttribute("bm_name").getValue();
        // //irf: getting the basepayincrese name to set name into fy-salary section of form
        // if(bm_name !== null){
        //     var extendeddate = new Date(new Date().setFullYear(new Date(context.getAttribute("bm_name").getValue()).getFullYear() + 1)).getFullYear();
        //     console.log("extendeddate" + extendeddate);
        //     //sectionObj.setLabel(extendeddate);
        // }

    } catch (error) {
        showerror(error.message);
    }
}
//variable for identifing that form is dirty, when form type is 2. 
var locatedirty = "";
// Get Market Assessment from Employee
function getMarketAssessmentFromEmployee(executionContext) {
    var context = executionContext.getFormContext();
    try {
        var basesalary = "";
        var employeeid = "";
        if (context.getAttribute('bm_employee').getValue() === null || context.getAttribute('bm_employee').getValue() === "") {
            showerror("Please select Employee to proceed.");
            clearAllFields(context);
            return;
        }
        var employee = context.getAttribute('bm_employee').getValue()[0].id;
        guid = employee.replace("{", "").replace("}", "");
        var fetchData = {
            "bm_employee": guid
        };
        var fetchXml = [
            "<fetch>",
            "  <entity name='bm_marketassesmenttype'>",
            "    <attribute name='bm_employee'/>",
            "    <attribute name='bm_basesalary'/>",
            "    <filter type='and'>",
            "      <condition attribute='bm_employee' operator='eq' value='", fetchData.bm_employee, "'/>",
            "    </filter>",
            "  </entity>",
            "</fetch>"
        ].join("");
        console.log(fetchXml);
        fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
        Xrm.WebApi.online.retrieveMultipleRecords("bm_marketassesmenttype", fetchXml).then(
            function success(results) {
                var bm_basesalary = results.entities[0]["bm_basesalary"];
                context.getAttribute("bm_fyannualbasesalary").setValue(bm_basesalary);
                getMarketAssessment(context, bm_basesalary, employeeid);
            },
            function (error) {
                showerror(error.message);
            }
        );
    } catch (error) {
        showerror(error.message);
    }
    // var fetchData = {
    //     "bm_employeeid": guid
    //   };
    //   var fetchXml = [
    //   "<fetch>",
    //   "  <entity name='bm_employee'>",
    //   "    <attribute name='bm_employeeid'/>",
    //   "    <attribute name='bm_basesalary'/>",
    //   "    <filter type='and'>",
    //   "      <condition attribute='bm_employeeid' operator='eq' value='", fetchData.bm_employeeid, "'/>",
    //   "    </filter>",
    //   "  </entity>",
    //   "</fetch>"
    //   ].join("");
    // fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
    // Xrm.WebApi.online.retrieveMultipleRecords("bm_employee", fetchXml).then(
    //     function success(result) {
    //         for (var i = 0; i < result.entities.length; i++) {
    //             basesalary = result.entities[i].bm_basesalary;
    //             employeeid = result.entities[i].bm_employeeid;
    //             context.getAttribute("bm_fyannualbasesalary").setValue(basesalary);
    //         }
    //         getMarketAssessment(context, basesalary, employeeid);
    //     },
    //     function(error) {
    //         showerror(error.message);
    //     }
    // );
}

function getMarketAssessment(executionContext) {
    //irf: making this empty so that employee name could be set into "onsave" event in setNameBasePayIncrease function
    locatedirty = "";
    var context = executionContext.getFormContext();
    try {
        if (context.getAttribute('bm_employee').getValue() === null || context.getAttribute('bm_employee').getValue() === "") {
            showerror("Please select Employee to proceed.");
            clearAllFields(context);
            return;
        }

        var employee = context.getAttribute('bm_employee').getValue()[0].id;
        guid = employee.replace("{", "").replace("}", "");
        var fetchData = {
            "bm_employee": guid
        };
        var fetchXml = [
            "<fetch>",
            "  <entity name='bm_marketassesmenttype'>",
            "    <attribute name='bm_employee'/>",
            "    <attribute name='bm_25thile'/>",
            "    <attribute name='bm_75thile'/>",
            "    <attribute name='bm_62_5thile'/>",
            "    <attribute name='bm_basesalary'/>",
            "    <attribute name='bm_50thile'/>",
            "    <filter type='and'>",
            //   "      <condition attribute='bm_basesalary' operator='eq' value='", fetchData.bm_basesalary, "'/>",
            "      <condition attribute='bm_employee' operator='eq' value='", fetchData.bm_employee, "'/>",
            "    </filter>",
            "  </entity>",
            "</fetch>"
        ].join("");
        fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
        Xrm.WebApi.online.retrieveMultipleRecords("bm_marketassesmenttype", fetchXml).then(
            function success(result) {
                for (var i = 0; i < result.entities.length; i++) {
                    var bm_25thile = result.entities[i].bm_25thile;
                    var bm_50thile = result.entities[i].bm_50thile;
                    var bm_62_5thile = result.entities[i].bm_62_5thile;
                    var bm_75thile = result.entities[i].bm_75thile;
                    var bm_bsalary = result.entities[i].bm_basesalary;
                    context.getAttribute("bm_fyannualbasesalary").setValue(bm_bsalary);
                    context.getAttribute("bm_25thpercentile").setValue(bm_25thile);
                    context.getAttribute("bm_50thpercentile").setValue(bm_50thile);
                    context.getAttribute("bm_62_5thpercentile").setValue(bm_62_5thile);
                    context.getAttribute("bm_75thpercentile").setValue(bm_75thile);
                    // Calcualte percentiles of the selected employee and set percentile fields
                    percentileCalculations(context, guid, bm_bsalary, bm_50thile, bm_62_5thile);
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
//Check if form isdirty
function CheckFormIsDirty(executionContext) {
    var context = executionContext.getFormContext();
    var isdirty = Xrm.Page.data.entity.getDataXml();
    if (isdirty != null) {
        var bm_name = context.getAttribute("bm_name").getValue();
        //if user did not save the form earlier, after adding employee all of calculations populate, then user add data into editbale fields, as those are auto saving then basepayincrese name was not saving
        if (bm_name === null) {
            var employee = context.getAttribute("bm_employee").getValue();
            var year = new Date(new Date().setFullYear(new Date(context.getAttribute("bm_startdate").getValue()).getFullYear())).getFullYear();
            var basepayname = employee[0].name + "-" + year;
            context.getAttribute("bm_name").setValue(basepayname);
        }
        locatedirty = "form is dirty";
        //return when successfully save
        context.data.save().then(function () { return; });
    }
}

// Calculate 50th and 62.5th percentiles
function percentileCalculations(context, empid, basesalary, _50thPercentile, _62_5thPercentile) {
    var bm_finalsalaryforfy = "";
    var bm_amountofincrease = "";
    var bm_percentchangeofincrease = "";
    var bm_percentofbenchmark50thpercentile = "";
    var bm_percentofbenchmark625thpercentile = "";
    var bm_percentchangeoflastincrease = "";
    var bm_percentof50thpercentile = "";
    var bm_percentof625thpercentile = "";
    try {
        if (_50thPercentile > basesalary) {
            context.getAttribute("bm_finalsalaryforfy").setValue(_50thPercentile);
            bm_finalsalaryforfy = _50thPercentile;
            prev_salary = bm_finalsalaryforfy;
        } else {
            bm_finalsalaryforfy = basesalary * (1 + (5 / 100));
            bm_finalsalaryforfy = Math.round(bm_finalsalaryforfy / 100) * 100;
            prev_salary = bm_finalsalaryforfy;
            context.getAttribute("bm_finalsalaryforfy").setValue(bm_finalsalaryforfy);
        }
        // Calculate fields
        bm_amountofincrease = bm_finalsalaryforfy - basesalary;
        bm_percentchangeofincrease = (bm_amountofincrease / basesalary) * 100;
        bm_percentof50thpercentile = Math.round(basesalary / _50thPercentile * 100);
        bm_percentof625thpercentile = Math.round(basesalary / _62_5thPercentile * 100);
        bm_percentofbenchmark50thpercentile = bm_finalsalaryforfy / _50thPercentile * 100;
        bm_percentofbenchmark625thpercentile = bm_finalsalaryforfy / _62_5thPercentile * 100;
        var bm_amountoflastincrease = context.getAttribute("bm_amountoflastincrease").getValue();
        bm_percentchangeoflastincrease = bm_amountoflastincrease / (basesalary - bm_amountofincrease) * 100;
        // Set fields
        context.getAttribute("bm_percentof50thpercentile").setValue(bm_percentof50thpercentile);
        context.getAttribute("bm_percentof625thpercentile").setValue(bm_percentof625thpercentile);
        context.getAttribute("bm_amountofincrease").setValue(bm_amountofincrease);
        context.getAttribute("bm_percentchangeofincrease").setValue(bm_percentchangeofincrease);
        context.getAttribute("bm_percentchangeoflastincrease").setValue(bm_percentchangeoflastincrease);
        context.getAttribute("bm_percentofbenchmark50thpercentile").setValue(bm_percentofbenchmark50thpercentile);
        context.getAttribute("bm_percentofbenchmark625thpercentile").setValue(bm_percentofbenchmark625thpercentile);
        context.getAttribute("bm_percentchangeoflastincrease").setValue(bm_percentchangeoflastincrease);
        var bm_retro = ((bm_finalsalaryforfy / 24) - (basesalary / 24)) * 3;
        context.getAttribute("bm_retro").setValue(bm_retro);
        // Get salary history of the selected employee
        getSalaryHistory(context, empid);
    } catch (error) {
        showerror(error.message);
    }
}

// Called on record create of Final FY Base Pay Incentive
function createSalaryHistoryFromFinalBasePayIncentive(executionContext) {
    var context = executionContext.getFormContext();
    context.data.entity.addOnPostSave(createRecordSalaryHistory);
}

// Create salary history record.
function createRecordSalaryHistory(executionContext) {
    try {
        var context = executionContext.getFormContext();
        var employee = context.getAttribute("bm_employee").getValue();
        var salaryhistoryname = new Date().getFullYear() + "-" + employee[0].name;
        var employeeid = context.getAttribute("bm_employee").getValue()[0].id.replace("{", "").replace("}", "");
        // var bm_fystartdate = context.getAttribute("bm_startdate").getValue();
        var salary = context.getAttribute("bm_fyannualbasesalary").getValue();
        var bm_amountofincrease = context.getAttribute("bm_amountofincrease").getValue();
        var bm_reasonforincrease = context.getAttribute("bm_reasonforincrease").getValue();
        context.getAttribute("bm_percentchangeofincrease").setValue(bm_amountofincrease / (salary - bm_amountofincrease));
        var bm_percentchangeofincrease = context.getAttribute("bm_percentchangeofincrease").getValue();
        var finalsalary = context.getAttribute("bm_finalsalaryforfy").getValue();
        var basepayid = context.data.entity.getId();
        var dateoflastincrease = context.getAttribute("bm_dateofincrease").getValue();
        var bm_yearssincelastincrease = context.getAttribute("bm_yearssincelastincrease").getValue();
        if (dateoflastincrease === null || dateoflastincrease === "")

            //irf: remove this error message as now date of increse is business recomended field  

            //  showerror("Please select date of increase first.");
            // !== null ? context.getAttribute("bm_dateofincrease").getValue() : new Date().toISOString().slice(0,10); 

            var newEntityId = "";
        var entity = {};
        entity["bm_employee@odata.bind"] = "/bm_employees(" + employeeid + ")";
        //entity["bm_basepayincrease@odata.bind"] = "/bm_basepayincreases()";
        entity["bm_basepay@odata.bind"] = "/bm_basepayincreases(" + basepayid.replace("{", "").replace("}", "") + ")";
        entity.bm_name = salaryhistoryname;
        entity.bm_amountoflastincrease = bm_amountofincrease;
        entity.bm_dateoflastincrease = new Date(dateoflastincrease).toISOString().slice(0, 10);
        entity.bm_percentchangeoflastincrease = bm_percentchangeofincrease;
        entity.bm_reasonforlastincrease = bm_reasonforincrease;
        entity.bm_yearssincelastincrease = bm_yearssincelastincrease;
        // entity.bm_yearssincelastincrease = yearsSinceLastIncrease(bm_fystartdate, new Date());
        Xrm.WebApi.online.createRecord("bm_salaryhistory", entity).then(
            function success(result) {
                newEntityId = result.id;
                UpdateSalaryHistoryLookup(newEntityId, basepayid);
                updateEmployeeSalary(employeeid, finalsalary);
            },
            function (error) {
                showerror(error.message);
            }
        );
    } catch (error) {
        showerror(error.message);
    }
}

function updateEmployeeSalary(empid, finalSalary) {
    try {
        var entity = {};
        entity.bm_basesalary = finalSalary;
        Xrm.WebApi.online.updateRecord("bm_employee", empid, entity).then(
            function success(result) {
                var updatedEntityId = result.id;
            },
            function (error) {
                showerror(error.message);
            }
        );
    } catch (error) {
        showerror(error.message);
    }
}

// Get salary history of the selected employee
function getSalaryHistory(context, empid) {
    try {
        Xrm.WebApi.online.retrieveMultipleRecords("bm_salaryhistory", "?$select=bm_amountoflastincrease,bm_dateoflastincrease,_bm_employee_value,bm_name,bm_percentchangeoflastincrease,bm_reasonforlastincrease&$filter=_bm_employee_value eq " + empid + "&$orderby=createdon desc&$top=1").then(
            function success(results) {
                for (var i = 0; i < results.entities.length; i++) {
                    var bm_amountoflastincrease = results.entities[i]["bm_amountoflastincrease"];
                    var bm_dateoflastincrease = results.entities[i]["bm_dateoflastincrease"];
                    var bm_percentchangeoflastincrease = results.entities[i]["bm_percentchangeoflastincrease"];
                    var bm_reasonforlastincrease = results.entities[i]["bm_reasonforlastincrease"];
                    var bm_yearssincelastincrease = results.entities[i]["bm_yearssincelastincrease"];
                    context.getAttribute("bm_dateoflastincrease").setValue(new Date(bm_dateoflastincrease));
                    context.getAttribute("bm_yearssincelastincrease").setValue(bm_yearssincelastincrease);
                    context.getAttribute("bm_reasonforlastincrease").setValue(bm_reasonforlastincrease);
                    context.getAttribute("bm_amountoflastincrease").setValue(bm_amountoflastincrease);
                    context.getAttribute("bm_percentchangeoflastincrease").setValue(bm_percentchangeoflastincrease);
                    var dateofincrease = context.getAttribute("bm_dateofincrease").getValue();
                    if (dateofincrease === null || dateofincrease === "") {
                        // showinfo("Please select date of increase.");
                    }
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

// Called on change event of date of increase.
function dateofincreaseOnchange(executionContext) {
    try {
        var context = executionContext.getFormContext();
        var dateofincrease = context.getAttribute("bm_dateofincrease").getValue();
        if (dateofincrease === null || dateofincrease === "") {
            return;
        }
        var bm_dateoflastincrease = context.getAttribute("bm_dateoflastincrease").getValue();
        var yearsSinceLastIncrease = diff_years(new Date(dateofincrease), new Date(bm_dateoflastincrease));
        context.getAttribute("bm_yearssincelastincrease").setValue(yearsSinceLastIncrease);
    } catch (error) {
        showerror(error.message);
    }
}

// Called on change event of discretionary award
function discretionaryawardOnChange(executionContext) {
    var context = executionContext.getFormContext();
    var _50thpc = context.getAttribute("bm_50thpercentile").getValue();
    var _62_5thpc = context.getAttribute("bm_62_5thpercentile").getValue();
    var bm_percentofbenchmark50thpercentile = "";
    var bm_percentofbenchmark625thpercentile = "";
    var bm_percentchangeofincrease = "";
    var bm_amountofincrease = context.getAttribute("bm_amountofincrease").getValue();
    try {
        var bm_discretionaryaward = context.getAttribute("bm_discretionaryaward").getValue();
        var bm_finalsalaryforfy = context.getAttribute("bm_finalsalaryforfy").getValue();
        var bm_fyannualbasesalary = context.getAttribute("bm_fyannualbasesalary").getValue();
        if (bm_discretionaryaward === null || bm_discretionaryaward === "" || bm_discretionaryaward === 0 || bm_discretionaryaward === 0.0) {
            context.getAttribute("bm_finalsalaryforfy").setValue(bm_fyannualbasesalary + context.getAttribute("bm_amountofincrease").getValue());
            var bm_finalsalaryforfy = context.getAttribute("bm_finalsalaryforfy").getValue();
            bm_percentchangeofincrease = bm_amountofincrease / bm_fyannualbasesalary * 100;
            bm_percentofbenchmark50thpercentile = bm_finalsalaryforfy / _50thpc * 100;
            bm_percentofbenchmark625thpercentile = bm_finalsalaryforfy / _62_5thpc * 100;
            context.getAttribute("bm_percentchangeofincrease").setValue(bm_percentchangeofincrease);
            context.getAttribute("bm_percentofbenchmark50thpercentile").setValue(bm_percentofbenchmark50thpercentile);
            context.getAttribute("bm_percentofbenchmark625thpercentile").setValue(bm_percentofbenchmark625thpercentile);
            return;
        }
        context.getAttribute("bm_finalsalaryforfy").setValue(bm_fyannualbasesalary + bm_discretionaryaward);
        bm_percentofbenchmark50thpercentile = bm_finalsalaryforfy / _50thpc * 100;
        bm_percentofbenchmark625thpercentile = bm_finalsalaryforfy / _62_5thpc * 100;
        bm_fyannualbasesalary = context.getAttribute("bm_finalsalaryforfy").getValue();
        bm_percentchangeofincrease = (bm_amountofincrease + bm_discretionaryaward) / bm_fyannualbasesalary * 100;
        context.getAttribute("bm_percentofbenchmark50thpercentile").setValue(bm_percentofbenchmark50thpercentile);
        context.getAttribute("bm_percentofbenchmark625thpercentile").setValue(bm_percentofbenchmark625thpercentile);
        context.getAttribute("bm_percentchangeofincrease").setValue(bm_percentchangeofincrease);

        //irf: for auto save the discretionary changes as well if "base pay increse" name not set then set it 
        CheckFormIsDirty(executionContext);

        //irf: Need to calculate the discretionary award even if form is in edi mood
        // var formtype = context.ui.getFormType();
        // var edit = 2;
        // if (formtype === edit || formtype === 2) {
        //     return;
        // }
    } catch (error) {
        showerror(error.message);
    }
}

// Calculate the years difference between date of increase and date of last increase
function diff_years(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60 * 24);
    return Math.abs(Math.round(diff / 365.25));
}

// Set name of the Base Pay Increase to the "Employee-Year" format
function setNameBasePayIncrease(executionContext) {
    var context = executionContext.getFormContext();
    context.data.entity.addOnSave(successCallback);
}

function successCallback(executionContext) {
    var context = executionContext.getFormContext();
    var formtype = context.ui.getFormType();
    var saveEvent = executionContext.getEventArgs();
    //comment below code, because in "Base pay increse" edit mood from subgrid, on employee change, emplyee name not set into subgrid 

    // Check if the form is in edit mode
    // if(formtype === 2 || formtype === "2") {
    //     return;
    // }
    try {
        if (context.getAttribute('bm_employee').getValue() === null || context.getAttribute('bm_employee').getValue() === "") {
            clearAllFields(context);
            return;
        }
        //irf: return when auto save field are chanegd, CheckFormIsDirty function is call, onsave function was calling automatically, 
        if (locatedirty !== "") {
            return;
        }

        var employee = context.getAttribute("bm_employee").getValue();
        var year = new Date(new Date().setFullYear(new Date(context.getAttribute("bm_startdate").getValue()).getFullYear())).getFullYear();
        var basepayname = employee[0].name + "-" + year;
        // Replacing white spaces with %20 to encode a valid URL
        var urlencodedname = basepayname.replace(/\s/g, '%20');
        var dumyurl = Xrm.Page.context.getClientUrl() + "/api/data/v9.1/bm_basepayincreases?$select=bm_basepayincreaseid,bm_name&$filter=bm_name eq '" + urlencodedname + "'";
        console.log(dumyurl);
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/bm_basepayincreases?$select=bm_basepayincreaseid,bm_name&$filter=bm_name eq '" + urlencodedname + "'", false);
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
                        var basepayid = results.value[i]["bm_basepayincreaseid"];
                        if (bm_name === basepayname) {
                            // Prevent the save operation
                            openExistingRecord(executionContext, basepayname, basepayid);
                            saveEvent.preventDefault();
                        }
                    }
                } else {
                    showerror("Malformed URL");
                }
            }
        };
        req.send();
        var  bm_name = context.getAttribute("bm_name").setValue(basepayname);

        //irf: getting the basepayincrese name to set name into fy-salary section of form
        var tabObj = context.ui.tabs.get("general");
        var sectionObj = tabObj.sections.get("fysalary");
        if(bm_name !== null){
            var extendeddate = new Date(new Date().setFullYear(new Date(context.getAttribute("bm_name").getValue()).getFullYear() + 1)).getFullYear();
            console.log("extendeddate" + extendeddate);
            sectionObj.setLabel("FY Salary " + extendeddate);
        }
    } catch (error) {
        showerror(error.message);
    }
}

function openExistingRecord(executionContext, basepayname, basepayid) {
    var context = executionContext.getFormContext();
    var urlencodedname = basepayname.replace(/\s/g, '%20');
    var recordURL =
        "https://org9ed408a4.crm.dynamics.com/main.aspx?appid=4c49b7ba-ecdf-ec11-bb3d-000d3a8c2dc0&pagetype=entityrecord&etn=bm_basepayincrease&id=" + basepayid + "&" + basepayname;
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
        // function (returnValue) {
        //     //returnValue is blank when "Cancel" button is clicked 
        //     if (!returnValue) {
        //         return;
        //     }
        //     //Add your processing logic here   
        //     // context.data.refresh(false); 
        // },
        // function (e) {
        //     //put your error handler here 
        // }
        function success() {
            // Run code on success
            console.log("inside success")
            window.close();
            window.location.reload();
        },
        function error() {
            // Handle errors
            console.log("inside error")

        }
    );
}

// Calculates years difference between FY Start Date and Date of last increase.
function yearsSinceLastIncrease(fystartdate, dateoflastincrease) {
    try {
        var months = Math.max((new Date(fystartdate).getFullYear() - dateoflastincrease.getFullYear()) * 12 +
            new Date(fystartdate).getMonth() - dateoflastincrease.getMonth(), 0);
        var years = (months / 12 | 0) + "." + months % 12;
        return parseFloat(years);
    } catch (error) {
        showerror(error.message);
    }
}

// Update the salary history lookup in base pay increase
function UpdateSalaryHistoryLookup(recordid, basepayid) {
    try {
        var entity = {};
        entity["bm_salaryhistory@odata.bind"] = "/bm_salaryhistories(" + recordid.replace("{", "").replace("}", "") + ")";
        Xrm.WebApi.online.updateRecord("bm_basepayincrease", basepayid.replace("{", "").replace("}", ""), entity).then(
            function success(result) {
                var updatedEntityId = result.id;
            },
            function (error) {
                showerror(error.message);
            }
        );
    } catch (error) {
        showerror(error.message);
    }
}

// Change final salary if amount of increase is empty
function ChangeFinalSalaryIfAmountOfIncreaseIsEmpty(executionContext) {
    var context = executionContext.getFormContext();
    try {
        var amountofincrese = context.getAttribute("bm_amountofincrease").getValue();
        var _50thpc = context.getAttribute("bm_50thpercentile").getValue();
        var _62_5thpc = context.getAttribute("bm_62_5thpercentile").getValue();
        var bm_percentofbenchmark50thpercentile = "";
        var bm_percentofbenchmark625thpercentile = "";
        var bm_percentchangeoflastincrease = "";
        if (amountofincrese === null || amountofincrese === undefined || amountofincrese === "0" || amountofincrese === 0.00 || amountofincrese === 0) {
            var basesalary = context.getAttribute("bm_fyannualbasesalary").getValue();
            context.getAttribute("bm_finalsalaryforfy").setValue(basesalary);
        } else {
            var basesalary = context.getAttribute("bm_fyannualbasesalary").getValue();
            context.getAttribute("bm_finalsalaryforfy").setValue(basesalary + amountofincrese);
            var bm_finalsalaryforfy = context.getAttribute("bm_finalsalaryforfy").getValue();
            context.getAttribute("bm_percentchangeofincrease").setValue((amountofincrese / bm_finalsalaryforfy) * 100);
            context.getAttribute("bm_finalsalaryforfy").setValue(amountofincrese + bm_finalsalaryforfy);
            bm_percentofbenchmark50thpercentile = bm_finalsalaryforfy / _50thpc * 100;
            bm_percentofbenchmark625thpercentile = bm_finalsalaryforfy / _62_5thpc * 100;
            bm_percentchangeoflastincrease = amountofincrese / (bm_finalsalaryforfy - amountofincrese);
            // context.getAttribute("bm_amountofincrease").setValue();
            context.getAttribute("bm_percentofbenchmark50thpercentile").setValue(bm_percentofbenchmark50thpercentile);
            context.getAttribute("bm_percentofbenchmark625thpercentile").setValue(bm_percentofbenchmark625thpercentile);
            context.getAttribute("bm_retro").setValue(((amountofincrese + bm_finalsalaryforfy / 24) - (bm_finalsalaryforfy / 24)) * 3);
            context.getAttribute("bm_percentchangeoflastincrease").setValue(bm_percentchangeoflastincrease);
        }

        // var _50thpc = context.getAttribute("bm_50thpercentile").getValue();
        // var _62_5thpc = context.getAttribute("bm_62_5thpercentile").getValue();
        // var bm_percentofbenchmark50thpercentile = "";
        // var bm_percentofbenchmark625thpercentile = "";
        // var bm_percentchangeoflastincrease = "";
        // var bm_amountofincrease = context.getAttribute("bm_amountofincrease").getValue();
    } catch (error) {
        showerror(error.message);
    }
}

// Clears all fields if employee field is null.bm_dateoflastincrease
function clearAllFields(context) {
    try {
        context.getAttribute("bm_name").setValue(null);
        context.getAttribute("bm_fyannualbasesalary").setValue(null);
        context.getAttribute("bm_25thpercentile").setValue(null);
        context.getAttribute("bm_50thpercentile").setValue(null);
        context.getAttribute("bm_62_5thpercentile").setValue(null);
        context.getAttribute("bm_75thpercentile").setValue(null);
        context.getAttribute("bm_dateoflastincrease").setValue(null);
        context.getAttribute("bm_dateofincrease").setValue(null);
        context.getAttribute("bm_yearssincelastincrease").setValue(null);
        context.getAttribute("bm_reasonforlastincrease").setValue(null);
        context.getAttribute("bm_amountoflastincrease").setValue(null);
        context.getAttribute("bm_percentchangeoflastincrease").setValue(null);
        context.getAttribute("bm_finalsalaryforfy").setValue(null);
        context.getAttribute("bm_amountofincrease").setValue(null);
        context.getAttribute("bm_notescomments").setValue(null);
        context.getAttribute("bm_percentchangeofincrease").setValue(null);
        context.getAttribute("bm_percentofbenchmark50thpercentile").setValue(null);
        context.getAttribute("bm_percentofbenchmark625thpercentile").setValue(null);
        context.getAttribute("bm_discretionaryaward").setValue(null);
        context.getAttribute("bm_retro").setValue(null);
        context.getAttribute("bm_percentof50thpercentile").setValue(null);
        context.getAttribute("bm_percentof625thpercentile").setValue(null);
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

// Utility function to display info messages
function showinfo(error) {
    var alertStrings = { confirmButtonLabel: "Ok", text: error, title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
}