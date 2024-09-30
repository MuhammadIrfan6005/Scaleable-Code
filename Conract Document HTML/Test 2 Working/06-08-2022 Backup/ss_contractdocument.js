// var isModifiedProductStatus="";
$(document).ready(function () {
    var FormStatus = window.parent.Xrm.Page.ui.getFormType();
    if (FormStatus == 1) {
        $("#mainTblDiv").addClass('d-none');
        $(".createmode").show();
    }
    else {
        $(".createmode").addClass('d-none');
        RetrieveContractDetailsTblData("","");
    }
    // setTimeout(function () {
    //     $(".loader").fadeIn().delay(2000).fadeOut();
    //     $(".loader").hide();
    // }, 1000);

    //nh=============================================================================================================
    //Function to update Contracts (Outer Table data)o
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
            var cancellationatdate = "";
            var cancellationtodate = "";
            if (tblLength > 0) {
                $(".loader").fadeIn();
                // $(".loader").show();
                var entity = {};
                for (var i = 0; i < tblLength; i++) {
                    tr = $('.ss-opportunity')[i];
                    OppId = $(tr).find('td:eq(0)').find('input[type=hidden]').val();


                    autoRenewalVal = $(tr).find('td:eq(13)').find('select').children("option:selected").val();

                    oppStatus = $(tr).find('td:eq(14)').find('div:eq(0)').text();

                    isOppStsChanged = $(tr).find('td:eq(15)').find('input[type=checkbox]').prop('checked');

                    var contractnumber = $(tr).find('td:eq(5)').text();

                    var contractowner = $(tr).find('td:eq(9)').text();


                    if (autoRenewalVal == "Yes") {
                        entity.ss_autorenewalforsubscriptionterm = 1;
                    }
                    else if (autoRenewalVal == "N/A") {
                        entity.ss_autorenewalforsubscriptionterm = 2;
                    }
                    else if (autoRenewalVal == "No") {
                        entity.ss_autorenewalforsubscriptionterm = 0;
                    }
                    if (isOppStsChanged == true) {
                        entity.ss_modifycontractstatus = true;
                    }
                    else if (isOppStsChanged == false) {
                        entity.ss_modifycontractstatus = false;
                    }
                    if (oppStatus == "Active") {
                        entity.ss_contractstatus = 1;
                    }

                    // else if (oppStatus == "Draft") {
                    //     entity.ss_contractstatus = 2;
                    // }
                    else if (oppStatus === "Termination Requested") {

                        entity.ss_contractstatus = 3;

                        cancellationatdate = $(tr).find('td:eq(16)').find('input[type=date]').val();
                        if (cancellationatdate != undefined && cancellationatdate != null && cancellationatdate != "Invalid" && cancellationatdate != "") {
                            entity.ss_cancelledatdate = new Date(cancellationatdate).toISOString();
                        }
                        else {
                            alert("Please Enter Cancellation To Date \n Cancellation At Date \n Select Reason");
                            location.reload();
                            return;
                        }

                        cancellationtodate = $(tr).find('td:eq(17)').find('input[type=date]').val();
                        if (cancellationtodate != undefined && cancellationtodate != null && cancellationtodate != "Invalid" && cancellationtodate != "") {
                            entity.ss_cancelledtodate = new Date(cancellationtodate).toISOString();
                        }
                        else {
                            alert("Please Enter Cancellation To Date \n Cancellation At Date \n Select Reason");
                            location.reload();
                            return;
                        }

                        var checkboxes = $(tr).find('td:eq(18)').find('input[type=checkbox]:checked').map(function () {
                            return this.value;
                        }).get().join(',');
                        if (checkboxes != null && checkboxes != undefined && checkboxes != "") {
                            entity.ss_contractcancellationreason = checkboxes;
                        }
                        else {
                            alert("Please Enter Cancellation To Date \n Cancellation At Date \n Select Reason");
                            location.reload();
                            return;
                        }
                        if (confirm("Are you SURE?\nYou want to TERMINATE the CONTRACT !") == true) {
                            entity.ss_contractstatus = 3;
                            entity.ss_transferedtofinance = false;
                            $(tr).find('td:eq(8)').find('select').attr("disabled", true);
                            $(tr).find('td:eq(10)').find('input[type=checkbox]').attr("disabled", true);
                            $(tr).find('td:eq(11)').find('input[type=date]').attr("disabled", true);
                            $(tr).find('td:eq(12)').find('input[type=date]').attr("disabled", true);
                            $(tr).find('td:eq(13)').find('input[type=checkbox]').attr("disabled", true);
                        }
                        else {
                            location.reload();
                            return;
                        }
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
                            CreateTermination(cancellationatdate, cancellationtodate, checkboxes, OppId, contractnumber, contractowner, "account", "Contract", "", "");



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


    //-----------------------------------------------------------------------------------------------------------------------
    //Function To Create Termination process Main Table ( Opportunity )
    function CreateTermination(cancellationatdate, cancellationtodate, checkboxes, OppId, contractnumber, contractowner, entitytype, items, licencefee, ss_productmaincategory) {
        var entity = {};
        entity.ss_cancelledtoedate = new Date(cancellationtodate).toISOString();
        entity.ss_cancelledatedate = new Date(cancellationatdate).toISOString();
        entity.ss_terminationreason = checkboxes;
        entity.ss_contractnumber = contractnumber;
        entity.ss_officialcontractpartner = contractowner;
        entity.ss_accountnavid = parent.Xrm.Page.getAttribute("bbo_navid").getValue();
        entity.ss_equitystoryid = parent.Xrm.Page.getAttribute("bbo_equitystoryid").getValue();
        entity.ss_entitytype = entitytype;
        entity.ss_items = items;
        entity.ss_yearlylicensefee = parseFloat(licencefee);
        entity.ss_productmaincategory = ss_productmaincategory;
        //entity.ss_yearlylicensefee = 
        entity["ss_relatedopportunity@odata.bind"] = '/opportunities(' + OppId + ')';
        entity["ss_opportunityaccount@odata.bind"] = '/accounts(' + parent.Xrm.Page.data.entity.getId().replace("{", "").replace("}", "") + ')';
        entity["ss_transactioncurrencyid@odata.bind"] = '/transactioncurrencies(' + parent.Xrm.Page.getAttribute("transactioncurrencyid").getValue()[0].id.replace("{", "").replace("}", "") + ')';
        entity.ss_name = parent.Xrm.Page.getAttribute("name").getValue() + " - Termination";
        parent.Xrm.WebApi.online.createRecord("ss_approval", entity).then(
            function success(result) {
                var newEntityId = result.id;
                OpenTermination(newEntityId);
            },
            function (error) {
                parent.Xrm.Utility.alertDialog(error.message);
            }
        );
    }

    //----------------------------------------------------------------------------------------------------------------------
    //This Function will Create Termination Process of Opportunity Product Table
    // function CreateTerminationOpportunityProduct(productcancellationatdate, productcancellationtodate, productcancelreason, OppId) {
    //     entity.ss_cancelledtoedate = new Date(cancellationtodate).toISOString();
    //     entity.ss_cancelledatedate = new Date(cancellationatdate).toISOString();
    // }
    // //-----------------------------------------------------------------------------------------------------------------------
    //Function To Open Termination Form
    function OpenTermination(newEntityId) {
        var entityFormOptions = {};
        entityFormOptions["entityName"] = "ss_approval";
        entityFormOptions["entityId"] = newEntityId;
        entityFormOptions["formId"] = "ec9814c0-ac5c-4610-a03c-7c470acbfca4";
        // Open the form.
        parent.Xrm.Navigation.openForm(entityFormOptions).then(
            function (success) {
                console.log(success);
            },
            function (error) {
                console.log(error);
            });
    }

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
                var OppId = $(tr).find('td:eq(0)').text().substring(1);

                var items = $(tr).find('td:eq(1)').text();

                var licencefee = $(tr).find('td:last').text();

                var ss_productmaincategory = $(tr).find('td:eq(14)').text();

                var OppProdId = $(tr).find('td:eq(13)').text();

                var prodStatus = $(tr).find('td:eq(8)').find('div:eq(0)').text();

                var iSprodStatusChanged = $(tr).find('td:eq(9)').find('div:eq(0)').find('input[type=checkbox]').prop('checked');
                var date = $(tr).find('td:eq(7)').find('input[type=date]').val();

                if (date != undefined && date != null && date != "") {
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
                // else if (prodStatus == "Draft") {
                //     entity.ss_productstatus = 2;
                // }
                else if (prodStatus == "Termination Requested") {
                    entity.ss_productstatus = 3;
                    var productcancellationatdate = $(tr).find('td:eq(10)').find('input[type=date]').val();

                    if (productcancellationatdate != undefined && productcancellationatdate != null && productcancellationatdate != "Invalid" && productcancellationatdate != "") {
                        entity.ss_productcancellationatdate = new Date(productcancellationatdate).toISOString();
                    }
                    else {
                        alert("Please Enter Cancellation To Date \n Cancellation At Date \n Select Reason");
                        location.reload();
                        return;
                    }

                    var productcancellationtodate = $(tr).find('td:eq(11)').find('input[type=date]').val();

                    if (productcancellationtodate != undefined && productcancellationtodate != null && productcancellationtodate != "Invalid" && productcancellationtodate != "") {
                        entity.ss_productcancellationtodate = new Date(productcancellationtodate).toISOString();
                    }
                    else {
                        alert("Please Enter Cancellation To Date \n Cancellation At Date \n Select Reason");
                        location.reload();
                        return;
                    }
                    var productcancelreason = $(tr).find('td:eq(12)').find('input[type=checkbox]:checked').map(function () {
                        return this.value;
                    }).get().join(',');
                    if (productcancelreason != null && productcancelreason != undefined && productcancelreason != "") {
                        entity.ss_productcancelreason = productcancelreason;
                    }
                    else {
                        alert("Please Enter Cancellation To Date \n Cancellation At Date \n Select Reason");
                        location.reload();
                        return;
                    }

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
                        CreateTermination(productcancellationatdate, productcancellationtodate, productcancelreason, OppId, "", "", "opportunityproduct", items, licencefee, ss_productmaincategory);


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
            var contract_cancelatdate = $(closestTR).find('td:eq(12)').find('input[type=date]').val();
            var contract_canceltodate = $(closestTR).find('td:eq(13)').find('input[type=date]').val();
            var setColor = "red";
            var textColor = "white";
            if ($(closestTR).find('.expandTbl').prop("checked") == true) {
                var removedTbl = $(closestTR).next();
                if ($(closestTR).find('.expandTbl2').prop("checked") == true) {
                    $(removedTbl).find('.OppProductStatus').text('Termination Requested');
                    $(removedTbl).find('.OppProductStatus').css({ "color": textColor, "background-color": setColor });
                    // $(trclass).next().find('.OppProductCB').prop('checked', true);"style ='pointer-events: none'"
                    $(removedTbl).find('.OppProductCB').prop("checked", "true");
                    $(removedTbl).find('.prod_cancel_at').val(contract_cancelatdate);
                    $(removedTbl).find('.prod_cancel_to').val(contract_canceltodate);
                    $(removedTbl).find('.product_contractcolumn').show();
                    $(removedTbl).find('.OppProductCB').css('pointer-events', 'none');
                    $(removedTbl).find('.product_contractcolumn').css('pointer-events', 'none');
                }

                $(removedTbl).show();
            }
            //nd=======

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

    // $("#contractDetailsTblBody").on("click", ".expandTbl2", function (eventObj) {
    //     var target = eventObj.target;
    //     var nextElement = $(target).next();
    //     $(".dropdown-menu").addClass('d-none');
    //     if (this.name == "contractCbox") {


    //         //var closestDiv = $(target).closest(".dropdown-menu");
    //         if ($(this).prop("checked") == true) {
    //             $(nextElement).removeClass("d-none");
    //             $(nextElement).show();


    //         }
    //         else if ($(this).prop("checked") == false) {
    //             $(nextElement).addClass("d-none");
    //             //$(nextElement).hide();

    //         }
    //     }
    //     //   else
    //     //   {
    //     //     $(".dropdown-menu").hide();
    //     //   }
    // });

    //===================================================nh
    // $(document).on('click','#procancelreason', function(){
    //     alert("called");
    //     var checkList = document.getElementById('list1');
    //     var items = document.getElementById('items');
    //     checkList.getElementsByClassName('anchor')[0].onclick = function (evt) {
    //         if (items.classList.contains('visible')){
    //             items.classList.remove('visible');
    //             items.style.display = "none";
    //         }
    //         else
    //         {
    //             items.classList.add('visible');
    //             items.style.display = "block";
    //         }
    //     }
    //     items.onblur = function(evt) {
    //         items.classList.remove('visible');
    //     }
    // });

    $("#products").on("change", function(){
        selectedproduct = $("#products option:selected").val();
        if(selectedproduct === "1") {
            $("#filtersrow").show();
            $("#filtersrowproduct").hide();
        }
        else if(selectedproduct === "2") {
            $("#filtersrow").hide();
            $("#filtersrowproduct").show();
        }
        else {
            $("#filtersrow").hide();
            $("#filtersrowproduct").hide();
        }
    });
    var selectedsegments = [];
    $("#productsegmentsearch").on("click",  function(){
        $("#productsegmentcheckboxes").find('input[type=checkbox]:checked').each(function(){
            selectedsegments.push(this.value);
        });
        var productsegmentvalues = "";
        if(selectedsegments.length > 0) {
            selectedsegments.forEach(segment => productsegmentvalues += `<value>${segment}</value>`);
        }
        var productsegmentfilter = "";
        if(selectedsegments.length > 0) {
            productsegmentfilter = `<condition attribute="ss_productmaincategory" operator="in">` + productsegmentvalues + `</condition>`;
            RetrieveContractDetailsTblData(productsegmentfilter,"");
        }
        else {
            RetrieveContractDetailsTblData("","");
        }
        
    });
    var selectedproducts = [];

    $(document).on("click", "#productsearch", function(){
        $("#productcheckboxes").find('input[type=checkbox]:checked').each(function(){
            selectedproducts.push(this.value);
        });
        var productsvalues = "";
        if(selectedproducts.length > 0) {
            selectedproducts.forEach(product => productsvalues += '<condition attribute="name" operator="like" value="%'+product+'%" />');
        }
        if(selectedproducts.length > 0) {
            RetrieveContractDetailsTblData("", productsvalues);
        }
        else {
            RetrieveContractDetailsTblData("","");
        }
    });
});

//checkbox multislect
var expanded = false;

function showprodcutsegmentCheckboxes() {
  var checkboxes = document.getElementById("productsegmentcheckboxes");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}

var productexpanded = false;
function showprodcutsCheckboxes() {
    var checkboxes = document.getElementById("productcheckboxes");
    if (!expanded) {
      checkboxes.style.display = "block";
      expanded = true;
    } else {
      checkboxes.style.display = "none";
      expanded = false;
    }
  }

// function to show or hide the Dynamic Reason Field
function dropDown(event) {
    event.target.parentElement.children[1].classList.remove("d-none");
    //document.getElementsByClassName('menu').remove("d-none");
    document.getElementById("overlay").classList.remove("d-none");
}
function hide(event) {
    var items = document.getElementsByClassName('menu');
    for (let i = 0; i < items.length; i++) {
        items[i].classList.add("d-none");
    }
    document.getElementById("overlay").classList.add("d-none");
}
function uploadcontract(current) {
    var id = $(current).closest('tr').attr('id');
    var custom = encodeURIComponent("\"" + id + "\"");
    var url = "/webresources/ss_AnnotationEdit.html?data=" + custom;
    window.open(url, null, "width=970px,height=219px, fullscreen=no, resizable=no,scrollbars=no");
}
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
        var trclass = $(mcsObj).closest('tr');
        $(trclass).find('.statusRadioBtn').prop("checked", false);
        $(trclass).find('.contract_columns').hide();
        var setColor = "green";
        var textColor = "white";
        Pstatus = 1;
        $(trclass).find('.ContractStatus').text('New');
        $(trclass).find('.ContractStatus').css({ "color": textColor, "background-color": setColor });
    }
    UpdateContractStatus(mcsObj, statusVal);
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
        var trclass = $(mpsObj).closest('tr');
        $(trclass).find('.statusRadioBtn').prop("checked", false);
        $(trclass).find('.product_contractcolumn').hide();
        var setColor = "green";
        var textColor = "white";
        Pstatus = 1;
        $(trclass).find('.OppProductStatus').text('New');
        $(trclass).find('.OppProductStatus').css({ "color": textColor, "background-color": setColor });
    }
    UpdateProductStatus(mpsObj, pstatusVal);
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
function UpdateContractStatus(contractID, statusVal) {
    var trid = $(contractID).closest('tr').attr('id');
    var trclass = $(contractID).closest('tr');

    var OppId = contractID.id;
    var contractStatus = 0;
    var setColor;
    var textColor;
    var ContractStatusText = "";
    if (statusVal) {
        setColor = "red";
        textColor = "white";
        contractStatus = 3;
        $("#cancelledatdate").show();
        $("#cancelledtodate").show();
        $("#cancelreason").show();
        $("#upload_termination").show();
        ContractStatusText = "Termination Requested";
        var contract_cancelatdate = $(trclass).find('td:eq(12)').find('input[type=date]').val();
        var contract_canceltodate = $(trclass).find('td:eq(13)').find('input[type=date]').val();
        $(trclass).find('.contract_columns').show();
        $(trclass).next().find('.OppProductStatus').text('Termination Requested');
        $(trclass).next().find('.OppProductStatus').css({ "color": textColor, "background-color": setColor });
        // $(trclass).next().find('.OppProductCB').prop('checked', true);
        $(trclass).next().find('.product_contractcolumn').show();
        $(trclass).next().find('.prod_cancel_at').val(contract_cancelatdate);
        $(trclass).next().find('.prod_cancel_to').val(contract_canceltodate);
        $(trclass).next().find('.OppProductCB').prop("checked", "true");
        $(trclass).next('tr').show();
    }

    else {
        setColor = "green";
        textColor = "white";
        contractStatus = 1;
        ContractStatusText = "Active";
        $(trclass).find('.contract_columns').hide();
        $(trclass).next().find('.OppProductStatus').text('New');
        $(trclass).next().find('.OppProductStatus').css({ "color": textColor, "background-color": setColor });
        $(trclass).next().find('.product_contractcolumn').hide();
        $(trclass).next().find('.OppProductCB').prop("checked", false);
        $(trclass).next('tr').hide();
        //$(trclass).next().find('.product_contractcolumn').hide();
    }
    //nh=======================
    // var entity = {};
    // entity.ss_contractstatus = contractStatus;

    // window.parent.Xrm.WebApi.online.updateRecord("opportunity", OppId, entity).then(
    //     function success(result) {
    //         var updatedEntityId = result.id;

    //     },
    //     function (error) {
    //         window.parent.Xrm.Utility.alertDialog(error.message);
    //     }
    // );
    //========================nh
    $(trclass).find('.ContractStatus').text(ContractStatusText);
    $(trclass).find('.ContractStatus').css({ "color": textColor, "background-color": setColor });

    // var newContractID = contractID.id;
    // //var newContractID = newContractID.substring(0, (newContractID.length - 1)); //making corresponding contract status Id to change its value according to the selected
    // $('#' + newContractID).html("<div style='color:" + textColor + ";background-color:" + setColor + ";margin:1px'>" + ContractStatusText + "</div>");

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
function getTerminationFile(annotationid) {
    window.parent.Xrm.WebApi.online.retrieveRecord("annotation", annotationid).then(
        function success(result) {
            // var annotationid = result["annotationid"];
            var DocumentBody;
            var FileName;
            var mimetype;
            if (result["documentbody"]) {
                DocumentBody = result["documentbody"];
            }
            if (result["filename"]) {
                FileName = result["filename"];
            }
            if (result["mimetype"]) {
                mimetype = result["mimetype"];
            }
            dataURItoBlob(DocumentBody, FileName, mimetype);
        },
        function (error) {
            window.parent.Xrm.Utility.alertDialog(error.message);
        }
    );
}
function getFile(annotationid) {
    window.parent.Xrm.WebApi.online.retrieveRecord("annotation", annotationid).then(
        function success(result) {
            // var annotationid = result["annotationid"];
            var DocumentBody;
            var FileName;
            var mimetype;
            if (result["documentbody"]) {
                DocumentBody = result["documentbody"];
            }
            if (result["filename"]) {
                FileName = result["filename"];
            }
            if (result["mimetype"]) {
                mimetype = result["mimetype"];
            }
            dataURItoBlob(DocumentBody, FileName, mimetype);

            //dataURItoBlob(DocumentBody, FileName);
        },
        function (error) {
            window.parent.Xrm.Utility.alertDialog(error.message);
        }
    );

}
//==============================nH
function dataURItoBlob(dataURI, filename, mimetype) {

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
    //var file = new Blob([ab], {type: 'application/pdf'});
    if (mimetype != null && mimetype != "" && mimetype != undefined) {
        var file = new Blob([ab], { type: mimetype });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
    }
    // var bb = new Blob([ab]);
    // saveFile(bb, filename);

}
// function saveFile(blob, filename) {
//     saveAs(blob, filename);

// }
//==============================
//Func to Update Product Status
function UpdateProductStatus(ProductID, pstatusVal) {
    // var trid = $(ProductID).closest('tr').attr('id');
    var trclass = $(ProductID).closest('tr');
    // var data = trclass.find("td:eq(8)").find("input[type='radio']:checked").val();

    var setColor;
    var Pstatus = 0;
    var textColor;
    var OppIdd = ProductID.name;
    var Product_Contract_Status = "";
    if (pstatusVal) {
        setColor = "red";
        textColor = "white";
        Pstatus = 3;
        $(trclass).find('.product_contractcolumn').show();
        Product_Contract_Status = "Termination Requested";
        //Product_Contract_Status = "Termination Requested";
    }
    // else if (ProductID.value == "Draft") {
    //     setColor = "yellow";
    //     textColor = "black";
    //     Pstatus = 2;
    // }
    else {
        setColor = "green";
        textColor = "white";
        Pstatus = 1;
        $(trclass).find('.product_contractcolumn').hide();
        Product_Contract_Status = "Active";
        //Product_Contract_Status = "New"
    }
    $(trclass).find('.OppProductStatus').text(Product_Contract_Status);
    $(trclass).find('.OppProductStatus').css({ "color": textColor, "background-color": setColor });
    // var newContractID = ProductID.id;
    // newContractID = newContractID.substring(0, (newContractID.length - 1));//making corresponding contract status Id to change its value according to the selected
    // $('#' + newContractID).html("<div style='background-color:" + setColor + "; color:" + textColor + "; margin:1px'>" + Product_Contract_Status + "</div>");
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
//===================================================================nd
// Table to Appear for Specific Opportunity when Specific checkbox in checked 
function getProductTable(opportunityID) {
    var productids = ["620007", "670013", "SP-148", "LP-04", "LP-03", "SP-02", "LP-02", "670020", "LF-148Test", "670023", "670022", "LP-115 S", "SP-01", "SP-115S", "SP-76", "LP-76", "SP-75", "LP-75", "670011", "620000", "670026"];
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
        "    <attribute name='ss_productcancellationatdate' />",
        "    <attribute name='ss_productcancellationtodate' />",
        "    <attribute name='ss_productcancelreason' />",
        "    <filter>",
        "      <condition attribute='opportunityid' operator='eq' value='", fetchData.opportunityid, "'/>",
        "    </filter>",
        "    <link-entity name='product' from='productid' to='productid' alias='oppProduct'>",
        "      <attribute name='productnumber' />",
        "      <attribute name='name' />",
        "      <attribute name='ss_productmaincategory' />",
        "       <filter>",
        "    <condition attribute='producttypecode' operator='eq' value='100000001' />",
        "    </filter>",
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
            if (results.entities.length > 0) {
                for (var i = 0; i < results.entities.length; i++) {
                    isModifiedPStatus = "";
                    var modifyproductstatus = results.entities[i]["ss_modifyproductstatus"];
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
                    var productcancellationatdate = results.entities[i]["ss_productcancellationatdate"];
                    var productcancellationtodate = results.entities[i]["ss_productcancellationtodate"];
                    var productcancellationreason = results.entities[i]["ss_productcancelreason"];
                    var productno = results.entities[i]["oppProduct.productnumber"];
                    var ss_productmaincategory_formatted = results.entities[i]["oppProduct.ss_productmaincategory@OData.Community.Display.V1.FormattedValue"];
                    var date = "";
                    if (ss_productlivedate != null && ss_productlivedate != undefined) {
                        date = new Date(ss_productlivedate).toISOString().substring(0, 10);
                    }
                    else {
                        date = "";
                    }

                    if (productcancellationatdate != null && productcancellationatdate != undefined) {
                        productcancellationatdate = new Date(productcancellationatdate).toISOString().substring(0, 10);
                    }

                    if (productcancellationtodate != null && productcancellationtodate != undefined) {
                        productcancellationtodate = new Date(productcancellationtodate).toISOString().substring(0, 10);
                    }

                    if (ss_startdate != undefined && ss_startdate != null) {
                        ss_startdate = ss_startdate.substring(0, 10);
                    }
                    else {
                        ss_startdate = "";
                    }

                    var ss_termenddate = results.entities[i]["ss_termenddate"];
                    if (ss_termenddate != undefined && ss_termenddate != null) {
                        ss_termenddate = ss_termenddate.substring(0, 10);
                    }
                    else {
                        ss_termenddate = "";
                    }
                    // var ss_productstatus = results.entities[i]["ss_productstatus"];
                    var ss_productstatus_formatted = results.entities[i]["ss_productstatus@OData.Community.Display.V1.FormattedValue"];
                    var productstatus = "";
                    if (modifyproductstatus == true) {
                        isModifiedPStatus = "checked";
                    }

                    if (ss_productstatus_formatted == undefined) {
                        setColor = "green";
                        textColor = "white";
                        ss_productstatus_formatted = "Active";
                    }
                    else if (ss_productstatus_formatted == "New") {
                        setColor = "green";
                        textColor = "white";
                        productstatus = "Active";
                    }

                    else if (ss_productstatus_formatted == "Cancellation") {
                        setColor = "red";
                        textColor = "white";
                        productstatus = "Termination Requested";
                    }
                    // else if (ss_productstatus_formatted == "Draft") {
                    //     setColor = "yellow";
                    //     textColor = "black";
                    // }
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
                    var displaycontractcolumns = "";
                    var displaydatecolumns = "";
                    var readonly_fields = "";
                    var button = "";
                    if (ss_productstatus_formatted !== "Cancellation") {
                        displaydatecolumns = "style='display:none'";
                    }
                    else {
                        $(".product_contractcolumn").show();
                        readonly_fields = "readonly";
                        button = "disabled";
                    }
                    var res = productids.includes(productno);
                    if (!res) {
                        displaycontractcolumns = "style='display:none'";
                    }
                    productTable = productTable + "<tr class='productstr' id='" + opportunityproductid + "_pd' onchange='isProductValChange(this)'><td style='display:none;'>p" + opportunityID + "</td><td class='Prod-and-ContractName'>" + productname + "</td><td style='display:none;'>" + ss_setupfee_formatted + "</td><td>" + ss_monthlylicensefee_formatted + "</td>"
                        + "<td>" + ss_licensefee_formatted + "</td><td style='display:none;'>" + ss_startdate + "</td><td style='display:none;'>" + ss_termenddate + "</td>"
                        + "<td id = 'golivedate' class='product_livedate' ><input type='date' id='golive' value = '" + date + "' " + displaycontractcolumns + "></td>"
                        + "<td id=" + opportunityID + i + "S >"
                        + "<div class='OppProductStatus' style='color:" + textColor + ";background-color:" + setColor + "'>" + productstatus + "</div></td><td><div class='dropdown'>"
                        + "<input type='checkbox' class='expandTbl2 OppProductCB' id='" + opportunityproductid + "' name='contractCbox' " + isModifiedPStatus + " onclick='modifyProductStatusFunc(this)'/>"
                        + "<div class='dropdown-menu dropdownProductsPosition' ><span></span><div class='selectedData'>"
                        // + "<input type='radio' class='statusRadioBtn' value='Draft' id='" + opportunityID + i + "S1' onclick='UpdateProductStatus(this)' name=" + opportunityproductid + "><span class='statusVal'>Draft</span><br>"
                        + "<input type='radio' class='statusRadioBtn' value='Termination'  id='" + opportunityID + i + "S2' onclick='UpdateProductStatus(this)' name=" + opportunityproductid + "><span class='statusVal'>Termination</span><br>"
                        // + "<input type='radio' class='statusRadioBtn' value='New'  id='" + opportunityID + i + "S3' onclick='UpdateProductStatus(this)' name=" + opportunityproductid + "><span class='statusVal'>New</span><br>"
                        + "</div></div></div></td>"

                        + "<td id = 'pcanat' class ='product_contractcolumn' " + displaydatecolumns + "><input type='date' id='patcanceldate'  class ='prod_cancel_at' value = '" + productcancellationatdate + "' " + readonly_fields + "></td>"
                        + "<td id = 'pcandate' class ='product_contractcolumn' " + displaydatecolumns + "><input type='date' id='ptocanceldate' class ='prod_cancel_to' value = '" + productcancellationtodate + "' " + readonly_fields + "></td>"
                        + "<td id = 'procancelreason' class ='product_contractcolumn' " + displaydatecolumns + "><div id = 'productreasoncancel'>"
                        + "<button onclick='dropDown(event)' class='menu-btn' type='button' " + button + ">"
                        + "Reason &#9013;</button>"
                        + "<div class='d-none shadow rounded menu'>"
                        + "<span class='d-block menu-option'><label><input type='checkbox' value= '0'>&nbsp;"
                        + "Price</label></span>"
                        + "<span class='d-block menu-option'><label><input type='checkbox' value= '1'>&nbsp;"
                        + "Product – lack of functionality</label></span>"
                        + "<span class='d-block menu-option'><label><input type='checkbox' value= '2'>&nbsp;"
                        + "Product – unreliable</label></span>"
                        + "<span class='d-block menu-option'><label><input type='checkbox' value= '3'>&nbsp;"
                        + "Product – not using it</label></span>"
                        + "<span class='d-block menu-option'><label><input type='checkbox' value= '4'>&nbsp;"
                        + "Moved to competitor</label></span>"
                        + "<span class='d-block menu-option'><label><input type='checkbox' value= '5'>&nbsp;"
                        + "Taken in-house</label></span>"
                        + "<span class='d-block menu-option'><label><input type='checkbox' value= '6'>&nbsp;"
                        + "Client service issue</label></span>"
                        + "<span class='d-block menu-option'><label><input type='checkbox' value= '7'>&nbsp;"
                        + "Acquisition</label></span>"
                        + "<span class='d-block menu-option'><label><input type='checkbox' value= '8'>&nbsp;"
                        + "Delisting</label></span>"
                        + "</div>"
                        + "</div>"
                        + "<div class='d-none' id='overlay' onclick='hide(event)'></div></td>"
                        + "<td id = 'oppid' style='display:none;'>" + opportunityproductid + "</td>";
                    embedtable(opportunityproductid, productcancellationreason);
                    productTable += "<td style='display:none;'>" + ss_productmaincategory_formatted + "</td><td style='display:none;'>" + ss_licensefee + "</td></tr>";
                    //<a class='fileLink' href=# onclick='getTerminationFile(\"" + TL_annotationid + "\")'>" + TL_filename + "</a>


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
function embedtable(oppProductid, reason) {
    $(function () {
        reason = reason.split(",");
        for (var i = 0; i < reason.length; i++) {
            $("#" + oppProductid + "_pd").find("#productreasoncancel").find('input[type="checkbox"][value = "' + reason[i] + '"]').prop("checked", true);
        }
    });
}

// Getting different fields data from account with link opportunityproduct + annotation
function RetrieveContractDetailsTblData(productsegmentfilter, productsvalues) {
        $("#contractDetailsTblBody > tr ").remove();
    
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
    //distinct="true"
    var fetchXML2 = `<fetch version="1.0" output-format="xml-platform" mapping="logical">
  <entity name="opportunity">
    <attribute name="ss_autorenewalforsubscriptionterm" />
    <attribute name="ss_newterminationperiod" />
    <attribute name="ss_newcontractenddate" />
    <attribute name="ss_contractstatus" />
    <attribute name="ss_modifycontractstatus" />
    <attribute name="opportunityid" />
    <attribute name="ss_priceincreases" />
    <attribute name="ss_cancelledatdate" />
    <attribute name="ss_cancelledtodate" />
    <attribute name="ss_contractcancellationreason" />
    <attribute name="ss_newcontractstartdate" />
    <attribute name="ss_officialcontractpartner" />
    <attribute name="ss_transferedtofinance" />
    <attribute name="ss_contractnumber" />bcendofcontract
    <attribute name="ss_totallicencefee" />
    <attribute name="ss_bcendofcontract" />
    <filter type="and">
      <condition attribute="parentaccountid" operator="eq" value="` + accounId + `" />
    </filter>
    <link-entity name="annotation" from="objectid" to="opportunityid" link-type="inner" alias="ano">
      <attribute name="objectid" />
      <attribute name="annotationid" />
      <attribute name="createdon" />
      <attribute name="filename" />
      <attribute name="notetext" />
      <attribute name="ownerid" />
      <filter type="or">
        <condition attribute="notetext" operator="like" value="%{{Contract--%" />
      </filter>
    </link-entity>
    <link-entity name="ss_salesopportunityproducts" from="ss_opportunity" to="opportunityid" alias="sp_prodcuts">
      <attribute name="ss_productselectorsection" />
    </link-entity>
    <link-entity name="opportunityproduct" from="opportunityid" to="opportunityid">
      <link-entity name="product" from="productid" to="productid" alias="opp_product">
        <attribute name="name" />
        <filter type="and">
          <condition attribute="producttypecode" operator="eq" value="100000001" />
          ` + productsegmentfilter + ` 
          ` + productsvalues + `
        </filter>
      </link-entity>
    </link-entity>
  </entity>
</fetch>`
    //This line is commented because Marian asked to display all the contracts
    //<order attribute="createdon" descending="true"/> 
    //<order attribute="createdon"/>
    fetchXML2 = "?fetchXml=" + encodeURIComponent(fetchXML2);
    window.parent.Xrm.WebApi.online.retrieveMultipleRecords("opportunity", fetchXML2).then(
        function success(results) {
            

            var checkArray = [];// check for repeated contracts

            var myOppertutitiesList = []; // a list of all unique oppertunities and its related fields or data
            var checkOppidArray = []; //check for repeated oppertunities

            // var TL_checkarray = [];
            // var TL_oppid = []; //check for repeated Termination Letter
            // for (j = 0; j < results.entities.length; j++) {
            //     if (results.entities[j]["ano.notetext"] === "{{Letter--" && !TL_oppid.includes(results.entities[j]["opportunityid"])) {
            //         TL_checkarray.push({
            //             opp_id: results.entities[j]["opportunityid"],
            //             annotation_id: results.entities[j]["ano.annotationid"],
            //             ter_filename: results.entities[j]["ano.filename"]
            //         });
            //         TL_oppid.push(results.entities[j]["opportunityid"]);
            //     }

            // }
            for (var i = 0; i < results.entities.length; i++) {


                // if (checkArray.includes(results.entities[i]["opportunityid"])) {

                //     continue;
                // }
                // else {
                if (results.entities[i]["ano.notetext"] !== "{{Letter--") {

                    var myCurrentobj = new myOppertuntyObject();//an object of Oppertunity 

                    var oppID = results.entities[i]["opportunityid"];

                    checkArray.push(oppID);

                    var TL_annotationid = "";
                    var TL_filename = "";
                    //var ter = TL_checkarray.find(x => x.opp_id === oppID);
                    // if (ter != null && ter != undefined && ter != "") {
                    //     TL_annotationid = ter.annotation_id;
                    //     TL_filename = ter.ter_filename;
                    // }
                    var name = results.entities[i]["ano.filename"];
                    var annotationid = results.entities[i]["ano.annotationid"];;
                    var createdOn = results.entities[i]["ss_newcontractstartdate"];
                    var ownerName = results.entities[i]["ano.ownerid@OData.Community.Display.V1.FormattedValue"];
                    var autoRenewal = results.entities[i]["ss_autorenewalforsubscriptionterm"];
                    var ss_terminationperiod = results.entities[i]["ss_newterminationperiod"];
                    var ss_terminationperiod_formatted = results.entities[i]["ss_terminationperiod@OData.Community.Display.V1.FormattedValue"];
                    var ss_contractstatus = results.entities[i]["ss_contractstatus@OData.Community.Display.V1.FormattedValue"];
                    var modifycontractstatus = results.entities[i]["ss_modifycontractstatus"];
                    var contractnumber = results.entities[i]["ss_contractnumber"];
                    var endDate = results.entities[i]["ss_newcontractenddate"];
                    var contractowner = results.entities[i]["ss_officialcontractpartner"];
                    var priceincrease = results.entities[i]["ss_priceincreases"];

                    var cancellationatdate = results.entities[i]["ss_cancelledatdate"];
                    if (cancellationatdate != undefined || cancellationatdate != null) {
                        cancellationatdate = new Date(cancellationatdate).toISOString().substring(0, 10);
                    }
                    var cancellationtodate = results.entities[i]["ss_cancelledtodate"];
                    if (cancellationtodate != undefined || cancellationtodate != null) {
                        cancellationtodate = new Date(cancellationtodate).toISOString().substring(0, 10);
                    }
                    var contractcancelreason = results.entities[i]["ss_contractcancellationreason"];
                    var transfertofinance = results.entities[i]["ss_transferedtofinance"];
                    var ss_totallicencefee = results.entities[i]["ss_totallicencefee"];
                    var productsegment = results.entities[i]["sp_prodcuts.ss_productselectorsection"];
                    var productname = results.entities[i]["opp_product.name"];
                    var ss_bcendofcontract = results.entities[i]["ss_bcendofcontract"];
                    if (ss_bcendofcontract != undefined || ss_bcendofcontract != null ) {
                        ss_bcendofcontract = new Date(ss_bcendofcontract).toISOString().substring(0, 10);
                    }
                    //populate Contract/Anotation object with data
                    var myCurrentContract = new myanotation();
                    myCurrentContract.annotationId = annotationid;
                    myCurrentContract.contractName = name;

                    var mysalesopportunityproducts = new salelsopportunityproducts();
                    mysalesopportunityproducts.productsegment = productsegment;

                    var myproducts = new proudcts();
                    myproducts.nameproducts = productname;

                    //check if oppertunity is not in list then create new oppertunity and its properties add the new oppertunity to list 
                    if (!checkOppidArray.includes(oppID)) {
                        myCurrentobj.contracts.push(myCurrentContract);
                        myCurrentobj.salelsopportunityproductsobj.push(mysalesopportunityproducts);
                        myCurrentobj.prdouctsname.push(myproducts);
                        checkOppidArray.push(oppID);
                        myCurrentobj.oppId = oppID;
                        myCurrentobj.ownerName = ownerName;
                        myCurrentobj.terminationTime = ss_terminationperiod_formatted;
                        myCurrentobj.renewal = autoRenewal;
                        myCurrentobj.contractid = i;
                        myCurrentobj.modifycontractstatus = modifycontractstatus;
                        myCurrentobj.cancellationatdate = cancellationatdate;
                        myCurrentobj.cancellationtodate = cancellationtodate;
                        myCurrentobj.contractcancelreason = contractcancelreason;
                        // myCurrentobj.TL_annotationid = TL_annotationid;
                        // myCurrentobj.TL_filename = TL_filename;
                        myCurrentobj.transfertofinance = transfertofinance;
                        myCurrentobj.ss_totallicencefee = ss_totallicencefee;
                        myCurrentobj.contractnumber = (contractnumber === undefined || contractnumber === null || contractnumber === "") ? "" : contractnumber;
                        myCurrentobj.createdOn = (createdOn != undefined && createdOn != null && createdOn != "") ? createdOn.substring(0, 10) : "";
                        myCurrentobj.contractowner = (contractowner == null || contractowner == undefined || contractowner == "") ? "" : contractowner;
                        myCurrentobj.ss_terminationperiod = (ss_terminationperiod == undefined || ss_terminationperiod == null) ? "" : ss_terminationperiod;
                        myCurrentobj.ss_contractstatus = (ss_contractstatus == undefined || ss_contractstatus == null) ? "New" : ss_contractstatus;
                        myCurrentobj.priceincrease = (priceincrease == undefined || priceincrease == null || priceincrease == "") ? "" : priceincrease + "%";
                        myCurrentobj.EndOfContract = (endDate == undefined || endDate == null) ? "" : endDate.substring(0, 10);
                        // myCurrentobj.productsegment = productsegment;
                        // myCurrentobj.product = productname;
                        myCurrentobj.ss_bcendofcontract = (ss_bcendofcontract != undefined && ss_bcendofcontract != null && ss_bcendofcontract != "") ? ss_bcendofcontract.substring(0, 10) : "";
                        myOppertutitiesList.push(myCurrentobj);

                    } else { //if oppetunity is already in the list then only append new contrcat for that oppertunity 
                        myOppertutitiesList.forEach(element => {
                            if (element.oppId == oppID) {
                                element.contracts.push(myCurrentContract);
                                element.salelsopportunityproductsobj.push(mysalesopportunityproducts);
                                element.prdouctsname.push(myproducts);
                            }
                        });
                    }

                    //createContractDetailsRow(oppID, name, createdOn, ownerName, ss_terminationperiod_formatted, endDate, autoRenewal, i, priceincrease, ss_contractstatus, modifycontractstatus, cancellationatdate, cancellationtodate, contractcancelreason, annotationid, ss_terminationperiod, contractowner, TL_annotationid, TL_filename, transfertofinance, contractnumber);
                    //getTermEndDateValue(oppID, name, createdOn, ownerName, ss_terminationperiod_formatted, autoRenewal, i, ss_contractstatus, modifycontractstatus);
                }
                //}//end of else
            }
            //}//end of for loop

            //create one record for each unique oppertunity 
            myOppertutitiesList.forEach(element => {
                createContractDetailsRow(element.oppId, element.contracts, element.createdOn, element.ownerName, element.terminationTime, element.EndOfContract, element.renewal, element.contractid, element.priceincrease, element.ss_contractstatus, element.modifycontractstatus, element.cancellationatdate, element.cancellationtodate, element.contractcancelreason, element.ss_terminationperiod, element.contractowner, element.TL_annotationid, element.TL_filename, element.transfertofinance, element.contractnumber, element.ss_totallicencefee, element.salelsopportunityproductsobj, element.prdouctsname, element.ss_bcendofcontract);
            });

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


//Oppertunity class with all related properties 
class myOppertuntyObject {
    constructor() {
        this.oppId = null;
        this.contracts = []; //each oppertunity can have more than one contracts/anotations 
        this.salelsopportunityproductsobj = [];
        this.prdouctsname = [];
        this.createdOn = null;
        this.ownerName = null;
        this.terminationTime = null;
        this.EndOfContract = null;
        this.renewal = null;
        this.contractid = null;
        this.priceincrease = null;
        this.ss_contractstatus = null;
        this.modifycontractstatus = null;
        this.cancellationatdate = null;
        this.cancellationtodate = null;
        this.contractcancelreason = null;
        this.ss_terminationperiod = null;
        this.contractowner = null;
        // this.TL_annotationid = null;
        // this.TL_filename = null;
        this.transfertofinance = null;
        this.ss_totallicencefee = null;
        this.contractnumber = null;
        this.productsegment = null;
        this.product = null;
        this.ss_bcendofcontract = null;
    }
}

//Contract or Anotation class 
class myanotation {
    constructor() {
        this.annotationId = null;
        this.contractName = null;
    }
}
class salelsopportunityproducts {
    constructor() {
        this.productsegment = null;
    }
}
class proudcts {
    constructor() {
        this.nameproducts = null;
    }
}



//nh=========================================
//=============================================nh
function createContractDetailsRow(oppid, contracts, createdOn, ownerName, terminationTime, EndOfContract, renewal, contractid, priceincrease, ss_contractstatus, modifycontractstatus, cancellationatdate, cancellationtodate, contractcancelreason, ss_terminationperiod, contractowner, TL_annotationid, TL_filename, transfertofinance, contractnumber,ss_totallicencefee,productsegment,prdouctsname, ss_bcendofcontract) {

    // create list of all anchor tags (contracts links) for single oppertunity and add those to data coulmn 
    allAnchorTags_Contracts = "";
    contracts.forEach(element => {
        anchortag = "<a class='fileLink' href=# onclick='getFile(\"" + element.annotationId + "\")'> " + element.contractName + "</a><br>";
        allAnchorTags_Contracts += anchortag + ",";
    });
    //create product segment list
    finalproductsegment = "";
    productsegment.forEach(element => {
        finalproductsegment += element.productsegment + ","+"<br>";
    });
    //create product names
    finalproducts = "";
    prdouctsname.forEach(element => {
        finalproducts += element.nameproducts +",";
    });
    allAnchorTags_Contracts = allAnchorTags_Contracts.split(',').filter(function (allItems, i, a) {
        return i == a.indexOf(allItems);
    }).join(',');

    finalproductsegment = finalproductsegment.split(',').filter(function (allItems, i, a) {
        return i == a.indexOf(allItems);
    }).join(',');

    finalproducts = finalproducts.split(',').filter(function (allItems, i, a) {
        return i == a.indexOf(allItems);
    }).join(',');
    finalproducts = finalproducts.slice(0,-1);
    var productsnametoappend = finalproducts.split(",");
    var finalappendedproducts = "";
    for(i = 0; i < productsnametoappend.length; i++) {
        finalappendedproducts += "<label><input type='checkbox' value=" +productsnametoappend[i] +" />" + productsnametoappend[i] + "</label>"
    }
    var productsdropdown = "<div class='row' id='filtersrowproduct' style='display: none'>"
    + "<table>"
        + "<tbody>"
          + "<tr>"
                + "<th class='middle'>"
                    + "<div class='container centerclass' id='productsegmentdropdown' >"
                        + "<div class='multiselect'>"
                            + "<div class='selectBox' onclick='showprodcutsCheckboxes()'>"
                                + "<select>"
                                    + "<option>Select an option</option>"
                                + "</select>"
                                + "<div class='overSelect'></div>"
                            + "</div>"
                            + "<div id='productcheckboxes' class='middle'>"
                                + finalappendedproducts +
                            + "</div>"
                        + "</div>"
                        + "<button class='btn btn-primary btn-sm' id='productsearch'>Search</button>"
                    + "</div>"
                + "</th>"
            + "</tr>"
        + "</tbody>"
    + "</table>"
+ "</div>";

 $(productsdropdown).insertAfter("#filtersrow");

    finalproductsegment =  finalproductsegment.replace(/,/g,'<br>');
    finalproducts =  finalproducts.replace(/,/g,'<br>');

    debugger;
    var setColor;
    var textColor;
    var isModified;
    var Contractstatustext = "";
    if (ss_contractstatus === "New" && transfertofinance === false) {
        setColor = "green";
        textColor = "white";
        Contractstatustext = "Active";
    }
    else if (ss_contractstatus === "New" && transfertofinance === true) {
        setColor = "red";
        textColor = "white";
        Contractstatustext = "Termination Completed";
    }
    else if (ss_contractstatus === "Cancellation" && transfertofinance === false) {
        setColor = "red";
        textColor = "white";
        Contractstatustext = "Termination Requested";
    }
    else if (ss_contractstatus === "Cancellation" && transfertofinance === true) {
        setColor = "red";
        textColor = "white";
        Contractstatustext = "Termination Completed";
    }
    // else if (ss_contractstatus == "Draft") {
    //     setColor = "yellow";
    //     textColor = "black";

    // }
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

    var displaycontractcolumns = "";
    var readonly_fields = "";
    var checkbox_fields = "";
    var button = "";
    var checkbox = "";
    if (ss_contractstatus !== "Cancellation") {
        displaycontractcolumns = "style='display:none'";
    }
    else {
        $("#cancelledatdate").show();
        $("#cancelledtodate").show();
        $("#cancelreason").show();
        $("#upload_termination").show();
        readonly_fields = "readonly";
        button = "disabled";
        checkbox = "style ='pointer-events: none'";
    }
    var markup = "<tr class='app' id='" + oppid + "_CR' ><td class='align-middle'><input type='checkbox' class='expandTbl' ><input type='hidden' value=" + oppid + " id='oppidvalue'></td><td class='align-middle'>" + finalproductsegment + "</td><td class='align-middle'>" + finalproducts + "</td><td class='align-middle'>" + ss_totallicencefee + "</td><td style='width:15%;' class='Prod-and-ContractName align-middle'> " + allAnchorTags_Contracts + " </td><td class='align-middle'> " + contractnumber + "</td><td class='align-middle'>" + priceincrease + "</td><td class='align-middle'>" + createdOn + "</td><td class='align-middle'>" + ownerName + "</td><td class='align-middle'>" + contractowner + "</td><td class='align-middle'>" + ss_terminationperiod +
        "</td><td class='align-middle'>"
        + EndOfContract + "</td><<td>" + ss_bcendofcontract + "</td><td class='align-middle'><select class='btn-outline-info'  id='" + oppid + "' onchange='isContractValChange(this)' >"
        + "<option value='Yes' " + selected2 + ">Yes</option><option value='N/A' " + selected3 + ">N/A</option><option value='No'  " + selected + ">No</option></select></td><td class='align-middle' id='" + contractid + "_S'><div class='ContractStatus' style='color:" + textColor + ";background-color:" + setColor + "'>" + Contractstatustext + "</div></td>"
        + "<td class='align-middle' id='cStatus'><div class='dropdown' ><input type='checkbox' class='expandTbl2' id='" + oppid + "' name='contractCbox'  " + isModified + " onchange='isContractValChange(this)' onclick='modifyContractStatusFunc(this)' " + checkbox + ">"
        + "<div class='dropdown-menu dropdownPosition d-none' ><span></span>"
        + "<div class='selectedData' >"
        + "<input type='radio' class='statusRadioBtn' value='Cancellation'  id='" + contractid + "_S2' onclick='UpdateContractStatus(this)' name='" + oppid + "'><span class='statusVal'>Termination</span><br>"
        // + "<input type='radio' class='statusRadioBtn' value='New'  id='" + contractid + "_S3' onclick='UpdateContractStatus(this)' name ='" + oppid + "'><span class='statusVal'>New</span><br></div></div></div></td>"
        + "<td class='contract_cancelatreason contract_columns align-middle' " + displaycontractcolumns + "><input type='date' id='atcanceldate' class ='dynamic_field' value = '" + cancellationatdate + "' " + readonly_fields + "></td>"
        + "<td class='contract_canceltoreason contract_columns align-middle' " + displaycontractcolumns + "><input type='date' id='tocanceldate' class ='dynamic_field' value = '" + cancellationtodate + "' " + readonly_fields + "></td>"
        + "<td class='contract_reasontocancel contract_columns align-middle' " + displaycontractcolumns + "><div id ='reasondiv' class ='dynamic_field'>"
        + "<button onclick='dropDown(event);' class='menu-btn' type='button' " + button + ">"
        + "Reason &#9013;"
        + "</button>"
        + "<div class='d-none shadow rounded menu'>"
        + "<span class='d-block menu-option'><label><input type='checkbox' value ='0' >&nbsp;"
        + "Price</label></span>"
        + "<span class='d-block menu-option'><label><input type='checkbox'  value ='1' >&nbsp;"
        + "Product – lack of functionality</label></span>"
        + "<span class='d-block menu-option'><label><input type='checkbox'  value ='2' >&nbsp;"
        + "Product – unreliable</label></span>"
        + "<span class='d-block menu-option'><label><input type='checkbox'  value ='3' >&nbsp;"
        + "Product – not using it</label></span>"
        + "<span class='d-block menu-option'><label><input type='checkbox'  value ='4' >&nbsp;"
        + "Moved to competitor</label></span>"
        + "<span class='d-block menu-option'><label><input type='checkbox'  value ='5' >&nbsp;"
        + "Taken in-house</label></span>"
        + "<span class='d-block menu-option'><label><input type='checkbox'  value ='6' >&nbsp;"
        + "Client service issue</label></span>"
        + "<span class='d-block menu-option'><label><input type='checkbox'  value ='7' >&nbsp;"
        + "Acquisition</label></span>"
        + "<span class='d-block menu-option'><label><input type='checkbox'  value ='8' >&nbsp;"
        + "Delisting</label></span>"
        + "</div>"
        + "</div>"
        + "<div class='d-none' id='overlay' onclick='hide(event)'></div></td>";

    $(function () {
        contractcancelreason = contractcancelreason.split(",");
        for (var i = 0; i < contractcancelreason.length; i++) {
            $("#" + oppid + "_CR").find("#reasondiv").find('input[type="checkbox"][value = "' + contractcancelreason[i] + '"]').prop("checked", true);
        }
    });
    markup += "</tr>";
    $("#contractDetailsTblBody").append(markup);



    //setTimeout(function () {


    var markup2 = "<tr class='OppProducts' style='display:none;'><td class='class='text-center' colspan='16' >"
        + "<table class='table table-responsive table-sm text-center border-0 removetable ' id='" + oppid + "_pt'  style='margin-left:20px;'>"
        + "<thead class='table-info'><tr> <th class='Prod-and-ContractName'>Product</th><th style='display:none;'>Setup Fee</th><th>Monthly Lisence</th>"
        + "<th>Yearly Lisence</th><th id ='liveproduct'>Go Live Date</th><th>Product Status</th>"
        + "<th>Product Termination</th><th id ='pcancelatdate' >Cancelled at Date</th><th id ='pcanceltodate' >Contract Expiry Date</th><th id ='pcancelreason'>Reason</th><th style='padding:2px;'><button class='btn btn-success btn-sm saveProducts' id='" + oppid + "_b' name='" + oppid + "' style='font-size: 9px;float: left;'>Save "
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
