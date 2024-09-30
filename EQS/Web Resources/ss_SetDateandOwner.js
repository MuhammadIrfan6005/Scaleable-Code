function SetDateandOwner(executionContext)
{
    var formcontext = executionContext.getFormContext();
    var uploadcontract = formcontext.getAttribute("ss_uploadcontract").getValue();
    if(uploadcontract != null || uploadcontract != "")
    {
        if(formcontext.getAttribute("primarycontactid").getValue() != null)
        {
            var contactId= formcontext.getAttribute("primarycontactid").getValue()[0].id;
            var contactname= formcontext.getAttribute("primarycontactid").getValue()[0].name;
            var contacttype= formcontext.getAttribute("primarycontactid").getValue()[0].entityType;
            Xrm.WebApi.online.retrieveRecord("contact", contactId, "?$select=_ownerid_value").then(
                function success(result) {
                    var _ownerid_value = result["_ownerid_value"];
                   var _ownerid_value_formatted = result["_ownerid_value@OData.Community.Display.V1.FormattedValue"];
                    var _ownerid_value_lookuplogicalname = result["_ownerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                    
                    //set OwnerID of account
                    var lookupValue = new Array();
                    lookupValue[0] = new Object();
                    lookupValue[0].id = _ownerid_value;
                    lookupValue[0].name = _ownerid_value_formatted;
                    lookupValue[0].entityType = _ownerid_value_lookuplogicalname;
                    formcontext.getAttribute("ownerid").setValue(lookupValue);
                },
                function(error) {
                    Xrm.Utility.alertDialog(error.message);
                }
            );
        }
        else
        {
            console.log("Contact ID not found");
        }
    }
    else
    {
        console.log("Field is Empty");
    }
}


