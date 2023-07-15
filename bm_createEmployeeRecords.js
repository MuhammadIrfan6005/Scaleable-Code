function createEmployeeRecords(executionContext) {
    var context = executionContext.getFormContext();
    var fetchXml = [
        "<fetch count='500' page='1' paging-cookie=''>",
        "   <entity name = 'bm_employee'>",
        "       <attribute name = 'bm_name' />",
        "       <attribute name = 'bm_hiredate' />",
        "       <attribute name = 'bm_basesalary' />",
        "       <attribute name = 'bm_employelevel' />",
        "   </entity>",
        "</fetch> "
    ].join("");
    var fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
    Xrm.WebApi.online.retrieveMultipleRecords("bm_employee", fetchXml).then(
        function success(results) {
            for (var i = 0; i < results.entities.length; i++) {
                var bm_basesalary = results.entities[i]["bm_basesalary"];
                var bm_basesalary_formatted = results.entities[i]["bm_basesalary@OData.Community.Display.V1.FormattedValue"];
                var bm_employelevel = results.entities[i]["bm_employelevel"];
                var bm_employelevel_formatted = results.entities[i]["bm_employelevel@OData.Community.Display.V1.FormattedValue"];
                var bm_employescore = results.entities[i]["bm_employescore"];
                var bm_employescore_formatted = results.entities[i]["bm_employescore@OData.Community.Display.V1.FormattedValue"];
                var bm_hiredate = results.entities[i]["bm_hiredate"];
                var bm_name = results.entities[i]["bm_name"];
            }
        },
        function(error) {
            showerror(error.message);
        }
    );
}

function bulkCreate(entitiesCollection, context) {
}

function showerror(error) {
    var alertStrings = { confirmButtonLabel: "Ok", text: error, title: "Error" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
}