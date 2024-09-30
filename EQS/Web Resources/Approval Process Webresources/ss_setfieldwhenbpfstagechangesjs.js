function getbpfactivestage(executionContext) {
    var formcontext = executionContext.getFormContext();
    // var productmain = formcontext.getAttribute("ss_productmaincategory").getValue();
    // var complianceform = "95ac21c9-5cdd-48b3-9aaa-f3a36119303a";
    // var activeform = Xrm.Page.ui.formSelector.getCurrentItem().getId();
    // if (activeform !== complianceform) {
    //     if (productmain !== null && (productmain.includes("Compliance Cockpit") || productmain.includes("Compliance Product"))) {

    //         var allforms = Xrm.Page.ui.formSelector.items.get();
    //         for (var i in allforms) {
    //             var form = allforms[i];
    //             if (form.getId().toLowerCase() == complianceform.toLowerCase()) {
    //                 form.navigate();
    //             }
    //         }
    //     }
    // }
    if (formcontext.data.process.getActiveStage()) {
        var name = formcontext.data.process.getActiveStage().getName();
        if (name === "Sales") {
            formcontext.getAttribute("ss_approvalprocess").setValue(0);
        } else if (name === "Newsroom") {
            formcontext.getAttribute("ss_approvalprocess").setValue(1);
        } else {
            console.log(name, " No Active Stage found");
        }
    }

    formcontext.data.process.addOnStageChange(stagechange);
    formcontext.data.process.addOnProcessStatusChange(StatusChange);

    // if (formlabel === "Termination Process")
    //     formcontext.data.process.addOnPreStageChange(preStageChange);
    // formcontext.data.process.addOnStageChange(stagechange);
    // formcontext.data.process.addOnProcessStatusChange(StatusChange);
}

function preStageChange(executionContext) {
    var direction = executionContext.getEventArgs().getDirection();
    var formcontext = executionContext.getFormContext();
    if (direction == "Next") {
        try {
            var notescheck = formcontext.getAttribute("ss_notescheck").getValue();
        } catch (err) {
            console.log(err.message);
        }

        if (!notescheck) {
            ShowErrorDialog();
            executionContext.getEventArgs().preventDefault();
        }

    }
}

function changeBPF(executionContext) {

    var formcontext = executionContext.getFormContext();
    var processname = formcontext.data.process.getActiveProcess().getName();
    var stagename = formcontext.data.process.getActiveStage().getName();
    var productmaincategory = formcontext.getAttribute("ss_productmaincategory").getValue();
    var prodName = formcontext.getAttribute("ss_productname").getValue();
    var formlabel = Xrm.Page.ui.formSelector.getCurrentItem().getLabel();

    if ((processname !== "Compliance Sales Checklist Approval") && prodName !== null && formlabel !== "Termination Process" && (prodName.includes("EQS Integrity Line") || prodName.includes("EQS Integrity Line Classic") || prodName.includes("EQS Policy Manager"))) {

        formcontext.data.process.setActiveProcess("5D65CA55-0508-479A-BF39-CF02E4A82707", "Success");
        console.log("Compliance Sales Checklist Approval BPF");

     } //else {
    //     formcontext.data.process.setActiveProcess("127A825E-4483-4602-8EFA-90515D1E3D76", "Success");
    //     console.log("Approval Process BPF");
    // }
}

function setConfirmedBy(executionContext) {

    var formcontext = executionContext.getFormContext();
    var processname = formcontext.data.process.getActiveProcess().getName();
    var stagename = formcontext.data.process.getActiveStage().getName();

    var context = Xrm.Utility.getGlobalContext();
    var userId = context.userSettings.userId.replace("{", "").replace("}", "");
    var username = Xrm.Page.context.getUserName();

    console.log("User: ", username);

    var confirmedby = new Array();
    confirmedby[0] = new Object();
    confirmedby[0].id = userId;
    confirmedby[0].name = username;
    confirmedby[0].entityType = "systemuser";

    console.log("Active stage ", stagename);

    if (stagename === "Sales") {

        // formcontext.getAttribute("ss_approvalprocess").setValue(0);
        formcontext.getAttribute("ss_confirmedbysales").setValue(confirmedby);
    } else
        if (stagename === "Newsroom") {

            // formcontext.getAttribute("ss_approvalprocess").setValue(1);
            formcontext.getAttribute("ss_approvedbysales").setValue(true);
            formcontext.getAttribute("ss_confirmedbynewsroom").setValue(confirmedby);
        } else if (stagename === "Accounting") {

            // formcontext.getAttribute("ss_approvalprocess").setValue(2);
            formcontext.getAttribute("ss_approvedbyaccounting").setValue(true);
            formcontext.getAttribute("ss_confirmedbyaccounting").setValue(confirmedby);
        }
}

