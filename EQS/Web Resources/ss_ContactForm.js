// JavaScript source code
// JavaScript source code
// JavaScript source code
function SetLetterSalutation(executionContext) {
    let ssformstatus = executionContext.getFormContext().ui.getFormType();
    console.log("Form Status => "+ssformstatus);
    var SalutationText = "";
    var ss_lettersalutation = executionContext.getFormContext().getAttribute("ss_lettersalutation");
    var bbo_salutation = executionContext.getFormContext().getAttribute("bbo_salutation");
    var bbo_title = executionContext.getFormContext().getAttribute("ss_title");
    var lastname = executionContext.getFormContext().getAttribute("lastname");
    if (bbo_salutation != null) {
        var Salutation = bbo_salutation.getValue();
        var TitleText = bbo_title !== null ? bbo_title.getValue() : null;
        var LName = lastname.getValue();
        if (Salutation != null) {
            //changed by saad to remove double space in case variable's value is null
            } if (Salutation === 864850000) {
                SalutationText = "Sehr geehrter Herr";
            }
            else if (Salutation === 864850001) {
                SalutationText = "Sehr geehrte Frau";
            }
            else if (Salutation === 100000000) {
                SalutationText = "Dear Mr.";
            }
            else if (Salutation === 100000001) {
                SalutationText = "Dear Ms.";
            }
            else if (Salutation === 717800001) {
                SalutationText = "Monsieur";
            }
            else if (Salutation === 717800000) {
                SalutationText = "Mademoiselle";
            }
            else {
                SalutationText = "";
            }
            //

        ss_lettersalutation.setValue(SalutationText);
        ss_lettersalutation.setSubmitMode("always");
        }
}

// JavaScript source code
function setResponsibility(executionContext) {
    var primaryContact = false;
    var reports = false;
    var websitechart = false;
    var press = false;
    var corportewebsite = false;
    var csr = false;
    var disclouse = false;
    var agency = false;
    var IM = false;
    var IR = false;
    var webcast = false;
    var SXML = false;
    var SPR = false;
    var SCC = false;
    var XML = false;
    var LEI = false;
    var Cockpit = false;
    var Compliance = false;
    var SCP = false;
    var IL = false;
    //var SCH = false;
    var ISM = false;
    var DPO=false;
    var REV = false;
    var POM = false;
    var esef= false;
    if (executionContext.getFormContext().getAttribute("ss_primarycontact")) {
        primaryContact = executionContext.getFormContext().getAttribute("ss_primarycontact").getValue();
    }
    if (executionContext.getFormContext().getAttribute("ss_lei")) {
        LEI = executionContext.getFormContext().getAttribute("ss_lei").getValue();
    }

    if (executionContext.getFormContext().getAttribute("bbo_reports")) {
        reports =executionContext.getFormContext().getAttribute("bbo_reports").getValue();
    }

    if (executionContext.getFormContext().getAttribute("bbo_websitecharts")) {
        websitechart = executionContext.getFormContext().getAttribute("bbo_websitecharts").getValue();
    }

    if (executionContext.getFormContext().getAttribute("bbo_press")) {
        press = executionContext.getFormContext().getAttribute("bbo_press").getValue();
    }

    if (executionContext.getFormContext().getAttribute("bbo_corporatewebsite")) {
        corportewebsite = executionContext.getFormContext().getAttribute("bbo_corporatewebsite").getValue();
    }

    if (executionContext.getFormContext().getAttribute("bbo_csr")) {
        csr = executionContext.getFormContext().getAttribute("bbo_csr").getValue();
    }

    if (executionContext.getFormContext().getAttribute("bbo_disclosure")) {
        disclouse = executionContext.getFormContext().getAttribute("bbo_disclosure").getValue();
    }

    if (executionContext.getFormContext().getAttribute("bbo_agency")) {
        agency = executionContext.getFormContext().getAttribute("bbo_agency").getValue();
    }

    if (executionContext.getFormContext().getAttribute("ss_im")) {
        IM = executionContext.getFormContext().getAttribute("ss_im").getValue();
    }

    if (executionContext.getFormContext().getAttribute("ss_investorrelations")) {
        IR = executionContext.getFormContext().getAttribute("ss_investorrelations").getValue();
    }

    if (executionContext.getFormContext().getAttribute("ss_webcast")) {
        webcast = executionContext.getFormContext().getAttribute("ss_webcast").getValue();
    }
    if (executionContext.getFormContext().getAttribute("ss_xml")) {
        XML = executionContext.getFormContext().getAttribute("ss_xml").getValue();
    }
    if (executionContext.getFormContext().getAttribute("ss_sxml")) {
        SXML = executionContext.getFormContext().getAttribute("ss_sxml").getValue();
    }
    if (executionContext.getFormContext().getAttribute("ss_scc")) {
        SCC = executionContext.getFormContext().getAttribute("ss_scc").getValue();
    }
    if (executionContext.getFormContext().getAttribute("ss_spr")) {
        SPR = executionContext.getFormContext().getAttribute("ss_spr").getValue();
    }
    if (executionContext.getFormContext().getAttribute("ss_cockpit")) {
        Cockpit = executionContext.getFormContext().getAttribute("ss_cockpit").getValue();
    }
    if (executionContext.getFormContext().getAttribute("ss_compliance")) {
        Compliance = executionContext.getFormContext().getAttribute("ss_compliance").getValue();
    }
        //for new fileds (Standard compilance SCP and Safe Channel IL)
    if (executionContext.getFormContext().getAttribute("ss_standardcompliance")) {
        SCP = executionContext.getFormContext().getAttribute("ss_standardcompliance").getValue();
    }
    if (executionContext.getFormContext().getAttribute("ss_safechannel")) {
        //SCH-> IL
        IL = executionContext.getFormContext().getAttribute("ss_safechannel").getValue();
    }

     if (executionContext.getFormContext().getAttribute("ss_audit")) {
        REV = executionContext.getFormContext().getAttribute("ss_audit").getValue();
    }

    if (executionContext.getFormContext().getAttribute("ss_informationsecurity")) {
        ISM = executionContext.getFormContext().getAttribute("ss_informationsecurity").getValue();
    }
    if (executionContext.getFormContext().getAttribute("ss_dataprotection")) {
        DPO = executionContext.getFormContext().getAttribute("ss_dataprotection").getValue();
    }
    if (executionContext.getFormContext().getAttribute("ss_esef")) {
        esef = executionContext.getFormContext().getAttribute("ss_esef").getValue();
    }


    // Adding new fields 
    var res = (primaryContact ? "SIR," : "")
               + (SPR ? "SPR," : "")
               + (SXML ? "SXML," : "")
               + (SCC ? "SCC," : "")
               + (IR ? "IR," : "")
               + (press ? "PR," : "")
               + (XML ? "XML," : "")
               + (corportewebsite ? "CC," : "")
               + (reports ? "RE," : "")
              + (websitechart ? "WT," : "")
              + (csr ? "CSR," : "")
              + (disclouse ? "MP," : "")
              + (agency ? "A," : "")
              + (IM ? "IM," : "")
              + (webcast ? "WC," : "")
              + (LEI ? "LEI," : "")
              + (Compliance ? "CP," : "")
              + (Cockpit ? "CO," : "")
              + (SCP ? "SCP," : "")
              + (IL ? "IL," : "")
              + (REV ? "REV," : "")
              + (DPO ? "DPO," : "")
              + (POM ? "POM," : "")
              + (ISM ? "ISM," : "")
              + (esef ? "ESEF," : "");

    var n = res.lastIndexOf(",");
    res = res.substring(0, n);

    executionContext.getFormContext().getAttribute("ss_responsibility").setSubmitMode("always");
    executionContext.getFormContext().getAttribute("ss_responsibility").setValue(res);


}
//Udate Primary Contact on change of PrimaryContact-Status 
var accountName;
var accountPrimaryContact;
var contactName = "";
var primaryContactField;
var currentContactId;
var res = "";
var primarycontactid_name;

