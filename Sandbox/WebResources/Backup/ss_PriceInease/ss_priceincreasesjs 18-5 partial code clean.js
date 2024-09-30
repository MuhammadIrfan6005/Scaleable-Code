var finalappendedproducts = "";
var finalproducts = [];
var recID = "";
var selltype = "";
var new_processtype = 100000001;
var createapprovalchk = "";
$(document).ready(function () {

    var FormStatus = window.parent.Xrm.Page.ui.getFormType();
    if (FormStatus == 1) {
        $("#mainTblDiv").addClass('d-none');
        $(".createmode").show();
    }
    else {
        $(".createmode").addClass('d-none');

        RetrieveContractDetailsTblData("", "");
    }

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
            var cancellationatdate = "";
            var cancellationtodate = "";
            // irf: make fields global out of for loop to access outside
            var incresetype;
            var incdate;
            var ss_totallicencefee;
            var reason;
            var comment;
            var exceptionalIncreasePercentage;
            var ss_exceptionalincrease;

            if (tblLength > 0) {
                $(".loader").fadeIn();
                // $(".loader").show();
                var entity = {};
                for (var i = 0; i < tblLength; i++) {
                    tr = $('.ss-opportunity')[i];

                    OppId = $(tr).find('td:eq(0)').find('input[type=hidden]').val();

                    autoRenewalVal = $(tr).find('td:eq(19)').find('select').children("option:selected").val();

                    oppStatus = $(tr).find('td:eq(20)').find('div:eq(0)').text();
                    ss_exceptionalincrease = $(tr).find('td:eq(20)').find('input[type=checkbox]').prop('checked')
                    if (ss_exceptionalincrease === undefined) {
                        ss_exceptionalincrease === false;
                    }
                    entity.ss_exceptionalincrease = ss_exceptionalincrease;

                    isOppStsChanged = $(tr).find('td:eq(21)').find('input[type=checkbox]').prop('checked');

                    var contractnumber = $(tr).find('td:eq(7)').text();

                    entity.ss_revisionnumber = $(tr).find('td:eq(8)').text();

                    // irf: get 3 fields from popover against each row
                    reason = Number($(".ss-opportunity:eq(" + i + ")").find(".reason").find(":selected").val());

                    comment = $(".ss-opportunity:eq(" + i + ")").find(".comment").val();
                    exceptionalIncreasePercentage = Number($(".ss-opportunity:eq(" + i + ")").find(".exceptionalIncreasePercentage").val());
                    ss_totallicencefee = Number($(".ss-opportunity:eq(" + i + ")").find(".ss_totallicencefee").text());
                    ss_totallicencefee = parseFloat(parseFloat(ss_totallicencefee).toFixed(2));


                    if (reason !== undefined && comment !== undefined && !isNaN(exceptionalIncreasePercentage)) {
                        entity.ss_reason = reason;
                        entity.ss_comment = comment;
                        entity.ss_exceptionalincreaseinpercentage = exceptionalIncreasePercentage;
                    }

                    var incper = Number($(tr).find('td:eq(10)').find('input[type=number]').val());
                    incdate = $(tr).find('td:eq(11)').find('input[type=date]').val();
                    if (incdate !== null && incdate !== "") {
                        // irf: if next allowed increse date is not today then alert user and stop updating opportunity as well as creating price increase history record
                        const provideddate = new Date(incdate);
                        const todayDate = new Date();

                        if (
                            provideddate.getDate() === todayDate.getDate() &&
                            provideddate.getMonth() === todayDate.getMonth() &&
                            provideddate.getYear() === todayDate.getYear()) {
                            entity.ss_increasedate = incdate;
                        } else {
                            alert("Next allowed increse date should of today");
                            location.reload();
                            //continue;
                            return;
                        }
                    }
                    var currencyid = $(tr).find('td:last').html();
                    var new_actualfee_value = $(tr).find('td:eq(25)').text();
                    createapprovalchk = $(tr).find('td:eq(25)').html();
                    var contractowner = $(tr).find('td:eq(14)').text();
                    entity.ss_createapprovalchecklist = false;
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

                    else if (oppStatus === "Termination Requested") {

                        entity.ss_contractstatus = 3;

                        cancellationatdate = $(tr).find('td:eq(22)').find('input[type=date]').val();
                        if (cancellationatdate != undefined && cancellationatdate != null && cancellationatdate != "Invalid" && cancellationatdate != "") {
                            entity.ss_cancelledatdate = new Date(cancellationatdate).toISOString();
                        }
                        else {
                            alert("Please Enter Cancellation To Date \n Cancellation At Date \n Select Reason");
                            location.reload();
                            return;
                        }

                        cancellationtodate = $(tr).find('td:eq(23)').find('input[type=date]').val();
                        if (cancellationtodate != undefined && cancellationtodate != null && cancellationtodate != "Invalid" && cancellationtodate != "") {
                            entity.ss_cancelledtodate = new Date(cancellationtodate).toISOString();
                        }
                        else {
                            alert("Please Enter Cancellation To Date \n Cancellation At Date \n Select Reason");
                            location.reload();
                            return;
                        }

                        var checkboxes = $(tr).find('td:eq(24)').find('input[type=checkbox]:checked').map(function () {
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
                            $(tr).find('td:eq(10)').find('select').attr("disabled", true);
                            $(tr).find('td:eq(12)').find('input[type=checkbox]').attr("disabled", true);
                            $(tr).find('td:eq(13)').find('input[type=date]').attr("disabled", true);
                            $(tr).find('td:eq(14)').find('input[type=date]').attr("disabled", true);
                            $(tr).find('td:eq(15)').find('input[type=checkbox]').attr("disabled", true);
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
                    data.push('PATCH ' + parent.Xrm.Page.context.getClientUrl() + '/api/data/v9.2/opportunities(' + OppId + ') HTTP/1.1');
                    data.push('Content-Type:application/json;type=entry');
                    data.push('');
                    data.push(JSON.stringify(entity));
                    //JSON.stringify(entity)
                    //========================nd

                }

                //end of changeset
                data.push('--changeset_BBB457--');
                //end of batch
                data.push('--batch_123456--');
                var payload = data.join('\r\n');

                $.ajax(
                    {

                        method: 'POST',
                        url: parent.Xrm.Page.context.getClientUrl() + '/api/data/v9.2/$batch',
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
                            CreatePriceIncrease(OppId, incdate, reason, ss_totallicencefee, exceptionalIncreasePercentage, comment);
                        },
                        error: function (error) {
                            $(".loader").hide();
                            alert(JSON.stringify(error));
                        }
                    });
            }
            else {
                alert("Please Change any record first");
            }
        }
    });

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
            $(".loader").fadeIn();
            var currencyid = "";
            for (var i = 0; i < tblLength; i++) {
                var tr = $('#' + pdTableID + ' > tbody > .' + pdclass)[i];
                var OppId = $(tr).find('td:eq(0)').text().substring(1);

                $(tr).parents().find('#contractDetailsTblBody').find('tr').each(function () {
                    id = $(this).attr('id');
                    if (id !== undefined && id !== null && id.includes(OppId)) {
                        currencyid = $(this).find('td:last').text();
                    }
                });

                var items = $(tr).find('td:eq(1)').text();

                var licencefee = $(tr).find('td:eq(18)').text();
                var new_actualfee_value = $(tr).find('td:eq(19)').text();

                var ss_productmaincategory = $(tr).find('td:eq(17)').text();

                var OppProdId = $(tr).find('td:eq(16)').text();

                var prodStatus = $(tr).find('td:eq(9)').find('div:eq(0)').text();

                var iSprodStatusChanged = $(tr).find('td:eq(12)').find('div:eq(0)').find('input[type=checkbox]').prop('checked');
                var date = $(tr).find('td:eq(5)').find('input[type=date]').val();

                var proudctid = $(tr).find('td:last').text();
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

                else if (prodStatus == "Termination Requested") {
                    entity.ss_productstatus = 3;
                    var productcancellationatdate = $(tr).find('td:eq(13)').find('input[type=date]').val();

                    if (productcancellationatdate != undefined && productcancellationatdate != null && productcancellationatdate != "Invalid" && productcancellationatdate != "") {
                        entity.ss_productcancellationatdate = new Date(productcancellationatdate).toISOString();
                    }
                    else {
                        alert("Please Enter Cancellation To Date \n Cancellation At Date \n Select Reason");
                        location.reload();
                        return;
                    }

                    var productcancellationtodate = $(tr).find('td:eq(14)').find('input[type=date]').val();

                    if (productcancellationtodate != undefined && productcancellationtodate != null && productcancellationtodate != "Invalid" && productcancellationtodate != "") {
                        entity.ss_productcancellationtodate = new Date(productcancellationtodate).toISOString();
                    }
                    else {
                        alert("Please Enter Cancellation To Date \n Cancellation At Date \n Select Reason");
                        location.reload();
                        return;
                    }
                    var productcancelreason = $(tr).find('td:eq(15)').find('input[type=checkbox]:checked').map(function () {
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


    $("#contractDetailsTblBody").on("click", ".expandTbl", function (eventObj) {
        if ($(this).prop("checked") == true) {
            var target = eventObj.target;
            var closestTR = $(target).closest("tr");
            var contract_cancelatdate = $(closestTR).find('td:eq(21)').find('input[type=date]').val();
            var contract_canceltodate = $(closestTR).find('td:eq(22)').find('input[type=date]').val();
            var setColor = "red";
            var textColor = "white";
            if ($(closestTR).find('.expandTbl').prop("checked") == true) {
                var removedTbl = $(closestTR).next();
                if ($(closestTR).find('.expandTbl2').prop("checked") == true) {
                    $(removedTbl).find('.OppProductStatus').text('Termination Requested');
                    $(removedTbl).find('.OppProductStatus').css({ "color": textColor, "background-color": setColor });
                    $(removedTbl).find('.OppProductCB').prop("checked", "true");
                    var val = $(removedTbl).find('.prod_cancel_at');
                    for (l = 0; l < val.length; l++) {
                        var x = $(val[l]);
                        if (!x.val()) {
                            x.val(contract_cancelatdate);
                        }
                    }
                    var dateVal = $(removedTbl).find('.prod_cancel_to');
                    for (j = 0; j < dateVal.length; j++) {
                        var y = $(dateVal[j]);
                        if (!y.val()) {
                            y.val(contract_canceltodate);
                        }
                    }
                    $(removedTbl).find('.product_contractcolumn').show();
                    $(removedTbl).find('.OppProductCB').css('pointer-events', 'none');
                    $(removedTbl).find('.product_contractcolumn').css('pointer-events', 'none');
                }
                $(removedTbl).show();
            }
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

    $("#products").on("change", function () {
        var selectedproduct = $("#products option:selected").val();
        if (selectedproduct === "1") {
            $("#filtersrow").show();
            $("#filtersrowproduct").nextAll().find('input[type=checkbox]').prop("checked", false);
            $("#filtersrowproduct").hide();
            $(".productclass").hide();
        }
        else if (selectedproduct === "2") {
            $("#filtersrow").nextAll().find('input[type=checkbox]').prop("checked", false);
            $("#filtersrow").hide();
            $("#filtersrowproduct").show();
            $(".productclass").show();
        }
        else {
            $("#filtersrowproduct").nextAll().find('input[type=checkbox]').prop("checked", false);
            $("#filtersrow").nextAll().find('input[type=checkbox]').prop("checked", false);
            $("#filtersrow").css("display", "none");
            $("#filtersrowproduct").css("display", "none");
            $("#filtersrow").hide();
            $("#filtersrowproduct").hide();
            $(".productclass").hide();
        }
    });
    var selectedsegments = [];
    $("#productsegmentsearch").on("click", function () {
        $("#productsegmentcheckboxes").find('input[type=checkbox]:checked').each(function () {
            selectedsegments.push(this.value);
        });
        var productsegmentvalues = "";
        if (selectedsegments.length > 0) {
            selectedsegments.forEach(segment => productsegmentvalues += `<value>${segment}</value>`);
        }
        var productsegmentfilter = "";
        if (selectedsegments.length > 0) {
            productsegmentfilter = `<condition attribute="ss_productmaincategory" operator="in">` + productsegmentvalues + `</condition>`;
            RetrieveContractDetailsTblData(productsegmentfilter, "");
        }
        else {
            RetrieveContractDetailsTblData("", "");
        }

    });
    var selectedproducts = [];

    $(document).on("click", "#productsearch", function () {
        $("#productcheckboxes").find('input[type=checkbox]:checked').each(function () {
            selectedproducts.push(this.value);
        });
        var productsvalues = "";
        if (selectedproducts.length > 0) {
            selectedproducts.forEach(product => productsvalues += '<condition attribute="name" operator="like" value="%' + product + '%" />');
        }
        if (selectedproducts.length > 0) {
            RetrieveContractDetailsTblData("", productsvalues);
        }
        else {
            RetrieveContractDetailsTblData("", "");
        }
    });

});
function updateincreasetype(id, incdateIS, selectedIncreseType, ss_totallicencefee, increaseper) {
    var comment = "Standard Price Increase";
    CreatePriceIncrease(id, incdateIS, selectedIncreseType, ss_totallicencefee, increaseper, comment);
    var entity = {};
    entity.ss_incresetype = selectedIncreseType;
    entity.ss_increaseinpercentage = increaseper;
    parent.Xrm.WebApi.online.updateRecord("opportunity", id, entity).then(
        function success(result) {

            var updatedEntityId = result.id;
            $(".loader").fadeOut().delay(2000);
            alert("The record has been updated");
        },
        function (error) {
            parent.Xrm.Utility.alertDialog(error.message);
        }
    );
}

function CreatePriceIncrease(OppId, last_price_increase, Increase_type, contract_start_arr, Increse_in_percen, comment) {
    var entity = {};
    entity["ss_opportunity@odata.bind"] = "/opportunities(" + OppId + ")";
    // irf: adding data into below fields 
    entity.ss_lastpriceincrease = new Date(last_price_increase).toISOString(); // Date Time
    entity.ss_increasetype = Increase_type;
    entity.ss_contractstartarr = contract_start_arr;
    entity.ss_increaseinpercentage = Increse_in_percen;
    entity.ss_comment = comment;

    parent.Xrm.WebApi.online.createRecord("ss_priceincreasehistory", entity).then(
        function success(result) {
            var newEntityId = result.id;
            // irf: to reload document.
            loadData();
        },
        function (error) {
            parent.Xrm.Utility.alertDialog(error.message);
        }
    );
}

var productexpanded = false;
function showprodcutsCheckboxes() {
    var checkboxes = document.getElementById("productcheckboxes");
    if (!productexpanded) {
        checkboxes.style.display = "block";
        productexpanded = true;
    } else {
        checkboxes.style.display = "none";
        productexpanded = false;
    }
}

function hide(event) {
    var items = document.getElementsByClassName('menu');
    for (let i = 0; i < items.length; i++) {
        items[i].classList.add("d-none");
    }
    document.getElementById("overlay").classList.add("d-none");
}

function loadData() {

    $(".loader").fadeIn();
    $("body").css("background-color", "#f5f5f5");
    $("body").css("opacity", .50);
    $("#mainTbl").hide();
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
        //irf:popover show 
        $(mcsObj).closest('tr').addClass("ss-opportunity")
        $(mcsObj).next().show();
    }
    else {
        $(mcsObj).closest('tr').removeClass("ss-opportunity")
        $(mcsObj).next().hide();
    }
}
//===========================================Ashir
function OpenOpportunity(newEntityId) {
    var id = $(newEntityId).closest('tr').attr('id');
    id = id.substring(0, id.length - 3);
    var entityFormOptions = {};
    entityFormOptions["entityName"] = "opportunity";
    entityFormOptions["entityId"] = id;
    // Open the form.
    parent.Xrm.Navigation.openForm(entityFormOptions).then(
        function (success) {
            console.log(success);
        },
        function (error) {
            console.log(error);
        });
}
//===================================nH
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
        },
        function (error) {
            window.parent.Xrm.Utility.alertDialog(error.message);
        }
    );

}
//==============================nH
function dataURItoBlob(dataURI, filename, mimetype) {

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
}
//==============================
//Func to Update Product Status
function UpdateProductStatus(ProductID, pstatusVal) {
    var trclass = $(ProductID).closest('tr');

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
    }

    else {
        setColor = "green";
        textColor = "white";
        Pstatus = 1;
        $(trclass).find('.product_contractcolumn').hide();
        Product_Contract_Status = "Active";
    }
    $(trclass).find('.OppProductStatus').text(Product_Contract_Status);
    $(trclass).find('.OppProductStatus').css({ "color": textColor, "background-color": setColor });
}

// Getting different fields data from account with link opportunityproduct + annotation
function RetrieveContractDetailsTblData(productsegmentfilter, productsvalues) {
    $("#contractDetailsTblBody > tr ").remove();

    var accounId = window.parent.Xrm.Page.data.entity.getId();

    // irf: here in fetch added attribut "incresetype" to fetch
    var fetchXML2 = `<fetch version="1.0" output-format="xml-platform" mapping="logical">
  <entity name="opportunity">
    <attribute name="ss_reason" />
    <attribute name="ss_comment" />
    <attribute name="ss_exceptionalincrease" />
    <attribute name="ss_exceptionalincreaseinpercentage" />
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
    <attribute name="ss_contractnumber" />
    <attribute name="ss_totallicencefee" />
    <attribute name="ss_bcendofcontract" />
    <attribute name="ss_currentyearpriceincrease" />
    <attribute name="ss_increaseinpercentage" />
    <attribute name="ss_increasedate" />
    <attribute name="ss_revisionnumber" />
    <attribute name="ss_incresetype" />
    <attribute name="name" />
    <attribute name="new_actuallicensefee" />
    <attribute name="transactioncurrencyid" />
    <attribute name="ss_createapprovalchecklist" />
    <filter type="and">
      <condition attribute="parentaccountid" operator="eq" value="` + accounId + `" />
      <condition attribute="statecode" operator="eq" value="1" />
      <condition attribute="new_displayoncontractdocuments" operator="eq" value="1" />
    </filter>
    <link-entity name="annotation" from="objectid" to="opportunityid" link-type="outer" alias="ano">
      <attribute name="objectid" />
      <attribute name="annotationid" />
      <attribute name="createdon" />
      <attribute name="filename" />
      <attribute name="notetext" />
      <attribute name="ownerid" />
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
            for (var i = 0; i < results.entities.length; i++) {
                var myCurrentobj = new myOppertuntyObject();//an object of Oppertunity 

                var oppID = results.entities[i]["opportunityid"];

                checkArray.push(oppID);

                var TL_annotationid = "";
                var TL_filename = "";
                var ss_exceptionalincrease = results.entities[i]["ss_exceptionalincrease"]; // Boolean
                var name = results.entities[i]["ano.filename"] !== undefined && results.entities[i]["ano.filename"] !== null ? results.entities[i]["ano.filename"] : "";
                // irf: getting incresetype,reason, comment, exceptionalincrese field
                var ss_reason = results.entities[i]["ss_reason@OData.Community.Display.V1.FormattedValue"]
                var ss_comment = results.entities[i].ss_comment
                var ss_exceptionalincreaseinpercentage = results.entities[i]["ss_exceptionalincreaseinpercentage@OData.Community.Display.V1.FormattedValue"]
                var ss_incresetype = results.entities[i].ss_incresetype;
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
                var contractcancelreasonformatted = results.entities[i]["ss_contractcancellationreason@OData.Community.Display.V1.FormattedValue"];
                var transfertofinance = results.entities[i]["ss_transferedtofinance"];
                var ss_totallicencefee = results.entities[i]["ss_totallicencefee"];
                var productsegment = results.entities[i]["sp_prodcuts.ss_productselectorsection"];
                var productname = results.entities[i]["opp_product.name"];
                var ss_bcendofcontract = results.entities[i]["ss_bcendofcontract"];
                if (ss_bcendofcontract != undefined || ss_bcendofcontract != null) {
                    ss_bcendofcontract = new Date(ss_bcendofcontract).toISOString().substring(0, 10);
                }
                var currentyearpriceincrease = results.entities[i]["ss_currentyearpriceincrease"];
                var changeinpen = results.entities[i]["ss_increaseinpercentage"];
                var increasedate = results.entities[i]["ss_increasedate"];
                var revisionnumber = results.entities[i]["ss_revisionnumber"];
                var opportunityname = results.entities[i]["name"];
                var new_actuallicensefee = results.entities[i]["new_actuallicensefee@OData.Community.Display.V1.FormattedValue"] !== null ? results.entities[i]["new_actuallicensefee@OData.Community.Display.V1.FormattedValue"] : "";
                var new_actualfee_value = results.entities[i]["new_actuallicensefee"] !== null ? results.entities[i]["new_actuallicensefee"] : null;
                var oppcurrencyid = results.entities[i]["_transactioncurrencyid_value"];
                var createterminationprocess = results.entities[i]["ss_createapprovalchecklist"] === null || results.entities[i]["ss_createapprovalchecklist"] === true || results.entities[i]["ss_createapprovalchecklist"] === "" || results.entities[i]["ss_createapprovalchecklist"] === undefined ? true : false;
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
                    // irf: adding reason, comment and exceptionalincrese field into object
                    myCurrentobj.ss_reason = ss_reason;
                    myCurrentobj.ss_exceptionalincrease = ss_exceptionalincrease;
                    //myCurrentobj.ss_comment = ss_comment;
                    myCurrentobj.ss_exceptionalincreaseinpercentage = ss_exceptionalincreaseinpercentage;

                    myCurrentobj.oppId = oppID;
                    myCurrentobj.ownerName = ownerName;
                    myCurrentobj.terminationTime = ss_terminationperiod_formatted;
                    myCurrentobj.renewal = autoRenewal;
                    myCurrentobj.contractid = i;
                    myCurrentobj.modifycontractstatus = modifycontractstatus;

                    myCurrentobj.ss_incresetype = ss_incresetype;

                    myCurrentobj.cancellationatdate = cancellationatdate;
                    myCurrentobj.cancellationtodate = cancellationtodate;
                    myCurrentobj.contractcancelreason = contractcancelreason;
                    myCurrentobj.transfertofinance = transfertofinance;
                    myCurrentobj.ss_totallicencefee = ss_totallicencefee;
                    myCurrentobj.contractnumber = (contractnumber === undefined || contractnumber === null || contractnumber === "") ? "" : contractnumber;
                    myCurrentobj.createdOn = (createdOn != undefined && createdOn != null && createdOn != "") ? moment(createdOn.substring(0, 10)).format("DD-MM-YYYY") : "";
                    myCurrentobj.contractowner = (contractowner == null || contractowner == undefined || contractowner == "") ? "" : contractowner;
                    myCurrentobj.ss_terminationperiod = (ss_terminationperiod == undefined || ss_terminationperiod == null) ? "" : ss_terminationperiod;
                    myCurrentobj.ss_contractstatus = (ss_contractstatus == undefined || ss_contractstatus == null) ? "New" : ss_contractstatus;
                    myCurrentobj.priceincrease = (priceincrease == undefined || priceincrease == null || priceincrease == "") ? "" : priceincrease + "%";
                    myCurrentobj.EndOfContract = (endDate == undefined || endDate == null) ? "" : endDate;
                    myCurrentobj.ss_bcendofcontract = (ss_bcendofcontract != undefined && ss_bcendofcontract != null && ss_bcendofcontract != "") ? moment(ss_bcendofcontract.substring(0, 10)).format('DD-MM-YYYY') : "";
                    myCurrentobj.ss_currentyearpriceincrease = currentyearpriceincrease;
                    myCurrentobj.ss_increaseinpercentage = changeinpen;
                    myCurrentobj.ss_increasedate = increasedate;
                    myCurrentobj.ss_revisionnumber = (revisionnumber !== undefined && revisionnumber !== null) ? revisionnumber : "";
                    myCurrentobj.oppname = opportunityname;
                    myCurrentobj.contractcancelreasonreason = contractcancelreasonformatted !== undefined && contractcancelreasonformatted !== null && contractcancelreasonformatted !== "" ? contractcancelreasonformatted : "";
                    myCurrentobj.new_actuallicensefee = new_actuallicensefee;
                    myCurrentobj.currencyid = oppcurrencyid;
                    myCurrentobj.ss_createapprovalchecklist = createterminationprocess;
                    myCurrentobj.new_actualfee_value = new_actualfee_value;
                    myOppertutitiesList.push(myCurrentobj);

                } else { //if oppetunity is already in the list then only append new contrcat for that oppertunity 
                    myOppertutitiesList.forEach(element => {
                        if (element.oppId === oppID) {
                            element.contracts.push(myCurrentContract);
                            element.salelsopportunityproductsobj.push(mysalesopportunityproducts);
                            element.prdouctsname.push(myproducts);
                        }
                    });
                }
            }
            //create one record for each unique oppertunity 
            //irf: added incresetype into list to traverse
            myOppertutitiesList.forEach(element => {
                createContractDetailsRow(element.ss_reason, element.ss_exceptionalincrease, element.ss_exceptionalincreaseinpercentage, element.oppId, element.contracts, element.createdOn, element.ownerName, element.terminationTime, element.EndOfContract, element.renewal, element.contractid, element.priceincrease, element.ss_contractstatus, element.modifycontractstatus, element.ss_incresetype, element.cancellationatdate, element.cancellationtodate, element.contractcancelreason, element.ss_terminationperiod, element.contractowner, element.TL_annotationid, element.TL_filename, element.transfertofinance, element.contractnumber, element.ss_totallicencefee, element.salelsopportunityproductsobj, element.prdouctsname, element.ss_bcendofcontract, element.ss_currentyearpriceincrease, element.ss_increaseinpercentage, element.ss_increasedate, element.ss_revisionnumber, element.oppname, element.contractcancelreasonreason, element.new_actuallicensefee, element.currencyid, element.ss_createapprovalchecklist, element.new_actualfee_value);
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
    $(".loader").fadeOut().delay(2000);
}

//Oppertunity class with all related properties 
//irf: added incresetype property into class
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
        this.ss_incresetype = null;
        // irf: add new fields in opportunity class
        this.ss_reason = null;
        this.ss_exceptionalincreaseinpercentage = null;
        this.ss_comment = null;
        this.transfertofinance = null;
        this.ss_totallicencefee = null;
        this.contractnumber = null;
        this.productsegment = null;
        this.product = null;
        this.ss_bcendofcontract = null;
        this.ss_currentyearpriceincrease = null;
        this.ss_increaseinpercentage = null;
        this.ss_increasedate = null;
        this.ss_revisionnumber = null;
        this.oppname = null;
        this.contractcancelreasonreason = null;
        this.new_actuallicensefee = null;
        this.currencyid = null;
        this.ss_createapprovalchecklist = null;
        this.new_actualfee_value = null;
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
//=============================================nh
//irf: added incresetype into function parameters
var notearray = [];
function createContractDetailsRow(ss_reason, ss_exceptionalincrease, ss_exceptionalincreaseinpercentage, oppid, contracts, createdOn, ownerName, terminationTime, EndOfContract, renewal, contractid, priceincrease, ss_contractstatus, modifycontractstatus, ss_incresetype, cancellationatdate, cancellationtodate, contractcancelreason, ss_terminationperiod, contractowner, TL_annotationid, TL_filename, transfertofinance, contractnumber, ss_totallicencefee, productsegment, prdouctsname, ss_bcendofcontract, ss_currentyearpriceincrease, ss_increaseinpercentage, ss_increasedate, ss_revisionnumber, oppname, contractcancelreasonformatted, new_actuallicensefee, currencyid, ss_createapprovalchecklist, new_actualfee_value) {

    // create list of all anchor tags (contracts links) for single oppertunity and add those to data coulmn 

    allAnchorTags_Contracts = "";
    const key = 'annotationId';
    notearray = [...new Map(contracts.map(item => [item[key], item])).values()];
    notearray.forEach(element => {
        anchortag = "<a class='fileLink' href=# onclick='getFile(\"" + element.annotationId + "\")'> " + element.contractName + "</a><br>";
        allAnchorTags_Contracts += anchortag;
    })
    //create product segment list
    var finalproductsegment = "";
    productsegment.forEach(element => {
        if (!finalproductsegment.includes(element.productsegment)) {
            finalproductsegment += element.productsegment + "," + "<br>";
        }
    });

    allAnchorTags_Contracts = allAnchorTags_Contracts.split(',').filter(function (allItems, i, a) {
        return i == a.indexOf(allItems);
    }).join(',');



    finalproductsegment = finalproductsegment.split(',').filter(function (allItems, i, a) {
        return i == a.indexOf(allItems);
    }).join(',');
    var finalproductstodisplay = [];
    prdouctsname.forEach(element => {
        if (!finalproducts.includes(element.nameproducts)) {
            finalproducts.push(element.nameproducts);
            finalappendedproducts += "<label><input type='checkbox' value=" + element.nameproducts + ">" + element.nameproducts + "</label><br>";
        }
        if (!finalproductstodisplay.includes(element.nameproducts)) {
            finalproductstodisplay.push(element.nameproducts);
        }
    });

    var productsdropdown = "<div class='row' id='filtersrowproduct' style='display: none'>"
        + "<table>"
        + "<tbody>"
        + "<tr>"
        + "<th>"
        + "<div class='container centerclass productclass' id='productsegmentdropdown' >"
        + "<div class='multiselect'>"
        + "<div class='selectBox' onclick='showprodcutsCheckboxes()'>"
        + "<select>"
        + "<option>Select an option</option>"
        + "</select>"
        + "<div class='overSelect'></div>"
        + "</div>"
        + "<div id='productcheckboxes'>"
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

    finalproductsegment = finalproductsegment.replace(/,/g, '<br>');
    //finalproducts =  finalproducts.replace(/,/g,'<br>');

    var setColor;
    var textColor;
    var isModified;
    var Contractstatustext = "";
    if (ss_contractstatus === "New" && renewal === 0 && (new Date(EndOfContract) < new Date())) {
        setColor = "red";
        textColor = "white";
        Contractstatustext = "Expired";
    }
    else if (ss_contractstatus === "New" && transfertofinance === false) {
        setColor = "green";
        textColor = "white";
        Contractstatustext = "Active";
    }
    else if (ss_contractstatus === "New" && transfertofinance === true) {
        setColor = "green";
        textColor = "white";
        Contractstatustext = "Transferred To Finance";
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
        $("#upload_termination").show();
        readonly_fields = "readonly";
        button = "disabled";
        checkbox = "style ='pointer-events: none'";
    }
    var displayincreasecolumns = "style='display:none'";
    var fields = "";
    if (ss_incresetype !== null && ss_incresetype !== "" && (ss_incresetype !== 5 || ss_incresetype !== "5")) {
        $('.increases').show();
        displayincreasecolumns = "";
        fields = "readonly";
    }
    // irf: show "" if below fields are empty
    if (ss_reason === undefined) {
        ss_reason = "";
    }
    if (ss_exceptionalincreaseinpercentage === undefined) {
        ss_exceptionalincreaseinpercentage = "";
    }
    if (ss_exceptionalincrease === true) {
        ss_exceptionalincrease = "checked";
    }
    else {
        ss_exceptionalincrease = "";
    }

    //irf: here replace toggle button with dropdown, add options and calling function
    var markup = "<tr class='app' id='" + oppid + "_CR' ><td class='align-middle'><input type='checkbox' class='expandTbl' ><input type='hidden' value=" + oppid + " id='oppidvalue'></td><td class='align-middle'><a class='fileLink' href=# onclick='OpenOpportunity(this)'> " + oppname + "</a></td><td class='align-middle maektextleft'>" + finalproductsegment + "</td><td class='align-middle maektextleft'>" + finalproductstodisplay + "</td><td class='align-middle ss_totallicencefee'>" + ss_totallicencefee + "</td><td class='align-middle'>" + new_actuallicensefee + "</td><td style='width:15%;' class='Prod-and-ContractName align-middle'> " + allAnchorTags_Contracts + " </td><td class='align-middle'> " + contractnumber + "</td><td class='align-middle'>" + ss_revisionnumber + "</td><td class='align-middle'><select class='btn-outline-info incresetype' onchange='CurrentYearPI(this)'> <option disabled selected value> - select an option - </option><option value='1' " + (ss_incresetype === 1 ? "selected" : "") + ">Danish Index</option><option value='2'  " + (ss_incresetype === 2 ? "selected" : "") + ">French Index</option><option value='3'  " + (ss_incresetype === 3 ? "selected" : "") + ">German Index</option><option value='4'  " + (ss_incresetype === 4 ? "selected" : "") + ">Italian Index</option><option value='6'  " + (ss_incresetype === 6 ? "selected" : "") + ">Spanish Index</option><option value='7'  " + (ss_incresetype === 7 ? "selected" : "") + ">Swiss Index</option><option value='8'  " + (ss_incresetype === 8 ? "selected" : "") + ">US Index</option><option value='9'  " + (ss_incresetype === 9 ? "selected" : "") + ">UK Index</option><option value='5'  " + (ss_incresetype === 5 ? "selected" : "") + ">Individual Value</option></select></td><td class='align-middle'><input type='number' onchange='CurrentYearPI(this)' class='increasesTD' id='increaseper' name='quantity' min='1' max='5' value ='" + ss_increaseinpercentage + "' " + displayincreasecolumns + " " + fields + " /></td><td class='align-middle' ><input type='date' class='increasesTD' value = '" + ss_increasedate + "' " + displayincreasecolumns + " onchange='isContractValChange(this)'></td><td class='align-middle'>" + createdOn + "</td><td class='align-middle'>" + ownerName + "</td><td class='align-middle'>" + contractowner + "</td><td class='align-middle'>" + ss_terminationperiod +
        "</td><td class='align-middle'>"
        + moment(EndOfContract.substring(0, 10)).format("DD-MM-YYYY") + "</td><td class='align-middle'>" + ss_bcendofcontract + "</td><td class='align-middle'><select class='btn-outline-info'  id='" + oppid + "' onchange='isContractValChange(this)' >"
        + "<option value='Yes' " + selected2 + ">Yes</option><option value='N/A' " + selected3 + ">N/A</option><option value='No'  " + selected + ">No</option></select></td><td class='align-middle' id='" + contractid + "_S'><div class='ContractStatus' style='color:" + textColor + ";background-color:" + setColor + "'>" + Contractstatustext + "</div></td>"
        + "<td class='align-middle' id='cStatus'><div class='dropdown' ><input type='checkbox' data-toggle='popover' title='Popover Header' data-content='Some content inside the popover' class='expandTbl2' id='checkbox' name='contractCbox'  " + isModified + " onclick='modifyContractStatusFunc(this)' " + checkbox + " " + ss_exceptionalincrease + ">"
        + "<div class='popover' style='top: 25px'><div class='popover-content'><label for='reason'>Reason:</label><select class='reason'><option value=''>Select</option><option value='10'>Exceptional Price Increase</option></select><label for='comment'>Comment:</label><input type='text' class='comment' placeholder='Comment'><label for='exceptionalIncreasePercentage'>Exceptional increase in %:</label><input type='number' class='exceptionalIncreasePercentage' onchange='setTwoNumberDecimal(this)' step='0.01' placeholder='Exceptional increase in %'></div></div></td>"
        + "<td>" + ss_reason + "</td><td>" + ss_exceptionalincreaseinpercentage + "</td>"
        + "<td style='display:none;'>" + new_actualfee_value + "</td>"
        + "<td style='display:none;'>" + ss_createapprovalchecklist + "</td>"
        + "<td style='display:none;'>" + currencyid + "</td>";
    markup += "</tr>";
    $("#contractDetailsTblBody").append(markup);
    $(function () {
        contractcancelreason = contractcancelreason.split(",");
        for (var i = 0; i < contractcancelreason.length; i++) {
            $("#" + oppid + "_CR").find("#reasondiv").find('input[type="checkbox"][value = "' + contractcancelreason[i] + '"]').prop("checked", true);
        }
    });

    var markup2 = "<tr class='OppProducts' style='display:none;'><td class='class='text-center' colspan='16' style='background-color:white' >"
        + "<table class='table table-responsive table-sm text-center border-0 removetable ' id='" + oppid + "_pt'  style='margin-left:20px;'>"
        + "<thead class='table-info'><tr> <th id='lastPriceIncrease'>Last Price Increase</th><th id='increaseType'>Increase Type</th><th id='contractStartARR'>Contract Start ARR</th>"
        + "<th>Increase In %</th><th>Latest ARR</th><th>Increase Value</th><th>Comment</th></tr></thead><tbody id='" + oppid + "_p'></tbody>"
        + "</table></td></tr>"

    $(markup2).insertAfter('#' + oppid + '_CR');

    getPriceIncrease(oppid);
}

//Irf:getpriceIncrease for opportunity

function getPriceIncrease(opportunityID) {
    var fetchData = {
        "ss_opportunity": opportunityID
    };
    var fetchXml = [
        "<fetch>",
        "  <entity name='ss_priceincreasehistory'>",
        "    <attribute name='ss_priceincreasehistoryid'/>",
        "    <attribute name='ss_increasetype'/>",
        "    <attribute name='ss_lastpriceincrease'/>",
        "    <attribute name='ss_contractstartarr'/>",
        "    <attribute name='ss_increaseinpercentage'/>",
        "    <attribute name='ss_latestarr'/>",
        "    <attribute name='ss_increasevalue'/>",
        "    <attribute name='ss_comment'/>",
        "    <filter>",
        "      <condition attribute='ss_opportunity' operator='eq' value='", fetchData.ss_opportunity, "'/>",
        "    </filter>",
        "  </entity>",
        "</fetch>"
    ].join("");
    fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);

    window.parent.Xrm.WebApi.retrieveMultipleRecords("ss_priceincreasehistory", fetchXml).then(
        function success(results) {

            var priceIncreaseTable = "";

            if (results.entities.length > 0) {
                for (var i = 0; i < results.entities.length; i++) {
                    var result = results.entities[i];
                    // Columns
                    var ss_priceincreasehistoryid = result["ss_priceincreasehistoryid"];
                    var ss_comment = result["ss_comment"]; 
                    var ss_contractstartarr = result["ss_contractstartarr"]; 
                    var ss_contractstartarr_formatted = result["ss_contractstartarr@OData.Community.Display.V1.FormattedValue"];
                    var ss_increaseinpercentage = result["ss_increaseinpercentage"]; 
                    var ss_increaseinpercentage_formatted = result["ss_increaseinpercentage@OData.Community.Display.V1.FormattedValue"];
                    var ss_increasetype = result["ss_increasetype"]; 
                    var ss_increasetype_formatted = result["ss_increasetype@OData.Community.Display.V1.FormattedValue"];
                    var ss_increasevalue = result["ss_increasevalue"]; 
                    var ss_increasevalue_formatted = result["ss_increasevalue@OData.Community.Display.V1.FormattedValue"];
                    if (ss_increasevalue_formatted === undefined) {
                        ss_increasevalue_formatted = "";
                    }
                    var ss_lastpriceincrease = result["ss_lastpriceincrease"]; 
                    var ss_lastpriceincrease_formatted = result["ss_lastpriceincrease@OData.Community.Display.V1.FormattedValue"];
                    var ss_latestarr_base = result["ss_latestarr_base"]; 
                    if (ss_latestarr_base === undefined) {
                        ss_latestarr_base = "";
                    }
                    priceIncreaseTable = priceIncreaseTable + "<tr class='productstr' id='" + ss_priceincreasehistoryid + "_pd' onchange='isProductValChange(this)'>"
                        + "<td> " + ss_lastpriceincrease_formatted + "   </td>"
                        + "<td> " + ss_increasetype_formatted + "   </td>"
                        + "<td> " + ss_contractstartarr_formatted + "  </td>"
                        + "<td> " + ss_increaseinpercentage_formatted + " </td>"
                        + "<td> " + ss_latestarr_base + " </td>"
                        + "<td> " + ss_increasevalue_formatted + "  </td>"
                        + "<td> " + ss_comment + "  </td>"
                    priceIncreaseTable += "</tr>";
                }
            }
            $("#" + opportunityID + '_p').append(priceIncreaseTable);

        },
        function (error) {
            console.log(error.message);
        }
    );
}

// irf: restrict length of exceptionalIncresePercentage
function setTwoNumberDecimal(event) {
    var exceptionalIncresePercentage = parseFloat(event.value).toFixed(2);
    $(event).val(exceptionalIncresePercentage);
}

function isContractValChange(Contractobj) {

    $(".loader").fadeIn();
    var recordid = $(Contractobj).closest('tr').find('td:eq(0)').find('input[type=hidden]').val();
    var value = $(Contractobj).val();
    var entity = {};
    if (value == "Yes") {
        entity.ss_autorenewalforsubscriptionterm = 1;
    }
    else if (value == "N/A") {
        entity.ss_autorenewalforsubscriptionterm = 2;
    }
    else if (value == "No") {
        entity.ss_autorenewalforsubscriptionterm = 0;
    }
    var incdate = $(Contractobj).closest('tr').find('td:eq(11)').find('input[type=date]').val();
    if (incdate !== null && incdate !== "") {
        entity.ss_increasedate = incdate;
    }
    parent.Xrm.WebApi.online.updateRecord("opportunity", recordid, entity).then(
        function success(result) {
            var updatedEntityId = result.id;
            $(".loader").fadeOut().delay(1000);
        },
        function (error) {
            $(".loader").fadeOut().delay(1000);
            Xrm.Utility.alertDialog(error.message);
        }
    );
}
function CurrentYearPI(mscobj) {
    $(".loader").fadeIn();
    var id = $(mscobj).closest('tr').attr('id');
    id = id.substring(0, id.length - 3);
    //irf: getting value from navision id on "dropdown value change", enabling disabling hiding showing inputs
    var new_danishindex = "";
    var new_frenchindex = "";
    var new_germanindex = "";
    var new_italianindex = "";
    var new_spanishindex = "";

    var selectedIncreseType = $(mscobj).closest('tr').find('td:eq(9)').find('select').children("option:selected").val();

    parent.Xrm.WebApi.online.retrieveMultipleRecords("ss_navisionidmapping", "?$select=new_danishindex,new_frenchindex,new_germanindex,new_italianindex,new_spanishindex,ss_swissindex,ss_usindex,ss_ukindex").then(
        function success(results) {
            for (var i = 0; i < results.entities.length; i++) {
                new_danishindex = results.entities[i]["new_danishindex"];
                new_frenchindex = results.entities[i]["new_frenchindex"];
                new_germanindex = results.entities[i]["new_germanindex"];
                new_italianindex = results.entities[i]["new_italianindex"];
                new_spanishindex = results.entities[i]["new_spanishindex"];
                ss_swissindex = results.entities[i]["ss_swissindex"];
                ss_usindex = results.entities[i]["ss_usindex"];
                ss_ukindex = results.entities[i]["ss_ukindex"];
            }
            if (selectedIncreseType !== "") {
                $(mscobj).closest('tr').find('.increasesTD').show();
                if (selectedIncreseType === 1 || selectedIncreseType === "1") {
                    $(mscobj).closest('tr').find('#increaseper').val(new_danishindex);
                    $(mscobj).closest('tr').find('#increaseper').attr('readonly', 'readonly');
                    $(mscobj).closest('tr').find('#increaseper').css('background-color', '#A9A9A9');
                }
                else if (selectedIncreseType === 2 || selectedIncreseType === "2") {
                    $(mscobj).closest('tr').find('#increaseper').val(new_frenchindex);
                    $(mscobj).closest('tr').find('#increaseper').attr('readonly', 'readonly');
                    $(mscobj).closest('tr').find('#increaseper').css('background-color', '#A9A9A9');
                }
                else if (selectedIncreseType === 3 || selectedIncreseType === "3") {
                    $(mscobj).closest('tr').find('#increaseper').val(new_germanindex);
                    $(mscobj).closest('tr').find('#increaseper').attr('readonly', 'readonly');
                    $(mscobj).closest('tr').find('#increaseper').css('background-color', '#A9A9A9');
                }
                else if (selectedIncreseType === 4 || selectedIncreseType === "4") {
                    $(mscobj).closest('tr').find('#increaseper').val(new_italianindex);
                    $(mscobj).closest('tr').find('#increaseper').attr('readonly', 'readonly');
                    $(mscobj).closest('tr').find('#increaseper').css('background-color', '#A9A9A9');
                }
                else if (selectedIncreseType === 6 || selectedIncreseType === "6") {
                    $(mscobj).closest('tr').find('#increaseper').val(new_spanishindex);
                    $(mscobj).closest('tr').find('#increaseper').attr('readonly', 'readonly');
                    $(mscobj).closest('tr').find('#increaseper').css('background-color', '#A9A9A9');
                }
                else if (selectedIncreseType === 7 || selectedIncreseType === "7") {
                    $(mscobj).closest('tr').find('#increaseper').val(ss_swissindex);
                    $(mscobj).closest('tr').find('#increaseper').attr('readonly', 'readonly');
                    $(mscobj).closest('tr').find('#increaseper').css('background-color', '#A9A9A9');
                }
                else if (selectedIncreseType === 8 || selectedIncreseType === "8") {
                    $(mscobj).closest('tr').find('#increaseper').val(ss_usindex);
                    $(mscobj).closest('tr').find('#increaseper').attr('readonly', 'readonly');
                    $(mscobj).closest('tr').find('#increaseper').css('background-color', '#A9A9A9');
                }
                else if (selectedIncreseType === 9 || selectedIncreseType === "9") {
                    $(mscobj).closest('tr').find('#increaseper').val(ss_ukindex);
                    $(mscobj).closest('tr').find('#increaseper').attr('readonly', 'readonly');
                    $(mscobj).closest('tr').find('#increaseper').css('background-color', '#A9A9A9');
                }
                else if (selectedIncreseType === 5 || selectedIncreseType === "5") {
                    if ($(mscobj).closest('tr').find('#increaseper').val() === null) {
                        $(mscobj).closest('tr').find('#increaseper').val(0);
                    }

                    $(mscobj).closest('tr').find('#increaseper').attr('readonly', false);
                    $(mscobj).closest('tr').find('#increaseper').css('background-color', 'white');
                    $(".loader").fadeOut().delay(1000);
                }
            }
            else {
                $(mscobj).closest('tr').find('.increasesTD').hide();

            }
            var increaseper = Number($(mscobj).closest('tr').find('#increaseper').val());
            var incdateIS = $(mscobj).closest('tr').find('td:eq(11)').find('input[type=date]').val();
            var ss_totallicencefee = $(mscobj).closest('tr').find(".ss_totallicencefee").text();
            ss_totallicencefee = parseFloat(parseFloat(ss_totallicencefee).toFixed(2));

            updateincreasetype(id, incdateIS, selectedIncreseType, ss_totallicencefee, increaseper);
        },
        function (error) {
            Xrm.Utility.alertDialog(error.message);
        }
    );
}

function isProductValChange(Productobj) {
    var oppidTD = $(Productobj).find('td:eq(0)').text();
    $(Productobj).addClass(oppidTD);
}
