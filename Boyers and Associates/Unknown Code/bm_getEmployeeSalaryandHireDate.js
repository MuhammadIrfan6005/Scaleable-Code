var bm_basesalary = "";
var fiscalyear = "";
var bm_organizationscore = "";
var bm_emplevel = "";
var empscore = "";
var bm_fiscalyearenddate = "";
var prorate = "";
var bm_hiredate = "";
var semifinalaward = "";
var incentiveaspercentageofsalary = "";
var discretionaryaward = "";
var finalawardroundedup = "";

// Get employee salary, level, and hire date from Employee entity, and set these values on the Quick Create form.
// Function is called on Employee lookup field change and when Employee score is selected.
function getEmployeeSalaryHireDate(executionContext) {
    var context = executionContext.getFormContext();
    try {
        var employee = context.getAttribute('bm_employee').getValue();
        if (employee === null || employee === "") {
            clearAllFieldsIfEmployeeNull(context)
            return;
        }
        var guid = employee[0].id.replace("{", "").replace("}", "");
        Xrm.WebApi.online.retrieveRecord("bm_employee", guid, "?$select=bm_basesalary,bm_employelevel,bm_employescore,bm_hiredate").then(
            function success(result) {
                bm_basesalary = result["bm_basesalary"];
                bm_hiredate = result["bm_hiredate"];
                bm_emplevel = result["bm_employelevel"];
                context.getAttribute('bm_basesalary').setValue(bm_basesalary);
                context.getAttribute('bm_hiredate').setValue(new Date(bm_hiredate));
                context.getAttribute('bm_employeelevel').setValue(bm_emplevel);
                var bm_empscore = context.getAttribute("bm_employeescore").getValue();
                var bmporgscore = context.getAttribute("bm_bmporgscore").getValue();
                GetEmployeeePercentage(bm_emplevel, bm_empscore, context);
            },
            function (error) {
                showerror(error.message);
            }
        );
    } catch (error) {
        showerror(error.message);
    }
}

//function to save bm_employeescore on bm_employeescore change and calculate percentage
function employeeScoreChange(executionContext){
    var context = executionContext.getFormContext();
    var bm_empscore = context.getAttribute("bm_employeescore").getValue();
    var bm_emplevel = context.getAttribute("bm_employeelevel").getValue();
    context.getAttribute('bm_employeescore').setValue(bm_empscore);
    GetEmployeeePercentage(bm_emplevel, bm_empscore, context);
}
//don't need to call delay function to get bmp_organizationscore as getting from local storage now


// function delay(executionContext) {
//     // ShowProgressIndicator();
//     setTimeout(() => {
//         var formContext = executionContext.getFormContext();
//         GetEmployeeFields(executionContext);
//     }, 800);
// }

// Get employee fields from the Quick Create form.
// function GetEmployeeFields(executionContext) {
//     var context = executionContext.getFormContext();
//     var formtype = context.ui.getFormType();
//     // var formLabel = context.formSelector.getCurrentItem().getLabel();
//     var CREATEMODE = 1;
//     var UPDATEMODE = 2;
//     var QUICKCREATEMODE = 5; /*Deprecated*/
//     try {
//         emplevel = context.getAttribute("bm_employeelevel").getValue();
//         empscore = context.getAttribute("bm_employeescore").getValue();
//         var bmporgscore = context.getAttribute("bm_bmporgscore").getValue();
//         if (emplevel !== null && empscore !== null && emplevel !== undefined && empscore !== undefined && emplevel !== "" && empscore !== "") {
//             // if(formLabel === "Incentive") 
//             // GetEmployeeePercentage(emplevel, empscore, bmporgscore, context);
//             // else
//             GetParentRecord(context, emplevel, empscore);
//         }
//     } catch (error) {
//         showerror(error.message);
//     }
// }

// Get the parent record of the Quick Create form to get the BMP Score field.
// function GetParentRecord(formContext, emplevel, empscore) {
//     try {
//         var parentRecordRef = Xrm.Utility.getPageContext().input.createFromEntity.id.replace("{", "").replace("}", "");
//         GetBMPScore(formContext, parentRecordRef, emplevel, empscore);
//     } catch (error) {
//         showerror(error.message);
//     }
// }

