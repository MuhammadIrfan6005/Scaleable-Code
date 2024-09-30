function OpenQuickCreatePartner(primaryControl)
{
     var formContext = primaryControl;
    // var userid = Xrm.Utility.getGlobalContext().userSettings.userId;
    // var username = Xrm.Utility.getGlobalContext().userSettings.userName;
    var entityFormOptions = {};
    entityFormOptions["entityName"] = "new_partner";
    entityFormOptions["useQuickCreateForm"] = true;
    Xrm.Navigation.openForm(entityFormOptions, null).then(
        function (success) {
            console.log(success);
        },
        function (error) {
            console.log(error);
        });
}