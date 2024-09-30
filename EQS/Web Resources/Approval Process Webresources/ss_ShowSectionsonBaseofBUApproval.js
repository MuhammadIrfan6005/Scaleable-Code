function ShowSectionsonBaseofBUApprovalEntity(executionContext) {
    var formcontext = executionContext.getFormContext();
    if (formcontext.ui.formSelector.getCurrentItem().getLabel() !== "Termination Process") {
        var ownerid = parent.Xrm.Utility.getGlobalContext().userSettings.userId;
        ownerid = ownerid.replace("{", "").replace("}", "");
        var productmaincategory = formcontext.getAttribute("ss_productmaincategory").getValue();
        var res = "";
        if (productmaincategory) {
            res = productmaincategory.includes("Compliance Products");
        }
        if (res) {
            return;
        }
        else if (ownerid) {
            Xrm.WebApi.online.retrieveRecord("systemuser", ownerid, "?$select=_businessunitid_value").then(
                function success(result) {
                    var _businessunitid_value = result["_businessunitid_value"];
                    var _businessunitid_value_formatted = result["_businessunitid_value@OData.Community.Display.V1.FormattedValue"];
                    var _businessunitid_value_lookuplogicalname = result["_businessunitid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                    if (_businessunitid_value_formatted !== null && _businessunitid_value_formatted === "EQS Switzerland") {
                        formcontext.ui.tabs.get("approvaltab_germany").setVisible(false);
                        formcontext.ui.tabs.get("approval_tab_uk").setVisible(false);
                        var control = formcontext.getControl("ss_companyadminaccountdata");
                        if (control) {
                            control.addNotification({
                                messages: ['Anlegen der Unternehmensdaten im companyAdmin\n(http://admin.equitystory.com)\n >Kunden-Nr.vergeben (Liste)\n >fur News.Kunden:"Kunde im IR-Admin verfugbar" anklicken)\n >Vertragsarten (XML, ERS-Kunde, etc)\n >Bloomberg-Ticker-Symbol eintragen\n  >Land immer eintragen (furwww.dgap.de)\n >ubernahme der Angaben aus Stammdaterblatt (Steuerschlussel, Rechtsform, Registerart, Register-Nr.)\n >Kunde in UReg anlegen (Rechnungsdaten=Kundenanschrift)'],
                                notificationLevel: 'RECOMMENDATION'
                            });
                        }
                    }
                    else if (_businessunitid_value_formatted !== null && _businessunitid_value_formatted === "EQS Germany") {
                        var processId = "127a825e-4483-4602-8efa-90515d1e3d76";
                        formcontext.data.process.setActiveProcess(processId, function () {
                            console.log("Success");
                        });
                        formcontext.ui.tabs.get("data_tab").setVisible(false);
                        formcontext.ui.tabs.get("approval_tab_uk").setVisible(false);
                        //formcontext.ui.tabs.get("approvaltab_germany").setVisible(true);
                        var control = formcontext.getControl("ss_companyadminaccountdatagermany");
                        if (control) {
                            control.addNotification({
                                messages: ['Anlegen der Unternehmensdaten im companyAdmin \n (http://admin.equitystory.com) \n >Kunden-Nr.vergeben (Liste) \n >fur News.Kunden:"Kunde im IR-Admin verfugbar" anklicken) \n >Vertragsarten (XML, ERS-Kunde, etc)\n >Bloomberg-Ticker-Symbol eintragen \n  >Land immer eintragen (furwww.dgap.de) \n >ubernahme der Angaben aus Stammdaterblatt (Steuerschlussel, Rechtsform, Registerart, Register-Nr.) \n >Kunde in UReg anlegen (Rechnungsdaten=Kundenanschrift)'],
                                notificationLevel: 'RECOMMENDATION'
                            });
                        }
                        var ss_useranlegenimcockpitadmingermany = formcontext.getControl("ss_useranlegenimcockpitadmingermany");
                        if (ss_useranlegenimcockpitadmingermany) {
                            ss_useranlegenimcockpitadmingermany.addNotification({
                                messages: ['. Username (Kunden-Nr. + 3 Buchstaben) \n .Freischaltung für TUG-Meldepflichten (inkl. DD) \n.Passwort(→ Button, keine 0,o,O,I,l) \n .Berechtigung pro User festlegen \n .User:__ \n .erhält Token'],
                                notificationLevel: 'RECOMMENDATION'
                            });
                        }
                        var ss_ubercockpitadmininseqsircockpitgermany = formcontext.getControl("ss_ubercockpitadmininseqsircockpitgermany");
                        if (ss_ubercockpitadmininseqsircockpitgermany) {
                            ss_ubercockpitadmininseqsircockpitgermany.addNotification({
                                messages: ['.Ansprechpartner/ Meldebeauftragter/ evtl.ERS-Ansprechpartner \n .Unternehmensangaben \n .Börsenlistings \n .DD und TUG-Ansprechpartner im IR Cockpit \n .anlegen'],
                                notificationLevel: 'RECOMMENDATION'
                            });
                        }
                        var ss_tokenimaceadminzuordnengermany = formcontext.getControl("ss_tokenimaceadminzuordnengermany");
                        if (ss_tokenimaceadminzuordnengermany) {
                            ss_tokenimaceadminzuordnengermany.addNotification({
                                messages: ['. Default Login = Kunden-Nr (5stellig) + Namen hinterlegen \n .event. zusätzl. Token im ACE-Server anlegen'],
                                notificationLevel: 'RECOMMENDATION'
                            });
                        }
                    }
                    else if (_businessunitid_value_formatted !== null && _businessunitid_value_formatted === "EQS UK") {
                        var processId = "e398f74f-2fd7-426a-9b13-bdbdc4d06833";
                        formcontext.data.process.setActiveProcess(processId, function () {
                            console.log("Success");
                        });
                        formcontext.ui.tabs.get("data_tab").setVisible(false);
                        formcontext.ui.tabs.get("approvaltab_germany").setVisible(false);
                        var control = formcontext.getControl("ss_companyadminuk");
                        if (control) {
                            control.addNotification({
                                messages: ['.Client No \n .Services \n .Exchange Ticker \n .Country (www.dgap.de) \n . Register Data \n .UREG'],
                                notificationLevel: 'RECOMMENDATION'
                            });
                        }
                        var ss_cockpitadminuseruk = formcontext.getControl("ss_cockpitadminuseruk");
                        if (ss_cockpitadminuseruk) {
                            ss_cockpitadminuseruk.addNotification({
                                messages: ['\n.Username \n.password \n.Services \n.Token'],
                                notificationLevel: 'RECOMMENDATION'
                            });
                        }
                        var ss_assigntokenuk = formcontext.getControl("ss_assigntokenuk");
                        if (ss_assigntokenuk) {
                            ss_assigntokenuk.addNotification({
                                messages: ['\n.ID=client No (5 dots) \n.Token: no PIN required! \n.Software-Tokens :Anleitungen'],
                                notificationLevel: 'RECOMMENDATION'
                            });
                        }
                        var ss_viacockpitadminuk = formcontext.getControl("ss_viacockpitadminuk");
                        if (ss_viacockpitadminuk) {
                            ss_viacockpitadminuk.addNotification({
                                messages: ['\n.Company data \n.Contact persons \n.Listings \n. services'],
                                notificationLevel: 'RECOMMENDATION'
                            });
                        }
                    }
                    else {
                        formcontext.ui.tabs.get("data_tab").setVisible(false);
                        formcontext.ui.tabs.get("approvaltab_germany").setVisible(false);
                        formcontext.ui.tabs.get("approval_tab_uk").setVisible(false);
                    }
                },
                function (error) {
                    showerror(error);
                    //Xrm.Utility.alertDialog(error.message);
                }
            );
        }
    }
}


