function setCurrentUserandCheckNAVID(executionContext)
{
    debugger;
    var formcontext= executionContext.getFormContext();
    var value = formcontext.getAttribute("ss_clientnumberset").getValue();
    var navid= formcontext.getAttribute("ss_accountnavid").getValue();
    var salesstageid = "bdd20315-b1b4-4401-b957-0211c1819144";
    if(value)
    {
        
        if(navid !=null && navid != "")
        {
            var userID= Xrm.Utility.getGlobalContext().userSettings.userId;
            Xrm.WebApi.online.retrieveRecord("systemuser", userID , "?$select=fullname").then(
                function success(result) {
                    var fullname = result["fullname"];
                    var setUservalue = new Array();
                    setUservalue[0] = new Object();
                    setUservalue[0].id = userID;
                    setUservalue[0].entityType = 'systemuser';
                    setUservalue[0].name = fullname;
                    formcontext.getAttribute("ss_processedby").setValue(setUservalue);
                },
                function(error) {
                    Xrm.Utility.alertDialog(error.message);
                }
            );
        }
        else
        {
            formcontext.getAttribute("ss_accountnavid").setRequiredLevel("required");
            formcontext.data.process.setActiveStage(salesstageid);
            window.parent.Xrm.Page.data.refresh(true);
            //formcontext.getAttribute("ss_clientnumberset").setValue(false);
        }
    }
    else
    {   
        formcontext.getAttribute("ss_processedby").setValue(null);
        console.log("False");
    }
}