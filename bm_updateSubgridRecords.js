var bm_organizationscore = "";
var fiscalyearenddate = "";
var check = false;
// for fetch results from bm_employeeincentiverating
var incentiverating = [];
// for fetch results from bm_incentivedetail
var incentivedetails = [];
// to pass employee score and employee level combinations to the fectXml
var ratingObj = [];
// for guids from the subgrids
var incentiveIds = [];
// class to store incentive details objects from the fetch results.
class IncentiveDetails {
    constructor() {
        this.bm_employeelevel = null;
        this.bm_employeescore = null;
        this.bm_incentiveaspercentofsalary = null;
        this.bm_employeelevel = null;
        this.bm_basesalary = null;
        this.bm_bmpboostforoutstandingorexceptionalscore = null;
        this.bm_discretionaryaward = null;
        this.bm_finalaward = null;
        this.bm_finalawardroundedup = null;
        this.bm_prorate = null;
        this.bm_proratedaward = null;
        this.bm_percentage = null;
        this.bm_orgscore = null;
        this.bm_incentivedetailid = null;
        this.bm_hiredate = null;
        this.bm_monthsworked = null;
        this.bm_semifinalaward = null;
        this.bm_discretionaryaward = null;
        this.bm_finalanddiscretionary = null;
    }
}