function updatePrimaryContactonAccount(executionContext) {

    currentContactId = executionContext.getFormContext().data.entity.getId().replace('{', '').replace('}', '');
    accountName = executionContext.getFormContext().getAttribute("parentcustomerid").getValue();
    contactName = executionContext.getFormContext().getAttribute("fullname").getValue();
    primaryContactField = executionContext.getFormContext().getAttribute("ss_primarycontact");

    if (accountName != null) {
        retrievePrimaryContactFromAccount();
    }
}

function retrievePrimaryContactFromAccount() {
    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v8.0/accounts(" + accountName[0].id.replace("{", "").replace("}", "") + ")?$select=_primarycontactid_value", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var result = JSON.parse(this.response);
                var primarycontactid_value;


                if (result["_primarycontactid_value"]) {
                    var primarycontactid_value = result["_primarycontactid_value"];
                    accountPrimaryContact = primarycontactid_value
                }
                if (result["_primarycontactid_value@OData.Community.Display.V1.FormattedValue"]) {
                    primarycontactid_name = result["_primarycontactid_value@OData.Community.Display.V1.FormattedValue"];
                }
                var primaryContact = primaryContactField.getValue();
                if (primaryContact) {
                    if (primarycontactid_value) {
                        if (currentContactId.toLowerCase() !== primarycontactid_value.toLowerCase()) {
                            confirmPrimaryContactUpdateOnAccount();
                        }
                    }
                    else {
                        UpdatePrimaryContactonAccount(executionContext);
                    }
                }
                else {
                    removePrimaryContactFromAccount();
                }


            }
            else {
                //alert(this.statusText);
            }
        }
    };
    req.send();
}

