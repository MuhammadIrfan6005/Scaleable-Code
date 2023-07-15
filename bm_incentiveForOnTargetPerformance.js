function setNameNewHireScenario(executionContext) {
    var context = executionContext.getFormContext();
    context.data.entity.addOnSave(successCallback);
}

function successCallback(executionContext) {
    var context = executionContext.getFormContext();
    var formtype = context.ui.getFormType();
    var saveEvent = executionContext.getEventArgs();
    var name = context.getAttribute("bm_name").getValue();
    var EDITMODE = 2;
    // Check if the form is in edit mode
    if (formtype === EDITMODE || formtype === "2") {
        return;
    }
    try {
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/bm_newhirescenarioplannings?$select=bm_name,bm_newhirescenarioplanningid&$filter=bm_name eq '" + name + "'", false);
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
                        var bm_newhirescenarioplanningid = results.value[i]["bm_newhirescenarioplanningid"];
                        if (bm_name === name) {
                            // Prevent the save operation
                            openExistingRecord(executionContext, bm_name, bm_newhirescenarioplanningid);
                            saveEvent.preventDefault();
                        }
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

function openExistingRecord(executionContext, bm_name, bm_newhirescenarioplanningid) {
    var context = executionContext.getFormContext();
    var entityid = Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");
    // Replacing white spaces with %20 to encode a valid URL
    var urlencodedname = bm_name.replace(/\s/g, '%20');
    var recordURL =
        "https://org9ed408a4.crm.dynamics.com/main.aspx?appid=4c49b7ba-ecdf-ec11-bb3d-000d3a8c2dc0&pagetype=entityrecord&etn=bm_newhirescenarioplanning&id=" + bm_newhirescenarioplanningid + "&" + bm_name;
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

// Called on change of the Level field
function incentiveForOnTargetPerformance(executionContext) {
    var context = executionContext.getFormContext();

    //irf: if level is empty, notify the user    
    if (context.getAttribute("bm_level").getValue() === null || context.getAttribute("bm_level").getValue() === "") {
        emptyAllFields(context);
        return;
    }
    //irf: if offerletterbaseSalary is empty, notify the user    
    if (context.getAttribute("bm_offerletterbasesalary").getValue() === null || context.getAttribute("bm_offerletterbasesalary").getValue() === "") {
        showerror("Please Enter Offer Letter Base Salary and then select Level.");
        context.getAttribute("bm_level").setValue(null);
        return;
    }
    try {
        var bm_level = context.getAttribute("bm_level").getValue();
        var bm_offerletterbasesalary = context.getAttribute("bm_offerletterbasesalary").getValue();
        console.log("offer letter base salary"+ bm_offerletterbasesalary);
        var percent = "";
        Xrm.WebApi.online.retrieveMultipleRecords("bm_employeeincentiverating", "?$select=bm_percent&$filter=bm_bmpscore eq 1 and  bm_empscore eq 4 and  bm_employeelevel eq " + bm_level + "").then(
            function success(results) {
                for (var i = 0; i < results.entities.length; i++) {
                    percent = results.entities[i]["bm_percent"];
                }
                context.getAttribute("bm_incentiveasaofsalary").setValue(percent);
                context.getAttribute("bm_incentiveforontargetperformance").setValue(bm_offerletterbasesalary * percent / 100);
                var incentiveontarget = context.getAttribute("bm_incentiveforontargetperformance").getValue();
                context.getAttribute("bm_totalcashsalaryincentive").setValue(bm_offerletterbasesalary + incentiveontarget);
                var totalcash = context.getAttribute("bm_totalcashsalaryincentive").getValue();
                //irf: if offer letter base salary is < 305000 then below two fields value will be zero else calculate
                if(bm_offerletterbasesalary > 305000){
                    context.getAttribute("bm_inlieusalarywithgrossup").setValue(((totalcash - 285000) * (15 / 100)) / 0.65);
                    context.getAttribute("bm_salaryinlieuwithgrossupfortaxes").setValue(((totalcash - 305000) * (15 / 100)) / 0.65);
                }
                else{
                    context.getAttribute("bm_inlieusalarywithgrossup").setValue(0);
                    context.getAttribute("bm_salaryinlieuwithgrossupfortaxes").setValue(0);
                }
                context.getAttribute("bm_payrollsalary").setValue(bm_offerletterbasesalary / 24);
                context.getAttribute("bm_estimatedvalueofbenefits").setValue(25000);
                var bm_salaryinlieuwithgrossupfortaxes = context.getAttribute("bm_salaryinlieuwithgrossupfortaxes").getValue();
                var bm_estimatedvalueofbenefits = context.getAttribute("bm_estimatedvalueofbenefits").getValue();
                var bm_bluemeridianretirementcontribution = "";
                if (bm_offerletterbasesalary >= 80000) //305000
                    bm_bluemeridianretirementcontribution = (147000 * 9.3 / 100) + ((305000 - 147000) * 15 / 100);
                else if (bm_offerletterbasesalary >= 70000)
                    bm_bluemeridianretirementcontribution = (147000 * 9.3 / 100) + ((totalcash - 147000) * 15 / 100);
                else if (bm_offerletterbasesalary >= 60000)
                    bm_offerletterbasesalary = totalcash * 9.3 / 100;
                context.getAttribute("bm_bluemeridianretirementcontribution").setValue(bm_bluemeridianretirementcontribution);
                var bm_totalcompensation = totalcash + bm_bluemeridianretirementcontribution + bm_salaryinlieuwithgrossupfortaxes + bm_estimatedvalueofbenefits;
                context.getAttribute("bm_totalcompensation").setValue(bm_totalcompensation);
            },
            function (error) {
                showerror(error.message);
            }
        );
    } catch (error) {
        showerror(error.message);
    }
}

//irf: if user change level to "select" while fields are having calculations, then empty the fields
function emptyAllFields(context) {
    context.getAttribute("bm_incentiveasaofsalary").setValue(null);
    context.getAttribute("bm_incentiveforontargetperformance").setValue(null);
    context.getAttribute("bm_totalcashsalaryincentive").setValue(null);
    context.getAttribute("bm_inlieusalarywithgrossup").setValue(null);
    context.getAttribute("bm_salaryinlieuwithgrossupfortaxes").setValue(null);
    context.getAttribute("bm_payrollsalary").setValue(null);
    context.getAttribute("bm_estimatedvalueofbenefits").setValue(null);
    context.getAttribute("bm_totalcompensation").setValue(null);
    context.getAttribute("bm_bluemeridianretirementcontribution").setValue(null);
}

function onsavecheckpercent(executionContext) {
    var context = executionContext.getFormContext();
    var percent = context.getAttribute("bm_incentiveasaofsalary").getValue();

    //irf: I am checking offerletterbaseSalary on level
    if (percent === null || percent === "") {
        showerror("Make sure to Enter Offer Letter Base Salary and then select Level to calculate parcentage");
        //irf: prevent form to save if percentage is not calculated
        // context.getEventArgs().preventDefault();
        if (executionContext != null && executionContext.getEventArgs() != null) {
            var eventArgs = executionContext.getEventArgs();
            if (eventArgs.getSaveMode() == 1) {
                eventArgs.preventDefault();
            }
        }
    }
}

// Called on change event of the offer letter salary field
function offerletterSalaryOnChange(executionContext) {
    var context = executionContext.getFormContext();
    try {
        var percent = context.getAttribute("bm_incentiveasaofsalary").getValue();

        var bm_offerletterbasesalary = context.getAttribute("bm_offerletterbasesalary").getValue();
        if (bm_offerletterbasesalary === null || bm_offerletterbasesalary === "") {
            showerror("Please Enter Offer Letter Base Salary for Calculations.");
            //irf: empty the level so that user chose level after enter base salary to do calculations
            context.getAttribute("bm_level").setValue(null);
            emptyAllFields(context);
            return;
        }
        context.getAttribute("bm_incentiveforontargetperformance").setValue(bm_offerletterbasesalary * (percent / 100));
        var incentiveontarget = context.getAttribute("bm_incentiveforontargetperformance").getValue();
        context.getAttribute("bm_totalcashsalaryincentive").setValue(bm_offerletterbasesalary + incentiveontarget);
        var totalcash = context.getAttribute("bm_totalcashsalaryincentive").getValue();
        //irf:  if offer letter base salary is < 305000 then below two fields value will be zero else calculate
        if(bm_offerletterbasesalary > 305000){
            context.getAttribute("bm_inlieusalarywithgrossup").setValue(((totalcash - 285000) * (15 / 100)) / 0.65);
            context.getAttribute("bm_salaryinlieuwithgrossupfortaxes").setValue(((totalcash - 305000) * (15 / 100)) / 0.65);
        }
        else{
            context.getAttribute("bm_inlieusalarywithgrossup").setValue(0);
            context.getAttribute("bm_salaryinlieuwithgrossupfortaxes").setValue(0);
        }
        var bm_salaryinlieuwithgrossupfortaxes = context.getAttribute("bm_salaryinlieuwithgrossupfortaxes").getValue();
        var bm_estimatedvalueofbenefits = context.getAttribute("bm_estimatedvalueofbenefits").getValue();
        context.getAttribute("bm_payrollsalary").setValue(bm_offerletterbasesalary / 24);
        var bm_bluemeridianretirementcontribution = "";
        if (bm_offerletterbasesalary >= 80000)
            bm_bluemeridianretirementcontribution = (147000 * 9.3 / 100) + ((305000 - 147000) * 15 / 100);
        else if (bm_offerletterbasesalary >= 70000)
            bm_bluemeridianretirementcontribution = (147000 * 9.3 / 100) + ((totalcash - 147000) * 15 / 100);
        else if (bm_offerletterbasesalary >= 60000)
            bm_offerletterbasesalary = totalcash * 9.3 / 100;
        context.getAttribute("bm_bluemeridianretirementcontribution").setValue(bm_bluemeridianretirementcontribution);
        var bm_totalcompensation = totalcash + bm_bluemeridianretirementcontribution + bm_salaryinlieuwithgrossupfortaxes + bm_estimatedvalueofbenefits;
        context.getAttribute("bm_totalcompensation").setValue(bm_totalcompensation);
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