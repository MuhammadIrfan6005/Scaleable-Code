// Function to get Email, Bussiness Phone and Job tite from account and set in Lead on change of contact
      function SetOpportunityFields(executionContext) {
        var formContext = executionContext.getFormContext();
        var  ContactEmail = formContext.getAttribute("ss_contactemail");
        var  ContactPhone = formContext.getAttribute("ss_contactphone");
        var parentcontactid = formContext.getAttribute("parentcontactid")
        var  contact = parentcontactid ? formContext.getAttribute("parentcontactid").getValue() : null;
           
   if (contact) {
           var contactid = contact[0].id;
          
           Xrm.WebApi.online.retrieveRecord("contact", contactid, "?$select=emailaddress1,telephone1").then(
               function success(result) {
                formContext.getControl("ss_contactemail").setVisible(true);
                formContext.getControl("ss_contactphone").setVisible(true);
                ContactPhone.setValue(result["telephone1"]);
                ContactEmail.setValue(result["emailaddress1"]);
               
               
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
    else if(ContactEmail !== null && ContactEmail !== undefined && ContactPhone !== null && ContactPhone !== undefined)
    {
        formContext.getControl("ss_contactemail").setVisible(false);
        formContext.getControl("ss_contactphone").setVisible(false);
        ContactPhone.setValue("");
        ContactEmail.setValue("");
    }
}