function SetPartnerFields(executionContext){
    var formcontext = executionContext.getFormContext();
   if(formcontext.getAttribute("new_ispartner").getValue() !=null)
   {
        var accountid = formcontext.getAttribute("new_ispartner").getValue();
        var accid= accountid[0].id;
        accid = accid.replace("{", "").replace("}", "");
        Xrm.WebApi.online.retrieveRecord("account",accid , "?$select=new_iscompliancepartner,ss_controlcenter,ss_ispartner,ss_partnercompanies,ss_partnerlevel,ss_xmlclienttype,ss_countryiso").then(
            function success(result) {
                var new_iscompliancepartner = result["new_iscompliancepartner"];
                var new_iscompliancepartner_formatted = result["new_iscompliancepartner@OData.Community.Display.V1.FormattedValue"];
                var ss_controlcenter = result["ss_controlcenter"];
                var ss_controlcenter_formatted = result["ss_controlcenter@OData.Community.Display.V1.FormattedValue"];
                var ss_ispartner = result["ss_ispartner"];
                var ss_ispartner_formatted = result["ss_ispartner@OData.Community.Display.V1.FormattedValue"];
                var ss_partnercompanies = result["ss_partnercompanies"];
                var ss_partnercompanies_formatted = result["ss_partnercompanies@OData.Community.Display.V1.FormattedValue"];
                var ss_partnerlevel = result["ss_partnerlevel"];
                var ss_partnerlevel_formatted = result["ss_partnerlevel@OData.Community.Display.V1.FormattedValue"];
                var ss_xmlclienttype = result["ss_xmlclienttype"];
                var ss_xmlclienttype_formatted = result["ss_xmlclienttype@OData.Community.Display.V1.FormattedValue"];
                var ss_countryiso = result["ss_countryiso"];
                var ss_countryiso_formatted = result["ss_countryiso@OData.Community.Display.V1.FormattedValue"];
                formcontext.getAttribute("ss_ispartner").setValue(ss_ispartner);
                formcontext.getAttribute("ss_iscompliancepartner").setValue(new_iscompliancepartner);
                formcontext.getAttribute("ss_controlcenter").setValue(ss_controlcenter);
                formcontext.getAttribute("ss_partnerlevel").setValue(ss_partnerlevel);
                formcontext.getAttribute("ss_partnercompanies").setValue(ss_partnercompanies);
                formcontext.getAttribute("ss_clienttype").setValue(ss_xmlclienttype);
                formcontext.getAttribute("ss_ss_countryiso").setValue(ss_countryiso);
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );
    }
    else
    {
        formcontext.getAttribute("ss_ispartner").setValue(null);
        formcontext.getAttribute("ss_iscompliancepartner").setValue(null);
        formcontext.getAttribute("ss_controlcenter").setValue(null);
        formcontext.getAttribute("ss_partnerlevel").setValue(null);
        formcontext.getAttribute("ss_partnercompanies").setValue(null);
        formcontext.getAttribute("ss_clienttype").setValue(null);
    }
}