// Get BMP Organisation Score from the parent record.
// function GetBMPScore(formContext, parentRecordRef, emplevel, empscore) {
//     try {
//         Xrm.WebApi.online.retrieveRecord("bm_employeeincentivecalculation", parentRecordRef, "?$select=bm_organizationscore,bm_fiscalyearenddate").then(
//             function success(result) {
//                 bm_organizationscore = result["bm_organizationscore"];
//                 bm_fiscalyearenddate = result["bm_fiscalyearenddate"];
//                 GetEmployeeePercentage(emplevel, empscore, bm_organizationscore, formContext);
//             },
//             function (error) {
//                 showerror(error.message);
//             }
//         );
//     } catch (error) {
//         showerror(error.message);
//     }
// }

// Retrieve records with the given values of employee level, employee score, and bmp score, from the employeeincentiverating.
function GetEmployeeePercentage(emplevel, empscore, formContext) {
    //irf: to get bmp_organizationscore saved into local storage
    var orgscore = window.localStorage.getItem('BmpOrganizationScore');
    orgscore = parseInt(orgscore);

    try {
        var fetchData = {
            "bm_employeelevel": emplevel,
            "bm_empscore": empscore,
            "bm_bmpscore": orgscore
        };
        var fetchXml = [
            "<fetch top='1'>",
            "  <entity name='bm_employeeincentiverating'>",
            "    <attribute name='bm_percent'/>",
            "    <filter>",
            "      <condition attribute='bm_employeelevel' operator='eq' value='", fetchData.bm_employeelevel/*3*/, "'/>",
            "      <condition attribute='bm_empscore' operator='eq' value='", fetchData.bm_empscore/*4*/, "'/>",
            "      <condition attribute='bm_bmpscore' operator='eq' value='", fetchData.bm_bmpscore/*1*/, "'/>",
            "    </filter>",
            "  </entity>",
            "</fetch>"
        ].join("");

        fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);

        window.parent.Xrm.WebApi.online.retrieveMultipleRecords("bm_employeeincentiverating", fetchXml).then(
            function success(results) {
                console.log(results.entities.length);
                for (var i = 0; i < results.entities.length; i++) {
                    var parecent = results.entities[i]["bm_percent"];
                    formContext.getAttribute("bm_percentage").setValue(parecent);
                    // Award calculation based on the percentage.
                    CalculationOfAwards(parecent, formContext);
                }
            },
            function (error) {
                var alertStrings = { confirmButtonLabel: "Yes", text: error.message, title: "Error in Getting Employee Percentage" };
                var alertOptions = { height: 120, width: 260 };
                parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
            }
        );
        //Irf: Same API Call was not returning response in CRM rest builder

        // Xrm.WebApi.online.retrieveMultipleRecords("bm_employeeincentiverating", "?$select=bm_percent&$filter=bm_employeelevel eq " + emplevel + " and  bm_bmpscore eq " + 
        //                 bm_organizationscore + " and  bm_empscore eq " + empscore + "&$top=1").then(
        // function success(results) {
        //     for (var i = 0; i < results.entities.length; i++) {
        //         var bm_percent = results.entities[i]["bm_percent"];
        //         formContext.getAttribute("bm_percentage").setValue(bm_percent);
        //         // Award calculation based on the percentage.
        //         CalculationOfAwards(bm_percent, formContext);
        //     }
        // },
        // function(error) {
        //     showerror(error.message);
        // }
        // );
    } catch (error) {
        showerror(error.message);
    }
}

// Calculate semifinal award, roundedup award from base salary and percentage. 
function CalculationOfAwards(bm_percent, formContext) {
    try {
        var bm_basesalary = formContext.getAttribute("bm_basesalary").getValue();
        semifinalaward = (bm_basesalary * bm_percent) / 100;
        formContext.getAttribute("bm_finalaward").setValue(semifinalaward);
        formContext.getAttribute("bm_bmpboostforoutstandingorexceptionalscore").setValue(semifinalaward);
        var finalawardroundedup = Math.round(semifinalaward / 100) * 100;
        formContext.getAttribute("bm_finalawardroundedup").setValue(finalawardroundedup);
        formContext.getAttribute("bm_finalanddiscretionary").setValue(finalawardroundedup);
        incentiveaspercentageofsalary = (finalawardroundedup / bm_basesalary) * 100;
        formContext.getAttribute("bm_incentiveaspercentofsalary").setValue(incentiveaspercentageofsalary);
        //After every field save, Save the form automatically
        var formtype = formContext.ui.getFormType();
        var EDITMODE = 2;
        //if user is updating a form, then form should auto save after populating data in all fields, else in create mood not auto save
        if(formtype == EDITMODE || formtype == "2"){
            formContext.data.save();
        }
    } catch (error) {
        showerror(error.message);
    }
}

