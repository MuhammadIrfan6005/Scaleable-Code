function ShowHideClientModel(executionContext) {
    var formcontext = executionContext.getFormContext();
    var value = formcontext.getAttribute("ss_partner").getValue()
    if(value === null || value === undefined) {
        formcontext.getAttribute("ss_partnershipmodel").setRequiredLevel("none");
    }
    else
    {
        formcontext.getAttribute("ss_partnershipmodel").setRequiredLevel("required");
    }
}