function confirmPrimaryContactUpdateOnAccount() {
    var message = primarycontactid_name + " is the existing Primary Contact for Account " + accountName[0].name + ". " + contactName + " will be set as the new Primary Contact";
   // Xrm.Utility.alertDialog(message, yesCallBack, null);
    
   var confirmStrings = { text: message, title:"Confirmation" };
var confirmOptions = { height: 200, width: 450 };
Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
function (success) {    
    if (success.confirmed)
       UpdatePrimaryContactonAccount(executionContext);
    else{
       // console.log("Dialog closed using Cancel button or X.");
       }
});
}

function noCallBack() {

    primaryContactField.setValue(false);

}

//function yesCallBack() {
//
//    UpdatePrimaryContactonAccount();
//}
//
function UpdatePrimaryContactonAccount(executionContext) {
    var Id = executionContext.getFormContext().data.entity.getId();
    var entity = {};
    entity["primarycontactid@odata.bind"] = "/contacts(" + Id.replace("{", "").replace("}", "") + ")";

    var req = new XMLHttpRequest();
    req.open("PATCH", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v8.0/accounts(" + accountName[0].id.replace("{", "").replace("}", "") + ")", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 204) {
                //Success - No Return Data - Do Something
                if (accountPrimaryContact != null)
                {
                    retrieveResponsibility();
                }
                else
                {
                   // Xrm.Utility.alertDialog(contactName + " has been updated as the Primary Contact for Account " + accountName[0].name, null);

                    var alertStrings = { confirmButtonLabel: "OK", text: contactName + " has been updated as the Primary Contact for Account " + accountName[0].name, title: "" };
                    var alertOptions = { height: 120, width: 260 };
                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                        function success(result) {
                            //console.log("Alert dialog closed");
                        },
                        function (error) {
                            //console.log(error.message);
                        }
                    );
                }
            }
            else {
                //alert(this.statusText);
            }
        }
    };
    req.send(JSON.stringify(entity));
}


function removePrimaryContactFromAccount() {

    if (accountPrimaryContact != null && currentContactId.toLowerCase() === accountPrimaryContact.toLowerCase()) {

        //var entity = {};
        //entity.primarycontactid = {
        //    Id: null,
        //    LogicalName: null
        //};

        var req = new XMLHttpRequest();
        req.open("DELETE", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v8.0/accounts(" + accountName[0].id.replace("{", "").replace("}", "") + ")/primarycontactid/$ref", true);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 204) {
                    //Success - No Return Data - Do Something
                   // Xrm.Utility.alertDialog(contactName + " has been removed as the Primary Contact for Account " + accountName[0].name, null);
                    var alertStrings = { confirmButtonLabel: "OK", text: contactName + " has been removed as the Primary Contact for Account " + accountName[0].name, title: "" };
                    var alertOptions = { height: 120, width: 260 };
                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                        function success(result) {
                            //console.log("Alert dialog closed");
                        },
                        function (error) {
                            //console.log(error.message);
                        }
                    );
                }
                else {
                    //alert(this.statusText);
                }
            }
        };
        req.send();
    }
}

function setPrimaryContactFlagOnContact() {
    var entity = {};
    entity.ss_primarycontact = false;
    entity.ss_responsibility = res;

    var req = new XMLHttpRequest();
    req.open("PATCH", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v8.0/contacts(" + accountPrimaryContact + ")", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 204) {
                //Success - No Return Data - Do Something
               // Xrm.Utility.alertDialog(contactName + " has been updated as the Primary Contact for Account " + accountName[0].name + " and previous Primary Contact was " + primarycontactid_name, null);
                var alertStrings = { confirmButtonLabel: "OK", text: contactName + " has been removed as the Primary Contact for Account " + accountName[0].name + " and previous Primary Contact was " + primarycontactid_name, title: "" };
                    var alertOptions = { height: 120, width: 260 };
                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                        function success(result) {
                            //console.log("Alert dialog closed");
                        },
                        function (error) {
                            //console.log(error.message);
                        }
                    );
            }
            else {
                //alert(this.statusText);
            }
        }
    };
    req.send(JSON.stringify(entity));
    //SDK.REST.updateRecord(accountPrimaryContact.Id, entity, "Contact", setPrimaryContactFlagOnContactCallBack, showError);
}


function retrieveResponsibility() {

    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v8.0/contacts(" + accountPrimaryContact + ")?$select=ss_responsibility", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var result = JSON.parse(this.response);
                var ss_Responsibility;
                if (result["ss_responsibility"]) {
                    ss_Responsibility = result["ss_responsibility"];
                }
                var index = ss_Responsibility.indexOf("SIR");
                if (index >= 0) {
                    var comma = ss_Responsibility.substring(index, 4);
                    if (comma === "SIR,")
                        res = ss_Responsibility.replace("SIR,", "");
                    else
                        res = ss_Responsibility.replace("SIR", "");

                    setPrimaryContactFlagOnContact();
                }
            }
            else {
                //alert(this.statusText);
            }
        }
    };
    req.send();
}
function showError(error) {
    Xrm.Navigation.openErrorDialog(error).then(successCallback,errorCallback);
}