function SetHSPartnerField(executionContext) {
    var formContext = executionContext.getFormContext();
    var potentialpartner = formContext.getAttribute("ss_scoring_partner").getValue();
    if(potentialpartner) {
        var hscompancyname = formContext.getAttribute("ss_hscompanyname").getValue();
        if(hscompancyname !== null || hscompancyname !== "") {
            formContext.getAttribute("ss_hsparentpartner").setValue(hscompancyname);
        }
    }
}