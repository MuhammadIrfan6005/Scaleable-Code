// JavaScript source code
var ss_accountcontractextraid = ""
var accountId = "";
var entityname = "";
var productCategory = "";
var productCategoryValue = -1;
var competitor = -1;
var Status = "";
var statusValue = -1;
var IsGreen = false;
var page = 1;
function setcompetitorvalue(executionContext) {
    //debugger;
    var fortype = executionContext.getFormContext().data.entity.attributes.get("ss_formtype").getText();
    if (fortype === "CC") {
        Status = executionContext.getFormContext().data.entity.attributes.get("ss_ccstatus").getText();
        statusValue = executionContext.getFormContext().data.entity.attributes.get("ss_ccstatus").getValue();
    }
    else if (fortype === "IR") {
        Status = executionContext.getFormContext().data.entity.attributes.get("ss_irstatus").getText();
        statusValue = executionContext.getFormContext().data.entity.attributes.get("ss_irstatus").getValue();

    }
    else if (fortype === "PR") {
        Status = executionContext.getFormContext().data.entity.attributes.get("ss_prstatus").getText();
        statusValue = executionContext.getFormContext().data.entity.attributes.get("ss_prstatus").getValue();
    }
    else if (fortype === "XML") {
        Status = executionContext.getFormContext().data.entity.attributes.get("ss_xmlstatus").getText();
        statusValue = executionContext.getFormContext().data.entity.attributes.get("ss_xmlstatus").getValue();
    }
    else if (fortype === "CO") {
        Status = executionContext.getFormContext().data.entity.attributes.get("ss_costatus").getText();
        statusValue = executionContext.getFormContext().data.entity.attributes.get("ss_costatus").getValue();
    }
    if (Status === "competitor") {
        var ss_competitor = executionContext.getFormContext().ui.controls.get("ss_competitor");
        ss_competitor.setVisible(true);
        var originalValue = executionContext.getFormContext().data.entity.attributes.get("ss_competitor").getValue();
        var options = ss_competitor.getAttribute().getOptions();
        if (ss_competitor != null) {
            var productcat = executionContext.getFormContext().data.entity.attributes.get("ss_productcategories").getText(); //ss_productcategories           
            productcat = productcat.split(" ");

            productcat = productcat[0];
            ss_competitor.clearOptions();
            if (productcat === "Regulatory" || productcat === "Newsfeed") {

                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[1]);
                ss_competitor.addOption(options[2]);
                ss_competitor.addOption(options[5]);
                ss_competitor.addOption(options[6]);
                ss_competitor.addOption(options[7]);
                ss_competitor.addOption(options[8]);
                ss_competitor.addOption(options[9]);


            }
                //Charts, Invest Calc., App, IR Website, Portal Network, Quick Analyzer
            else if (productcat === "Charts" || productcat === "App" || productcat === "IR" || productcat === "Portal" || productcat === "Quick") {
                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[3]);
                ss_competitor.addOption(options[10]);
                ss_competitor.addOption(options[11]);
                ss_competitor.addOption(options[9]);

            }
                //Audio/Video Webcasts & Telco
            else if (productcat === "Audio" || productcat === "Telco" || productcat === "Video") {

                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[1]);
                ss_competitor.addOption(options[12]);
                ss_competitor.addOption(options[13]);
                ss_competitor.addOption(options[14]);
                ss_competitor.addOption(options[15]);
                ss_competitor.addOption(options[16]);
                ss_competitor.addOption(options[17]);
                ss_competitor.addOption(options[9]);


            }

                //Online Report:
            else if (productcat === "Online") {

                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[21]);
                ss_competitor.addOption(options[9]);

            }
                //Contact Manager
            else if (productcat === "Contact") {

                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[18]);
                ss_competitor.addOption(options[19]);
                ss_competitor.addOption(options[20]);
                ss_competitor.addOption(options[9]);

            }
                //INSIDER MANAGER
            else if (productcat === "Insider") {

                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[22]);
                ss_competitor.addOption(options[23]);
                ss_competitor.addOption(options[24]);
                ss_competitor.addOption(options[25]);
                ss_competitor.addOption(options[26]);
                ss_competitor.addOption(options[27]);
                ss_competitor.addOption(options[28]);
                ss_competitor.addOption(options[29]);
                ss_competitor.addOption(options[30]);
                ss_competitor.addOption(options[31]);
                ss_competitor.addOption(options[9]);
            }
                //LEI
            else if (productcat === "LEI") {
                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[1]);
                ss_competitor.addOption(options[2]);
                ss_competitor.addOption(options[3]);
                ss_competitor.addOption(options[4]);
                ss_competitor.addOption(options[32]);
                ss_competitor.addOption(options[33]);
                ss_competitor.addOption(options[34]);
                ss_competitor.addOption(options[35]);
                ss_competitor.addOption(options[36]);
                ss_competitor.addOption(options[37]);
                ss_competitor.addOption(options[38]);
                ss_competitor.addOption(options[39]);
                ss_competitor.addOption(options[40]);
                ss_competitor.addOption(options[41]);
                ss_competitor.addOption(options[42]);
                ss_competitor.addOption(options[43]);
                ss_competitor.addOption(options[44]);
                ss_competitor.addOption(options[45]);
                ss_competitor.addOption(options[46]);
                ss_competitor.addOption(options[47]);
                ss_competitor.addOption(options[48]);
                ss_competitor.addOption(options[49]);
                ss_competitor.addOption(options[50]);
                ss_competitor.addOption(options[51]);
                ss_competitor.addOption(options[52]);
                ss_competitor.addOption(options[53]);
                ss_competitor.addOption(options[54]);
                ss_competitor.addOption(options[55]);
                ss_competitor.addOption(options[56]);
                ss_competitor.addOption(options[57]);
                ss_competitor.addOption(options[58]);
                ss_competitor.addOption(options[59]);
                ss_competitor.addOption(options[60]);
                ss_competitor.addOption(options[61]);
                ss_competitor.addOption(options[62]);
                ss_competitor.addOption(options[63]);
                ss_competitor.addOption(options[64]);
                ss_competitor.addOption(options[65]);


            }
            else if (productcat === "Integrity") {
                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[1]);
                ss_competitor.addOption(options[2]);
                ss_competitor.addOption(options[3]);
                ss_competitor.addOption(options[4]);
                ss_competitor.addOption(options[66]);
                ss_competitor.addOption(options[67]);
                ss_competitor.addOption(options[68]);
                ss_competitor.addOption(options[69]);
                ss_competitor.addOption(options[70]);
                ss_competitor.addOption(options[9]);
            }
                // Corp Web & Micro, Fact Sheet,Media Plan,Translation, Others, XML Conversion.
            else {
                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[1]);
                ss_competitor.addOption(options[2]);
                ss_competitor.addOption(options[3]);
                ss_competitor.addOption(options[4]);
            }
            executionContext.getFormContext().data.entity.attributes.get("ss_competitor").setValue(originalValue);
        }
    }
    else {
        var ss_competitor = executionContext.getFormContext().ui.controls.get("ss_competitor");
        executionContext.getFormContext().data.entity.attributes.get("ss_competitor").setValue(0);
        ss_competitor.setVisible(false);
    }
}
function showHideCompitorField(executionContext) {

    var fortype = executionContext.getFormContext().data.entity.attributes.get("ss_formtype").getText();
    if (fortype === "CC") {
        Status = executionContext.getFormContext().data.entity.attributes.get("ss_ccstatus").getText();
        statusValue = executionContext.getFormContext().data.entity.attributes.get("ss_ccstatus").getValue();
    }
    else if (fortype === "IR") {
        Status = executionContext.getFormContext().data.entity.attributes.get("ss_irstatus").getText();
        statusValue = executionContext.getFormContext().data.entity.attributes.get("ss_irstatus").getValue();

    }
    else if (fortype === "PR") {
        Status = executionContext.getFormContext().data.entity.attributes.get("ss_prstatus").getText();
        statusValue = executionContext.getFormContext().data.entity.attributes.get("ss_prstatus").getValue();
    }
    else if (fortype === "XML") {
        Status = executionContext.getFormContext().data.entity.attributes.get("ss_xmlstatus").getText();
        statusValue = executionContext.getFormContext().data.entity.attributes.get("ss_xmlstatus").getValue();
    }
    else if (fortype === "CO") {
        Status = executionContext.getFormContext().data.entity.attributes.get("ss_costatus").getText();
        statusValue = executionContext.getFormContext().data.entity.attributes.get("ss_costatus").getValue();
    }

    if (Status === "competitor") {
        var ss_competitor = executionContext.getFormContext().ui.controls.get("ss_competitor");
        ss_competitor.setVisible(true);
        var options = ss_competitor.getAttribute().getOptions();
        if (ss_competitor != null) {
            var productcat = executionContext.getFormContext().data.entity.attributes.get("ss_productcategories").getText(); //ss_productcategories           
            productcat = productcat.split(" ");

            productcat = productcat[0];
            ss_competitor.clearOptions();
            if (productcat === "Regulatory" || productcat === "Newsfeed") {

                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[1]);
                ss_competitor.addOption(options[2]);
                ss_competitor.addOption(options[5]);
                ss_competitor.addOption(options[6]);
                ss_competitor.addOption(options[7]);
                ss_competitor.addOption(options[8]);
                ss_competitor.addOption(options[9]);


            }
                //Charts, Invest Calc., App, IR Website, Portal Network, Quick Analyzer
            else if (productcat === "Charts" || productcat === "App" || productcat === "IR" || productcat === "Portal" || productcat === "Quick") {
                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[3]);
                ss_competitor.addOption(options[10]);
                ss_competitor.addOption(options[11]);
                ss_competitor.addOption(options[9]);

            }
                //Audio/Video Webcasts & Telco
            else if (productcat === "Audio" || productcat === "Telco" || productcat === "Video") {

                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[1]);
                ss_competitor.addOption(options[12]);
                ss_competitor.addOption(options[13]);
                ss_competitor.addOption(options[14]);
                ss_competitor.addOption(options[15]);
                ss_competitor.addOption(options[16]);
                ss_competitor.addOption(options[17]);
                ss_competitor.addOption(options[9]);


            }

                //Online Report:
            else if (productcat === "Online") {

                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[21]);
                ss_competitor.addOption(options[9]);

            }
                //Contact Manager
            else if (productcat === "Contact") {

                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[18]);
                ss_competitor.addOption(options[19]);
                ss_competitor.addOption(options[20]);
                ss_competitor.addOption(options[9]);

            }
                //INSIDER MANAGER
            else if (productcat === "Insider") {

                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[22]);
                ss_competitor.addOption(options[23]);
                ss_competitor.addOption(options[24]);
                ss_competitor.addOption(options[25]);
                ss_competitor.addOption(options[26]);
                ss_competitor.addOption(options[27]);
                ss_competitor.addOption(options[28]);
                ss_competitor.addOption(options[29]);
                ss_competitor.addOption(options[30]);
                ss_competitor.addOption(options[31]);
                ss_competitor.addOption(options[9]);
            }
            else if (productcat === "Insider") {
                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[1]);
                ss_competitor.addOption(options[2]);
                ss_competitor.addOption(options[3]);
                ss_competitor.addOption(options[4]);
                ss_competitor.addOption(options[32]);
                ss_competitor.addOption(options[33]);
                ss_competitor.addOption(options[34]);
                ss_competitor.addOption(options[35]);
                ss_competitor.addOption(options[36]);
                ss_competitor.addOption(options[37]);
                ss_competitor.addOption(options[38]);
                ss_competitor.addOption(options[39]);
                ss_competitor.addOption(options[40]);
                ss_competitor.addOption(options[41]);
                ss_competitor.addOption(options[42]);
                ss_competitor.addOption(options[43]);
                ss_competitor.addOption(options[44]);
                ss_competitor.addOption(options[45]);
                ss_competitor.addOption(options[46]);
                ss_competitor.addOption(options[47]);
                ss_competitor.addOption(options[48]);
                ss_competitor.addOption(options[49]);
                ss_competitor.addOption(options[50]);
                ss_competitor.addOption(options[51]);
                ss_competitor.addOption(options[52]);
                ss_competitor.addOption(options[53]);
                ss_competitor.addOption(options[54]);
                ss_competitor.addOption(options[55]);
                ss_competitor.addOption(options[56]);
                ss_competitor.addOption(options[57]);
                ss_competitor.addOption(options[58]);
                ss_competitor.addOption(options[59]);
                ss_competitor.addOption(options[60]);
                ss_competitor.addOption(options[61]);
                ss_competitor.addOption(options[62]);
                ss_competitor.addOption(options[63]);
                ss_competitor.addOption(options[64]);
                ss_competitor.addOption(options[65]);

            }
                // Corp Web & Micro, Fact Sheet,Media Plan,Translation, Others, XML Conversion.
            else {
                ss_competitor.addOption(options[0]);
                ss_competitor.addOption(options[1]);
                ss_competitor.addOption(options[2]);
                ss_competitor.addOption(options[3]);
                ss_competitor.addOption(options[4]);
            }
        }



    }
    else {
        var ss_competitor = executionContext.getFormContext().ui.controls.get("ss_competitor");
        if (ss_competitor != null) {
            ss_competitor.setVisible(false);
        }

    }

}


