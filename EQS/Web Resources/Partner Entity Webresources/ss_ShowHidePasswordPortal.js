function ShowHidePasswordPortal(executoncontext) {
    var formcontext = executoncontext.getFormContext();
    formcontext.getControl("header_process_ss_passwordpartnerportal").setVisible(false);
    var value = formcontext.getControl("header_process_ss_credentialtopartnerprortalsent").getAttribute().getValue();
    if(value) {
        formcontext.getControl("header_process_ss_passwordpartnerportal").setVisible(true);
    }
    else {
        formcontext.getControl("header_process_ss_passwordpartnerportal").setVisible(false);
    }
}