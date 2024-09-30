// JavaScript source code
function OnLoad(executionContext) {
 var executionContext= executionContext.getFormContext();
    LoadFetchXML(executionContext);
}
function LoadFetchXML(executionContext) {
    //This will get the related products grid details and store in a variable.
    var relatedProducts = document.getElementById("Telefonanrufe");
    //This method is to ensure that grid is loaded before processing.
    if (relatedProducts == null || relatedProducts.readyState != "complete") {
        //This statement is used to wait for 2 seconds and recall the function until the grid is loaded.
        //"LoadFetchXML(executionContext)"
        setTimeout('LoadFetchXML(executionContext)', 2000);
        return;
    }
    
    var duedatefield = executionContext.getFormContext().data.entity.attributes.get("scheduledend");
    var accountField = executionContext.getFormContext().data.entity.attributes.get("from");
    if (duedatefield && accountField) {
        var duedatevalue = duedatefield.getValue();
        var FromLookup = accountField.getValue();

        if (duedatevalue && FromLookup && FromLookup.length > 0) {
            var FromDetails = FromLookup[0];
            var accountid = FromDetails.id;
            var name = FromDetails.name;
            var TypeName = FromDetails.typename;

            //var accountid,accountName;
            var d = new Date(duedatevalue);
            var formateddate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            //This is the fetch xml code which will retrieve all the order products related to the order selected for the case.
            //alert("fetchXML");
            var fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>" +
                "<entity name='phonecall'>" +
                    "<attribute name='subject' />" +
                    "<attribute name='statecode' />" +
                    "<attribute name='prioritycode' />" +
                    "<attribute name='scheduledend' />" +
                    "<attribute name='createdby' />" +
                    "<attribute name='regardingobjectid' />" +
                    "<attribute name='activityid' />" +
                    "<order attribute='subject' descending='false' />" +
                    "<filter type='and'>" +
                        "<condition attribute='scheduledend' operator='on' value='" + formateddate + "' />" +
                    "</filter>" +
                    "<link-entity name='activityparty' from='activityid' to='activityid' alias='ac'>" +
                        "<link-entity name='" + TypeName + "' from='" + TypeName + "id' to='partyid' alias='ad'>" +
                            "<filter type='and'>" +
                                "<condition attribute='" + TypeName + "id' operator='eq' uiname='" + name + "' uitype='" + TypeName + "' value='" + accountid + "' />" +
                            "</filter>" +
                        "</link-entity>" +
                    "</link-entity>" +
                "</entity>" +
             "</fetch>";

            //var fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
            //        "<entity name='phonecall'>" +
            //            "<attribute name='subject' />" +
            //            "<attribute name='scheduledend' />" +
            //            "<attribute name='regardingobjectid' />" +
            //            //"<order attribute='subject' descending='false' />" +
            //            "<filter type='and'>" +
            //                "<condition attribute='scheduledend' operator='on' value='" + formateddate + "' />" +
            //            "</filter>" +
            //            "<link-entity name='activityparty' to='activityid' from='activityid'>" +
            //                "<link-entity name='" + TypeName + "' to='partyid' from='" + TypeName + "id'>" +
            //                    "<filter type='and'>" +
            //                        "<condition attribute='" + TypeName + "id' value='" + accountid + "' operator='eq' />" +
            //                    "</filter>" +
            //                "</link-entity>" +
            //            "</link-entity>" +
            //            "</entity>" +
            //        "</fetch>";
            //Setting the fetch xml to the sub grid.
            relatedProducts.control.SetParameter("fetchXml", fetchXml);
            //This statement will refresh the sub grid after making all modifications.
            relatedProducts.control.refresh();
            executionContext.getFormContext().ui.tabs.get("phonecall").sections.get("tab_2_section_2").setVisible(true);
        }
        else {
            executionContext.getFormContext().ui.tabs.get("phonecall").sections.get("tab_2_section_2").setVisible(false);
        }
    }
    else {
        //hide
        executionContext.getFormContext().ui.tabs.get("phonecall").sections.get("tab_2_section_2").setVisible(false);
    }
}

