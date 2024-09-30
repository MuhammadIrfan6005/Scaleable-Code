var activestageidname = "";
var ss_setbpf = "";
var processtatus = "";
var formContext = "";
function OpenCloseAsLostDialog(primaryControl) {
    formContext = primaryControl;
    var recordid = formContext.data.entity.getId().replace("{", "").replace("}", "");
    var pageInput = {
        pageType: "webresource",
        webresourceName: "ss_OpenCloseAsLostDialogpartnerhtml",
        data: recordid
    };
    var navigationOptions = {
        title: "Close Partner",
        target: 2,
        width: 400, // value specified in pixel
        height: 400, // value specified in pixel
        position: 1
    };
    Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
        function success() {
            Xrm.WebApi.online.retrieveRecord("new_partner", recordid, "?$select=ss_setbpf").then(
                function success(result) {
                    ss_setbpf = result["ss_setbpf"];
                    if (ss_setbpf) {
                        checksetbpffield(formContext);
                    }
                },
                function (error) {
                    Showerror(error.message);
                }
            );

        }
    );
}
function checksetbpffield(formContext) {

    //Get Active stage partner process (note not cancellation one)
    activestageidname = formContext.data.process.getActiveStage().getName();
    processtatus = formContext.data.process.getStatus();
    //Set Partner PRocess Cancellation Active
    var processId = "c92780e5-73c4-4882-853f-111fcc2dc063";
    formContext.data.process.setActiveProcess(processId);
    if(processtatus === "finished") {
        formContext.getAttribute("ss_stagename").setValue(processtatus);
    }
    else if(processtatus === "active") {
        formContext.getAttribute("ss_stagename").setValue(activestageidname);
    }
    formContext.data.refresh(true);
    // var activestageid = "";
    // var finalstage = "";

    // formContext.data.process.getProcessInstances(callbackFunction);
}
// function successCallback() {
//     //Partner Process Cancellation stage ID's
//     var qualify = "b9122419-33c0-4740-ba18-66675e2e2316";
//     var initiate = "b51033e7-549e-4ee0-945d-1bf5619aa26a";
//     var presentationcontracts = "c8882fc4-c108-465e-a2f1-2d3b10bff53a";
//     var cancelled = "d64a8aaf-e34d-4943-80b2-01c2fb5ab906";

//     //set the stage of Partner Process Cancellation
//     if (activestageidname === "Qualify") {
//         Xrm.Page.data.process.setActiveStage(qualify);
//     }
//     else if (activestageidname === "Initiate") {
//         Xrm.Page.data.process.setActiveStage(initiate);
//     }
//     else if (activestageidname === "Presentation & Contract") {
//         Xrm.Page.data.process.setActiveStage(presentationcontracts);
//     }
//     else if (activestageidname === "Live") {
//         Xrm.Page.data.process.setActiveStage(cancelled);
//     }
//     else {
//         if (processtatus === "finished") {
//             Xrm.Page.data.process.setStatus("finished");
//         }
//     }
//     Xrm.Page.data.refresh(true);
// }
// function callbackFunction(state) {
//     var instances = [];
//     instances = Object.values(state);
//     if(instances[0].ProcessInstanceName === "Partner Process (Cancellation)") {
//         var id = instances[0].ProcessInstanceID;
//         ActiveProcess(id);
//     }
//     else if(instances[1].ProcessInstanceName === "Partner Process (Cancellation)") {
//         var id = instances[1].ProcessInstanceID;
//         ActiveProcess(id);
//     }
// }
// function ActiveProcess(instacenid) {


//         var entity = {};
//         // entity["activestageid@odata.bind"] = "/processstages(" + activestageid + ")";
//         entity.traversedpath = finalstage;
//         Xrm.WebApi.online.updateRecord("new_bpf_c92780e573c44882853f111fcc2dc063", instacenid, entity).then(
//             function success(result) {
//                 var updatedEntityId = result.id;
//                 if(processtatus === "finished") {
//                     Xrm.Page.data.process.setStatus("finished");
//                 }
//                 Xrm.Page.data.refresh(true);
//             },
//             function (error) {
//                 Showerror(error);
//             }
//         );
// }
function Showerror(error) {
    var alertStrings = { confirmButtonLabel: "Yes", text: error.message, title: "Information" };
    var alertOptions = { height: 120, width: 260 };
    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
}