function GetAccountFieldsForUKApproval(executionContext) {
    var formContext = executionContext.getFormContext();
    if (formContext.ui.formSelector.getCurrentItem().getLabel() !== "Termination Process") {
        var account = formContext.getAttribute("ss_opportunityaccount").getValue();
        var clientagency = new Array();
        clientagency[0] = new Object();
        var salesmanager = new Array();
        salesmanager[0] = new Object();
        if (account) {
            var accountid = account[0].id;
            formContext.getAttribute("ss_accountnameuk").setValue(account[0].name);
            Xrm.WebApi.online.retrieveRecord("account", accountid, "?$select=_bbo_clientagency_value,bbo_isin,_ownerid_value,ss_vatnumber").then(
                function success(result) {
                    var _bbo_clientagency_value = result["_bbo_clientagency_value"];
                    var _bbo_clientagency_value_formatted = result["_bbo_clientagency_value@OData.Community.Display.V1.FormattedValue"];
                    var _bbo_clientagency_value_lookuplogicalname = result["_bbo_clientagency_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                    var bbo_isin = result["bbo_isin"];
                    var ss_vatnumber = result["ss_vatnumber"];
                    var ss_vatnumber_formatted = result["ss_vatnumber@OData.Community.Display.V1.FormattedValue"];
                    var _ownerid_value = result["_ownerid_value"];
                    var _ownerid_value_formatted = result["_ownerid_value@OData.Community.Display.V1.FormattedValue"];
                    var _ownerid_value_lookuplogicalname = result["_ownerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                    clientagency[0].id = _bbo_clientagency_value.replace("{", "").replace("}", "");
                    clientagency[0].name = _bbo_clientagency_value_formatted;
                    clientagency[0].entityType = _bbo_clientagency_value_lookuplogicalname;
                    salesmanager[0].id = _ownerid_value.replace("{", "").replace("}", "");
                    salesmanager[0].name = _ownerid_value_formatted;
                    salesmanager[0].entityType = _ownerid_value_lookuplogicalname;
                    formContext.getAttribute("ss_agencyuk").setValue(clientagency);
                    formContext.getAttribute("ss_salesmanageruk").setValue(salesmanager);
                    formContext.getAttribute("ss_isinuk").setValue(bbo_isin);
                    formContext.getAttribute("ss_vatnouk").setValue(ss_vatnumber_formatted);
                },
                function (error) {
                    showerror(error.message)
                }
            );
        }
    }
}

function GetAccountFieldsForGermanyApproval(executionContext) {
    var formContext = executionContext.getFormContext();
    if (formContext.ui.formSelector.getCurrentItem().getLabel() !== "Termination Process") {
        var account = formContext.getAttribute("ss_opportunityaccount").getValue();
        var clientagency = new Array();
        clientagency[0] = new Object();
        if (account) {
            var accountid = account[0].id;
            formContext.getAttribute("ss_accountnamegermany").setValue(account[0].name);
            Xrm.WebApi.online.retrieveRecord("account", accountid, "?$select=_bbo_clientagency_value,bbo_isin").then(
                function success(result) {
                    var _bbo_clientagency_value = result["_bbo_clientagency_value"];
                    var _bbo_clientagency_value_formatted = result["_bbo_clientagency_value@OData.Community.Display.V1.FormattedValue"];
                    var _bbo_clientagency_value_lookuplogicalname = result["_bbo_clientagency_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                    var bbo_isin = result["bbo_isin"];
                    clientagency[0].id = _bbo_clientagency_value.replace("{", "").replace("}", "");
                    clientagency[0].name = _bbo_clientagency_value_formatted;
                    clientagency[0].entityType = _bbo_clientagency_value_lookuplogicalname;
                    formContext.getAttribute("ss_agencygermany").setValue(clientagency);
                    formContext.getAttribute("ss_isingermany").setValue(bbo_isin);
                },
                function (error) {
                    showerror(error.message)
                }
            );
        }
    }
}

function showhideIfCockpitFieldApproval(executionContext) {
    var formContext = executionContext.getFormContext();
    if (formContext.ui.formSelector.getCurrentItem().getLabel() !== "Termination Process") {
        if (formContext.getAttribute("ss_cockpituk").getValue() === 3) {
            formContext.getControl("ss_ifcockpit").setVisible(false);
        }
        else {
            formContext.getControl("ss_ifcockpit").setVisible(true);
        }
    }
}

function showhideInsiderManagerPDF(executionContext) {
    var formContext = executionContext.getFormContext();
    if (formContext.ui.formSelector.getCurrentItem().getLabel() !== "Termination Process") {
        var services = formContext.getAttribute("ss_servicesuk").getText();
        if (services !== null && services.includes("Insider Manager")) {
            formContext.getControl("ss_insiderinformationpdf").setVisible(true);
        }
        else {
            formContext.getControl("ss_insiderinformationpdf").setVisible(false);
        }
    }
}
function showhidelistedon(executionContext) {
    var formContext = executionContext.getFormContext();
    if (formContext.ui.formSelector.getCurrentItem().getLabel() !== "Termination Process") {
        var stockexchagen = formContext.getAttribute("ss_stockexchangeuk").getText();
        if (stockexchagen !== null && stockexchagen.includes("Listed On___")) {
            formContext.getControl("ss_listedonuk").setVisible(true);
        }
        else {
            formContext.getControl("ss_listedonuk").setVisible(false);
        }
    }
}
function showerror(error) {

    var alertStrings = { confirmButtonLabel: "Yes", text: error.message, title: "Error" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}