
function GetSelectedRecordsId(PrimaryControl) {
    var formContext = PrimaryControl;
    var entityName = formContext.data.entity.getEntityName();
    var selectedEntityReferences = [];
    var sGuids = [];
    var Note_Dec = Document_Name = accountid = opportunityid = customentitytype = "";
    if (entityName === "opportunity") {
        accountid = formContext.getAttribute("parentaccountid").getValue()[0].id;
        opportunityid = formContext.data.entity.getId().replace("{", "").replace("}", "");
        customentitytype = entityName;
        var sRows = formContext.getControl("XMLQuotes").getGrid().getSelectedRows();
    sRows.forEach(function (selectedRow, i) {
        selectedEntityReferences.push(selectedRow.getData().getEntity().getId().replace("{", "").replace("}", ""));
    });
    for (let i = 0; i < selectedEntityReferences.length; i++) {
        sGuids.push(selectedEntityReferences[i]);
    }
        Note_Dec = "{--ByCustomEntity";
        Document_Name = "New XML Quote Price Calculations - By Custom Entity";
        entityName = "ss_xmlquotetemplate";
    }
    else if(entityName === "account") {
        var parentaccount = formContext.getAttribute("parentaccountid").getValue();
        accountid = formContext.data.entity.getId().replace("{", "").replace("}", "");
        customentitytype = entityName;   
        var sRows = "";                            
        if(formContext.getControl("XML_QuotesBy_ParentFirma").getGrid().getSelectedRows() !== null) {
            sRows =  formContext.getControl("XML_QuotesBy_ParentFirma").getGrid().getSelectedRows();
        }
        else if (formContext.getControl("XML_QuotesBy_Firma").getGrid().getSelectedRows() !== null) {
            sRows = formContext.getControl("XML_QuotesBy_Firma").getGrid().getSelectedRows();
        }
        
        sRows.forEach(function (selectedRow, i) {
            selectedEntityReferences.push(selectedRow.getData().getEntity().getId().replace("{", "").replace("}", ""));
        });
        for (let i = 0; i < selectedEntityReferences.length; i++) {
            sGuids.push(selectedEntityReferences[i]);
        }
            Note_Dec = "{--ByCustomEntity";
            Document_Name = "New XML Quote Price Calculations - By Custom Entity";
            entityName = "ss_xmlquotetemplate";
    }
    var currentrecordid = formContext.data.entity.getId().replace("{", "").replace("}", "");
    

    var entity = {};
    if(accountid !== null && accountid !== "") {
        entity["ss_account@odata.bind"] = "/accounts(" + accountid.replace("{", "").replace("}", "") + ")";
    }
    if(opportunityid !== null && opportunityid !== "") {
        entity["ss_opportunity@odata.bind"] = "/opportunities(" + opportunityid + ")";
    }
    entity.ss_name = formContext.getAttribute("name").getValue();
    Xrm.WebApi.online.createRecord("ss_xmlquotetemplate", entity).then(
        function success(result) {
            var newEntityId = result.id;
            var data = [];
            data.push('--batch_123456');
            data.push('Content-Type: multipart/mixed;boundary=changeset_BBB457');
            data.push('');
            for (i = 0; i < sGuids.length; i++) {
                var entity = {};
                entity["ss_xmlquotetemplateid@odata.bind"] = "/ss_xmlquotetemplates(" + newEntityId + ")";
                data.push('--changeset_BBB457');
                data.push('Content-Type:application/http');
                data.push('Content-Transfer-Encoding:binary');
                var id = i + 1;
                data.push('Content-ID:' + id);
                data.push('');
                data.push('PATCH ' + parent.Xrm.Page.context.getClientUrl() + '/api/data/v8.2/quotes(' + sGuids[i] + ') HTTP/1.1');
                data.push('Content-Type:application/json;type=entry');
                data.push('');
                data.push(JSON.stringify(entity));
            }
            data.push('--changeset_BBB457--');
            //end of batch
            data.push('--batch_123456--');
            var payload = data.join('\r\n');
            parent.$.ajax(
                {
                    method: 'POST',
                    url: parent.Xrm.Page.context.getClientUrl() + '/api/data/v8.2/$batch',
                    headers: {
                        'Content-Type': 'multipart/mixed;boundary=batch_123456',
                        'Accept': 'application/json',
                        'Odata-MaxVersion': '4.0',
                        'Odata-Version': '4.0'
                    },
                    data: payload,
                    async: false,
                    success: function (data) {
                        callactionfordocument(newEntityId, Document_Name, Note_Dec, entityName, currentrecordid, customentitytype);
                    },
                    error: function (error) {
                        alert(JSON.stringify(error));
                        console.log("Error is => " + error);
                    }
                });
        },
        function (error) {
            ShowErrorDialog(error.message);
        }
    );
}

function callactionfordocument(newEntityId, Document_Name, Note_Dec, entityName, currentrecordid, customentitytype) {
    var parameters = {};
    parameters.customentitytype = customentitytype;
    parameters.recordid = currentrecordid;
    parameters.documentname = Document_Name;
    parameters.notedescription = Note_Dec;
    parameters.entitytype = entityName;
    parameters.noteobjectid = newEntityId.replace("{", "").replace("}", "");
    var ss_XMLQuoteDocumentGeneratorRequest = {
        customentitytype: parameters.customentitytype,
        noteobjectid: parameters.noteobjectid,
        recordid: parameters.recordid,
        documentname: parameters.documentname,
        notedescription: parameters.notedescription,
        entitytype: parameters.entitytype,

        getMetadata: function() {
            return {
                boundParameter: null,
                parameterTypes: {
                    "customentitytype": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                    "noteobjectid": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                    "recordid": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                    "documentname": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                    "notedescription": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                    "entitytype": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    }
                },
                operationType: 0,
                operationName: "ss_XMLQuoteDocumentGenerator"
            };
        }
    };

    Xrm.WebApi.online.execute(ss_XMLQuoteDocumentGeneratorRequest).then(
        function success(result) {
            if (result.ok) {
                result.json().then(function (results) {
                    if (results.csvjson !== null && results.csvjson !== "") {
                        var JsonResult = results.result;
                        ShowAlertDialog(JsonResult);
                    }
                    else {
                        ShowErrorDialog("Json Result is empty..");

                    }
                },
                    function (error) {
                        ShowErrorDialog(error.message);
                    });
            }


        },
        function (error) {
            ShowErrorDialog(error.message);
        }
    );
}
function ShowErrorDialog(ErrorMessage) {
    var alertStrings = { confirmButtonLabel: "OK", text: ErrorMessage, title: "Error" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
        function (success) {
            console.log("Alert dialog closed");
        },
        function (error) {
            console.log(error.message);
        }
    );
}
function ShowAlertDialog(Message) {
    var alertStrings = { confirmButtonLabel: "OK", text: Message, title: "Result!" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
        function (success) {
            console.log("Alert dialog closed");
        },
        function (error) {
            console.log(error.message);
        }
    );
}