function CreateUpdateContractandExtra(executionContext) {
    executionContext.getFormContext().ui.clearFormNotification();
    var setSave = false;
    if (executionContext.getFormContext().data.entity.attributes.get("ss_accountid").getValue() != null) {
        entityname = executionContext.getFormContext().data.entity.attributes.get("ss_accountid").getValue()[0].entityType;
        accountId = executionContext.getFormContext().data.entity.attributes.get("ss_accountid").getValue()[0].id;
        accountId = accountId.replace("{", "").replace("}", "");
    }
    else if (executionContext.getFormContext().data.entity.attributes.get("regardingobjectid").getValue() != null) { //to
        entityname = executionContext.getFormContext().data.entity.attributes.get("regardingobjectid").getValue()[0].entityType;
        accountId = executionContext.getFormContext().data.entity.attributes.get("regardingobjectid").getValue()[0].id;
        accountId = accountId.replace("{", "").replace("}", "");
    }
    else if (executionContext.getFormContext().data.entity.attributes.get("to").getValue() != null) {
        entityname = executionContext.getFormContext().data.entity.attributes.get("to").getValue()[0].entityType;
        accountId = executionContext.getFormContext().data.entity.attributes.get("to").getValue()[0].id;
        accountId = accountId.replace("{", "").replace("}", "");
    }
    if (executionContext.getFormContext().data.entity.attributes.get("ss_productcategories") != null) {
        productCategory = executionContext.getFormContext().data.entity.attributes.get("ss_productcategories").getText();
        productCategoryValue = executionContext.getFormContext().data.entity.attributes.get("ss_productcategories").getValue();
    }
    if (executionContext.getFormContext().data.entity.attributes.get("ss_competitor").getValue() != null) {
        competitor = executionContext.getFormContext().data.entity.attributes.get("ss_competitor").getValue();
    }
   // console.log("To2 = "+entityname);
    if(entityname === "account"){
            if (productCategory !== "" && productCategory != null && accountId !== "" && accountId != null && accountId !== undefined) { //console.log("ACC ID -" +accountId);
            var req = new XMLHttpRequest();
            req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v8.2/ss_accountcontractextras?$select=ss_accountcontractextraid,ss_contractstartingdate&$filter=_ss_accountcontractextra_value eq " + accountId + " and  ss_name eq '" + encodeURIComponent(productCategory) + "'", true);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                        var results = JSON.parse(this.response);
                        if (results.value.length > 0) {
                            IsGreen = false;
                            ss_accountcontractextraid = results.value[0]["ss_accountcontractextraid"];
                            var ss_contractstartingdate = results.value[0]["ss_contractstartingdate"];

                            if (ss_contractstartingdate != null && ss_contractstartingdate !== undefined) {
                                IsGreen = true;
                            }
                        }
                        if (IsGreen === false) {
                            CheckInvoiceExists();
                        }

                        if (IsGreen === false) {
                            UpdateContractandExtra(executionContext);
                        }
                        else {
                            executionContext.getFormContext().ui.setFormNotification("You Cannot set Product Status against the selected Product category. ", "ERROR");
                            setSave = true;
                        }

                    } else {
                        //Xrm.Utility.alertDialog(this.statusText);
                        var message = { confirmButtonLabel: "Ok", text: this.statusText+ "  Web Api Failed ss_TrackingActivitiesBasedOnProductCategories #611 " }; 
                        var alertOptions = { height: 150, width: 280 }; 
                        Xrm.Navigation.openAlertDialog(message, alertOptions).then( 
                            function success(result) { 
                                //console.log("Alertog closed"); 
                            }, 
                            function (error) { 
                               // console.log(error.message); 
                            } 
                        );
                    }
                }
            };
            req.send();
        }  
    }  // entityname condition end
    
    if (setSave) {
      //  executionContext.getEventArgs().preventDefault();//executionContext.getEventArgs()
    }
}

