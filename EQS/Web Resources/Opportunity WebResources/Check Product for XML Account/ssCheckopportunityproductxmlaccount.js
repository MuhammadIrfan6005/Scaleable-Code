function Checkopportunityproduct(executionContext) {
    var formContext = executionContext.getFormContext();
    var opportunityid = formContext.data.entity.getId().replace("{","").replace("}","");
    var fetchData = {
        "productid": "{F3F8A0CD-5052-EA11-A812-000D3AB85666}",
        "opportunityid": opportunityid
      };
      var fetchXml = [
      "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>",
      "  <entity name='opportunityproduct'>",
      "    <attribute name='productid'/>",
      "    <attribute name='productdescription'/>",
      "    <attribute name='priceperunit'/>",
      "    <attribute name='quantity'/>",
      "    <attribute name='extendedamount'/>",
      "    <attribute name='opportunityproductid'/>",
      "    <order attribute='productid' descending='false'/>",
      "    <filter type='and'>",
      "      <condition attribute='productid' operator='eq' uiname='XML-Konvertierung UReg/eBanz (je Zeichen)' uitype='product' value='", fetchData.productid/*{BA498DF7-9F53-ED11-BBA2-000D3ADDC3F9}*/, "'/>",
      "      <condition attribute='opportunityid' operator='eq' uiname='test acc 2022 - xml' uitype='opportunity' value='", fetchData.opportunityid/*{597666B4-BB37-454E-BD76-496F71B8E0E5}*/, "'/>",
      "    </filter>",
      "  </entity>",
      "</fetch>"
      ].join("");
      fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
      Xrm.WebApi.online.retrieveMultipleRecords("opportunityproduct", fetchXml).then(
        function success(results) {
            if(results.entities.length > 0) {
                var control = formContext.getControl("ss_createxmlaccount");
                if(control) {
                    control.setVisible(true);
                    var value = formContext.getAttribute("ss_createxmlaccount").getValue();
                    if(!value) {
                        control.addNotification({
                            messages: ['Please change this field to YES if you want to create XML Accounts and then Upload Excel File.'],
                            notificationLevel: 'RECOMMENDATION'
                        });
                    }
                }
            }
        },
        function (error) {
            var alertStrings = { confirmButtonLabel: "Yes", text: error.message, title: "Error" };
            var alertOptions = { height: 120, width: 260 };
            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
        }
    );
}