function stagechange(executionContext) {
    var formcontext = executionContext.getFormContext();
    var processname = formcontext.data.process.getActiveProcess().getName();
    var stagename = formcontext.data.process.getActiveStage().getName();
    var productmaincategory = formcontext.getAttribute("ss_productmaincategory").getValue();

    var context = Xrm.Utility.getGlobalContext();
    var userId = context.userSettings.userId.replace("{", "").replace("}", "");
    var username = Xrm.Page.context.getUserName();

    console.log("User: ", username);

    var confirmedby = new Array();
    confirmedby[0] = new Object();
    confirmedby[0].id = userId;
    confirmedby[0].name = username;
    confirmedby[0].entityType = "systemuser";

    if (processname === "Standard Checklist Termination") {
        if (stagename === "Sales") {
            formcontext.getAttribute("ss_approvalprocess").setValue(0);
        } else if (stagename === "Accounting") {
            formcontext.getAttribute("ss_approvalprocess").setValue(2);
            formcontext.getAttribute("ss_confirmedatsales").setValue(new Date());
            formcontext.getAttribute("ss_approvedbysales").setValue(true);
            //CheckNotes(recordid, formcontext, stagename);

        } else if (stagename === "Newsroom") {
            formcontext.getAttribute("ss_approvalprocess").setValue(1);
            formcontext.getAttribute("ss_confirmedataccounting").setValue(new Date());
            formcontext.getAttribute("ss_approvedbyaccounting").setValue(true);
            //CheckContract(formcontext, stagename);
        } else if (stagename === "Customer Success / Project Management" && !productmaincategory.includes("Compliance Cockpit")) {
            formcontext.getAttribute("ss_approvalprocess").setValue(4);
            formcontext.getAttribute("ss_confirmedatnewsroom").setValue(new Date());
            formcontext.getAttribute("ss_approvedbynewsroom").setValue(true);
            //CheckContract(formcontext, stagename);
        } else if (stagename === "Customer Success / Project Management" && productmaincategory.includes("Compliance Cockpit")) {
            formcontext.getAttribute("ss_approvalprocess").setValue(4);
            formcontext.getAttribute("ss_confirmedataccounting").setValue(new Date());
            formcontext.getAttribute("ss_approvedbyaccounting").setValue(true);
            //CheckContract(formcontext, stagename);
        }
    } else if (processname === "Checklist UK IR New Client" || processname === "Approval Process" || processname === "Compliance Sales Checklist" || processname === "IR Sales Checklist Process" || processname === "XML Sales Checklist BPF") {
        if (stagename === "Sales") {
            //formcontext.getAttribute("ss_confirmedbysales").setValue(confirmedby);
            formcontext.getAttribute("ss_approvalprocess").setValue(0);
        } else if (stagename === "Newsroom") {
            //formcontext.getAttribute("ss_confirmedbynewsroom").setValue(confirmedby);
            formcontext.getAttribute("ss_approvalprocess").setValue(1);
            formcontext.getAttribute("ss_confirmedatsales").setValue(new Date());
            formcontext.getAttribute("ss_confirmedbysales").setValue(confirmedby);
        } else if (stagename === "Accounting") {
            formcontext.getAttribute("ss_confirmedbynewsroom").setValue(confirmedby);
            //formcontext.getAttribute("ss_confirmedbyaccounting").setValue(confirmedby);
            formcontext.getAttribute("ss_approvalprocess").setValue(2);
            formcontext.getAttribute("ss_confirmedatnewsroom").setValue(new Date());
        }
    }
}