//For tasks only//

function TasksCreateUpdateContractandExtra(executionContext) {
    executionContext.getFormContext().ui.clearFormNotification();
    var setSave = false;
    if (executionContext.getFormContext().data.entity.attributes.get("regardingobjectid").getValue() != null) {
        entityname = executionContext.getFormContext().data.entity.attributes.get("regardingobjectid").getValue()[0].entityType;
        accountId = executionContext.getFormContext().data.entity.attributes.get("regardingobjectid").getValue()[0].id;
        accountId = accountId.replace("{", "").replace("}", "");
    }
    if (executionContext.getFormContext().data.entity.attributes.get("ss_productcategories") != null) {
        entityname = executionContext.getFormContext().data.entity.attributes.get("regardingobjectid").getValue()[0].entityType;
        productCategory = executionContext.getFormContext().data.entity.attributes.get("ss_productcategories").getText();
        productCategoryValue = executionContext.getFormContext().data.entity.attributes.get("ss_productcategories").getValue();
    }
    if (executionContext.getFormContext().data.entity.attributes.get("ss_competitor").getValue() != null) {
        competitor = executionContext.getFormContext().data.entity.attributes.get("ss_competitor").getValue();
    }

    if(entityname === "account"){
        if (productCategory !== "" && productCategory != null && accountId !== "" && accountId != null && accountId !== undefined) {
            var req = new XMLHttpRequest();
            req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v8.2/ss_accountcontractextras?$select=ss_accountcontractextraid,ss_contractstartingdate&$filter=_ss_accountcontractextra_value eq " + accountId + " and  ss_name eq '" + encodeURIComponent(productCategory) + "'", true);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                        var results = JSON.parse(this.response);
                        if (results.value.length > 0) {
                            IsGreen = false;
                            ss_accountcontractextraid = results.value[0]["ss_accountcontractextraid"];
                            var ss_contractstartingdate = results.value[0]["ss_contractstartingdate"];

                            if (ss_contractstartingdate != null && ss_contractstartingdate !== undefined) {
                                IsGreen = true;
                            }
                        }
                        if (IsGreen === false) {
                            CheckInvoiceExists();
                        }

                        if (IsGreen === false) {
                            UpdateContractandExtra(executionContext);
                        }
                        else {
                            executionContext.getFormContext().ui.setFormNotification("You Cannot set Product Status against the selected Product category. ", "ERROR");
                            setSave = true;
                        }

                    } else {
                        //Xrm.Utility.alertDialog(this.statusText);
                        var message = { confirmButtonLabel: "Ok", text: this.statusText+ " ss_TrackingActivitiesBasedOnProductCategories #612 "  }; 
                        var alertOptions = { height: 150, width: 280 }; 
                        Xrm.Navigation.openAlertDialog(message, alertOptions).then( 
                            function success(result) { 
                               // console.log("Alertog closed"); 
                            }, 
                            function (error) { 
                               // console.log(error.message); 
                            } 
                        );
                    }
                }
            };
            req.send();
        } 
    } // entityname condition end
    
    if (setSave) {
      //  executionContext.getEventArgs().preventDefault();//executionContext.getEventArgs()
    }
}

