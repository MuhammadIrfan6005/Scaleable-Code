// Added By Nadeem Hasan
//==========================================================================================
function UpdateActiveForm(executionContext) {
    var formContext = executionContext.getFormContext();
    var formName = formContext.ui.formSelector.getCurrentItem().getLabel();
    var ss_activeform = formContext.getAttribute("ss_activeform");
    var contracttype = formContext.getControl("ss_contracttype");
         if(ss_activeform)
         {
           var  ss_activeformValue = ss_activeform.getValue();
            if(ss_activeformValue !== "swiss" && formName === "EQS-Switzerland")
            {
                ss_activeform.setValue("swiss");
                contracttype.removeOption(0);
                contracttype.removeOption(3);
                contracttype.removeOption(4);
            }
            else if(ss_activeformValue !== "other" && formName !== "EQS-Switzerland")
            {
                ss_activeform.setValue("other");
                contracttype.removeOption(1);
                contracttype.removeOption(2);
            }
         }
           
         
}
