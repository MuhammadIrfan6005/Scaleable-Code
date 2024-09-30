function ShowUploadContractField(executionContext)
{
    var formcontext= executionContext.getFormContext();
    var value = formcontext.getAttribute("ss_ispartner").getValue();
    if(value)
    {
        formcontext.getControl("ss_uploadcontract").setVisible(true);
    }
    else
    {
        formcontext.getControl("ss_uploadcontract").setVisible(false);
    }
}