function onload(executionContext){
    //irf: for getting bmp_organzationscore ON-LOAD and storing into local storage, so that could be accessed into "incentive detail" form

    //For deleting exising local storage
    window.localStorage.removeItem('BmpOrganizationScore');
    //for creating new local storage
    var orgscore = Xrm.Page.getAttribute('bm_organizationscore');
    orgscore =  orgscore.getValue();
    window.localStorage.setItem("BmpOrganizationScore",orgscore);
}
// Update subgrid records when BMP Organization score changes.
function updateSubgridRecords(executionContext, area) {
    //Irf: If user update organization score, then replace latest score with alreasdy saved organization Score. 

    //For deleting exising local storage
    window.localStorage.removeItem('BmpOrganizationScore');
    //for creating new local storage
    var orgscore = Xrm.Page.getAttribute('bm_organizationscore');
    orgscore =  orgscore.getValue();
    window.localStorage.setItem("BmpOrganizationScore",orgscore);

    if(check) {
        return;
    }
    try {
        //ShowProgressIndicator();
        if (area === "subgrid") {
            bm_organizationscore = parent.Xrm.Page.getAttribute("bm_organizationscore").getValue();
            var rows = parent.Xrm.Page.getControl("Incentives").getGrid().getRows()._collection;
        }
        else {
            var context = executionContext.getFormContext();
            bm_organizationscore = parent.Xrm.Page.getAttribute("bm_organizationscore").getValue();
            var rows = context.getControl("Incentives").getGrid().getRows()._collection;
        }
        // Get the rows ids to filter the fetchXml.
        for (var i in rows) {
            incentiveIds.push("" + i);
        }
        // Retrun if the subgrid is empty.
        if (incentiveIds.length < 1) {
            return;
        }
        // fetchXml for bm_incentivedetail
        var fetchXml = "<fetch>" +
            "<entity name='bm_incentivedetail'>" +
            "<attribute name='bm_employee' />" +
            "<attribute name='bm_employeelevel' />" +
            "<attribute name='bm_incentiveaspercentofsalary' />" +
            "<attribute name='bm_monthsworked' />" +
            "<attribute name='bm_percentage' />" +
            "<attribute name='bm_incentivedetailid' />" +
            "<attribute name='bm_employeescore' />" +
            "<attribute name='bm_basesalary' />" +
            "<attribute name='bm_bmpboostforoutstandingorexceptionalscore' />" +
            "<attribute name='bm_semifinalaward' />" +
            "<attribute name='bm_discretionaryaward' />" +
            "<attribute name='bm_finalaward' />" +
            "<attribute name='bm_finalawardroundedup' />" +
            "<attribute name='bm_prorate' />" +
            "<attribute name='bm_proratedaward' />" +
            "<attribute name='bm_finalanddiscretionary' />" +
            "<attribute name='bm_discretionaryaward' />" +
            "<filter>" +
            "<condition attribute='bm_incentivedetailid' operator='in'>";
        for (var i in incentiveIds) {
            fetchXml += "<value>{" + incentiveIds[i] + "}</value>";
        }
        fetchXml += "   </condition>" +
            "</filter>" +
            "</entity>" +
            "</fetch>";
        var encodedFetchXML = encodeURIComponent(fetchXml);
        var fetchXmlRequest = "?fetchXml=" + encodedFetchXML;
        Xrm.WebApi.retrieveMultipleRecords("bm_incentivedetail", fetchXmlRequest).then(
            function success(result) {
                for (var i = 0; i < result.entities.length; i++) {
                    // Creating object of IncentiveDetails class to store the result entities.
                    var incentiveObj = new IncentiveDetails();
                    incentiveObj.bm_basesalary = result.entities[i].bm_basesalary;
                    incentiveObj.bm_bmpboostforoutstandingorexceptionalscore = result.entities[i].bm_bmpboostforoutstandingorexceptionalscore;
                    incentiveObj.bm_discretionaryaward = result.entities[i].bm_discretionaryaward;
                    incentiveObj.bm_employeelevel = result.entities[i].bm_employeelevel;
                    incentiveObj.bm_employeescore = result.entities[i].bm_employeescore;
                    incentiveObj.bm_semifinalaward = result.entities[i].bm_semifinalaward;
                    incentiveObj.bm_finalaward = result.entities[i].bm_finalaward;
                    incentiveObj.bm_finalawardroundedup = result.entities[i].bm_finalawardroundedup;
                    incentiveObj.bm_incentiveaspercentofsalary = result.entities[i].bm_incentiveaspercentofsalary;
                    incentiveObj.bm_prorate = result.entities[i].bm_prorate;
                    incentiveObj.bm_proratedaward = result.entities[i].bm_proratedaward;
                    incentiveObj.bm_incentivedetailid = result.entities[i].bm_incentivedetailid;
                    incentiveObj.bm_discretionaryaward = result.entities[i].bm_discretionaryaward;
                    incentiveObj.bm_finalanddiscretionary = result.entities[i].bm_finalanddiscretionary
                    incentivedetails.push(incentiveObj);
                    // used in fetchXml for incentiveratings to filter the results
                    rating = new Object();
                    rating.level = result.entities[i].bm_employeelevel,
                    rating.score = result.entities[i].bm_employeescore;
                    ratingObj.push(rating);
                }
                // Get incentive ratings with to retrieve percentage with the combination: Employee score, Employee level, BMP Organization score
                getIncentiveRatings(context, area);
            },
            function (error) {
                showerror(error.message);
            }
        );
    } catch (error) {
        showerror(error.message);
    }
}

function getIncentiveRatings(context, area) {
    // fetchXml for bm_employeeincentiverating
    var fetchXml = "<fetch>" +
        "<entity name='bm_employeeincentiverating'>" +
        "<attribute name='bm_empscore' />" +
        "<attribute name='bm_employeelevel' />" +
        "<attribute name='bm_percent' />" +
        "<attribute name='bm_bmpscore' />" +
        "<filter type='or'>";
    for (var i in ratingObj) {
        fetchXml += "<filter type='and'><condition attribute='bm_empscore' operator='eq' value='" + ratingObj[i].score + "'/>" +
            "<condition attribute='bm_employeelevel' operator='eq' value='" + ratingObj[i].level + "'/>" +
            "<condition attribute='bm_bmpscore' operator='eq' value='" + bm_organizationscore + "'/></filter>";
    }
    fetchXml += "</filter></entity>" +
        "</fetch>";
    fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
    Xrm.WebApi.retrieveMultipleRecords("bm_employeeincentiverating", fetchXml).then(
        function success(result) {
            for (var i = 0; i < result.entities.length; i++) {
                for (var j = 0; j < incentivedetails.length; j++) {
                    // Check the combinations to get percentage
                    if (incentivedetails[j].bm_employeelevel === result.entities[i].bm_employeelevel &&
                        incentivedetails[j].bm_employeescore === result.entities[i].bm_empscore &&
                        bm_organizationscore === result.entities[i].bm_bmpscore) {

                        incentivedetails[j].bm_employeelevel = result.entities[i].bm_employeelevel;
                        incentivedetails[j].bm_employeescore = result.entities[i].bm_empscore;
                        incentivedetails[j].bm_percentage = result.entities[i].bm_percent;
                        // incentivedetails[j].bm_orgscore = bm_organizationscore;
                    }
                }
            }
            // Awards calculations
            CalculateAwards(context, area);
        },
        function (error) {
            showerror(error.message);
        }
    );
}

