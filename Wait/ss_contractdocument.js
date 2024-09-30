// var isModifiedContractStatus="";
// var isModifiedProductStatus="";
$(document).ready(function () {
    var FormStatus =window.parent.Xrm.Page.ui.getFormType();
   
    if(FormStatus==1)
    {
       $("#mainTblDiv").addClass('d-none');
       $(".createmode").show();
    }
    else{
    	 $(".createmode").addClass('d-none');
            RetrieveContractDetailsTblData();
        }
    // setTimeout(function () {
    //     $(".loader").fadeIn().delay(2000).fadeOut();
    //     $(".loader").hide();
    // }, 1000);

    //nh=============================================================================================================
    //Function to update Contracts (Outer Table data)
    $("#saveContracts").on({
        click: function () {
           
            var data = [];
            data.push('--batch_123456');
            data.push('Content-Type: multipart/mixed;boundary=changeset_BBB457');
            data.push('');

            var tblLength = $('.ss-opportunity').length;
            var tr;
            var OppId;
            var oppStatus;
            var autoRenewalVal;
            var isOppStsChanged;
            if (tblLength > 0) {
                $(".loader").fadeIn();
               // $(".loader").show();
                var entity = {};
                for (var i = 0; i < tblLength; i++) {
                    tr = $('.ss-opportunity')[i];
                    OppId = $(tr).find('td:eq(0)').find('input[type=hidden]').val();

                  
                    autoRenewalVal = $(tr).find('td:eq(7)').find('select').children("option:selected").val();
                   
                    oppStatus = $(tr).find('td:eq(8)').find('div:eq(0)').text();
                    
                    isOppStsChanged = $(tr).find('td:eq(9)').find('input[type=checkbox]').prop('checked');
                   
                    if (autoRenewalVal == "Yes") {
                        entity.ss_autorenewalforsubscriptionterm = 1;
                    }
                    else  if (autoRenewalVal == "N/A"){
                        entity.ss_autorenewalforsubscriptionterm = 2;
                    }
                    else  if (autoRenewalVal == "No"){
                        entity.ss_autorenewalforsubscriptionterm = 0;
                    }
                    if (isOppStsChanged == true) {
                        entity.ss_modifycontractstatus = true;
                    }
                    else  if (isOppStsChanged == false){
                        entity.ss_modifycontractstatus = false;
                    }
                    if (oppStatus == "Active") {
                        entity.ss_contractstatus = 1;
                    }
                    else if (oppStatus == "Draft") {
                        entity.ss_contractstatus = 2;
                    }
                    else if (oppStatus == "Terminated") {
                        entity.ss_contractstatus = 3;
                    }
                   
                    //nd========================
                    data.push('--changeset_BBB457');
                    data.push('Content-Type:application/http');
                    data.push('Content-Transfer-Encoding:binary');
                    var id = i + 1;
                    data.push('Content-ID:' + id);
                    data.push('');
                    data.push('PATCH ' + parent.Xrm.Page.context.getClientUrl() + '/api/data/v8.2/opportunities(' + OppId + ') HTTP/1.1');
                    data.push('Content-Type:application/json;type=entry');
                    data.push('');
                    data.push(JSON.stringify(entity));
                    //JSON.stringify(entity)
                    //========================nd

                }
              
                //nd===================================


                //first request


                //end of changeset
                data.push('--changeset_BBB457--');
                //end of batch
                data.push('--batch_123456--');
                var payload = data.join('\r\n');

                $.ajax(
                    {
                        method: 'POST',
                        url: parent.Xrm.Page.context.getClientUrl() + '/api/data/v8.2/$batch',
                        headers: {
                            'Content-Type': 'multipart/mixed;boundary=batch_123456',
                            'Accept': 'application/json',
                            'Odata-MaxVersion': '4.0',
                            'Odata-Version': '4.0'

                        },

                        data: payload,
                        async: false,
                        success: function (data) {  
                           
                            $(".loader").fadeOut().delay(2000);
                            alert("The record has been updated");
                           
                            
                            

                        },
                        error: function (error) {
                            $(".loader").hide();
                            // console.error("data is =>"+data);
                            alert(JSON.stringify(error));
                        }
                    });

                //========================================nd    
            }
            else {
                alert("Please Change any record first");
            }
        }

    });



    //========================================================================================================================
    //Function to update Products (Nested Tables data)
    $("#contractDetailsTblBody").on("click", ".saveProducts", function (eventObj) {
       
        //================
        var data = [];
        data.push('--batch_123456');
        data.push('Content-Type: multipart/mixed;boundary=changeset_BBB457');
        data.push('');
        var entity = {};
        //================

        var btnName = this.name;
        var pdclass = 'p' + btnName;
        var pdTableID = btnName + '_pt';

        var tblLength = $('#' + pdTableID + ' > tbody > .' + pdclass).length;

        if (tblLength > 0) {
            
            //$(".loader").show();
            debugger;
            $(".loader").fadeIn();
            for (var i = 0; i < tblLength; i++) {
                var tr = $('#' + pdTableID + ' > tbody > .' + pdclass)[i];
                var OppProdId = $(tr).find('td:eq(10)').text();
                if(OppProdId === null || OppProdId ==="")
                {
                    OppProdId = $(tr).find('td:eq(9)').text();
                }
                var prodStatus = $(tr).find('td:eq(7)').find('div:eq(0)').text();
                var iSprodStatusChanged = $(tr).find('td:eq(8)').find('div:eq(0)').find('input[type=checkbox]').prop('checked');
                var date = $(tr).find('td:eq(9)').find('input[type=date]').val();
                if(date != undefined && date != null)
                {
                    entity.ss_productlivedate = new Date(date).toISOString();
                }
                //nh=================================
                if (iSprodStatusChanged == true) {
                    entity.ss_modifyproductstatus = true;
                }
                else if (iSprodStatusChanged == false) {
                    entity.ss_modifyproductstatus = false;
                }

                if (prodStatus == "Active") {
                    entity.ss_productstatus = 1;
                }
                else if (prodStatus == "Draft") {
                    entity.ss_productstatus = 2;
                }
                else if (prodStatus == "Terminated") {
                    entity.ss_productstatus = 3;
                }
                
                data.push('--changeset_BBB457');
                data.push('Content-Type:application/http');
                data.push('Content-Transfer-Encoding:binary');
                var id = i + 1;
                data.push('Content-ID:' + id);
                data.push('');
                data.push('PATCH ' + parent.Xrm.Page.context.getClientUrl() + '/api/data/v8.2/opportunityproducts(' + OppProdId + ') HTTP/1.1');
                data.push('Content-Type:application/json;type=entry');
                data.push('');
                data.push(JSON.stringify(entity));

                //=================================nh
            }
           
            //nh========================================
            //end of changeset
            data.push('--changeset_BBB457--');
            //end of batch
            data.push('--batch_123456--');
            var payload = data.join('\r\n');

            $.ajax(
                {
                    
                    method: 'POST',
                    url: parent.Xrm.Page.context.getClientUrl() + '/api/data/v8.2/$batch',
                    headers: {
                        'Content-Type': 'multipart/mixed;boundary=batch_123456',
                        'Accept': 'application/json',
                        'Odata-MaxVersion': '4.0',
                        'Odata-Version': '4.0'

                    },

                    data: payload,
                    async: false,
                    success: function (data) {
                       
                        //$(".loader").hide();
                        $(".loader").fadeOut().delay(2000);
                        alert("The record has been updated");
                        
                        
                    },
                    error: function (error) {
                        // console.error("data is =>"+data);
                        $(".loader").fadeOut().delay(2000);
                        alert(JSON.stringify(error));
                    }
                });
        }
        else {
            alert("Please Change any record first");
        }
        //=======================================nh


    });
    // function updatedate(date,id)
    // {
    //     var newdate = new Date(date);
    //     var y = newdate.getFullYear();
    //     var m = newdate.getMonth();
    //     var d = newdate.getDate();
    //     var entity = {};
    //     entity.ss_productlivedate = d+"/"+m+"/"+y;
    //     parent.Xrm.WebApi.online.updateRecord("opportunityproduct", id, entity).then(
    //         function success(result) {
    //             var updatedEntityId = result.id;
    //             alert("Date updated");
    //         },
    //         function(error) {
    //             parent.Xrm.Utility.alertDialog(error.message);
    //         }
    //     );
    // }
    //==========================================nh    


    $("#contractDetailsTblBody").on("click", ".expandTbl", function (eventObj) {
        if ($(this).prop("checked") == true) {
            var target = eventObj.target;
            var closestTR = $(target).closest("tr");
            //nd=======
            var removedTbl = $(closestTR).next();
            $(removedTbl).show();
            //=======nd

        }
        else if ($(this).prop("checked") == false) {
            var target = eventObj.target;
            var closestTR = $(target).closest("tr");
            var removeTbl = $(closestTR).next();
            $(removeTbl).hide();
        }
    });
    //nh=================================================
    $("Body").on("click", function (eventObj2) {

        var target = eventObj2.target;
        var dp = $(".dropdown-menu").css('display');

        if (target.name != "contractCbox") {

            $(".dropdown-menu").addClass('d-none');

            
        }

    });

    $("#contractDetailsTblBody").on("click", ".expandTbl2", function (eventObj) {
        var target = eventObj.target;
        var nextElement = $(target).next();
        $(".dropdown-menu").addClass('d-none');
        if (this.name == "contractCbox") {


            //var closestDiv = $(target).closest(".dropdown-menu");
            if ($(this).prop("checked") == true) {
                $(nextElement).removeClass("d-none");
                $(nextElement).show();


            }
            else if ($(this).prop("checked") == false) {
                $(nextElement).addClass("d-none");
                //$(nextElement).hide();

            }
        }
        //   else
        //   {
        //     $(".dropdown-menu").hide();
        //   }
    });
    //===================================================nh
});
function loadData() {

    $(".loader").fadeIn();
    $("body").css("background-color", "#f5f5f5");
	$("body").css("opacity", .50);
    $("#mainTbl").hide();   
   // $(".loader").show();
    setTimeout(function () {
        location.reload(true);
    }, 1000);

}
//nh=============================================
//Func to Update Modify contract status field
function modifyContractStatusFunc(mcsObj) {
    var OppId = mcsObj.id;
    var statusVal;
    if ($(mcsObj).prop("checked") == true) {
        statusVal = true;
    }
    else if ($(mcsObj).prop("checked") == false) {
        statusVal = false;
    }

    // alert(statusVal);

    // var entity = {};
    // entity.ss_modifycontractstatus = statusVal;

    // window.parent.Xrm.WebApi.online.updateRecord("opportunity", OppId, entity).then(
    //     function success(result) {
    //         alert("C S updated");
    //         var updatedEntityId = result.id;

    //     },
    //     function (error) {
    //         window.parent.Xrm.Utility.alertDialog(error.message);
    //     }
    // );

}
//Func to Update Modify Product status field
function modifyProductStatusFunc(mpsObj) {
    var OppProId = mpsObj.id;
    var pstatusVal;
    if ($(mpsObj).prop("checked") == true) {
        pstatusVal = true;
    }
    else if ($(mpsObj).prop("checked") == false) {
        pstatusVal = false;
    }

    // var entity = {};
    // entity.ss_modifyproductstatus = pstatusVal;

    // window.parent.Xrm.WebApi.online.updateRecord("opportunityproduct", OppProId, entity).then(
    //     function success(result) {
    //         alert("P S updated");
    //         var updatedEntityId = result.id;

    //     },
    //     function (error) {
    //         window.parent.Xrm.Utility.alertDialog(error.message);
    //     }
    // );
}
//=============================================nh
// Func to Update Opp Contract Status
function UpdateContractStatus(contractID) {


    var OppId = contractID.name;
    var contractStatus = 0;
    var setColor;
    var textColor;
    if (contractID.value == "Terminated") {
        setColor = "red";
        textColor = "white";
        contractStatus = 3;
    }
    else if (contractID.value == "Draft") {
        setColor = "yellow";
        textColor = "black";
        contractStatus = 2;
    }
    else {
        setColor = "green";
        textColor = "white";
        contractStatus = 1;
    }
    //nh=======================
    var entity = {};
    entity.ss_contractstatus = contractStatus;

    window.parent.Xrm.WebApi.online.updateRecord("opportunity", OppId, entity).then(
        function success(result) {
            var updatedEntityId = result.id;

        },
        function (error) {
            window.parent.Xrm.Utility.alertDialog(error.message);
        }
    );
    //========================nh

    var newContractID = contractID.id;
    var newContractID = newContractID.substring(0, (newContractID.length - 1)); //making corresponding contract status Id to change its value according to the selected
    $('#' + newContractID).html("<div style='color:" + textColor + ";background-color:" + setColor + ";margin:1px'>" + contractID.value + "</div>");

    //nd=====================================
    //    if(!(isModifiedContractStatus.includes(OppId)))
    //    {
    //     isModifiedContractStatus+=" "+OppId;
    //         var entity = {};
    //         entity.ss_modifycontractstatus = true;

    //         window.parent.Xrm.WebApi.online.updateRecord("opportunity", OppId, entity).then(
    //             function success(result) {
    //                 alert("c updated");
    //                 var updatedEntityId = result.id;

    //             },
    //             function (error) {
    //                 window.parent.Xrm.Utility.alertDialog(error.message);
    //             }
    //         );
    //    }
    //======================================nh


}
//===================================nH
//Func to get file
 function getFile(annotationid)
 {  
    window.parent.Xrm.WebApi.online.retrieveRecord("annotation",annotationid).then(
        function success(result) {
           // var annotationid = result["annotationid"];
            var DocumentBody;
            var FileName;
                if (result["documentbody"]) 
                {
                    DocumentBody = result["documentbody"];
                }
                if (result["filename"])
                {
                    FileName = result["filename"];
                }
                        
                dataURItoBlob(DocumentBody, FileName);
        },
        function(error) {
            window.parent. Xrm.Utility.alertDialog(error.message);
        }
    );
   
 }
 //==============================nH
 function dataURItoBlob(dataURI, filename) {
    // convert base64 to raw binary data held in a string
    //
    var byteString = atob(dataURI);
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab]);
    saveFile(bb, filename);

}
function saveFile(blob, filename) {
    saveAs(blob, filename);
}
//==============================
//Func to Update Product Status
function UpdateProductStatus(ProductID) {
    var setColor;
    var Pstatus = 0;
    var textColor;
    var OppIdd = ProductID.name;

    if (ProductID.value == "Terminated") {
        setColor = "red";
        textColor = "white";
        Pstatus = 3;
    }
    else if (ProductID.value == "Draft") {
        setColor = "yellow";
        textColor = "black";
        Pstatus = 2;
    }
    else {
        setColor = "green";
        textColor = "white";
        Pstatus = 1;
    }
    var newContractID = ProductID.id;
    newContractID = newContractID.substring(0, (newContractID.length - 1));//making corresponding contract status Id to change its value according to the selected
    $('#' + newContractID).html("<div style='background-color:" + setColor + "; color:" + textColor + "; margin:1px'>" + ProductID.value + "</div>");
    //nd===========================================================
    // var entity = {};
    // entity.ss_productstatus = Pstatus;

    // window.parent.Xrm.WebApi.online.updateRecord("opportunityproduct", OppIdd, entity).then(
    //     function success(result) {
    //         var updatedEntityId = result.id;
    //         //alert("P Satus Updated");
    //     },
    //     function (error) {
    //         window.parent.Xrm.Utility.alertDialog(error.message);
    //     }
    // );
    //=============================================================nd



    //nd=====================================
    //  if(!(isModifiedProductStatus.includes(OppIdd)))
    //  {
    //     isModifiedProductStatus+=" "+OppIdd;
    //       var entity = {};
    //       entity.ss_modifyproductstatus = true;

    //       window.parent.Xrm.WebApi.online.updateRecord("opportunityproduct", OppIdd, entity).then(
    //           function success(result) {
    //               alert("o p updated");
    //               var updatedEntityId = result.id;

    //           },
    //           function (error) {
    //               window.parent.Xrm.Utility.alertDialog(error.message);
    //           }
    //       );
    //    }
    //======================================nh
}
//nd=================================================================
//Func to Update autoRenewal Status
// function UpdateRenewalStatus(renewalStatus) {

