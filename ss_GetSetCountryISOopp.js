function GetSetCountryISO(executionContext)
{
    var formContext = executionContext.getFormContext();  
    if(formContext.getAttribute("parentaccountid").getValue() != null){
    var countryiso = formContext.getAttribute("parentaccountid").getValue();
    var countryisoid = countryiso[0].id;
    GetAccount(formContext , countryisoid)
    }
    else
    {
        console.log("Account Field in empty");
    }
}
function GetAccount(formcontext , countryid)
{
    parent.Xrm.WebApi.online.retrieveRecord("account", countryid, "?$select=ss_countryiso").then(
        function success(result) {
            var ss_countryiso = result["ss_countryiso"];
            var ss_countryiso_formatted = result["ss_countryiso@OData.Community.Display.V1.FormattedValue"];
            formcontext.getAttribute("ss_countryiso").setValue(ss_countryiso);
        },
        function(error) {
            Xrm.Utility.alertDialog(error.message);
        }
    );
}