function GetOpportunityProducts(executionContext) {
    var formContext = executionContext.getFormContext();
    var ss_productmaincategory_formatted = "";
        if (formContext.getAttribute("ss_entitytype").getValue() !== "opportunityproduct") {
            var opportunity = formContext.getAttribute("ss_relatedopportunity").getValue();
            if (opportunity) {
                var opportunityid = opportunity[0].id;
                var fetchData = {
                    opportunityid: opportunityid
                };
                var fetchXml = [
                    "<fetch>",
                    "  <entity name='product'>",
                    "    <attribute name='name' />",
                    "    <attribute name='ss_productmaincategory' />",
                    "    <link-entity name='opportunityproduct' from='productid' to='productid' alias='OppPro'>",
                    "      <filter>",
                    "        <condition attribute='opportunityid' operator='eq' value='", fetchData.opportunityid/*opportunity*/, "'/>",
                    "      </filter>",
                    "    </link-entity>",
                    "  </entity>",
                    "</fetch>",
                ].join("");
                fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
                Xrm.WebApi.online.retrieveMultipleRecords("product", fetchXml).then(
                    function success(results) {
                        if (results.entities.length > 0) {
                            for (var i = 0; i < results.entities.length; i++) {
                                var ss_productmaincategory = results.entities[i]["ss_productmaincategory"];
                                ss_productmaincategory_formatted += results.entities[i]["ss_productmaincategory@OData.Community.Display.V1.FormattedValue"] + ",";
                            }
                            ss_productmaincategory_formatted = ss_productmaincategory_formatted.split(',').filter(function (allItems, i, a) {
                                return i == a.indexOf(allItems);
                            }).join(',');
                            formContext.getAttribute("ss_productmaincategory").setValue(ss_productmaincategory_formatted);
                        }
                    },
                    function (error) {
                        showerror(error.message)
                    }
                );
            }
        }
    }

//This Function is Used to Set the Termination Process
function SetTerminationProcess(executionContext) {
    // var formContext = executionContext.getFormContext();
    // if (formContext.data.process.getActiveProcess()) {
    //     var currentprocess = formContext.data.process.getActiveProcess().getId();
    //     if (formContext.ui.formSelector.getCurrentItem().getLabel() === "Termination Process" && currentprocess !== "9db8d4e1-09f8-4e5a-9931-151c6ad0a35e") {
    //         formContext.data.process.setActiveProcess("9db8d4e1-09f8-4e5a-9931-151c6ad0a35e");
    //     }
    // }

}

//This Function is Used to Get/Set the Yearly License fee From Opportunity Entity
function GetSetYearlyLicenseFee(executionContext) {
    var formContext = executionContext.getFormContext();
    var formlabel = formContext.ui.formSelector.getCurrentItem().getLabel();
    var opportunity = formContext.getAttribute("ss_relatedopportunity").getValue();
    //var yearlyfee = formContext.getAttribute("ss_yearlylicensefee").getValue();
    var entitytype = formContext.getAttribute("ss_entitytype").getValue();
    if (opportunity) {
        var opportunityid = opportunity[0].id;
        Xrm.WebApi.online.retrieveRecord("opportunity", opportunityid, "?$select=ss_contractnumber,ss_officialcontractpartner,ss_totallicencefee,ss_totalsetupfee").then(
            function success(result) {
                var ss_contractnumber = result["ss_contractnumber"];
                var ss_officialcontractpartner = result["ss_officialcontractpartner"];
                var ss_totallicencefee = result["ss_totallicencefee"];
                var ss_totallicencefee_formatted = result["ss_totallicencefee@OData.Community.Display.V1.FormattedValue"];
                var ss_totalsetupfee = result["ss_totalsetupfee"];
                formContext.getAttribute("ss_contractnumber").setValue(ss_contractnumber);
                formContext.getAttribute("ss_officialcontractpartner").setValue(ss_officialcontractpartner);
                if (entitytype !== "opportunityproduct" && formlabel === "Termination Process") {
                    formContext.getAttribute("ss_yearlylicensefee").setValue(ss_totallicencefee);
                }
                else if(formlabel !== "Termination Process") {
                    formContext.getAttribute("ss_totalsetupfee_base").setValue(ss_totalsetupfee);
                }
            },
            function (error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );
    }
}

//This Function Will Check The Notes for Opportunity PRoducts on Load
// function CheckOppProductContract(executionContext) {
//     var formContext = executionContext.getFormContext();
//     var entitytype = formContext.getAttribute("ss_entitytype").getValue();
//     if (entitytype !== null && entitytype === "opportunityproduct") {
//         var recordid = formContext.data.entity.getId();
//         CheckNotes(recordid, formContext);
//     }
// }


// function CheckNotes(recordid, formContext) {
//     Xrm.WebApi.online.retrieveMultipleRecords("annotation", "?$select=_objectid_value,objecttypecode&$filter=notetext eq '%7B%7BProductContract--' and  _objectid_value eq" + recordid + "").then(
//         function success(results) {
//             if (results.entities.length < 1) {
//                 ShowErrorDialog(formContext);
//             }
//         },
//         function (error) {
//             showerror(error.message);
//         }
//     );
// }
// function ShowErrorDialog(formContext) {
//     var alertStrings = { confirmButtonLabel: "Yes", text: "Please Upload the Contract For Product", title: "Information" };
//     var alertOptions = { height: 120, width: 260 };
//     parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
//         function (success) {
//             var customParam = encodeURIComponent("\"" + 'ProductContract' + "\"");
//             var url = "/webresources/ss_AnnotationEdit.html?data=" + customParam;
//             window.open(url, null, "width=970px,height=219px, fullscreen=no, resizable=no,scrollbars=no");
//         },
//         function (error) {
//             showerror(error.message);
//         }
//     )
// }
function showerror(error) {

    var alertStrings = { confirmButtonLabel: "Yes", text: error, title: "Error" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}