//     var autoRenewalSts;

//     if (renewalStatus.value == "Yes") {
//         autoRenewalSts = true;
//     }
//     else {
//         autoRenewalSts = false;
//     }
//     var OppId = renewalStatus.id;


//     //nd=======================
//     var entity = {};
//     entity.ss_autorenewalforsubscriptionterm = autoRenewalSts;

//     window.parent.Xrm.WebApi.online.updateRecord("opportunity", OppId, entity).then(
//         function success(result) {
//             var updatedEntityId = result.id;

//         },
//         function (error) {
//             window.parent.Xrm.Utility.alertDialog(error.message);
//         }
//     );
//     //========================nd
//     //  alert(renewalValue);

// }
// function checkaccountoppProducts(oppid)
// {
//     var fetchData = {
// 		opportunityid: oppid,
// 		productnumber: "620007",
// 		productnumber2: "670013",
// 		productnumber3: "SP-04",
// 		productnumber4: "LP-04",
// 		productnumber5: "LP-03",
// 		productnumber6: "SP-02",
// 		productnumber7: "LP-02",
// 		productnumber8: "670020",
// 		productnumber9: "LF-148Test",
// 		productnumber10: "670023",
// 		productnumber11: "670022",
// 		productnumber12: "LP-01",
// 		productnumber13: "SP-74",
// 		productnumber14: "LP-74",
// 		productnumber15: "SP-76",
// 		productnumber16: "LP-76",
// 		productnumber17: "SP-75",
// 		productnumber18: "LP-75",
// 		productnumber19: "670011",
// 		productnumber20: "620000",
// 		productnumber21: "670026"
// 	};

