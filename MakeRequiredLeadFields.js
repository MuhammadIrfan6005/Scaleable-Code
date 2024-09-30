function makeRequiredFields(executionContext){
 	var formContext = executionContext.getFormContext();
 	var parentAccount = formContext.getAttribute("parentaccountid");
 	var parentContact = formContext.getAttribute("parentcontactid");
 	if(parentAccount != null){
 		formContext.getAttribute("parentaccountid").setRequiredLevel("required");

 		console.log("===================== Account field contains");
 	}else{
 		console.log("===========================Account field doesn't contain");
 	}

 	if(parentContact != null){
 		formContext.getAttribute("parentcontactid").setRequiredLevel("required");
 		console.log("===================== Contact field contains");
 	}
}