var PhoneNumber;
function Addphonenumbertophonecall(executionContext) {
    debugger;
    var PhoneNo = executionContext.getFormContext().getAttribute("phonenumber").getValue();
    var lookupfieldvalue = executionContext.getFormContext().getAttribute("to").getValue();

    if (executionContext.getFormContext().data.entity.attributes.get("to").getValue() != null) {
        var lookUpGuid = lookupfieldvalue[0].id;
        var lookupEntityName = lookupfieldvalue[0].entityType;
        var FormType = executionContext.getFormContext().ui.getFormType();
        lookUpGuid = lookUpGuid.replace("{", "").replace("}", "");

        if (FormType == 1) {
            if (PhoneNo == "" || PhoneNo == null) {
                if (lookupEntityName == "account") {

    //                SDK.REST.retrieveRecord(lookUpGuid, "Account", "Telephone1", null, retrievePhoneNo, errorHandler);


                    Xrm.WebApi.retrieveRecord("account", lookUpGuid, "?$select=telephone1").then(
                        function success(results){
//                            var results = JSON.parse(this.response)
                            retrievePhoneNo(executionContext,results);
                        },
                        function (error){
                            // Xrm.Utility.alertDialog(error.message);
                            var message = { confirmButtonLabel: "Ok", text: error.message + "Web Api Failed, Count couldn't retrieve record from Account; bb_PhoneCall #611." };
                            var alertOptions = { height: 150, width: 280 };
                            Xrm.Navigation.openAlertDialog(message, alertOptions).then(
                                function success(result) {
                                    console.log("Alertog closed");
                                },
                                function (error) {
                                    console.log(error.message);
                                }
                            );

                        }
                    );
                }

                if (lookupEntityName == "contact") {
              // SDK.REST.retrieveRecord(lookUpGuid, "Contact", "Telephone1", null, retrievePhoneNo, errorHandler);
                    Xrm.WebApi.retrieveRecord("contact", lookUpGuid, "?$select=telephone1").then(
                        function success(results){
                            //var results = JSON.parse(response);
                            retrievePhoneNo(executionContext,results);
                        }, 
                        function (error){
                            // Xrm.Utility.alertDialog(error.message);
                            var message = { confirmButtonLabel: "Ok", text: error.message + "Web Api Failed, Could not retrieve record from contacts; bb_PhoneCall #612." };
                            var alertOptions = { height: 150, width: 280 };
                            Xrm.Navigation.openAlertDialog(message, alertOptions).then(
                                function success(result) {
                                    console.log("Alertog closed");
                                },
                                function (error) {
                                    console.log(error.message);
                                }
                            );

                        }
                    );
                }

                if (lookupEntityName == "lead") {
                    //   SDK.REST.retrieveRecord(lookUpGuid, "Lead", "Telephone1", null, retrievePhoneNo, errorHandler);
                    Xrm.WebApi.retrieveRecord("lead", lookUpGuid , "?$select=telephone1").then(
                        function success(results){
                            //var results = JSON.parse(this.response);
                            retrievePhoneNo(executionContext,results);
                        },
                        function (error){
                            // Xrm.Utility.alertDialog(error.message);
                            var message = { confirmButtonLabel: "Ok", text: error.message + "Web Api Failed, Could not retrieve record from lead; bb_PhoneCall #613." };
                            var alertOptions = { height: 150, width: 280 };
                            Xrm.Navigation.openAlertDialog(message, alertOptions).then(
                                function success(result) {
                                    console.log("Alertog closed");
                                },
                                function (error) {
                                    console.log(error.message);
                                }
                            );

                        }
                    );
                }
            }
        }
    }
}

 
function retrievePhoneNo(executionContext,result) {
    //PhoneNumber = results.Telephone1;
    if(result["telephone1"] != null && result["telephone1"] !="" && result["telephone1"] !="undefine"){
    if (result["telephone1"]) {
        PhoneNumber = result["telephone1"];
        executionContext.getFormContext().getAttribute("phonenumber").setValue(PhoneNumber);
    }
    }
}

function errorHandler(error) {
    Xrm.Navigation.openErrorDialog(error + "Error in errorHandler Function, bbo_PhoneCall; #614. ").then(successCallback,errorCallback);
}
