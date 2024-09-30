function SetDevelopStageonLoadPartnerOpp(executionContext) {
    var formcontext = executionContext.getFormContext();
    var process = formcontext.data.process;
    //var developstageid = "eef152a2-a873-48a8-8f9c-e9c82ea356dc";
    if (formcontext.data.process.getActiveStage()) {
        var name = formcontext.data.process.getActiveStage().getName();
        if (name === "Qualify") {
            process.moveNext();
        }
    } else {
        console.log("No Active Stage found");
    }
    formcontext.data.process.addOnStageChange(stagechange);
}

function stagechange(executionContext) {
    var formcontext = executionContext.getFormContext();
    var stagename = formcontext.data.process.getSelectedStage()._stageStep.description;
    if (stagename === "Qualify") {
        if (formcontext.getAttribute("ss_partneropplead")) {
            var leadid = formcontext.getAttribute("ss_partneropplead").getValue()[0].id;
            openleadform(leadid);
        }
    } else {
        console.log("Stage Not Qualify");
    }
}

function openleadform(leadid) {
    var entityFormOptions = {};
    entityFormOptions["entityName"] = "lead";
    entityFormOptions["entityId"] = leadid;
    // Open the form.
    Xrm.Navigation.openForm(entityFormOptions).then(
        function (success) {
            console.log(success);
        },
        function (error) {
            showerror(error);
        }
    );

}