function UpdateContractandExtra(executionContext) {
    var fortype = executionContext.getFormContext().data.entity.attributes.get("ss_formtype").getText();


    if (executionContext.getFormContext().data.entity.attributes.get("ss_productcategories") != null) {
        productCategory = executionContext.getFormContext().data.entity.attributes.get("ss_productcategories").getText();
    }
    if (executionContext.getFormContext().data.entity.attributes.get("ss_competitor") != null) {
        competitor = executionContext.getFormContext().data.entity.attributes.get("ss_competitor").getValue();
    }

    var entity = {};

    if (statusValue !== -1) {
        if (fortype === "CC") {
            if (statusValue === 1) {
                entity.ss_productstatus = 3;
            }
            else if (statusValue === 2) {
                entity.ss_productstatus = 2;
            }
            else if (statusValue === 5) {
                entity.ss_productstatus = 3;
            }
            else if (statusValue === 7) {
                entity.ss_productstatus = 5;
            }
            else if (statusValue === 19) {
                entity.ss_productstatus = 1;
            }
        }
        if (fortype === "IR") {
            if (statusValue === 1) {
                entity.ss_productstatus = 3;
            }
            else if (statusValue === 2) {
                entity.ss_productstatus = 2;
            }
            else if (statusValue === 5) {
                entity.ss_productstatus = 3;
            }
            else if (statusValue === 7) {
                entity.ss_productstatus = 5;
            }
            else if (statusValue === 19) {
                entity.ss_productstatus = 1;
            }
        }
        if (fortype === "PR") {
            if (statusValue === 4) {
                entity.ss_productstatus = 0;
            }
            else if (statusValue === 2) {
                entity.ss_productstatus = 2;
            }
            else if (statusValue === 5) {
                entity.ss_productstatus = 3;
            }
            else if (statusValue === 7) {
                entity.ss_productstatus = 5;
            }
            else if (statusValue === 19) {
                entity.ss_productstatus = 1;
            }
        }

        if (fortype === "CO") {
            if (statusValue === 20) {
                entity.ss_productstatus = 0;
            }
            else if (statusValue === 21) {
                entity.ss_productstatus = 2;
            }
            else if (statusValue === 22) {
                entity.ss_productstatus = 3;
            }
           
            else if (statusValue === 23) {
                entity.ss_productstatus = 2;
            }
            else if (statusValue === 24) {
                entity.ss_productstatus = 3;
            }
            else if (statusValue === 25) {
                entity.ss_productstatus = 3;
            }

            else if (statusValue === 26) {
                entity.ss_productstatus = 3;
            }
            else if (statusValue === 27) {
                entity.ss_productstatus = 1;
            }
            else if (statusValue === 28) {
                entity.ss_productstatus = 0;
            }

            else if (statusValue === 7) {
                entity.ss_productstatus = 5;
            }
        }



        if (fortype === "XML") {
            if (statusValue === 3) {
                entity.ss_productstatus = 3;
            }
            else if (statusValue === 4) {
                entity.ss_productstatus = 0;
            }
            else if (statusValue === 5) {
                entity.ss_productstatus = 3;
            }
            else if (statusValue === 7) {
                entity.ss_productstatus = 5;
            }
            else if (statusValue === 8) {
                entity.ss_productstatus = 3;
            }
            if (statusValue === 9) {
                entity.ss_productstatus = 0;
            }
            else if (statusValue === 10) {
                entity.ss_productstatus = 2;
            }
            else if (statusValue === 11) {
                entity.ss_productstatus = 1;
            }
            else if (statusValue === 12) {
                entity.ss_productstatus = 2;
            }
            else if (statusValue === 13) {
                entity.ss_productstatus = 3;
            }
            if (statusValue === 14) {
                entity.ss_productstatus = 3;
            }
            else if (statusValue === 15) {
                entity.ss_productstatus = 2;
            }
            else if (statusValue === 16) {
                entity.ss_productstatus = 0;
            }
            else if (statusValue === 17) {
                entity.ss_productstatus = 3;
            }
            else if (statusValue === 18) {
                entity.ss_productstatus = 3;
            }
            else if (statusValue === 19) {
                entity.ss_productstatus = 1;
            }
        }

    }
    if (competitor !== -1 && competitor != null && competitor !== undefined) {
        entity.ss_competitor = competitor;
    }
    else {
        entity.ss_competitor = 0
    }

  //  var req = new XMLHttpRequest();
    if(entityname === "account"){
         if (ss_accountcontractextraid !== "" && ss_accountcontractextraid != null) {
            // req.open("PATCH", executionContext.getFormContext().context.getClientUrl() + "/api/data/v8.2/ss_accountcontractextras(" + ss_accountcontractextraid + ")", true);
            //console.log("Entity33 = "+entity.entityType);
        Xrm.WebApi.online.updateRecord("ss_accountcontractextra", ss_accountcontractextraid, entity).then(
            function success(result) {
                //Success - No Return Data
            },
            function(error) {
                //Xrm.Utility.alertDialog(error.message);
                        var message = { confirmButtonLabel: "Ok", text: error+ " Web API Failed ss_TrackingActivitiesBasedonProductCategories #611B" }; 
                        var alertOptions = { height: 150, width: 280 }; 
                        Xrm.Navigation.openAlertDialog(message, alertOptions).then( 
                            function success(result) { 
                               // console.log("Alertog closed"); 
                            }, 
                            function (error) { 
                               // console.log(error.message); 
                            } 
                        );
                    }
            );
        }
        else {
            // req.open("POST", executionContext.getFormContext().context.getClientUrl() + "/api/data/v8.2/ss_accountcontractextras", true);
            entity.ss_name = productCategory;
            entity["ss_accountcontractextra@odata.bind"] = "/accounts(" + accountId + ")";
            Xrm.WebApi.online.createRecord("ss_accountcontractextra", entity).then(
            function success(result) {
                //Success - No Return Data ;
            },
            function(error) {
                //Xrm.Utility.alertDialog(error.message);
                        var message = { confirmButtonLabel: "Ok", text: this.statusText+ "Web API Failed ss_TrackingActivitiesBasedonProductCategories #612B" }; 
                        var alertOptions = { height: 150, width: 280 }; 
                        Xrm.Navigation.openAlertDialog(message, alertOptions).then( 
                            function success(result) { 
                                //console.log("Alertog closed"); 
                            }, 
                            function (error) { 
                               // console.log(error.message); 
                            } 
                        );

                }
            );
        } 
    } // entityname codition end
    
}

