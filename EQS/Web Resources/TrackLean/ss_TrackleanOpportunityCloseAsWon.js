function getFieldData(primaryControl) {
    console.log("Tracklean Called");
    var ownerid = parent.Xrm.Page.getAttribute("ownerid").getValue()[0].id;
    var contactid = parent.Xrm.Page.getAttribute("parentcontactid").getValue()[0].id;
    var trackleancontact = "";
    if (parent.Xrm.Page.getAttribute("ss_trackleancontact").getValue() != null) {
        trackleancontact = parent.Xrm.Page.getAttribute("ss_trackleancontact").getValue()[0].id;
        trackleancontact = trackleancontact.replace(/[{}]/g, "");
    }
    else {
        trackleancontact = "";
    }
    var formContext = primaryControl;
    var OppID = formContext.data.entity.getId();
    OppID = OppID.replace(/[{}]/g, "");
    if (ownerid != null) {
        ownerid = ownerid.replace(/[{}]/g, "");
        //alert("id=>"+ownerid);
    }
    ////////////////*********************************
    getbusinessUnit(OppID, contactid, ownerid, trackleancontact, getContactEmail);
    //getbusinessUnit(OppID,contactid,trackleancontact,ownerid,getContactEmail);
}
function getbusinessUnit(OppID, contactid, ownerid, trackleancontact, getContactEmail) {
    //console.log("getbusinessUnit called");
    Xrm.WebApi.online.retrieveRecord("systemuser", ownerid, "?$select=_businessunitid_value").then(
        function success(result) {
            var _businessunitid_value = result["_businessunitid_value"];
            var _businessunitid_value_formatted = result["_businessunitid_value@OData.Community.Display.V1.FormattedValue"];
            var _businessunitid_value_lookuplogicalname = result["_businessunitid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
            //alert(_businessunitid_value_formatted);
            getContactEmail(contactid, OppID, trackleancontact, gettrackleanacontactemial);
        },
        function (error) {
            Xrm.Utility.alertDialog(error.message);
        }
    );
}
function getContactEmail(contactid, OppID, trackleancontact, gettrackleanacontactemial) {
    //console.log("getContactEmail called");
    Xrm.WebApi.online.retrieveRecord("contact", contactid, "?$select=emailaddress1").then(
        function success(result) {
            var emailaddress1 = result["emailaddress1"];
            if (emailaddress1 == null || emailaddress1 == undefined || emailaddress1 == "") {
                alert("Contact's Email is missing");
            } else {
                gettrackleanacontactemial(OppID, trackleancontact, emailaddress1, getNotes);
                //getNotes(OppID,emailaddress1,ActionCall);
            }

            //alert("emailaddress=>"+email);
        },
        function (error) {
            Xrm.Utility.alertDialog(error.message);
        }
    );
}
function gettrackleanacontactemial(OppID, trackleancontact, emailaddress1, getNotes) {
    if (trackleancontact) {
        Xrm.WebApi.online.retrieveRecord("contact", trackleancontact, "?$select=emailaddress1").then(
            function success(result) {
                var emailaddress2 = result["emailaddress1"];
                if (emailaddress2 == null || emailaddress2 == undefined || emailaddress2 == "") {
                    alert("Tracklean Contact's Email is missing");
                } else {
                    //gettrackleanacontactemial(OppID,trackleancontact,emailaddress1,getNotes);
                    emailaddress1 += "," + emailaddress2;
                    getNotes(OppID, emailaddress1, ActionCall)
                }

                //alert("emailaddress=>"+email);
            },
            function (error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );
    }
    else {
        getNotes(OppID, emailaddress1, ActionCall)
    }
}
function getNotes(OppID, email, ActionCall) {
    //console.log("getNotes called");
    Xrm.WebApi.online.retrieveMultipleRecords("annotation", "?$select=filename,documentbody,_objectid_value,mimetype,subject&$filter=_objectid_value eq " + OppID + "").then(
        function success(results) {
            let found = 0;
            if (results.entities.length > 0) {
                for (var i = 0; i < results.entities.length; i++) {
                    var documentbody = results.entities[i]["documentbody"];
                    var filename = results.entities[i]["filename"];
                    var _objectid_value = results.entities[i]["_objectid_value"];
                    var _objectid_value_formatted = results.entities[i]["_objectid_value@OData.Community.Display.V1.FormattedValue"];
                    var _objectid_value_lookuplogicalname = results.entities[i]["_objectid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                    var subject = results.entities[i]["subject"];

                    if (results.entities[i]["mimetype"] == "application/pdf") {
                        if (documentbody == null || documentbody == undefined || documentbody == "") {
                            alert("Contract file is empty, please upload valid Contract");
                        } else {
                            found = 1;
                            //alert("Contract Name: "+filename);
                            if (confirm("Contract Name: \n" + filename + " \nAre you sure you want to send this contract to \nContact's Email:  " + email + " ?")) {
                                ActionCall(documentbody, email, filename);
                            } else {

                            }

                        } // end document body if else

                    } //end mime type if
                } // end for loop
                if (found == 0) alert("There is not pdf contract file, please upload pdf file");
            } else {
                alert("Contract is missing, please upload the contract");
            } //end length if else

        },
        function (error) {
            Xrm.Utility.alertDialog(error.message);
        }
    );
}
function ActionCall(document, email, filename) {
    var id = Xrm.Page.data.entity.getId();
    id = id.replace("{", "").replace("}", "");
    var parameters = {};
    var entity = {};
    entity.id = id;
    entity.entityType = "opportunity";
    parameters.entity = entity;
    parameters.fileName = filename + "_@/" + id;
    parameters.contractBody = document;
    parameters.contactEmail = email;

    var ss_TrackLeanAPIRequest = {
        entity: parameters.entity,
        fileName: parameters.fileName,
        contractBody: parameters.contractBody,
        contactEmail: parameters.contactEmail,

        getMetadata: function () {
            return {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "mscrm.opportunity",
                        "structuralProperty": 5
                    },
                    "fileName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                    "contractBody": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                    "contactEmail": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    }
                },
                operationType: 0,
                operationName: "ss_TrackLeanAPI"
            };
        }
    };

    Xrm.WebApi.online.execute(ss_TrackLeanAPIRequest).then(
        function success(result) {
            if (result.ok) {
                alert("Contract Sent Successfully, Contract name: " + filename);
            }
        },
        function (error) {
            Xrm.Utility.alertDialog(error.message); alert("Failed, Something Went Wrong. #Action");
            //         console.log("Request Error =>"+error.message)
        }
    );


    // var id = Xrm.Page.data.entity.getId();
    // id = id.replace("{","").replace("}","");
    // console.log("ActionCall called, base64 Length: "+document.length);
    // debugger;
    // //alert("Action email"+email);
    // //alert("Action document=>"+document);
    // var parameters = {};
    // var entity = {};
    // entity.id = id;
    // entity.entityType = "opportunity";
    // parameters.entity = entity;
    // parameters.fileName = filename;
    // parameters.contractBody = document;
    // parameters.contactEmail = email;

    // //alert("Action"+parameters.contractBody);
    // var ss_TrackLeanAPIRequest = {
    //     entity: parameters.entity,
    //     fileName: parameters.fileName,
    //     contractBody: parameters.contractBody,
    //     contactEmail: parameters.contactEmail,

    //     getMetadata: function() {
    //         return {
    //             boundParameter: "entity",
    //             parameterTypes: {
    //                 "entity": {
    //                     "typeName": "mscrm.opportunity",
    //                     "structuralProperty": 5
    //                 },
    //                 "contractBody": {
    //                     "typeName": "Edm.String",
    //                     "structuralProperty": 1
    //                 },
    //                 "contactEmail": {
    //                     "typeName": "Edm.String",
    //                     "structuralProperty": 1
    //                 }
    //             },
    //             operationType: 0,
    //             operationName: "ss_TrackLeanAPI"
    //         };
    //     }
    // };
    // Xrm.WebApi.online.execute(ss_TrackLeanAPIRequest).then(
    //     function success(result) {
    //         if (result.ok) {
    //             //Success - No Return Data - Do Something
    //             //console.log("Action Called Successfully");
    //             alert("Action Called Successfully");
    //         }
    //     },
    //     function(error) {
    //         Xrm.Utility.alertDialog(error.message);alert("Failed, Something Went Wrong.");
    //         console.log("Request Error =>"+error.message)
    //     }
    // );
}