function ClosePhoneCall(executionContext) {
    var formContext = executionContext.getFormContext();

    formContext.data.entity.addOnPostSave(successCallback);

}
function successCallback(executionContext) {
    var formContext2 = executionContext.getFormContext();
    var pcallId = formContext2.data.entity.getId();
    var activity = formContext2.getAttribute("ss_markcomplete").getValue();
    if (activity == true) {
        if (pcallId) {
            var entity = {};
            entity.statecode = 1;
            entity.statuscode = 2;
            Xrm.WebApi.online.updateRecord("phonecall", pcallId, entity).then(
                function success(result) {
                    var updatedEntityId = result.id;
                },
                function (error) {
                    Xrm.Utility.alertDialog(error.message);
                }
            );
        }
    }
}
