function setAccount(executionContext)
{
	var formContext = executionContext.getFormContext();
	console.dir(formContext);
	var contextParams = window.parent.Xrm.Page.context.getQueryStringParameters();

	if(contextParams == undefined || contextParams == null || contextParams == "")
		return;

	console.log("Contect Params--------------"+JSON.stringify(contextParams));
	//var a2 = formContext.getQueryStringParameters();
	//console.log("22222--------------"+JSON.stringify(a2));
	var leadid = contextParams.parentrecordid;
	var recordType = contextParams.parentrecordtype;
	var recordName = contextParams.parentrecordname;
	console.log("id-----"+contextParams.parentrecordid);
	console.log("type-----"+contextParams.parentrecordtype);
	console.log("name-----"+contextParams.parentrecordname);
	if(leadid != undefined && recordType == "lead"){
		//console.log(window.parent.Xrm.Page.getAttribute("parentaccountid").getValue());
		if(window.parent.Xrm.Page.getAttribute("parentaccountid"))
		{
			alert("field contains");
			let parentAccount = window.parent.Xrm.Page.getAttribute("parentaccountid").getValue();
			if(parentAccount != null)
			{
				var accountid = parentAccount[0].id;
				var accountname = parentAccount[0].name;
				var enttype = parentAccount[0].entityType;
				console.log(accountname);
				alert(accountname);

			}
		}
		else
		{
			alert("Account null");
		}
		

	}
}