//Added on 1/29/2021 By Nadeem
//its getting few fields from Account And Contact then populating into in Lead
//=========================================================================================================================================
      function SyncAccountFields(executionContext) {
        var formContext = executionContext.getFormContext();
        var  Lead_address1_country = formContext.getAttribute("address1_country");
        var  Lead_bbo_clientagency = formContext.getAttribute("bbo_clientagency");
        var  Lead_bbo_isin = formContext.getAttribute("bbo_isin");
        var  Lead_websiteurl = formContext.getAttribute("websiteurl");
        var msdyncrm_companysize = formContext.getAttribute("msdyncrm_companysize");
        var ss_countryiso = formContext.getAttribute("ss_countryiso");
        var parentaccountid = formContext.getAttribute("parentaccountid");
        var  Account = parentaccountid ? formContext.getAttribute("parentaccountid").getValue() : null;
        var ss_partnerlead = formContext.getAttribute("ss_partnerlead");
        var ss_ismanuallycreated = formContext.getAttribute("ss_ismanuallycreated").getValue();  
   if (Account && ss_ismanuallycreated) {
           var accountid = Account[0].id;
          
           Xrm.WebApi.online.retrieveRecord("account", accountid, "?$select=numberofemployees,ss_countryiso,address1_country,_bbo_clientagency_value,bbo_isin,websiteurl,_ss_partner_value").then(
               function success(result) {
                Lead_address1_country ? Lead_address1_country.setValue(result["address1_country"]) :"";
                var _bbo_clientagency_value = result["_bbo_clientagency_value"];
                var _bbo_clientagency_value_formatted = result["_bbo_clientagency_value@OData.Community.Display.V1.FormattedValue"];
                var _bbo_clientagency_value_lookuplogicalname = result["_bbo_clientagency_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                var _ss_partner_value = result["_ss_partner_value"];
                var _ss_partner_value_formatted = result["_ss_partner_value@OData.Community.Display.V1.FormattedValue"];
                var _ss_partner_value_lookuplogicalname = result["_ss_partner_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                var bbo_clientagency = new Array();
                bbo_clientagency[0] = new Object();
                bbo_clientagency[0].id = _bbo_clientagency_value // GUID of the lookup id
                bbo_clientagency[0].name = _bbo_clientagency_value_formatted; // Name of the lookup
                bbo_clientagency[0].entityType = _bbo_clientagency_value_lookuplogicalname;
                msdyncrm_companysize ? msdyncrm_companysize.setValue(result["numberofemployees@OData.Community.Display.V1.FormattedValue"]) : "";
                ss_countryiso ? ss_countryiso.setValue(parseInt(result["ss_countryiso"])) : "";
                (Lead_bbo_clientagency && _bbo_clientagency_value)? Lead_bbo_clientagency.setValue(bbo_clientagency) : "";
                Lead_bbo_isin ? Lead_bbo_isin.setValue(result["bbo_isin"]) : "";
                Lead_websiteurl ? Lead_websiteurl.setValue(result["websiteurl"]) : "";
                if(_ss_partner_value !== null || _ss_partner_value !== undefined) {
                    var lookupValue = new Array();
                    lookupValue[0] = new Object();
                    lookupValue[0].id = _ss_partner_value; // GUID of the lookup id
                    lookupValue[0].name = _ss_partner_value_formatted; // Name of the lookup
                    lookupValue[0].entityType = _ss_partner_value_lookuplogicalname; //Entity Type of the lookup entity
                    ss_partnerlead ? ss_partnerlead.setValue(lookupValue) : null;
                    formContext.getControl("ss_partnerlead").setDisabled(true);
                }
                
               
               },
            function(error) {
                var alertStrings = { confirmButtonLabel: "Yes", text: error.message, title: "Error" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function success(success) {
                       
                    },
                    function (error2) {
                       
                    });
            }
        );
    }
    else if(ss_ismanuallycreated)
    {
                Lead_address1_country ? Lead_address1_country.setValue("") : "";
                Lead_bbo_clientagency ? Lead_bbo_clientagency.setValue(null) : "";
                Lead_bbo_isin ? Lead_bbo_isin.setValue("") : "";
                Lead_websiteurl ? Lead_websiteurl.setValue("") : "";
                msdyncrm_companysize ? msdyncrm_companysize.setValue("") : "";
                ss_countryiso ? ss_countryiso.setValue(null) : "";
                ss_partnerlead.setValue(null);
                formContext.getControl("ss_partnerlead").setDisabled(false);
    }
}
//=========================================================================================================================================
function SyncContactFields(executionContext) {
    var formContext = executionContext.getFormContext();
    var  firstname = formContext.getAttribute("firstname");
    var  lastname = formContext.getAttribute("lastname");
    var  emailaddress1 = formContext.getAttribute("emailaddress1");
    var  jobtitle = formContext.getAttribute("jobtitle");
    var  telephone1 = formContext.getAttribute("telephone1");
   
    var parentcontactid = formContext.getAttribute("parentcontactid")
    var  contact = parentcontactid ? formContext.getAttribute("parentcontactid").getValue() : null;
    var ss_ismanuallycreated = formContext.getAttribute("ss_ismanuallycreated").getValue();  
if (contact && ss_ismanuallycreated) {
       var contactid = contact[0].id;
      
       Xrm.WebApi.online.retrieveRecord("contact", contactid, "?$select=firstname,lastname,jobtitle,emailaddress1,telephone1").then(
           function success(result) {
            firstname.setValue(result["firstname"]);
            lastname.setValue(result["lastname"]);
            emailaddress1 ? emailaddress1.setValue(result["emailaddress1"]) : "";
            jobtitle ? jobtitle.setValue(result["jobtitle"]) : "";
            telephone1 ? telephone1.setValue(result["telephone1"]) : "";
           
           },
        function(error) {
            var alertStrings = { confirmButtonLabel: "Yes", text: error.message, title: "Error" };
            var alertOptions = { height: 120, width: 260 };
            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                function success(success) {
                   
                },
                function (error2) {
                   
                });
        }
    );
}
else if(ss_ismanuallycreated)
{
    firstname ? firstname.setValue("") : "";
    lastname ? lastname.setValue("") : "";
    emailaddress1 ? emailaddress1.setValue("") : "";
    jobtitle ?  jobtitle.setValue("") : "";
    telephone1 ?  telephone1.setValue("") : "";
}
}
//=========================================================================================================================================
function SetIsManuallyCreatedToYes(executionContext) {
    var formContext = executionContext.getFormContext();
    var formState = formContext.ui.getFormType();
    if(formState === 1)
    {
        formContext.getAttribute("ss_ismanuallycreated").setValue(true);
    }
}