// 	var fetchXml = [
// "<fetch top='50'>",
// "  <entity name='opportunityproduct'>",
// "    <attribute name='productid' />",
// "    <attribute name='opportunityproductid' />",
// "    <attribute name='productidname' />",
// "    <filter>",
// "      <condition attribute='opportunityid' operator='eq' value='", fetchData.opportunityid, "'/>",
// "    </filter>",
// "    <link-entity name='product' from='productid' to='productid' alias='oppproduct'>",
// "      <attribute name='name' />",
// "      <filter type='and'>",
// "        <filter type='or'>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber2, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber3, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber4, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber5, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber6, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber7, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber8, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber9, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber10, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber11, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber12, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber13, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber14, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber15, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber16, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber17, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber18, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber19, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber20, "'/>",
// "          <condition attribute='productnumber' operator='eq' value='", fetchData.productnumber21, "'/>",
// "        </filter>",
// "      </filter>",
// "    </link-entity>",
// "  </entity>",
// "</fetch>",
// 	].join("");
//     var prodName = "";
//     fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
//     debugger;
//     window.parent.Xrm.WebApi.online.retrieveMultipleRecords("opportunityproduct", fetchXml).then(
//         function success(result)
//         {
//             if(result.entities.length > 0)
//             {
//                 for(var i=0; i<result.entities.length; i++)
//                 {
//                     prodName += result.entities[i]["oppproduct.name"] + ",";
//                 }
//             }
//             getProductTable(oppid,prodName);
//         },
//             function(error)
//             {
//                 console.log("Error is => " + error);
//             }
//         )
// }
//===================================================================nd
// Table to Appear for Specific Opportunity when Specific checkbox in checked 
function getProductTable(opportunityID) {
    var productids = ["620007", "670013", "SP-04", "LP-04", "LP-03", "SP-02", "LP-02", "670020", "LF-148Test","670023","670022", "LP-01", "SP-74", "LP-74", "SP-76", "LP-76", "SP-75", "LP-75", "670011", "620000", "670026"];
    var fetchData = {
		opportunityid: opportunityID
	};
	var fetchXml = [
                    "<fetch>",
                    "  <entity name='opportunityproduct'>",
                    "    <attribute name='ss_termenddate' />",
                    "    <attribute name='ss_monthlylicensefee' />",
                    "    <attribute name='ss_licensefee' />",
                    "    <attribute name='ss_modifyproductstatus' />",
                    "    <attribute name='opportunityproductid' />",
                    "    <attribute name='ss_productlivedate' />",
                    "    <attribute name='productname' />",
                    "    <attribute name='ss_setupfee' />",
                    "    <attribute name='ss_startdate' />",
                    "    <attribute name='ss_productstatus' />",
                    "    <filter>",
                    "      <condition attribute='opportunityid' operator='eq' value='",fetchData.opportunityid,"'/>",
                    "    </filter>",
                    "    <link-entity name='product' from='productid' to='productid' alias='oppProduct'>",
                    "      <attribute name='productnumber' />",
                    "      <attribute name='name' />",
                    "    </link-entity>",
                    "  </entity>",
                    "</fetch>",
                        ].join("");
                        fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
    window.parent.Xrm.WebApi.online.retrieveMultipleRecords("opportunityproduct", fetchXml).then(
        function success(results) {
            console.log(results);
            var setColor;
            var textColor;
            var isModifiedPStatus;
            var productTable = "";
            if(results.entities.length > 0){
            for (var i = 0; i < results.entities.length; i++) {
                isModifiedPStatus = "";
                var modifyproductstatus = results.entities[i]["ss_modifyproductstatus"];
                console.log(`Modified Product Status is ${modifyproductstatus}`);
                var opportunityproductid = results.entities[i]["opportunityproductid"];
                var productname = results.entities[i]["productname"];
                var ss_licensefee = results.entities[i]["ss_licensefee"];
                var ss_licensefee_formatted = results.entities[i]["ss_licensefee@OData.Community.Display.V1.FormattedValue"];
                var ss_monthlylicensefee = results.entities[i]["ss_monthlylicensefee"];
                var ss_monthlylicensefee_formatted = results.entities[i]["ss_monthlylicensefee@OData.Community.Display.V1.FormattedValue"];
                var ss_setupfee = results.entities[i]["ss_setupfee"];
                var ss_setupfee_formatted = results.entities[i]["ss_setupfee@OData.Community.Display.V1.FormattedValue"];
                var ss_startdate = results.entities[i]["ss_startdate"];
                var ss_productlivedate = results.entities[i]["ss_productlivedate"];
                var productno = results.entities[i]["oppProduct.productnumber"];
                var date = "";
                if(ss_productlivedate != null && ss_productlivedate != undefined)
                {
                    date = new Date(ss_productlivedate).toISOString().substring(0, 10);
                }
                else
                {
                    date = "";  
                }
                if (ss_startdate != undefined && ss_startdate != null)
                {
                    ss_startdate = ss_startdate.substring(0, 10);
                }
                 else
                 {
                    ss_startdate = "";  
                 }

                var ss_termenddate = results.entities[i]["ss_termenddate"];
                if (ss_termenddate != undefined && ss_termenddate != null)
                {
                    ss_termenddate = ss_termenddate.substring(0, 10);
                }
                else
                {
                    ss_termenddate = "";
                }   
                // var ss_productstatus = results.entities[i]["ss_productstatus"];
                var ss_productstatus_formatted = results.entities[i]["ss_productstatus@OData.Community.Display.V1.FormattedValue"];

                if (modifyproductstatus == true) {
                    isModifiedPStatus = "checked";
                }

                if (ss_productstatus_formatted == undefined) {
                    setColor = "green";
                    textColor = "white";
                    ss_productstatus_formatted = "Active";
                }
                else if (ss_productstatus_formatted == "Active") {
                    setColor = "green";
                    textColor = "white";
                }
                else if (ss_productstatus_formatted == "Terminated") {
                    setColor = "red";
                    textColor = "white";
                }
                else if (ss_productstatus_formatted == "Draft") {
                    setColor = "yellow";
                    textColor = "black";
                }
                else {
                    setColor = "white";
                    textColor = "white";
                }
                // productTable = productTable + "<tr><td>" + productname + "</td><td>" + ss_setupfee_formatted + "</td><td>" + ss_monthlylicensefee_formatted + "</td>"
                //     + "<td>" + ss_licensefee_formatted + "</td><td>" + ss_startdate + "</td><td>" + ss_termenddate + "</td><td id=" + opportunityID + i + "S ><div style='color:" + textColor + ";background-color:" + setColor + "'>" + ss_productstatus_formatted + "</div></td><td><div class='dropdown'><button type='button' class='btn btn-light btn-xs small dropdown-toggle modifyStatus' data-toggle='dropdown' ></button>"
                //     + "<div class='dropdown-menu dropdownProductsPosition' aria-labelledby='dropdownMenuButton'>"
                //     + "<div class='selectedData'><input type='radio'  value='Draft' id='" + opportunityID + i + "S1' onclick='UpdateProductStatus(this)' name=" + opportunityproductid + ">Draft<br>"
                //     + "<input type='radio' value='Terminated'  id='" + opportunityID + i + "S2' onclick='UpdateProductStatus(this)' name=" + opportunityproductid + ">Terminated<br>"
                //     + "<input type='radio' value='Active'  id='" + opportunityID + i + "S3' onclick='UpdateProductStatus(this)' name=" + opportunityproductid + ">Active<br></div></div></div></td></tr></td>";

                //nh=================================================
               
                productTable = productTable + "<tr class='productstr' id='" + opportunityproductid + "_pd' onchange='isProductValChange(this)'><td style='display:none;'>p" + opportunityID + "</td><td class='Prod-and-ContractName'>" + productname + "</td><td>" + ss_setupfee_formatted + "</td><td>" + ss_monthlylicensefee_formatted + "</td>"
                    + "<td>" + ss_licensefee_formatted + "</td><td>" + ss_startdate + "</td><td>" + ss_termenddate + "</td><td id=" + opportunityID + i + "S >"
                    + "<div style='color:" + textColor + ";background-color:" + setColor + "'>" + ss_productstatus_formatted + "</div></td><td><div class='dropdown'>"
                    + "<input type='checkbox' class='expandTbl2' id='" + opportunityproductid + "' name='contractCbox' " + isModifiedPStatus + " onclick='modifyProductStatusFunc(this)'/>"
                    + "<div class='dropdown-menu dropdownProductsPosition' ><span>Please select</span><div class='selectedData'>"
                    + "<input type='radio' class='statusRadioBtn' value='Draft' id='" + opportunityID + i + "S1' onclick='UpdateProductStatus(this)' name=" + opportunityproductid + "><span class='statusVal'>Draft</span><br>"
                    + "<input type='radio' class='statusRadioBtn' value='Terminated'  id='" + opportunityID + i + "S2' onclick='UpdateProductStatus(this)' name=" + opportunityproductid + "><span class='statusVal'>Terminated</span><br>"
                    + "<input type='radio' class='statusRadioBtn' value='Active'  id='" + opportunityID + i + "S3' onclick='UpdateProductStatus(this)' name=" + opportunityproductid + "><span class='statusVal'>Active</span><br>"
                    + "</div></div></div></td>";
                    var res = productids.includes(productno);
                    if(res)
                    {
                        productTable += `<td><input type="date" id="golive" value = ${date}></td>`;
                    }
                    else
                    {
                        $("#liveproduct").hide();
                    }
                    productTable += "<td id = 'oppid' style='display:none;'>" + opportunityproductid + "</td></tr>";
                //====================================================nh
            }
        }
            $("#" + opportunityID + '_p').append(productTable);
        },
        function (error) {
            var errorOptions = { message: "Custom Error Message", details: "Inner exception details" };
            window.parent.Xrm.Navigation.openErrorDialog(errorOptions).then(
                function (success) {
                    console.log(success);
                },
                function (error) {
                    console.log(error);
                });
        }
    );
}

