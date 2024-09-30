// Added By Nadeem Hasan
//==========================================================================================
function UpdateActiveForm(executionContext) {
    var formContext = executionContext.getFormContext();
    var formName = formContext.ui.formSelector.getCurrentItem().getLabel();
    var ss_activeform = formContext.getAttribute("ss_activeform");
    var language = formContext.getControl("ss_precontractlanguage");
         if(ss_activeform)
         {
           var  ss_activeformValue = ss_activeform.getValue();
            if(ss_activeformValue !== "swiss" && formName === "EQS-Switzerland")
            {
                ss_activeform.setValue("swiss");
            }
            else if(ss_activeformValue !== "other" && formName !== "EQS-Switzerland")
            {
                ss_activeform.setValue("other");
            }
         }
         if(formName === "EQS-Switzerland") {
             language.removeOption(4);
             language.removeOption(5);
             language.removeOption(6);
         }
}