// Calculate semifinal award, roundedup award from base salary and percentage. 
function CalculateAwards(context, area) {
    try {
        fiscalyearenddate = Xrm.Page.getAttribute("bm_fiscalyearenddate").getValue();
        incentivedetails.forEach((incentObj, index, array) => {
            if (incentObj.bm_prorate) {
                // Validate dates, if hire date is less than the fiscal year end date then proceed.
                if (validateDates(fiscalyearenddate, incentObj.bm_hiredate)) {
                    var monthsworked = "";
                    var semifinalaward = "";
                    var bsalary = incentObj.bm_basesalary;
                    var bmpercent = incentObj.bm_percentage;
                    var semifinalaward = (bsalary * bmpercent) / 100;
                    incentObj.bm_semifinalaward = semifinalaward;
                    // Calculating months worked for prorate award.
                    monthsworked = getMonthDifference(incentObj.bm_hiredate, fiscalyearenddate);
                    if (monthsworked >= 0 && monthsworked < 12) {
                        incentObj.bm_monthsworked = monthsworked;
                        var proratedaward = (incentObj.bm_finalaward / 12) * monthsworked;
                        incentObj.bm_proratedaward = proratedaward;
                        incentObj.bm_bmpboostforoutstandingorexceptionalscore = proratedaward;
                        finalawardroundedup = Math.round(proratedaward / 100) * 100;
                        incentObj.bm_finalawardroundedup = finalawardroundedup;
                        incentObj.bm_finalanddiscretionary = incentObj.bm_discretionaryaward + finalawardroundedup;
                        incentObj.bm_incentiveaspercentofsalary = finalawardroundedup / ((bsalary / 12) * monthsworked);
                        // incentObj.bm_incentiveaspercentofsalary = (finalawardroundedup / incentObj.bm_basesalary) * monthsworked;
                    }
                }
            } else {
                // Calculating awards with no prorate
                var bsalary = incentObj.bm_basesalary;
                var bmpercent = incentObj.bm_percentage;
                var semifinalaward = (bsalary * bmpercent) / 100;
                finalawardroundedup = Math.round(semifinalaward / 100) * 100;
                incentiveaspercentageofsalary = (finalawardroundedup / bsalary) * 100;
                incentObj.bm_finalaward = semifinalaward;
                incentObj.bm_finalawardroundedup = finalawardroundedup;
                incentObj.bm_incentiveaspercentofsalary = incentiveaspercentageofsalary;
                incentObj.bm_bmpboostforoutstandingorexceptionalscore = semifinalaward;
                incentObj.bm_semifinalaward = semifinalaward;
                incentObj.bm_finalanddiscretionary = incentObj.bm_discretionaryaward + finalawardroundedup;
            }
        });
        var data = [];
        data.push('--batch_123456');
        data.push('Content-Type: multipart/mixed;boundary=changeset_BBB457');
        data.push('');
        for (i = 0; i < incentivedetails.length; i++) {
            var entity = {};
            entity.bm_bmpboostforoutstandingorexceptionalscore = incentivedetails[i].bm_bmpboostforoutstandingorexceptionalscore;
            entity.bm_finalaward = incentivedetails[i].bm_finalaward;
            entity.bm_finalawardroundedup = incentivedetails[i].bm_finalawardroundedup;
            entity.bm_incentiveaspercentofsalary = incentivedetails[i].bm_incentiveaspercentofsalary;
            entity.bm_percentage = incentivedetails[i].bm_percentage;
            entity.bm_semifinalaward = incentivedetails[i].bm_semifinalaward;
            entity.bm_discretionaryaward = incentivedetails[i].bm_discretionaryaward;
            entity.bm_finalanddiscretionary = incentivedetails[i].bm_finalanddiscretionary;
            data.push('--changeset_BBB457');
            data.push('Content-Type:application/http');
            data.push('Content-Transfer-Encoding:binary');
            var id = i + 1;
            data.push('Content-ID:' + id);
            data.push('');
            data.push('PATCH ' + parent.Xrm.Page.context.getClientUrl() + '/api/data/v9.1/bm_incentivedetails(' + incentivedetails[i].bm_incentivedetailid.replace("{", "").replace("}", "") + ') HTTP/1.1');
            data.push('Content-Type:application/json;type=entry');
            data.push('');
            data.push(JSON.stringify(entity));
        }
        incentivedetails = [];
        data.push('--changeset_BBB457--');
        //end of batch
        data.push('--batch_123456--');
        var payload = data.join('\r\n');
        parent.$.ajax(
            {
                method: 'POST',
                url: parent.Xrm.Page.context.getClientUrl() + '/api/data/v9.1/$batch',
                headers: {
                    'Content-Type': 'multipart/mixed;boundary=batch_123456',
                    'Accept': 'application/json',
                    'Odata-MaxVersion': '4.0',
                    'Odata-Version': '4.0'
                },
                data: payload,
                async: false,
                success: function (data) {
                    //HideProgressIndicator();
                    // area === "subgrid" ? parent.Xrm.Page.data.save() : context.data.save();
                    parent.Xrm.Page.getControl("Incentives").refresh();
                    context.data.save();
                },
                error: function (error) {
                    alert(JSON.stringify(error));
                    console.log("Error is => " + error);
                }
            });
    } catch (error) {
        showerror(error.message);
    }
}