// Calculation of awards if prorate is applicable, hire date should be less than the fiscal year end date for this calculation.
// Called on the onChange event of Prorate Two Options field.
function CalculationOfAwardsWithProrate(executionContext) {
    try {
        var context = executionContext.getFormContext();
        prorate = context.getAttribute("bm_prorate").getValue();
        var bm_hiredate = context.getAttribute("bm_hiredate").getValue();
        var bm_basesalary = context.getAttribute("bm_basesalary").getValue();
        var employee = context.getAttribute('bm_employee').getValue()[0].id;
        guid = employee.replace("{", "").replace("}", "");
        var bm_fiscalyearenddate = context.getAttribute("bm_fyenddate").getValue();
        var bm_organizationscore = "";
        var employeescore = context.getAttribute("bm_employeescore").getValue();
        var percentage = context.getAttribute("bm_percentage").getValue();
        var semifinalaward = (bm_basesalary * percentage) / 100;
        if (prorate) {
            if (validateDates(bm_fiscalyearenddate, bm_hiredate)) {
                var monthsworked = "";
                // Calculating months worked for prorate award.
                // monthsworked = Math.max(
                //     (new Date(bm_fiscalyearenddate).getFullYear() - new Date(bm_hiredate).getFullYear()) * 12 +
                //     new Date(bm_fiscalyearenddate).getMonth() -
                //     new Date(bm_hiredate).getMonth(),
                //     0);
                const date1 = new Date(bm_fiscalyearenddate);
                const date2 = new Date(bm_hiredate);
                const diffTime = Math.abs(date2 - date1);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                var monthsworked = Math.round(diffDays / 30.0);
                if (monthsworked > 0 && monthsworked < 12) {
                    context.getAttribute("bm_monthsworked").setValue(monthsworked);
                    var proratedaward = (semifinalaward / 12) * monthsworked;
                    context.getAttribute("bm_proratedaward").setValue(proratedaward);
                    context.getAttribute("bm_bmpboostforoutstandingorexceptionalscore").setValue(proratedaward);
                    finalawardroundedup = Math.round(proratedaward / 100) * 100;
                    context.getAttribute("bm_finalawardroundedup").setValue(finalawardroundedup);
                    context.getAttribute("bm_incentiveaspercentofsalary").setValue((finalawardroundedup / ((bm_basesalary / 12) * monthsworked)) * 100);
                }
            } else {
                context.getAttribute("bm_prorate").setValue(false);
                showinfo("Hire date should always be less than the fiscal year end date.");
            }
        } else {
            var bm_percent = context.getAttribute("bm_percentage").getValue();
            CalculationOfAwards(bm_percent, context);
        }
    } catch (error) {
        showerror(error.message);
    }
}

// Add discretionary award and final award, and update the field "incentive as % of salary".
function addFinalAwardDiscretionaryAward(executionContext) {
    var context = executionContext.getFormContext();
    var basesalary = "";
    try {
        basesalary = context.getAttribute("bm_basesalary").getValue();
        discretionaryaward = context.getAttribute("bm_discretionaryaward").getValue();
        finalawardroundedup = context.getAttribute("bm_finalawardroundedup").getValue();
        var finalawardAnddiscretionaryaward = discretionaryaward + finalawardroundedup;
        context.getAttribute("bm_finalanddiscretionary").setValue(finalawardAnddiscretionaryaward);
        // Calculate percentage from finalroundedup if the discretionary is 0.
        if (discretionaryaward === 0 || discretionaryaward === "" || discretionaryaward === null) {
            incentiveaspercentageofsalary = (finalawardroundedup / basesalary) * 100;
        }
        // Calculate percentage from finalawardAnddiscretionaryaward if discretionary is non zero.
        else {
            incentiveaspercentageofsalary = (finalawardAnddiscretionaryaward / basesalary) * 100;
        }
        context.getAttribute("bm_incentiveaspercentofsalary").setValue(incentiveaspercentageofsalary);
        //when user enter data into bm_discretionaryaward, and final is updated, it will save form
        context.data.save();
    } catch (error) {
        showerror(error.message);
    }
}

