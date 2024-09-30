var bm_organizationscore = "";
var fiscalyearenddate = "";

// for employees fetchXml results
var employees = [];

// to pass employee score and employee level combinations to the fectXml
var ratingObj = [];

class Employees {
    constructor() {
        this.bm_name = null;
        this.bm_hiredate = null;
        this.bm_employelevel = null;
        this.bm_employescore = null;
        this.bm_percent = null;
        this.bm_basesalary = null;
    }
}

// TODO: Register this function on bm_incentivedetail OnSave event.
function batchCreateEmployees(executionContext) {
    var context = executionContext.getFormContext();

    bm_organizationscore = context.getAttribute("bm_organizationscore").getValue();
    fiscalyearenddate = context.getAttribute("bm_fiscalyearenddate").getValue();

    var fetchXml = [
        "<fetch>",
        "  <entity name='bm_employee'>",
        "    <attribute name='bm_employescore'/>",
        "    <attribute name='bm_employelevel'/>",
        "    <attribute name='bm_name'/>",
        "    <attribute name='bm_hiredate'/>",
        "    <attribute name='bm_basesalary'/>",
        "  </entity>",
        "</fetch>"
        ].join("");

    fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
    Xrm.WebApi.online.retrieveMultipleRecords("bm_employee", fetchXml).then(
        function success(results) {
            for (var i = 0; i < results.entities.length; i++) {
                var employee = new Employees();
                var bm_employelevel = results.entities[i]["bm_employelevel"];
                var bm_employelevel_formatted = results.entities[i]["bm_employelevel@OData.Community.Display.V1.FormattedValue"];
                var bm_employescore = results.entities[i]["bm_employescore"];
                var bm_employescore_formatted = results.entities[i]["bm_employescore@OData.Community.Display.V1.FormattedValue"];
                var bm_hiredate = results.entities[i]["bm_hiredate"];
                var bm_name = results.entities[i]["bm_name"];
                var bm_basesalary = results.entities[i]["bm_basesalary"];

                employee.bm_name = bm_name;
                employee.bm_hiredate = bm_hiredate;
                employee.bm_employescore = bm_employescore;
                employee.bm_employelevel = bm_employelevel;
                employee.bm_basesalary = bm_basesalary;

                empoyees.push(employee);

                // used in fetchXml for incentiveratings
                rating = new Object();
                rating.level = results.entities[i].bm_employeelevel,
                rating.score = results.entities[i].bm_employeescore;
                ratingObj.push(rating);
            }

            // getIncentiveRatings();
        },
        function(error) {
            showerror(error.message);
        }
    );
}

function getIncentiveRatings() {
    // fetchXml for bm_employeeincentiverating
    var fetchXml = "<fetch>" +
                        "<entity name='bm_employeeincentiverating'>" +
                            "<attribute name='bm_empscore' />" +
                            "<attribute name='bm_employeelevel' />" +
                            "<attribute name='bm_percent' />" +
                            "<attribute name='bm_bmpscore' />" +
                            "<filter type='or'>";
                            for (var i in ratingObj) {
                                fetchXml += "<filter type='and'><condition attribute='bm_empscore' operator='eq' value='" + ratingObj[i].score +"'/>" + 
                                "<condition attribute='bm_employeelevel' operator='eq' value='" + ratingObj[i].level +"'/>" +
                                "<condition attribute='bm_bmpscore' operator='eq' value='" + bm_organizationscore +"'/></filter>";
                            }
                            fetchXml += "</filter></entity>" +
                    "</fetch>";
    fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
    Xrm.WebApi.retrieveMultipleRecords("bm_employeeincentiverating", fetchXml).then(
        function success(result) {
            for (var i = 0; i < result.entities.length; i++) {
                for(var j = 0; j < incentivedetails.length; j++) {
                    // Check the combinations to get percentage
                    if(employees[j].bm_employeelevel === result.entities[i].bm_employeelevel && 
                        employees[j].bm_employeescore === result.entities[i].bm_empscore &&
                        bm_organizationscore === result.entities[i].bm_bmpscore) {
                        // employees[j].bm_employeelevel = result.entities[i].bm_employeelevel;
                        // employees[j].bm_employeescore = result.entities[i].bm_empscore;
                        employees[j].bm_percentage = result.entities[i].bm_percent;
                        // employees[j].bm_orgscore = bm_organizationscore;
                    }
                }
            }
        },
        function (error) {
            showerror(error.message);
        }
    );    
}

// Calculate semifinal award, roundedup award from base salary and percentage. 
function CalculateAwards(context) {
    employees.forEach((incentivedetail, index, array) => {
        var bsalary = incentivedetail.bm_basesalary;
        var bmpercent = incentivedetail.bm_percentage;
        var semifinalaward = (bsalary * bmpercent) / 100;
        finalawardroundedup = Math.round(semifinalaward / 100) * 100;
        incentiveaspercentageofsalary = (finalawardroundedup / bsalary) * 100;
        incentivedetail.bm_finalaward = semifinalaward;
        incentivedetail.bm_finalawardroundedup = finalawardroundedup;
        incentivedetail.bm_incentiveaspercentofsalary = incentiveaspercentageofsalary;
        incentivedetail.bm_bmpboostforoutstandingorexceptionalscore = semifinalaward;
    });

    // Batch create here
    var data = [];
    data.push('--batch_123456');
    data.push('Content-Type: multipart/mixed;boundary=changeset_BBB457');
    data.push('');
    for (i = 0; i < employees.length; i++) {
        var entity = {};
        entity.bm_bmpboostforoutstandingorexceptionalscore = employees[i].bm_bmpboostforoutstandingorexceptionalscore;
        entity.bm_finalaward = employees[i].bm_finalaward;
        entity.bm_finalawardroundedup = employees[i].bm_finalawardroundedup;
        entity.bm_incentiveaspercentofsalary = employees[i].bm_incentiveaspercentofsalary;
        data.push('--changeset_BBB457');
        data.push('Content-Type:application/http');
        data.push('Content-Transfer-Encoding:binary');
        var id = i + 1;
        data.push('Content-ID:' + id);
        data.push('');

        // TODO: URL needs to be changed for the batch create
        data.push('POST ' + parent.Xrm.Page.context.getClientUrl() + '/api/data/v9.1/bm_incentivedetails HTTP/1.1');
        data.push('Content-Type:application/json;type=entry');
        data.push('');
        data.push(JSON.stringify(entity));
    }
    employees = [];
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
                HideProgressIndicator();
            },
            error: function (error) {
                // alert(JSON.stringify(error));
                console.log("Error is => " + error);
            }
        });
}

function ShowProgressIndicator() {
    Xrm.Utility.showProgressIndicator("Processing");
    // setTimeout('HideProgressIndicator()', 5000);
}
   
function HideProgressIndicator() {
    Xrm.Utility.closeProgressIndicator();
}

function showerror(error) {
    var alertStrings = { confirmButtonLabel: "Ok", text: error, title: "Error" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
}