// Called on the subgrid onSave event.
function delay(executionContext) {
    ShowProgressIndicator();
    setTimeout(() => {
        var formContext = executionContext.getFormContext();
        updateSubgridRecords(executionContext, "subgrid");
    }, 3000);
}

// Validating dates, hire date should be less than the fiscal year end date. If so, return true, and false otherwise.
function validateDates(fiscal, hire) {
    try {
        if (new Date(fiscal).getTime() > new Date(hire).getTime())
            return true;
        return false;
    } catch (error) {
        showerror(error.message);
    }
}

// Get months worked by taking difference of hire date and fiscal year end date.
function getMonthDifference(startDate, endDate) {
    try {
        var difference = new Date(endDate).getMonth() -
            new Date(startDate).getMonth() +
            12 * (new Date(endDate).getFullYear() - new Date(startDate).getFullYear());
        // If the difference is negative, change it to positive.
        if (difference < 0)
            return -difference;
        return difference;
    } catch (error) {
        showerror(error.message);
    }
}

function ShowProgressIndicator() {
    Xrm.Utility.showProgressIndicator("Processing");
    setTimeout('HideProgressIndicator()', 3000);
}

function HideProgressIndicator() {
    Xrm.Utility.closeProgressIndicator();
}

function setNameOfIncentiveCalculation(executionContext) {
    var context = executionContext.getFormContext();
    context.data.entity.addOnSave(successCallBack);
}

