function SetContactEmailPhoneOpp(executionContext)
{
    var formcontext = executionContext.getFormContext();
    if(formcontext.getAttribute("ss_trackleancontact").getValue() != null){
        var contact = formcontext.getAttribute("ss_trackleancontact").getValue();
        var contactid = contact[0].id;
        GetContactDetails(contactid, formcontext);
    }
    else
    {
        formcontext.getControl("ss_trackleancontactemail").setVisible(false);
        formcontext.getControl("ss_trackleancontactphone").setVisible(false);
        formcontext.getAttribute("ss_trackleancontactemail").setValue("");
        formcontext.getAttribute("ss_trackleancontactphone").setValue("");
    }
}
function GetContactDetails(contactid, formcontext)
{
    Xrm.WebApi.online.retrieveRecord("contact", contactid, "?$select=emailaddress1,telephone1").then(
        function success(result) {
            var emailaddress1 = result["emailaddress1"];
            var telephone1 = result["telephone1"];
            if(emailaddress1 !=null && telephone1 !=null)
            {
                formcontext.getControl("ss_trackleancontactemail").setVisible(true);
                formcontext.getControl("ss_trackleancontactphone").setVisible(true);
                formcontext.getAttribute("ss_trackleancontactemail").setValue(emailaddress1);
                formcontext.getAttribute("ss_trackleancontactphone").setValue(telephone1);
            }
        },
        function(error) {
            var alertStrings = { confirmButtonLabel: "Yes", text: error.message, title: "Error" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function success(success) {
                       
                    },
                );
        }
    );
}