// Getting different fields data from account with link opportunityproduct + annotation
function RetrieveContractDetailsTblData() {
    var accounId = window.parent.Xrm.Page.data.entity.getId();
    // var fetchXML2 = `<fetch>
    //                         <entity name="account" count='1' distinct='false'>
    //                             <filter type="and" >
    //                                 <condition attribute="accountid" operator="eq" value="`+ accounId + `" />
    //                             </filter>
    //                             <link-entity name="opportunity" from="parentaccountid" to="accountid" link-type="inner" alias="op" >
    //                                 <attribute name="ss_autorenewalforsubscriptionterm" />
    //                                 <attribute name="ss_terminationperiod" />
    //                                 <attribute name="ss_contractstatus" />
    //                                 <attribute name="opportunityid" />
    //                                 <link-entity name="annotation" from="objectid" to="opportunityid" alias="ano"  >
    //                                 <attribute name="createdon" />
    //                                 <attribute name="filename" />
    //                                 <attribute name="ownerid" />
    //                                 </link-entity>
    //                             </link-entity>
    //                         </entity>
    //                 </fetch>`

    var fetchXML2 = `<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="true" >
                       <entity name="opportunity">
                            <attribute name="ss_autorenewalforsubscriptionterm" />
                            <attribute name="ss_terminationperiod" />
                            <attribute name="ss_contractenddate" />
                            <attribute name="ss_contractstatus" />
                            <attribute name="ss_modifycontractstatus" />
                            <attribute name="opportunityid" /> 
                            <attribute name="ss_priceincreases" />
                             <order attribute="createdon"/>               
                            <filter type="and">                         
                            <condition attribute="parentaccountid" operator="eq" value="`+ accounId + `" />
                            </filter>
                            <link-entity name="annotation" from="objectid" to="opportunityid" link-type="inner" alias="ano" >
                                    <attribute name="objectid" distinct="true"/>
                                    <attribute name="annotationid" />
                                    <attribute name="createdon" />
                                    <attribute name="filename" />
                                    <attribute name="ownerid" />   
                                    <order attribute="createdon" descending="true"/>                                
                            <filter type="and">
                                <condition attribute="notetext" operator="like" value="%{{Contract--%" />
                            </filter>
                            </link-entity>
                    </entity>
                </fetch>`
    fetchXML2 = "?fetchXml=" + encodeURIComponent(fetchXML2);
    window.parent.Xrm.WebApi.online.retrieveMultipleRecords("opportunity", fetchXML2).then(
        function success(results) {
                var checkArray=[];// check for repeated contracts
                
            for (var i = 0; i < results.entities.length; i++) {

                  if(checkArray.includes(results.entities[i]["opportunityid"]))
                  {
                  	continue;
                  }
                  else
                  {
                  	var oppID = results.entities[i]["opportunityid"];
                  	checkArray.push(oppID);
                  var name = results.entities[i]["ano.filename"];
                  var annotationid = results.entities[i]["ano.annotationid"];

                var createdOn = results.entities[i]["ano.createdon"];
                if (createdOn != undefined)
                    createdOn = createdOn.substring(0, 10);

                var ownerName = results.entities[i]["ano.ownerid@OData.Community.Display.V1.FormattedValue"];


                var autoRenewal = results.entities[i]["ss_autorenewalforsubscriptionterm"];

                var ss_terminationperiod = results.entities[i]["ss_terminationperiod"];
                

                var ss_terminationperiod_formatted = results.entities[i]["ss_terminationperiod@OData.Community.Display.V1.FormattedValue"];

                var ss_contractstatus = results.entities[i]["ss_contractstatus@OData.Community.Display.V1.FormattedValue"];
                var modifycontractstatus = results.entities[i]["ss_modifycontractstatus"];
                var endDate = results.entities[i]["ss_contractenddate@OData.Community.Display.V1.FormattedValue"];
                var priceincrease = results.entities[i]["ss_priceincreases"];
                if(priceincrease == null || priceincrease == "")
                {
                    priceincrease = " ";
                }
                else
                {
                    priceincrease = priceincrease + "%";
                }
                if (endDate == undefined) {
                    endDate = "";
                }
                if (ss_contractstatus == undefined) {
                    ss_contractstatus = "Active";
                }

                createContractDetailsRow(oppID, name, createdOn, ownerName, ss_terminationperiod_formatted, endDate, autoRenewal, i,priceincrease, ss_contractstatus, modifycontractstatus, annotationid);
                //getTermEndDateValue(oppID, name, createdOn, ownerName, ss_terminationperiod_formatted, autoRenewal, i, ss_contractstatus, modifycontractstatus);
             }//end of else

           }//end of for loop


        },
        function (error) {
            var errorOptions = { message: "Custom Error Message", details: "Inner exception details" };
            window.parent.Xrm.Navigation.openErrorDialog(errorOptions).then(
                function (success) {
                    console.log(success);
                },
                function (error) {
                    console.log(error);
                });
        }
    );
  
        
        //$(".loader").hide();
        $(".loader").fadeOut().delay(2000);
    
}

