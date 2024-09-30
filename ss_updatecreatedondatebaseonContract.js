function updatecreatedondatebaseonContract(executionContext)
{
    var formcontext = executionContext.GetFormContext();
    var parameters = {};
var entity = {};
entity.id = "";
entity.entityType = "account";
parameters.entity = entity;
parameters.UploadContract = "yes";
parameters.CreatedOn = JSON.stringify(new Date("03/01/2021 00:00:00").toISOString());

var ss_UpdatecreatedondatebaseonContractRequest = {
    entity: parameters.entity,
    UploadContract: parameters.UploadContract,
    CreatedOn: parameters.CreatedOn,

    getMetadata: function() {
        return {
            boundParameter: "entity",
            parameterTypes: {
                "entity": {
                    "typeName": "mscrm.account",
                    "structuralProperty": 5
                },
                "UploadContract": {
                    "typeName": "Edm.String",
                    "structuralProperty": 1
                },
                "CreatedOn": {
                    "typeName": "Edm.DateTimeOffset",
                    "structuralProperty": 1
                }
            },
            operationType: 0,
            operationName: "ss_UpdatecreatedondatebaseonContract"
        };
    }
};

Xrm.WebApi.online.execute(ss_UpdatecreatedondatebaseonContractRequest).then(
    function success(result) {
        if (result.ok) {
            var results = JSON.parse(result.responseText);
        }
    },
    function(error) {
        Xrm.Utility.alertDialog(error.message);
    }
);
}