// Set the name of FY Incentive Calculation entity to "Incentive-(selected year)" format.
function successCallBack(executionContext) {
    try {
        var context = executionContext.getFormContext();
        var formtype = context.ui.getFormType();
        var EDITMODE = 2;
        if(formtype === EDITMODE || formtype === "2") {
            return;
        }
        var saveEvent = executionContext.getEventArgs();
        // Check if the Fiscal Year field contains data
        if (context.getAttribute("bm_fiscalyearenddate").getValue() == null) {
            showerror("Please enter Fiscal Year End Date");
            saveEvent.preventDefault();
        }
        var fiscalDate = context.getAttribute("bm_fiscalyearenddate").getValue();
        var year = new Date(fiscalDate).getFullYear();
        var name = "Incentive-" + year;
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/bm_employeeincentivecalculations?$select=bm_employeeincentivecalculationid,bm_name&$filter=bm_name eq '" + name + "'", false);
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
                        var bm_employeeincentivecalculationid = results.value[i]["bm_employeeincentivecalculationid"];
                        if(bm_name === name) {
                            // Prevent the save operation
                            openExistingRecord(executionContext, name, bm_employeeincentivecalculationid);
                            saveEvent.preventDefault();
                            // showerror("Incentive record already Exists");
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
    } catch (error) {
        showerror(error.message);
    }
}

function openExistingRecord(executionContext, name, bm_employeeincentivecalculationid) {
    var context = executionContext.getFormContext();
    var entityid = Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");
    // Replacing white spaces with %20 to encode a valid URL
    var urlencodedname = name.replace(/\s/g, '%20');
    var recordURL = 
    "https://org9ed408a4.crm.dynamics.com/main.aspx?appid=4c49b7ba-ecdf-ec11-bb3d-000d3a8c2dc0&pagetype=entityrecord&etn=bm_employeeincentivecalculation&id=" + bm_employeeincentivecalculationid + "&" + name;
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

// Set editable subgrid specific columns to read only.
function setSubgridColumnsReadOnly(executionContext) {
    var context = executionContext.getFormContext();
    try {
        context.getData().getEntity().attributes.forEach(function (attr) {
            if (attr.getName() === "bm_percentage") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_name") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_employeelevel") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_basesalary") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_finalaward") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_bmpboostforoutstandingorexceptionalscore") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_finalawardroundedup") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_discretionaryaward") {
                attr.controls.forEach(function (c) {
                    // c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_finalanddiscretionary") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_incentiveaspercentofsalary") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_monthsworked") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            } else if (attr.getName() === "bm_proratedaward") {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                })
            }
        });
    } catch (error) {
        showerror(error.message);
    }
}
//called on subgrid records on change
function GetValues(executionContext) {
    var context = executionContext.getFormContext();
    var selected = executionContext.getFormContext().data.entity;
    //var Id = selected.getId();
    try {
        var basesalary = selected.attributes.getByName("bm_basesalary").getValue();
        var discretionaryaward = selected.attributes.getByName("bm_discretionaryaward").getValue();
        var finalawardroundedup = selected.attributes.getByName("bm_finalawardroundedup").getValue();
        var finalawardAnddiscretionaryaward = discretionaryaward + finalawardroundedup;
        selected.attributes.getByName("bm_finalanddiscretionary").setValue(finalawardAnddiscretionaryaward);
        // var incentiveaspercentageofsalary = finalawardroundedup / ((basesalary / 12) * monthsworked);
        // Calculate percentage from finalroundedup if the discretionary is 0.
        if (discretionaryaward === 0 || discretionaryaward === "" || discretionaryaward === null) {
            incentiveaspercentageofsalary = (finalawardroundedup / basesalary) * 100;
        }
        // Calculate percentage from finalawardAnddiscretionaryaward if discretionary is non zero.
        else {
            incentiveaspercentageofsalary = (finalawardAnddiscretionaryaward / basesalary) * 100;
        }
        selected.attributes.getByName("bm_incentiveaspercentofsalary").setValue(incentiveaspercentageofsalary);
        check = true;
        //context.data.save().
        context.data.save();
    } catch(error) {
        showerror(error.message);
    }
}