function CheckInvoiceExists() {
    var LatestDate = new Date();
    var CurrentYear = "01" + "/" + "01" + "/" + LatestDate.getFullYear();
    var Year = LatestDate.getFullYear() - 1;
    LatestDate = "01" + "/" + "01" + "/" + Year;

    var FetchInvoices = '<fetch page="' + page + '"  mapping="logical">' +
                                '<entity name="invoicedetail" >' +
                                  '<attribute name="productid" />' +
                                  '<attribute name="baseamount" />' +
                                  '<filter>' +
                                    '<condition attribute="productid" operator="not-null" />' +
                                  '</filter>' +
                                  '<link-entity name="invoice" from="invoiceid" to="invoiceid" link-type="inner" alias="invoice" >' +
                                    '<attribute name="accountid" />' +
                                    '<attribute name="name" />' +
                                    '<attribute name="ss_postingdate" />' +
                                       '<filter type="and"><condition attribute="ss_postingdate" operator="on-or-after" value="' + LatestDate + '" />' +
                                       '<filter type="or" >' +
                                      '<condition attribute="accountid" operator="eq" value="' + accountId + '" />' +
                                      '<condition attribute="customerid" operator="eq" value="' + accountId + '" />' +
                                    '</filter></filter>' +
                                  '</link-entity>' +
                                    '<link-entity name="contract" from="contractid" to="ss_contractnolookup" link-type="outer" alias="contract" >' +
                                    '<attribute name="activeon" />' +
                                    '<attribute name="expireson" />' +
                                    '<attribute name="title" />' +
                                  '</link-entity>' +
                                  '<order attribute="productid" />' +
                                  '<link-entity name="product" from="productid" to="productid" link-type="inner" >' +
                                      '<attribute name="ss_crmproductgroupsname" />' +
                                      '<attribute name="ss_crmproductgroups" />' +
                                      '<attribute name="productnumber" />' +
                                     '<filter type="and" > ' +
                                      '<condition attribute="ss_crmproductgroups" operator="eq" value="' + productCategoryValue + '" />' +
                                      '</filter>' +
                                   '</link-entity>' +
                                '</entity>' +
                              '</fetch>';
                              
    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v8.0/invoicedetails?fetchXml=" + encodeURI(FetchInvoices), true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var results = JSON.parse(this.response);
                var morerecords = false;
                if (results.value['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie']) {
                    morerecords = true;
                }
                for (var x = 0; x < results.value.length; x++) {
                    if (results.value[x]['invoice_x002e_ss_postingdate@OData.Community.Display.V1.FormattedValue']) {
                        var InvoicePostingDate = results.value[x]['invoice_x002e_ss_postingdate'];

                        var UTCPreviousInvoicePostingDate = "";
                        var today = new Date();
                        var formatedold = today.setMonth(today.getMonth() - 12);
                        var lastYear = new Date(formatedold);
                        if (InvoicePostingDate !== "") {
                            UTCPreviousInvoicePostingDate = new Date(InvoicePostingDate);  //.toUTCString()
                            UTCPreviousInvoicePostingDate = new Date(UTCPreviousInvoicePostingDate);
                        }
                        if (UTCPreviousInvoicePostingDate !== "" && UTCPreviousInvoicePostingDate > lastYear)	//invoice exists within 6 months
                        {
                            IsGreen = true;
                        }
                    }
                }
                if (morerecords === true) {
                    pagingcookie = results.value['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie'];
                    pagingcookie = pagingcookie.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/\'/g, '&quot;').replace(/&amp;/g, "&amp;amp;");
                    page++;
                    CheckInvoiceExists();
                }
            }
            else {
                //alert(this.responseText+ " ss_TrackingActivitiesBasedOnProductCategories #612 ");
            }
        }

    };
    req.send();
}
