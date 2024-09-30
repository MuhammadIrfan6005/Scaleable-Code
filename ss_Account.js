// JavaScript source code
// Show/hide Client Agency Section based on the Agency field. 
function ShowClientAgency(executionContext) {
    agencyField = executionContext.getFormContext().getAttribute("bbo_agency");
    if (agencyField != null) agency = agencyField.getValue();
    summaryTab =  executionContext.getFormContext().ui.tabs.get("SUMMARY_TAB");
    if (summaryTab != null) {
        sectionClientAgency = summaryTab.sections.get("Section_Client_Agency");
        if (sectionClientAgency != null) sectionClientAgency.setVisible(agency);
    }
}

var sysAdminRole = false;
var roleNewsroom = false;
var roleSystemCustomizer = false;

function CheckUserRole(executionContext) {
 
    var serverURL = executionContext.getFormContext().context.getClientUrl();
//    var entity = "roles";
//    var descQuery = "?$select=name&$filter=";
   var filter = "";
    var currentUserRoles = executionContext.getFormContext().context.getUserRoles();
    
  
   var data = [];
       Xrm.WebApi.retrieveMultipleRecords("roles", "?$select=name,roleid").then(
            function success(result) {
         
                for (var i = 0; i < result.entities.length; i++) {
                 for (var j = 0; j < currentUserRoles.length; j++) {
                    filter = currentUserRoles[j];
                    if(filter == result.entities[i].roleid){
                    data.push(result.entities[i]);
//                    console.log(data);
                    }
                    }
              }
              // console.log(data); 
              //console.log(data.length);
              if(data != null && data != "" && typeof(data) != "undefined"){
                 retrieveRoleNameCallBack(data,executionContext);
                }                 
            // perform additional operations on retrieved records
            },
            function (error) {
                // Xrm.Utility.alertDialog(error.message);
                var message = { confirmButtonLabel: "Ok", text: error.message + "Web Api Failed,Could not retrieve multiple records from roles; ss_Account #611. " };
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

function retrieveRoleNameCallBack(results,executionContext) {
   
    for (var i = 0; i < results.length; i++) {
        if (results[i].name == "System Administrator") {
            sysAdminRole = true;
            break;
        }
        if (results[i].name == "Newsroom") {
            roleNewsroom = true;
            break;
        }
        if (results[i].name == "System Customizer Asia") {
            roleSystemCustomizer = true;
            break;
        }
    }

    MakeAcountFieldReadonly(executionContext);

}

    
function errorHandler(error) {
//    Xrm.Navigation.openAlertDialog(error.message, null);
    Xrm.Navigation.openErrorDialog(error + "Error in errorHandler function; ss_Account #612. ").then(successCallback,errorCallback);
}
function completeFunction()
{ }

function MakeAcountFieldReadonly(executionContext) {

    var NavId1 = executionContext.getFormContext().getAttribute("bbo_navid");
    var NavId2 = executionContext.getFormContext().getAttribute("ss_navid2");
    var NavId3 = executionContext.getFormContext().getAttribute("ss_navid3");
    var Equitystoryid = executionContext.getFormContext().getAttribute("bbo_equitystoryid");
    var XMLVertragStyp = executionContext.getFormContext().getAttribute("new_xmlvertragstyp");
    var TugVertragStyp = executionContext.getFormContext().getAttribute("new_tugvertragstyp");


    if ((!sysAdminRole && !roleNewsroom && !roleSystemCustomizer) && NavId1.getValue() != null) {
        NavId1.setSubmitMode("always");
      executionContext.getFormContext().ui.controls.get("bbo_navid").setDisabled(true);
    }
    if ((!sysAdminRole && !roleNewsroom && !roleSystemCustomizer) && NavId2.getValue() != null) {
        NavId2.setSubmitMode("always");
        executionContext.getFormContext().ui.controls.get("ss_navid2").setDisabled(true);
    }
    if ((!sysAdminRole && !roleNewsroom && !roleSystemCustomizer) && NavId3.getValue() != null) {
        NavId3.setSubmitMode("always");
        executionContext.getFormContext().ui.controls.get("ss_navid3").setDisabled(true);
    }
    if ((!sysAdminRole && !roleNewsroom && !roleSystemCustomizer) && Equitystoryid.getValue() != null) {
        Equitystoryid.setSubmitMode("always");
       executionContext.getFormContext().ui.controls.get("bbo_equitystoryid").setDisabled(true);
    }
    //if (XMLVertragStyp != null && !sysAdminRole && !roleNewsroom && XMLVertragStyp.getValue() != null) {
    //    XMLVertragStyp.setSubmitMode("always");
    //    Xrm.Page.ui.controls.get("new_xmlvertragstyp").setDisabled(true);
    //}
    if (TugVertragStyp != null && !sysAdminRole && !roleNewsroom && TugVertragStyp.getValue() != null) {
        TugVertragStyp.setSubmitMode("always");
        executionContext.getFormContext().ui.controls.get("new_tugvertragstyp").setDisabled(true);
    }
}


//Show/Hide Contacts SubGrid

function HideShowSubGrid(executionContext) {
    setTimeout(function () {
        var gridObj = executionContext.getFormContext().getControl("ContactsRelatedToAccount");
       if (gridObj !== null){
        var allRows = gridObj.getGrid().getRows().getLength();
        if (allRows > 0) {
            gridObj.setVisible(true);
        }
        else {
            gridObj.setVisible(false);
        }
}
    }, 3000);
}

//Set Account ID Field
function SetAccountID(executionContext) {
    var fomrContext = executionContext.getFormContext();
    if(fomrContext.getAttribute("ss_recordid").getValue() === null) {
        fomrContext.getAttribute("ss_recordid").setValue(fomrContext.data.entity.getId().replace("{","").replace("}",""));
    }
}