function StatusChange(executionContext) {
    
    var formcontext = executionContext.getFormContext();
    var context = Xrm.Utility.getGlobalContext();
    var userId = context.userSettings.userId.replace("{", "").replace("}", "");
    var username = Xrm.Page.context.getUserName();

    console.log("User: ", username);

    var confirmedby = new Array();
    confirmedby[0] = new Object();
    confirmedby[0].id = userId;
    confirmedby[0].name = username;
    confirmedby[0].entityType = "systemuser";
    var status = formcontext.data.process.getStatus();
    var stage = formcontext.data.process.getActiveStage().getName();
    var processname = formcontext.data.process.getActiveProcess().getName();
    if (status === "finished" && stage === "Accounting" && (processname === "Checklist UK IR New Client" || processname === "Approval Process" || processname === "Compliance Sales Checklist" || processname === "IR Sales Checklist Process" || processname === "XML Sales Checklist BPF")) {
        formcontext.getAttribute("ss_approvalprocess").setValue(3);
        formcontext.getAttribute("ss_confirmedataccounting").setValue(new Date());
        formcontext.getAttribute("ss_confirmedbyaccounting").setValue(confirmedby);
    } else if (status === "finished" && stage === "Newsroom" && processname === "Standard Checklist Termination") {
        formcontext.getAttribute("ss_approvalprocess").setValue(3);
        formcontext.getAttribute("ss_confirmedatnewsroom").setValue(new Date());
        formcontext.getAttribute("ss_approvedbynewsroom").setValue(true);
    } else if (status === "finished" && stage === "Customer Success / Project Management" && processname === "Standard Checklist Termination") {
        formcontext.getAttribute("ss_approvalprocess").setValue(3);
        formcontext.getAttribute("new_confirmedatcspm").setValue(new Date());
        formcontext.getAttribute("ss_approvedbycspm").setValue(true);
    }
    var approvalid = formcontext.data.entity.getId();
    var entityname = formcontext.data.entity.getEntityName();
    var entity = {};
    entity.statecode = 1;
    entity.statuscode = 2;
    parent.Xrm.WebApi.online.updateRecord(entityname, approvalid, entity).then(
        function success(result) {
            var updatedEntityId = result.id;
            formcontext.data.refresh(true);
        },
        function (error) {
            var alertStrings = {
                confirmButtonLabel: "Yes",
                text: error.message,
                title: "Error"
            };
            var alertOptions = {
                height: 120,
                width: 260
            };
            parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
        }
    );
}
// function CheckNotes(recordid, formcontext, stagename) {
//     Xrm.WebApi.online.retrieveMultipleRecords("annotation", "?$select=_objectid_value,objecttypecode&$filter=notetext eq '%7B%7BTerminationProcess--' and  _objectid_value eq" + recordid + "").then(
//         function success(results) {
//             if (results.entities.length < 1) {
//                 ShowErrorDialog(formcontext);
//             }
//         },
//         function (error) {
//             showerror(error.message);
//         }
//     );
// }
function ShowErrorDialog() {
    var alertStrings = { confirmButtonLabel: "Yes", text: "Please Upload the Document of Termination First", title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}

function showerror(error) {

    var alertStrings = { confirmButtonLabel: "Yes", text: error, title: "Error" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}
function ShowHideProjectCharterURL(executionContext) {
    var formcontext = executionContext.getFormContext();
    var productmain = formcontext.getAttribute("ss_productmaincategory").getValue();
    var projectcharter = formcontext.getAttribute("ss_projectcharter").getValue();
    if(productmain.includes("IR Cockpit") && projectcharter) {
        formcontext.getControl("ss_projectcharterurl").setVisible(true);
        formcontext.getAttribute("ss_projectcharterurl").setValue("https://insight.eqs.com/display/PO/Cockpit+Migration+Form#");
    }
    else if(productmain.includes("IR Products") && projectcharter) {
        formcontext.getControl("ss_projectcharterurl").setVisible(true);
        formcontext.getAttribute("ss_projectcharterurl").setValue("https://insight.eqs.com/display/PO/Cockpit+Migration+Form#");
    }
    else {
        formcontext.getControl("ss_projectcharterurl").setVisible(false);
        formcontext.getAttribute("ss_projectcharterurl").setValue(null);
    }
}
function showhidecomplianceprojectcharter(executionContext) {
    var formcontext = executionContext.getFormContext();
    var value = formcontext.getAttribute("ss_productmaincategory").getValue();
    if(value !== null && value !== "" && (value.includes("Compliance Cockpit") || value.includes("Compliance Product"))) {
        formcontext.getControl("ss_compliaceprojectcharter").setVisible(true);
    }
    else {
        formcontext.getControl("ss_compliaceprojectcharter").setVisible(false);
    }
}
function ChangeForm(executionContext) {
    var formcontext = executionContext.getFormContext();
    var fromType = formcontext.ui.getFormType();
    if(fromType === 1 || fromType === "1") {
        return;
    }
    var currentForm = formcontext.ui.formSelector.getCurrentItem();
    var businessunit = formcontext.getAttribute("ss_businessunit").getValue() !== null ? formcontext.getAttribute("ss_businessunit").getValue() : "";
    if(businessunit === "EQS Group AG") {
        businessunit = "EQS Germany";
    }
    var availableForms = formcontext.ui.formSelector.items.get();
    // if(currentForm.getLabel() === "EQS PR") {
    //     return;
    // }
    if (currentForm.getLabel().toLowerCase() !== businessunit.toLowerCase()) {
      for (var i in availableForms) {
        var form = availableForms[i];
        // try to find a form based on the name
        if (form.getLabel().toLowerCase() == businessunit.toLowerCase()) {
          form.navigate();
          return true;
        }
      }
    }
  }