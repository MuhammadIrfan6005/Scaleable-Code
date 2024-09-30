function getsetfieldvalues(executionContext){
    var formcontext = executionContext.getFormContext();
    formLabel = parent.Xrm.Page.ui.formSelector.getCurrentItem().getLabel();
    if(formLabel == "Partner Opportunity"){
    var accountid = formcontext.getAttribute("parentaccountid").getValue();
	var accid= accountid[0].id;
	accid = accid.replace("{", "").replace("}", "");
                parent.Xrm.WebApi.online.retrieveRecord("account", accid, "?$select=new_iscompliancepartner,ss_controlcenter,ss_countryiso,ss_partnercompanies").then(
                function success(result) {
                    var ss_controlcenter = result["ss_controlcenter"];
                    var ss_iscompliancepartner = result["new_iscompliancepartner"];
                    var ss_partnertype =  result["ss_partnercompanies@OData.Community.Display.V1.FormattedValue"];
                    var ss_countryiso = result["ss_countryiso@OData.Community.Display.V1.FormattedValue"];
                    formcontext.getAttribute("ss_controlcenter").setValue(ss_controlcenter);
                    formcontext.getAttribute("ss_iscompliancepartner").setValue(ss_iscompliancepartner);
                    formcontext.getAttribute("ss_partnertype").setValue(ss_partnertype);
                    formcontext.getAttribute("ss_countryiso").setValue(ss_countryiso);
                },
                function(error) {
                    parent.Xrm.Utility.alertDialog(error.message);
                }
            );
    }
    else
    {
        console.log("Form is not Partner Opportunity ");
    }
}