// Calculate semifinal award, roundedup award from base salary and percentage. 
function CalculationOfAwards(executionContext) {
    try {
        var context = executionContext.getFormContext();
        var selected = executionContext.getFormContext().data.entity;
        var bm_basesalary = selected.attributes.getByName("bm_basesalary").getValue();
        var percentage =  selected.attributes.getByName("bm_percentage").getValue();
        semifinalaward = (bm_basesalary * percentage) / 100;
        selected.attributes.getByName("bm_finalaward").setValue(semifinalaward);
        selected.attributes.getByName("bm_bmpboostforoutstandingorexceptionalscore").setValue(semifinalaward);
        var finalawardroundedup = Math.round(semifinalaward / 100) * 100;
        selected.attributes.getByName("bm_finalawardroundedup").setValue(finalawardroundedup);
        var finalanddiscretionary = finalawardroundedup + selected.attributes.getByName("bm_discretionaryaward").getValue();
        selected.attributes.getByName("bm_finalanddiscretionary").setValue(finalanddiscretionary);
        incentiveaspercentageofsalary = (finalawardroundedup / bm_basesalary) * 100;
        selected.attributes.getByName("bm_incentiveaspercentofsalary").setValue(incentiveaspercentageofsalary);
        selected.attributes.getByName("bm_monthsworked").setValue(null);
        selected.attributes.getByName("bm_proratedaward").setValue(null);
        check = true;
        context.data.save();
    } catch(error) {
        showerror(error.message);
    }
}

// Calculation of awards if prorate is applicable, hire date should be less than the fiscal year end date for this calculation.
// Called on the onChange event of Prorate Two Options field.
function CalculationOfAwardsWithProrate(executionContext) {
    try {
        var context = executionContext.getFormContext();
        var selected = executionContext.getFormContext().data.entity;
        prorate = selected.attributes.getByName("bm_prorate").getValue();
        var bm_hiredate = selected.attributes.getByName("bm_hiredate").getValue();
        var bm_basesalary = selected.attributes.getByName("bm_basesalary").getValue();
        // var employee = selected.attributes.getByName('bm_employee').getValue()[0].id;
        // guid = employee.replace("{","").replace("}","");
        var bm_fiscalyearenddate = parent.Xrm.Page.getAttribute("bm_fiscalyearenddate").getValue();
        var bm_organizationscore = "";
        var employeescore = selected.attributes.getByName("bm_employeescore").getValue();
        var percentage =  selected.attributes.getByName("bm_percentage").getValue();
        var semifinalaward = (bm_basesalary * percentage) / 100;
        if(prorate) {
            if (validateDates(bm_fiscalyearenddate, bm_hiredate)) {
                var monthsworked = "";
                // Calculating months worked for prorate award.
                monthsworked = Math.max(
                    (new Date(bm_fiscalyearenddate).getFullYear() - new Date(bm_hiredate).getFullYear()) * 12 +
                    new Date(bm_fiscalyearenddate).getMonth() -
                    new Date(bm_hiredate).getMonth(),
                    0);
                if (monthsworked > 0 && monthsworked < 12) {
                    selected.attributes.getByName("bm_monthsworked").setValue(monthsworked);
                    var proratedaward = (semifinalaward / 12) * monthsworked;
                    selected.attributes.getByName("bm_proratedaward").setValue(proratedaward);
                    selected.attributes.getByName("bm_bmpboostforoutstandingorexceptionalscore").setValue(proratedaward);
                    finalawardroundedup = Math.round(proratedaward / 100) * 100;
                    selected.attributes.getByName("bm_finalawardroundedup").setValue(finalawardroundedup);
                    var finalanddiscretionary = finalawardroundedup + selected.attributes.getByName("bm_discretionaryaward").getValue();
                    selected.attributes.getByName("bm_finalanddiscretionary").setValue(finalanddiscretionary);
                    selected.attributes.getByName("bm_incentiveaspercentofsalary").setValue((finalawardroundedup / ((bm_basesalary / 12) * monthsworked)) * 100);
                }
            } else {
                selected.attributes.getByName("bm_prorate").setValue(false);
                showinfo("Hire date should always be less than the fiscal year end date.");
            }
        } else {
            // var bm_percent = context.getAttribute("bm_percentage").getValue();
            CalculationOfAwards(executionContext);
        }
        check = true;
        context.data.save();
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

// Utility function to display info messages
function showinfo(error) {
    var alertStrings = { confirmButtonLabel: "Ok", text: error, title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
}