function CheckCreateAccountXMLField(executionContext) {
    setTimeout(Navigate, 3000, executionContext);
}
function Navigate(executionContext) {
    var formContext = executionContext.getFormContext();
        var confirmStrings = { text: "'To create the XML accounts please upload the excel file containing Master Data", title: "Confirmation Dialog" };
        var confirmOptions = { height: 200, width: 450 };
        Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
            function (success) {
                if (success.confirmed)
                formContext.getAttribute("ss_createxmlaccount").setValue(true);
                else
                formContext.getAttribute("ss_createxmlaccount").setValue(false);
            });
}
// function NavigateToCreateXMLAccountForm(formContext) {
//     var name = formContext.getAttribute("name").getValue();
//     var owner = formContext.getAttribute("ownerid").getValue();
//     var account = formContext.getAttribute("parentaccountid").getValue();
//     var Opportunity = formContext.data.entity.getId();

//     var entityFormOptions = {};
//     entityFormOptions["entityName"] = "ss_xmlaccount";

//     // Set default values for the XML Accounts
//     var formParameters = {};
//     //
//      formParameters["ss_name"] = name;
//      //Owner
//      formParameters["ownerid"] = owner[0].id.replace("{","").replace("}","");
//      formParameters["owneridname"] = owner[0].name;
//      formParameters["owneridtype"] = owner[0].entityType;

//      //Account
//      formParameters["ss_account"] = account[0].id.replace("{","").replace("}","");
//      formParameters["ss_accountname"] = account[0].name;
//      formParameters["ss_accounttype"] = account[0].entityType;

//      //Opportunity
//      formParameters["ss_opportunity"] = Opportunity.replace("{","").replace("}","");
//      formParameters["ss_opportunityname"] = name;
//      formParameters["ss_opportunitytype"] = "opportunity";
//     // formParameters["fullname"] = "Sample Contact";
//     // formParameters["emailaddress1"] = "contact@adventure-works.com";
//     // formParameters["jobtitle"] = "Sr. Marketing Manager";
//     // formParameters["donotemail"] = "1";
//     // formParameters["description"] = "Default values for this record were set programmatically.";

//     // // Set lookup column
//     // formParameters["preferredsystemuserid"] = "3493e403-fc0c-eb11-a813-002248e258e0"; // ID of the user.
//     // formParameters["preferredsystemuseridname"] = "Admin user"; // Name of the user.
//     // End of set lookup column

//     // Open the form.
//     Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
//         function (success) {
//             console.log(success);
//         },
//         function (error) {
//             console.log(error);
//         });
// }