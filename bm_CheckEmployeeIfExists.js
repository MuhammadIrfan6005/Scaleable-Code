function CheckEmployeeIfExists(executionContext) {
    parent.$("#id-125fc733-aabe-4bd2-807e-fd7b6da72779-5").hide();
    // var formContext = executionContext.getFormContext();
    // var firstname = formContext.getAttribute("bm_firstname").getValue();
    // var lastname = formContext.getAttribute("bm_lastname").getValue();

    // var req = new XMLHttpRequest();
    // req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/bm_employees?$select=bm_firstname,bm_lastname&$filter=bm_firstname eq " + firstname + " and  bm_lastname eq " + lastname + "", true);
    // req.setRequestHeader("OData-MaxVersion", "4.0");
    // req.setRequestHeader("OData-Version", "4.0");
    // req.setRequestHeader("Accept", "application/json");
    // req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    // req.setRequestHeader("Prefer", "odata.include-annotations=\"*\",odata.maxpagesize=1");
    // req.onreadystatechange = function() {
    //     if (this.readyState === 4) {
    //         req.onreadystatechange = null;
    //         if (this.status === 200) {
    //             var results = JSON.parse(this.response);
    //             if(results.value.length > 0) {
    //                 showinfo("Employee with Same Name already Exists");
    //                 executionContext.getEventArgs().preventDefault();
    //             }
    //         } else {
    //             showerror(this.statusText);
    //         }
    //     }
    // };
    // req.send();
}
// function showinfo(error) {
//     var alertStrings = { confirmButtonLabel: "Ok", text: error, title: "Information" };
//     var alertOptions = { height: 120, width: 260 };
//     parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
// }
// function showerror(error) {
//     var alertStrings = { confirmButtonLabel: "Ok", text: error, title: "Error" };
//     var alertOptions = { height: 120, width: 260 };
//     parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
// }