//nh=========================================
//=============================================nh
function createContractDetailsRow(oppid, contractName, createdOn, ownerName, terminationTime, EndOfContract, renewal, contractid, priceincrease,ss_contractstatus, modifycontractstatus, annotationid) {
    debugger;
    var setColor;
    var textColor;
    var isModified;
    if (ss_contractstatus == "Active") {
        setColor = "green";
        textColor = "white";
    }
    else if (ss_contractstatus == "Terminated") {
        setColor = "red";
        textColor = "white";
    }
    else if (ss_contractstatus == "Draft") {
        setColor = "yellow";
        textColor = "black";
    }
    else {
        setColor = "white";
        textColor = "white";
    }

    if (modifycontractstatus == true) {
        isModified = "checked";
    }

    var selected = "";
    var selected2 = "";
    var selected3 = "";
    if (renewal == 0) {
        selected = "selected";
    }
    else if (renewal == 1) {
        selected2 = "selected";
    }
    else if (renewal == 2) {
        selected3 = "selected";
    }


    var markup = "<tr class='app ' id='" + oppid + "_CR' ><td><input type='checkbox' class='expandTbl' ><input type='hidden' value=" + oppid + " id='oppidvalue'></td><td style='width:30%;' class='Prod-and-ContractName'><a class='fileLink' href=# onclick='getFile(\"" + annotationid + "\")'>" + contractName + "</a></td><td>"+ priceincrease  +"</td><td>" + createdOn + "</td><td>" + ownerName + "</td><td>" + terminationTime + 
        "</td><td>"
        + EndOfContract + "</td><td><select class='btn-outline-info'  id='" + oppid + "' onchange='isContractValChange(this)'>"
        + "<option value='Yes' " + selected2 + ">Yes</option><option value='N/A' " + selected3 + ">N/A</option><option value='No'  " + selected + ">No</option></select></td><td id='" + contractid + "_S'  > <div style='color:" + textColor + ";background-color:" + setColor + "'>" + ss_contractstatus + "</div></td>"
        + "<td id='cStatus'><div class='dropdown'><input type='checkbox' class='expandTbl2' id='" + oppid + "' name='contractCbox' " + isModified + " onchange='isContractValChange(this)' onclick='modifyContractStatusFunc(this)'>"
        + "<div class='dropdown-menu dropdownPosition d-none' ><span>Please select</span>"
        + "<div class='selectedData' ><input type='radio' class='statusRadioBtn' value='Draft' id='" + contractid + "_S1'  onclick='UpdateContractStatus(this)' name='" + oppid + "'><span class='statusVal'>Draft</span><br>"
        + "<input type='radio' class='statusRadioBtn' value='Terminated'  id='" + contractid + "_S2' onclick='UpdateContractStatus(this)' name='" + oppid + "'><span class='statusVal'>Terminated</span><br>"
        + "<input type='radio' class='statusRadioBtn' value='Active'  id='" + contractid + "_S3' onclick='UpdateContractStatus(this)' name ='" + oppid + "'><span class='statusVal'>Active</span><br></div></div></div></td></tr>";
    $("#contractDetailsTblBody").append(markup);



    //setTimeout(function () {


    var markup2 = "<tr class='OppProducts' style='display:none;'><td class='class='text-center' colspan='11' >"
        + "<table class='table table-responsive table-sm text-center border-0 removetable ' id='" + oppid + "_pt'  style='margin-left:90px;'>"
        + "<thead class='table-info'><tr> <th class='Prod-and-ContractName'>Product</th><th>Setup Fee</th><th>Monthly Lisence</th>"
        + "<th>Yearly Lisence</th><th>Term Start Date</th><th>Term End Date</th> <th>Product Status</th>"
        + "<th>Modify Product Status</th><th id ='liveproduct'>Go Live Date</th><th style='padding:2px;'><button class='btn btn-success btn-sm saveProducts' id='" + oppid + "_b' name='" + oppid + "' style='font-size: 9px;float: left;'>Save "
        + "<i class='fa fa-envelope-square fa-lg' style='float: left;padding: 2px 7px 0px 0px;'></i></button></th> </tr></thead><tbody id='" + oppid + "_p'></tbody>"
        + "</table></td></tr>"



    $(markup2).insertAfter('#' + oppid + '_CR');
    //checkaccountoppProducts(oppid);
    getProductTable(oppid);



    // }, 50);

}
//nh=============================================
function isContractValChange(Contractobj) {

    $(Contractobj).closest('tr').addClass("ss-opportunity");
    //    alert("class has been Added");
}
function isProductValChange(Productobj) {
    // alert("added"+Productobj.id)
    // var pId=Productobj.id;
    var oppidTD = $(Productobj).find('td:eq(0)').text();
    // var pclass="p" +pId;
    //   alert(oppidTD);
    $(Productobj).addClass(oppidTD);
    // alert(pId);
    //  $(Contractobj).addClass("ss-opportunity");
}

  //================================================nh
