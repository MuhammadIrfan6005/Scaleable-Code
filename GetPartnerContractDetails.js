function GetPartnerContractDetails()
{
    var accountid = Xrm.Page.data.entity.getId();
    alert(accountid);
    var fetchData = {
		accountid: accountid
	};
	var fetchXml = [
"<fetch top='50'>",
"  <entity name='account'>",
"    <attribute name='ss_uploadcontract_name' />",
"    <attribute name='createdon' />",
"    <filter>",
"      <condition attribute='accountid' operator='eq' value='", fetchData.accountid/*EE95D9C7-11CE-E911-A833-000D3AB71EE2*/, "'/>",
"    </filter>",
"    <link-entity name='systemuser' from='systemuserid' to='ownerid' alias='user'>",
"      <attribute name='fullname' />",
"    </link-entity>",
"  </entity>",
"</fetch>",
	].join("");
    var tablerow = "";
    fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
    parent.Xrm.WebApi.online.retrieveMultipleRecords("account", fetchXml).then(
        function success(result)
        {
            if(result.entities.length > 0)
            {
                for(var i=0; i<result.entities.length; i++)
					{
                        tablerow += "<tr>";
                        tablerow += "<td>"+result.entities[i]["account"]+"</td>";
                        tablerow += "<td>"+result.entities[i]["ss_uploadcontract_name"]+"</td>";
                        tablerow += "<td>"+result.entities[i]["createdon"]+"</td>";
                        tablerow += "<td>"+result.entities[i]["user.fullname"]+"</td>";
                        tablerow += "</tr>";
					}
            }
            $("#partnercontractDetailsTblBody").html(tablerow);
        },
            function(error)
            {
                console.log("Error is => " + console.error);
            }
    )
}