function validateDates(fiscal, hire) {
    try {
        // Validating dates, hire date should be less than the fiscal year end date. If so, return true and false otherwise.
        if (new Date(fiscal).getTime() > new Date(hire).getTime())
            return true;
        return false;
    } catch (error) {
        showerror(error.message);
    }
}

// Clear all fields if Employee field is cleared.
function clearAllFieldsIfEmployeeNull(context) {
    try {
        context.getAttribute("bm_name").setValue(null);
        context.getAttribute("bm_employeelevel").setValue(null);
        context.getAttribute("bm_monthsworked").setValue(null);
        context.getAttribute("bm_proratedaward").setValue(null);
        context.getAttribute("bm_employeescore").setValue(null);
        context.getAttribute("bm_basesalary").setValue(null);
        context.getAttribute("bm_hiredate").setValue(null);
        context.getAttribute("bm_prorate").setValue(null);
        context.getAttribute("bm_percentage").setValue(null);
        context.getAttribute("bm_finalaward").setValue(null);
        context.getAttribute("bm_bmpboostforoutstandingorexceptionalscore").setValue(null);
        context.getAttribute("bm_finalawardroundedup").setValue(null);
        context.getAttribute("bm_discretionaryaward").setValue(null);
        context.getAttribute("bm_finalanddiscretionary").setValue(null);
        context.getAttribute("bm_incentiveaspercentofsalary").setValue(null);
    } catch (error) {
        showerror(error.message);
    }
}

// Called before saving the record
function runOnPreSave(executionContext) {
    var context = executionContext.getFormContext();
    context.data.entity.addOnSave(setNameofIncentive);
}

// Set the name of Incentive to Employee Name - Year format.
function setNameofIncentive(executionContext) {
    var context = executionContext.getFormContext();
    var saveEvent = executionContext.getEventArgs();
    var formtype = context.ui.getFormType();
    var EDITMODE = 2;
    if (context.getAttribute('bm_employee').getValue() === null || context.getAttribute('bm_employee').getValue() === "" || formtype === EDITMODE || formtype === "2") {
        clearAllFieldsIfEmployeeNull(context);
        //to set employee incentive in edit mood
        if((formtype === EDITMODE || formtype === "2") && (context.getAttribute('bm_employee').getValue() !== null) ){
            var employee = context.getAttribute("bm_employee").getValue();
            var enddate = context.getAttribute("bm_fyenddate").getValue();
            var incentivename = employee[0].name + "-" + new Date(enddate).getFullYear();
            context.getAttribute("bm_name").setValue(incentivename);
        }
        return;
    }
    try {
        var employee = context.getAttribute("bm_employee").getValue();
        var enddate = context.getAttribute("bm_fyenddate").getValue();
        var incentivename = employee[0].name + "-" + new Date(enddate).getFullYear();
        context.getAttribute("bm_name").setValue(incentivename);
        var req = new XMLHttpRequest();
        // Replacing white spaces with %20 to encode a valid URL
        var incentiveurlname = incentivename.replace(/\s/g, '%20');
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/bm_incentivedetails?$select=bm_incentivedetailid,bm_name&$filter=bm_name eq '" + incentiveurlname + "'", false);
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
                        var bm_incentivedetailid = results.value[i]["bm_incentivedetailid"];
                        if (bm_name === incentivename) {
                            // Prevent the save operation
                            openExistingRecord(executionContext, incentivename, bm_incentivedetailid);
                            saveEvent.preventDefault();
                            return;
                        }
                    }
                } else {
                    showerror(this.status);
                }
            }
        };
        req.send();
    } catch (error) {

    }
}

function openExistingRecord(executionContext, name, bm_incentivedetailid) {
    var context = executionContext.getFormContext();
    var entityid = Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");
    // Replacing white spaces with %20 to encode a valid URL
    var urlencodedname = name.replace(/\s/g, '%20');
    var recordURL =
        "https://org9ed408a4.crm.dynamics.com/main.aspx?appid=4c49b7ba-ecdf-ec11-bb3d-000d3a8c2dc0&pagetype=entityrecord&etn=bm_incentivedetail&id=" + bm_incentivedetailid + "&" + name;
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
            // context.data.refresh(false); 
        },
        function (e) {
            //put your error handler here 
        });
}

// Set Discretionary Award field to 0 when the form is loaded, to avoid any miscalculation if it is used in formula without setting.
function onloadSetDiscretionarytozero(executionContext) {
    var context = executionContext.getFormContext();
    context.getAttribute("bm_discretionaryaward").setValue(0);
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