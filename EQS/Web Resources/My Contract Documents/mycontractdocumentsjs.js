var globalCountryFilter = "";
var globalDateFilter = "";
var globalAccountTitleFilter = "";
var globalProductsFilter = "";
var globalEmpoyeeFilter = "";
var globalSectorFilter = "";
var productsTblHead = "";
var productsTblBody = "";
var MainRecordsArray = [];
var cPageNumber = 1;
var pPageNumber = 1;
var MyContracts = '<condition attribute="ownerid" operator="eq-userid" />';
var ContactDashboards = "1";
var totacountarray = [];
$(document).ready(function () {

    $(".createmode").addClass('d-none');
    var sortByCreatedOn = '<order attribute="createdon" descending="true" />';
    SumofAllContracts();
    RetrieveContractDetailsTblData(sortByCreatedOn, "", "", "", "", "", true);

    var start = moment().subtract(31, 'days');
    var end = moment();
    $('#daterange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    });

    //nh=============================================================================================================
    $("#ContactDashboards").on('change', function () {
        ContactDashboards = $("#ContactDashboards").val();
        $("#saveProductsBtn").hide();
        $("#saveContractsBtn").show();
        $("#filterby").val(0);
        $("#mainTblDiv").show();
        $("#productname").val('');
        $("#accounttitle").val('');
        $("#country").val('');
        $("#productsTblDiv").hide();
        $("#productsbox").hide();
        $("#titlebox").hide();
        $("#datebox").hide();
        $("#countrybox").hide();
        $("#employeesbox").hide();
        $("#employeefilterby").val(0);

        $(".ContractsFooter").show();
        $(".ProductsFooter").hide();
        if (ContactDashboards === "1" || ContactDashboards === 1) {
            MyContracts = '<condition attribute="ownerid" operator="eq-userid" />';
            $("#saveProductsBtn").hide();

            loadData();
            //RetrieveContractDetailsTblData(sortByCreatedOn, "", "", "", true);
        }
        else if (ContactDashboards === "2" || ContactDashboards === 2) {
            MyContracts = '';
            loadData();
            //RetrieveContractDetailsTblData(sortByCreatedOn, "", "", "", true);
        }
    });
    $("#filterby").on('change', function () {

        var selectedOpt = $("#filterby option:selected").val();
        if (selectedOpt === "0") {
            cPageNumber = 1;
            pPageNumber = 1;
            $("#mainTblDiv").show();
            $("#productsTblDiv").hide();
            $(".ContractsFooter").show();
            $(".ProductsFooter").hide();
            $("#saveContractsBtn").show();
            $("#saveProductsBtn").hide();
            $("#productsbox").val('');
            $("#titlebox").val('');
            $("#datebox").val('');
            $("#countrybox").val('');
            $("#productsbox").css("display", "none");
            $("#titlebox").css("display", "none");
            $("#datebox").css("display", "none");
            $("#countrybox").css("display", "none");
            $("#employeesbox").css("display", "none");
            $("#employeefilterby").val(0);
            $("#sectorbox").css("display", "none");
            $("#sectorfilterby").val(0);
            loadData();

        }
        else if (selectedOpt === "1") {
            $("#saveProductsBtn").hide();
            $("#saveContractsBtn").show();
            $("#productsbox").css("display", "none");
            $("#datebox").css("display", "flex");
            $("#countrybox").css("display", "none");
            $("#titlebox").css("display", "none");
            $("#employeesbox").css("display", "none");
            $("#employeefilterby").val(0);
            $("#sectorbox").css("display", "none");
            $("#sectorfilterby").val(0);
        }
        else if (selectedOpt === "2") {
            $("#saveProductsBtn").hide();
            $("#saveContractsBtn").show();
            $("#countrybox").css("display", "flex");
            $("#datebox").css("display", "none");
            $("#titlebox").css("display", "none");
            $("#productsbox").css("display", "none");
            $("#employeesbox").css("display", "none");
            $("#employeefilterby").val(0);
            $("#sectorbox").css("display", "none");
            $("#sectorfilterby").val(0);
        }
        else if (selectedOpt === "3") {
            $("#saveProductsBtn").hide();
            $("#saveContractsBtn").show();
            $("#titlebox").css("display", "flex");
            $("#datebox").css("display", "none");
            $("#countrybox").css("display", "none");
            $("#productsbox").css("display", "none");
            $("#employeesbox").css("display", "none");
            $("#employeefilterby").val(0);
            $("#sectorbox").css("display", "none");
            $("#sectorfilterby").val(0);
        }
        else if (selectedOpt === "4") {
            $("#saveProductsBtn").show();
            $("#saveContractsBtn").hide();
            $("#productsbox").css("display", "flex");
            $("#titlebox").css("display", "none");
            $("#datebox").css("display", "none");
            $("#countrybox").css("display", "none");
            $("#employeesbox").css("display", "none");
            $("#employeefilterby").val(0);
            $("#sectorbox").css("display", "none");
            $("#sectorfilterby").val(0);

        }
        else if (selectedOpt === "5") {
            $("#saveProductsBtn").hide();
            $("#saveContractsBtn").show();
            $("#employeesbox").show();
            $("#titlebox").css("display", "none");
            $("#datebox").css("display", "none");
            $("#countrybox").css("display", "none");
            $("#productsbox").css("display", "none");
            $("#sectorbox").css("display", "none");
            $("#sectorfilterby").val(0);
        }
        else if (selectedOpt === "6") {
            $("#saveProductsBtn").hide();
            $("#saveContractsBtn").show();
            $("#sectorbox").show();
            $("#employeesbox").css("display", "none");
            $("#employeefilterby").val(0);
            $("#titlebox").css("display", "none");
            $("#datebox").css("display", "none");
            $("#countrybox").css("display", "none");
            $("#productsbox").css("display", "none");
        }
    });
    //Fun to retrieve records by creaton on
    $("#dateSearch").on('click', function () {
        cPageNumber = 1;
        var dateRange = $("#daterange").val().trim();
        if (dateRange === "") {
            alert("Please Enter Date Range first");
        }
        else {
            $("#mainTblDiv").show();
            $("#productsTblDiv").hide();
            $(".ContractsFooter").show();
            $(".ProductsFooter").hide();
            var dateRangeArray = dateRange.split("-");
            var startDate = dateRangeArray[0].trim();
            var endDate = dateRangeArray[1].trim();
            var dateRangeFilter = '<condition attribute="createdon" operator="on-or-after" value="' + startDate + '" />'
            dateRangeFilter += '<condition attribute="createdon" operator="on-or-before" value="' + endDate + '" />'
            var sortByCreatedOn = '<order attribute="createdon" descending="true" />';
            $("#cdon").removeClass("desc");
            $("#cdon").addClass("asc");
            $("#cdon > span").removeClass("glyphicon-arrow-up");
            $("#cdon > span").addClass("glyphicon-arrow-down");
            RetrieveContractDetailsTblData(sortByCreatedOn, dateRangeFilter, "", "", "", "", false);
            globalDateFilter = dateRangeFilter;
        }
    });
    //Fun to retrieve records by country
    $("#countrySearch").on('click', function () {
        cPageNumber = 1;
        var country = $("#country").val().trim();
        if (country === "") {
            alert("Please Enter Counrty Name first");
        }
        else {
            $("#mainTblDiv").show();
            $("#productsTblDiv").hide();
            $(".ContractsFooter").show();
            $(".ProductsFooter").hide();
            var countryFilter = '<condition attribute="ss_countryfullnamename" operator="like" value="%' + country + '%" />'
            var sortByCreatedOn = '<order attribute="createdon" descending="true" />';
            $("#cdon").removeClass("desc");
            $("#cdon").addClass("asc");
            $("#cdon > span").removeClass("glyphicon-arrow-up");
            $("#cdon > span").addClass("glyphicon-arrow-down");
            RetrieveContractDetailsTblData(sortByCreatedOn, "", countryFilter, "", "", "", false);
            globalCountryFilter = countryFilter;
        }
    });
    //=-=-=-=-=
    //Fun to retrieve records by Account title
    $("#titleSearch").on('click', function () {
        cPageNumber = 1;
        var accounttitle = $("#accounttitle").val().trim();
        if (accounttitle === "") {
            alert("Please Enter Account Name first");
        }
        else {
            $("#mainTblDiv").show();
            $("#productsTblDiv").hide();
            $(".ContractsFooter").show();
            $(".ProductsFooter").hide();
            var accountFilter = '<condition attribute="name" operator="like" value="%' + accounttitle + '%" />'
            var sortByCreatedOn = '<order attribute="createdon" descending="true" />';
            $("#cdon").removeClass("desc");
            $("#cdon").addClass("asc");
            $("#cdon > span").removeClass("glyphicon-arrow-up");
            $("#cdon > span").addClass("glyphicon-arrow-down");
            RetrieveContractDetailsTblData(sortByCreatedOn, "", "", accountFilter, "", "", false);
            globalAccountTitleFilter = accountFilter;
        }
    });
    //Fun to retrieve records by Product name
    $("#productsSearch").on('click', function () {
        pPageNumber = 1;
        var productname = $("#productname").val().trim();
        if (productname === "") {
            alert("Please Enter Product Name first");
        }
        else {
            $("#mainTblDiv").hide();
            $("#productsTblDiv").show();
            $(".ContractsFooter").hide();
            $(".ProductsFooter").show();
            var productFilter = '<condition attribute="opportunityproductname" operator="like" value="%' + productname + '%" />';
            globalProductsFilter = productFilter;
            getSearchedProductTable(productFilter);
        }
    });
    $("#employeeSearch").on('click', function () {
        cPageNumber = 1;
        var noofemployees = $("#employeefilterby option:selected").val();
        var startrange = "";
        var endrange = "";
        if (noofemployees === "0") {
            alert("Please Select Option First");
        }
        else {
            if (noofemployees === "1") {
                startrange = 1;
                endrange = 10;
            }
            else if (noofemployees === "2") {
                startrange = 11;
                endrange = 50;
            }
            else if (noofemployees === "3") {
                startrange = 51;
                endrange = 200;
            }
            else if (noofemployees === "4") {
                startrange = 201;
                endrange = 500;
            }
            else if (noofemployees === "5") {
                startrange = 501;
                endrange = 1000;
            }
            else if (noofemployees === "6") {
                startrange = 1001;
                endrange = 5000;
            }
            else if (noofemployees === "7") {
                startrange = 5001;
                endrange = 10000;
            }
            else if (noofemployees === "8") {
                startrange = 10000;
                endrange = 50000;
            }
            $("#mainTblDiv").show();
            $("#productsTblDiv").hide();
            $(".ContractsFooter").show();
            $(".ProductsFooter").hide();
            var employeefilter = `<condition attribute="numberofemployees" operator="in" >
            <value>${startrange}</value>
            <value>${endrange}</value>
            </condition>`;
            var sortByCreatedOn = '<order attribute="createdon" descending="true" />';
            $("#cdon").removeClass("desc");
            $("#cdon").addClass("asc");
            $("#cdon > span").removeClass("glyphicon-arrow-up");
            $("#cdon > span").addClass("glyphicon-arrow-down");
            RetrieveContractDetailsTblData(sortByCreatedOn, "", "", "", employeefilter, "", false);
            globalEmpoyeeFilter = employeefilter;
        }
    });
    $("#sectorSearch").on('click', function () {
        var sectoroptions = [];
        var sectorfilter = "";
        $('#sectorfilterby option').each(function () {
            sectoroptions.push($(this).val());
        });
        var sectorselectedvalue = $("#sectorfilterby option:selected").val().trim();
        if (sectoroptions.includes(sectorselectedvalue)) {
            if (sectorselectedvalue !== "0") {
                $("#cdon").removeClass("desc");
                $("#cdon").addClass("asc");
                $("#cdon > span").removeClass("glyphicon-arrow-up");
                $("#cdon > span").addClass("glyphicon-arrow-down");
                sectorfilter = '<condition attribute="bbo_sector" operator="eq" value="' + sectorselectedvalue + '"/>';
                var sortByCreatedOn = '<order attribute="createdon" descending="true" />';
                RetrieveContractDetailsTblData(sortByCreatedOn, "", "", "", "", sectorfilter, false);
                globalSectorFilter = sectorfilter;
            }
        }
    });
    $("#backToHome").on('click', function () {
        cPageNumber = 1;
        pPageNumber = 1;
        $("#saveProductsBtn").hide();
        $("#saveContractsBtn").show();
        $("#filterby").val(0);
        $("#mainTblDiv").show();
        $("#productsTblDiv").hide();
        $("#productsbox").hide();
        $("#titlebox").hide();
        $("#datebox").hide();
        $("#countrybox").hide();
        $(".ContractsFooter").show();
        $(".ProductsFooter").hide();
        $("#employeesbox").css("display", "none");
        loadData();
    });
    //=-=-=-=-=
    //Function to Sort by Created on Contracts (Outer Table data)
    $("#cdon").click(function () {

        var elmClass = $("#cdon").attr("class");
        var sortByCreatedOn = "";
        var otherCountryFilters = "";
        var otherDateFilters = "";
        var otherAccountTitleFilters = "";
        var otherEmployeeFilter = "";
        var otherSectorFilter = "";
        var selectedOpt = $("#filterby option:selected").val();

        if (selectedOpt === "1") {
            otherDateFilters = globalDateFilter;
        }
        else if (selectedOpt === "2") {
            otherCountryFilters = globalCountryFilter;
        }
        else if (selectedOpt === "3") {
            otherAccountTitleFilters = globalAccountTitleFilter;
        }
        else if (selectedOpt === "5") {
            otherEmployeeFilter = globalEmpoyeeFilter;
        }
        else if (selectedOpt === "6") {
            otherSectorFilter = globalSectorFilter;
        }

        if (elmClass === "asc") {
            sortByCreatedOn = '<order attribute="createdon" descending="false" />';
            $("#cdon").removeClass("asc");
            $("#cdon").addClass("desc");
            $("#cdon > span").removeClass("glyphicon-arrow-down");
            $("#cdon > span").addClass("glyphicon-arrow-up");

        }
        else if (elmClass === "desc") {
            sortByCreatedOn = '<order attribute="createdon" descending="true" />';
            $("#cdon").removeClass("desc");
            $("#cdon").addClass("asc");
            $("#cdon > span").removeClass("glyphicon-arrow-up");
            $("#cdon > span").addClass("glyphicon-arrow-down");

        }
        RetrieveContractDetailsTblData(sortByCreatedOn, otherDateFilters, otherCountryFilters, otherAccountTitleFilters, otherEmployeeFilter, otherSectorFilter, false)

    });

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

                var entity = {};
                for (var i = 0; i < tblLength; i++) {
                    tr = $('.ss-opportunity')[i];
                    OppId = $(tr).find('td:eq(0)').find('input[type=hidden]').val();


                    autoRenewalVal = $(tr).find('td:eq(11)').find('select').children("option:selected").val();

                    oppStatus = $(tr).find('td:eq(9)').find('div:eq(0)').text();

                    isOppStsChanged = $(tr).find('td:eq(12)').find('input[type=checkbox]').prop('checked');

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
                    if (oppStatus === "New") {
                        entity.ss_contractstatus = 1;
                    }
                    //    else if (oppStatus === "Draft") {
                    //        entity.ss_contractstatus = 2;
                    //    }
                    else if (oppStatus === "Cancellation") {
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

                            $(".loader").fadeOut().delay(1000);
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
    // function to save searched products
    $("#saveSearchedProducts").on({
        click: function () {

            var data = [];
            data.push('--batch_123456');
            data.push('Content-Type: multipart/mixed;boundary=changeset_BBB457');
            data.push('');

            var tblLength = $('.changedProduct').length;

            var tr = "";
            if (tblLength > 0) {
                $(".loader").show();

                var entity = {};
                for (var i = 0; i < tblLength; i++) {
                    var tr = $('.changedProduct')[i];
                    var OppProdId = $(tr).attr("id");
                    OppProdId = OppProdId.substring(0, (OppProdId.length - 3));
                    var prodStatus = $(tr).find('td:eq(8)').find('div:eq(0)').text();

                    var iSprodStatusChanged = $(tr).find('td:eq(9)').find('div:eq(0)').find('input[type=checkbox]').prop('checked');

                    //nh=================================
                    if (iSprodStatusChanged == true) {
                        entity.ss_modifyproductstatus = true;
                    }
                    else if (iSprodStatusChanged == false) {
                        entity.ss_modifyproductstatus = false;
                    }

                    if (prodStatus == "New") {
                        entity.ss_productstatus = 1;
                    }
                    // else if (prodStatus == "Draft") {
                    //     entity.ss_productstatus = 2;
                    // }
                    else if (prodStatus == "Cancellation") {
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

                            $(".loader").hide();
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
            $(".loader").fadeIn();
            for (var i = 0; i < tblLength; i++) {
                var tr = $('#' + pdTableID + ' > tbody > .' + pdclass)[i];
                var OppProdId = $(tr).find('td:eq(9)').text();

                var prodStatus = $(tr).find('td:eq(7)').find('div:eq(0)').text();

                var iSprodStatusChanged = $(tr).find('td:eq(8)').find('div:eq(0)').find('input[type=checkbox]').prop('checked');

                //nh=================================
                if (iSprodStatusChanged == true) {
                    entity.ss_modifyproductstatus = true;
                }
                else if (iSprodStatusChanged == false) {
                    entity.ss_modifyproductstatus = false;
                }

                if (prodStatus == "New") {
                    entity.ss_productstatus = 1;
                }
                //    else if (prodStatus == "Draft") {
                //        entity.ss_productstatus = 2;
                //    }
                else if (prodStatus == "Cancellation") {
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
                        $(".loader").fadeOut().delay(1000);
                        alert("The record has been updated");


                    },
                    error: function (error) {
                        // console.error("data is =>"+data);
                        $(".loader").fadeOut().delay(1000);
                        alert(JSON.stringify(error));
                    }
                });
        }
        else {
            alert("Please Change any record first");
        }
        //=======================================nh


    });
    //==========================================nh    


    $("#contractDetailsTblBody").on("click", ".expandTbl", function (eventObj) {
        if ($(this).prop("checked") == true) {
            var target = eventObj.target;
            var closestTR = $(target).closest("tr");
            if ($(closestTR).attr('class') === "app") {
                $(closestTR).removeClass("app");
                //$(closestTR).addClass("appended");
                var OppID = $(closestTR).attr('id');
                OppID = OppID.substring(0, (OppID.length - 3));
                getProductTable(OppID, "", closestTR);
            }
            //nd=======
            var removedTbl = $(closestTR).next();
            // var removedTbl2 = $(closestTR).next().next();
            $(removedTbl).show();
            // $(removedTbl2).show();
            //=======nd

        }
        else if ($(this).prop("checked") == false) {
            var target = eventObj.target;
            var closestTR = $(target).closest("tr");
            var removeTbl = $(closestTR).next();
            // var removeTbl2 = $(closestTR).next().next();
            // $(removeTbl2).hide();
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

    $(document).on("click", ".expandTbl2", function (eventObj) {
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
//-------------------------------------------------------------------------------------
function SumofAllContracts() {
    var fetch = '<fetch>' +
        '<entity name="opportunity">' +
        '<attribute name="ss_autorenewalforsubscriptionterm" />' +
        '<attribute name="ss_terminationperiod" />' +
        '<attribute name="ss_contractenddate" />' +
        '<attribute name="ss_contractstatus" />' +
        '<attribute name="ss_modifycontractstatus" />' +
        '<attribute name="parentaccountid" />' +
        '<attribute name="opportunityid" />' +
        '<attribute name="ownerid" />' +
        '<filter type="and">' +
        '<condition attribute="statecode" operator="eq" value="1" />' +
        '"' + MyContracts + '"' +
        '</filter>' +
        '<link-entity name="annotation" from="objectid" to="opportunityid" alias="ano">' +
        '<attribute name="objectid" />' +
        '<attribute name="annotationid" />' +
        '<attribute name="createdon" />' +
        '<attribute name="filename" />' +
        '<attribute name="ownerid" />' +
        '</link-entity>' +
        '<link-entity name="account" from="accountid" to="parentaccountid" link-type="inner" alias="ac">' +
        '<attribute name="name" />' +
        '<attribute name="bbo_navid" />' +
        '<attribute name="accountid" />' +
        '<attribute name="ss_countryfullname" />' +
        '</link-entity>' +
        '</entity>' +
        '</fetch>';

    var req = new XMLHttpRequest();
    req.open("GET", parent.Xrm.Page.context.getClientUrl() + "/api/data/v9.1/opportunities?fetchXml=" + encodeURI(fetch), true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var results = JSON.parse(this.response);
                // for(var i = 0; i <= results.value.length; i ++) {
                //     totacountarray.push(results.value[i])
                // }
                $("#trecordsText").text("Total no of Contracts : " + results.value.length);
            }
               else {
                    parent.Xrm.Utility.alertDialog(this.statusText);
                }
            }
    };
    req.send();
}
function loadData() {
    globalCountryFilter = "";
    globalDateFilter = "";
    globalAccountTitleFilter = "";

    $("#cdon > span").removeClass("glyphicon-arrow-up");
    $("#cdon > span").addClass("glyphicon-arrow-down");
    $("#cdon").removeClass("desc");
    $("#cdon").addClass("asc");
    var sortByCreatedOn = '<order attribute="createdon" descending="true" />';
    SumofAllContracts();
    RetrieveContractDetailsTblData(sortByCreatedOn, "", "", "", "", "", true);



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


}
//=============================================nh
// Func to Update Opp Contract Status
function UpdateContractStatus(contractID) {


    var OppId = contractID.name;
    var contractStatus = 0;
    var setColor;
    var textColor;
    if (contractID.value == "Cancellation") {
        setColor = "red";
        textColor = "white";
        contractStatus = 3;
    }
    // else if (contractID.value == "Draft") {
    //    setColor = "yellow";
    //    textColor = "black";
    //    contractStatus = 2;
    // }
    else {
        setColor = "green";
        textColor = "white";
        contractStatus = 1;
    }


    var newContractID = contractID.id;
    var newContractID = newContractID.substring(0, (newContractID.length - 1)); //making corresponding contract status Id to change its value according to the selected
    $('#' + newContractID).html("<div style='color:" + textColor + ";background-color:" + setColor + ";margin:1px'>" + contractID.value + "</div>");



}
//===================================nH
//Func to get file
function getFile(annotationid) {
    window.parent.Xrm.WebApi.online.retrieveRecord("annotation", annotationid).then(
        function success(result) {
            // var annotationid = result["annotationid"];
            var DocumentBody;
            var FileName;
            if (result["documentbody"]) {
                DocumentBody = result["documentbody"];
            }
            if (result["filename"]) {
                FileName = result["filename"];
            }

            dataURItoBlob(DocumentBody, FileName);
        },
        function (error) {
            window.parent.Xrm.Utility.alertDialog(error.message);
        }
    );

}
//Func to open Account record 
function openAccountForm(accountid) {
    var windowOptions = {
        openInNewWindow: true,
        entityName: "account",
        entityId: accountid
    };
    window.parent.Xrm.Navigation.openForm(windowOptions);

}
//Func to open Opportunity Record
function openOpportunityForm(oppid) {
    var windowOptions = {
        openInNewWindow: true,
        entityName: "opportunity",
        entityId: oppid
    };
    window.parent.Xrm.Navigation.openForm(windowOptions);

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
    $(ProductID).closest("tr").addClass("changedProduct");
    var setColor;
    var Pstatus = 0;
    var textColor;
    var OppIdd = ProductID.name;

    if (ProductID.value == "Cancellation") {
        setColor = "red";
        textColor = "white";
        Pstatus = 3;
    }
    // else if (ProductID.value == "Draft") {
    //    setColor = "yellow";
    //    textColor = "black";
    //    Pstatus = 2;
    // }
    else {
        setColor = "green";
        textColor = "white";
        Pstatus = 1;
    }
    var newProductID = ProductID.id;
    newProductID = newProductID.substring(0, (newProductID.length - 1));//making corresponding product status Id to change its value according to the selected
    $('#' + newProductID).html("<div style='background-color:" + setColor + "; color:" + textColor + "; margin:1px'>" + ProductID.value + "</div>");
}
// Getting different fields data from account with link opportunityproduct + annotation
function RetrieveContractDetailsTblData(sortByCreatedOn, dateRangeFilter, countryFilter, accounttitleFilter, employeefilter, sectorfilter, isFirstcall) {

    var linkType = "outer";
    $(".loader").show();
    $("#contractDetailsTblBody").css("background-color", "#f5f5f5");
    $("#contractDetailsTblBody").css("opacity", .50);
    $("#contractDetailsTblBody > tr ").remove();
    if (sortByCreatedOn.includes("false")) {
        SortByDescContractDetailsTblData(MainRecordsArray, sortByCreatedOn);
        return;
    }
    if (dateRangeFilter !== "") {
        linkType = "inner";
    }
    var fetchXML2 = `<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="true" count="500" page="` + cPageNumber + `">
                  <entity name="opportunity">
                       <attribute name="ss_autorenewalforsubscriptionterm" />
                       <attribute name="ss_terminationperiod" />
                       <attribute name="ss_contractenddate" />
                       <attribute name="ss_contractstatus" />
                       <attribute name="ss_modifycontractstatus" />
                       <attribute name="parentaccountid" /> 
                       <attribute name="opportunityid" /> 
                       <attribute name="ownerid" />   
                       <attribute name="name" />
                       <attribute name="ss_contractnumber" />       
                       <filter type="and">                         
                       <condition attribute="statecode" operator="eq" value="1" />
                       `+ MyContracts + `
                       </filter>
                       <link-entity name="annotation" from="objectid" to="opportunityid" link-type="`+ linkType + `" alias="ano" >
                               <attribute name="objectid" />
                               <attribute name="annotationid" />
                               <attribute name="createdon" />
                               <attribute name="filename" />
                               <attribute name="ownerid" />   
                               `+ sortByCreatedOn + `  
                               <filter type="and">
                               ` + dateRangeFilter + `
                              </filter> 
                       </link-entity>
                       <link-entity name="account" from="accountid" to="parentaccountid" link-type="inner" alias="ac">
                       <attribute name="name" /> 
                       <attribute name="bbo_navid" />
                       <attribute name="accountid" />
                       <attribute name="ss_countryfullname" />
                       <filter type="and">
                           ` + countryFilter + `
                           ` + accounttitleFilter + `
                           `+ employeefilter + `
                           ` + sectorfilter + `
                       </filter>
                     </link-entity>                 
               </entity>
           </fetch>`;
    // <filter type="and">
    // ` + dateRangeFilter + `
    // </filter>
    fetchXML2 = "?fetchXml=" + encodeURIComponent(fetchXML2);
    window.parent.Xrm.WebApi.online.retrieveMultipleRecords("opportunity", fetchXML2).then(
        function success(results) {
            $("#cPage").text("Page " + cPageNumber);
            if (results.entities.length < 500 && cPageNumber === 1) {
                $("#cHomePage").hide();
                $("#nextContactsPage").hide();
                $("#preContactsPage").hide();

            }
            else if (results.entities.length < 500 && cPageNumber !== 1) {

                $("#nextContactsPage").hide();
                $("#preContactsPage").show();
                $("#cHomePage").show();
            }
            else if (results.entities.length === 500 && cPageNumber !== 1) {
                $("#nextContactsPage").show();
                $("#preContactsPage").show();
                $("#cHomePage").show();
            }
            else if (results.entities.length === 500 && cPageNumber === 1) {
                $("#nextContactsPage").show();
                $("#preContactsPage").hide();
                $("#cHomePage").hide();
            }
            var checkArray = [];// check for repeated contracts         
            MainRecordsArray = [];
            for (var i = 0; i < results.entities.length; i++) {

                // if (checkArray.includes(results.entities[i]["opportunityid"])) {
                //     continue;
                // }
                // else {

                // var oppID = results.entities[i]["opportunityid"];
                // checkArray.push(oppID);
                //}//end of else

                MainRecordsArray.push(results.entities[i]);

            }//end of for loop



            $("#backToHome").hide();
            $("#trecordsText").empty();
            //$("#trecordsText").text("Total no of Contracts : " + MainRecordsArray.length);
            SortByDescContractDetailsTblData(MainRecordsArray, sortByCreatedOn);

        },
        function (error) {
            var errorOptions = { message: error.message, details: "Inner exception details" };
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


}

//nh=========================================
//=============================================nh
function createContractDetailsRow(accountid, bbo_navid, _parentaccount, oppid, contractName, createdOn, ownerName, country, EndOfContract, renewal, contractid, ss_contractstatus, modifycontractstatus, annotationid, opportunityname , ss_contractnumber) {
    //nh===============

    var setColor;
    var textColor;
    var isModified;
    var noteFun = "getFile(\"" + annotationid + "\")";
    if (contractName === "No") {
        noteFun = "";
    }

    if (ss_contractstatus === "New") {
        setColor = "green";
        textColor = "white";
    }
    else if (ss_contractstatus === "Cancellation") {
        setColor = "red";
        textColor = "white";
    }
    // else if (ss_contractstatus == "Draft") {
    //    setColor = "yellow";
    //    textColor = "black";
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


    var markup = "<tr class='app' id='" + oppid + "_CR' ><td><input type='checkbox' class='expandTbl' ><input type='hidden' value=" + oppid + " id='oppidvalue'></td><td style='width:10%;' class='Account-Name'><a href=# onclick='openAccountForm(\"" + accountid + "\")'>" + _parentaccount + "</a></td><td style='width:5%;' class='bbo_navid'>" + bbo_navid + "</td><td style='width:10%;' class='Account-Name'><a href=# onclick='openOpportunityForm(\"" + oppid + "\")'>" + opportunityname + "</a></td><td style='width:15%;' class='Prod-and-ContractName'><a class='fileLink' href=# onclick='" + noteFun + "'>" + contractName + "</a></td><td style='width:5%;' class='bbo_navid'>" + ss_contractnumber + "</td><td colspan='2'>"
        + createdOn + "</td><td>" + EndOfContract + "</td><td>" + country + "</td><td id='" + contractid + "_S'> <div style='color:" + textColor + ";background-color:" + setColor + "'>" + ss_contractstatus + "</div></td><td>"
        + ownerName + "</td><td><select class='btn-outline-info'  id='" + oppid + "' onchange='isContractValChange(this)'>"
        + "<option value='Yes' " + selected2 + ">Yes</option><option value='N/A' " + selected3 + ">N/A</option><option value='No'  " + selected + ">No</option></select></td>"
        + "<td colspan='2' id='cStatus'><div class='dropdown'><input type='checkbox' class='expandTbl2' id='" + oppid + "' name='contractCbox' " + isModified + " onchange='isContractValChange(this)' onclick='modifyContractStatusFunc(this)'>"
        + "<div class='dropdown-menu dropdownPosition d-none' ><span class='statusoptionsText'>Please select</span>"
        + "<div class='selectedData' >"
        + "<input type='radio' class='statusRadioBtn' value='Cancellation'  id='" + contractid + "_S2' onclick='UpdateContractStatus(this)' name='" + oppid + "'><span class='statusVal'>Cancellation</span><br>"
        + "<input type='radio' class='statusRadioBtn' value='New'  id='" + contractid + "_S3' onclick='UpdateContractStatus(this)' name ='" + oppid + "'><span class='statusVal'>New</span><br></div></div></div></td></tr>";
    $("#contractDetailsTblBody").append(markup);


    var markup2 = "<tr class='OppProducts' style='display:none;'><td class='text-center' colspan='13' >"
        + "<table class='table table-responsive table-sm text-center border-0 removetable ' id='" + oppid + "_pt'  style='margin-left:90px;'>"
        + "<thead class='table-info'><tr> <th class='Prod-and-ContractName'>Product</th><th>Setup Fee</th><th>Monthly Lisence</th>"
        + "<th>Yearly Lisence</th><th>Term Start Date</th><th>Term End Date</th> <th>Product Status</th>"
        + "<th>Modify Product Status</th><th style='padding:2px;'><button class='btn btn-success btn-sm saveProducts' id='" + oppid + "_b' name='" + oppid + "' style='font-size: 9px;float: left;'>Save "
        + "<i class='fa fa-envelope-square fa-lg' style='float: left;padding: 2px 7px 0px 0px;'></i></button></th>"
        + "<th id='" + oppid + "_rp' class='refreshProducts'><a href='#'>"
        + "<span class='glyphicon glyphicon-repeat' style='padding: 0px 5px 0px 5px;'></span></a></th>"
        + "</tr></thead>"
        + "<tbody id='" + oppid + "_p'></tbody>"
        + "</table></td></tr>";

    //+ "<caption style='caption-side:top'><div class='captionDiv'><input type='text' class='form-control' name='productsSearch' placeholder='Enter Product Name'/>"
    //  + "<button class='btn btn-primary btn-sm productsSearch' id='" + oppid + "_tb'>Search</button></div></caption>"

    $(markup2).insertAfter('#' + oppid + '_CR');
    // getProductTable(result, oppid);

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

}

function getProductTable(oppid, productFilter, closestTR) {
    $(".loader").show();
    var OppProductsFetchxml = `<fetch>
           <entity name="opportunityproduct" >
           <attribute name="ss_modifyproductstatus" />
           <attribute name="opportunityproductid" />
           <attribute name="productname" />
           <attribute name="ss_licensefee" />
           <attribute name="ss_setupfee" />
           <attribute name="ss_startdate" />
           <attribute name="ss_termenddate" />
           <attribute name="ss_productstatus" />
           <attribute name="ss_monthlylicensefee" />
           <attribute name="opportunityproductname" />
           <filter type="and" >
               <condition attribute="opportunityid" operator="eq" value="` + oppid + `" />
           </filter>
           <link-entity name="product" from="productid" to="productid" link-type="inner" alias="pr">
               <attribute name="name" />
               <filter type="and" >
              ` + productFilter + `
               </filter>
           </link-entity>
           </entity>
       </fetch>`;
    OppProductsFetchxml = "?fetchXml=" + encodeURIComponent(OppProductsFetchxml);
    window.parent.Xrm.WebApi.online.retrieveMultipleRecords("opportunityproduct", OppProductsFetchxml).then(
        function success(results) {
            var setColor;
            var textColor;
            var isModifiedPStatus;
            var productTable = "";
            for (var i = 0; i < results.entities.length; i++) {
                isModifiedPStatus = "";
                var modifyproductstatus = results.entities[i]["ss_modifyproductstatus"];
                var opportunityproductid = results.entities[i]["opportunityproductid"];
                var productname = results.entities[i]["pr.name"];
                var ss_licensefee = results.entities[i]["ss_licensefee"];
                var ss_licensefee_formatted = results.entities[i]["ss_licensefee@OData.Community.Display.V1.FormattedValue"];
                var ss_monthlylicensefee = results.entities[i]["ss_monthlylicensefee"];
                var ss_monthlylicensefee_formatted = results.entities[i]["ss_monthlylicensefee@OData.Community.Display.V1.FormattedValue"];
                var ss_setupfee = results.entities[i]["ss_setupfee"];
                var ss_setupfee_formatted = results.entities[i]["ss_setupfee@OData.Community.Display.V1.FormattedValue"];
                var ss_startdate = results.entities[i]["ss_startdate"];
                if (ss_startdate != undefined && ss_startdate != null) {
                    ss_startdate = ss_startdate.substring(0, 10);
                }
                else {
                    ss_startdate = "";
                }

                if (ss_monthlylicensefee_formatted === undefined || ss_monthlylicensefee_formatted === null || ss_monthlylicensefee_formatted === "undefined") {
                    ss_monthlylicensefee_formatted = "";
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

                if (modifyproductstatus == true) {
                    isModifiedPStatus = "checked";
                }

                if (ss_productstatus_formatted == undefined) {
                    setColor = "green";
                    textColor = "white";
                    ss_productstatus_formatted = "New";
                }
                else if (ss_productstatus_formatted == "New") {
                    setColor = "green";
                    textColor = "white";
                }
                else if (ss_productstatus_formatted == "Cancellation") {
                    setColor = "red";
                    textColor = "white";
                }
                //    else if (ss_productstatus_formatted == "Draft") {
                //        setColor = "yellow";
                //        textColor = "black";
                //    }
                else {
                    setColor = "white";
                    textColor = "white";
                }

                //nh=================================================
                productTable = productTable + "<tr class='productstr' id='" + opportunityproductid + "_pd' onchange='isProductValChange(this)'><td style='display:none;'>p" + oppid + "</td><td class='Prod-and-ContractName'>" + productname + "</td><td>" + ss_setupfee_formatted + "</td><td>" + ss_monthlylicensefee_formatted + "</td>"
                    + "<td>" + ss_licensefee_formatted + "</td><td>" + ss_startdate + "</td><td>" + ss_termenddate + "</td><td id=" + oppid + i + "S >"
                    + "<div style='color:" + textColor + ";background-color:" + setColor + "'>" + ss_productstatus_formatted + "</div></td><td><div class='dropdown'>"
                    + "<input type='checkbox' class='expandTbl2' id='" + opportunityproductid + "' name='contractCbox' " + isModifiedPStatus + " onclick='modifyProductStatusFunc(this)'/>"
                    + "<div class='dropdown-menu dropdownPosition' ><span class='statusoptionsText'>Please select</span><div class='selectedData'>"
                    + "<input type='radio' class='statusRadioBtn' value='Cancellation'  id='" + oppid + i + "S2' onclick='UpdateProductStatus(this)' name=" + opportunityproductid + "><span class='statusVal'>Cancellation</span><br>"
                    + "<input type='radio' class='statusRadioBtn' value='New'  id='" + oppid + i + "S3' onclick='UpdateProductStatus(this)' name=" + opportunityproductid + "><span class='statusVal'>New</span><br>"
                    + "</div></div></div></td><td style='display:none;'>" + opportunityproductid + "</td></tr>";

                //====================================================nh
            }
            $(".loader").hide();
            if (closestTR !== "") {
                $(closestTR).addClass("appended");
            }
            //productsTblBody += productTable;
            $("#" + oppid + '_p').append(productTable);

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

$(document).on("click", ".refreshProducts", function () {

    var opportunityId = $(this).attr('id');
    opportunityId = opportunityId.substring(0, (opportunityId.length - 3));
    var prodTblBody = $(this).closest("table").children('tbody');
    $(prodTblBody).empty();
    getProductTable(opportunityId, "", "");

});
//Products table related to search
function getSearchedProductTable(productFilter) {

    $(".loader").show();
    var OppProductsFetchxml = `<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="true" count="200" page="` + pPageNumber + `">
           <entity name="opportunityproduct" >
           <attribute name="ss_modifyproductstatus" />
           <attribute name="opportunityproductid" />
           <attribute name="productname" />
           <attribute name="ss_licensefee" />
           <attribute name="ss_setupfee" />
           <attribute name="ss_startdate" />
           <attribute name="ss_termenddate" />
           <attribute name="ss_productstatus" />
           <attribute name="ss_monthlylicensefee" />
           <attribute name="opportunityproductname" />
           <attribute name="opportunityid" />
           <filter type="and" >
               ` + productFilter + `
           </filter>
           <link-entity name="opportunity" from="opportunityid" to="opportunityid" alias="opp" >
           <attribute name="name" />
           <attribute name="accountid" />
           <attribute name="opportunityid" />
           <filter type="and" >
           <condition attribute="statecode" operator="eq" value="1" />
           `+ MyContracts + `
           </filter>
           <link-entity name="annotation" from="objectid" to="opportunityid" alias="ano" >
             <attribute name="filename" />
             <attribute name="createdon" />
             <attribute name="annotationid" />             
             <order attribute="createdon" descending="true" />
           </link-entity>
           <link-entity name="account" from="accountid" to="parentaccountid" alias="acc" >
             <attribute name="name" />
             <attribute name="accountid" />
           </link-entity>
         </link-entity>    
           </entity>
       </fetch>`;
    OppProductsFetchxml = "?fetchXml=" + encodeURIComponent(OppProductsFetchxml);
    window.parent.Xrm.WebApi.online.retrieveMultipleRecords("opportunityproduct", OppProductsFetchxml).then(
        function success(results) {
            $("#pPage").text("Page " + pPageNumber);
            if (results.entities.length < 200 && pPageNumber === 1) {
                $("#nextProductsPage").hide();
                $("#preProductsPage").hide();
                $("#pHomePage").hide();

            }
            else if (results.entities.length < 200 && pPageNumber !== 1) {

                $("#nextProductsPage").hide();
                $("#preProductsPage").show();
                $("#pHomePage").show();
            }
            else if (results.entities.length === 200 && pPageNumber !== 1) {
                $("#nextProductsPage").show();
                $("#preProductsPage").show();
                $("#pHomePage").show();
            }
            else if (results.entities.length === 200 && pPageNumber === 1) {
                $("#nextProductsPage").show();
                $("#preProductsPage").hide();
                $("#pHomePage").hide();
            }

            var setColor;
            var textColor;
            var isModifiedPStatus;
            var productTable = "";
            var oppProductsIdsArray = [];
            for (var i = 0; i < results.entities.length; i++) {
                isModifiedPStatus = "";
                var modifyproductstatus = results.entities[i]["ss_modifyproductstatus"];
                var opportunityproductid = results.entities[i]["opportunityproductid"];
                if (oppProductsIdsArray.includes(opportunityproductid)) {
                    continue;
                }
                oppProductsIdsArray.push(opportunityproductid);
                var productname = results.entities[i]["opportunityproductname"];
                var ss_licensefee = results.entities[i]["ss_licensefee"];
                var opportunityid_name = results.entities[i]["_opportunityid_value@OData.Community.Display.V1.FormattedValue"];
                var ss_licensefee_formatted = results.entities[i]["ss_licensefee@OData.Community.Display.V1.FormattedValue"];
                var ss_monthlylicensefee = results.entities[i]["ss_monthlylicensefee"];
                var ss_monthlylicensefee_formatted = results.entities[i]["ss_monthlylicensefee@OData.Community.Display.V1.FormattedValue"];
                var ss_setupfee = results.entities[i]["ss_setupfee"];
                var ss_setupfee_formatted = results.entities[i]["ss_setupfee@OData.Community.Display.V1.FormattedValue"];
                var ss_startdate = results.entities[i]["ss_startdate"];
                //Annotation fields
                var annotationid = results.entities[i]["ano.annotationid"];
                var contractName = results.entities[i]["ano.filename"];
                if (contractName === "undefined" || contractName === undefined || contractName === null) {
                    contractName = "No";
                }
                //Account fields
                var AccountName = results.entities[i]["acc.name"];
                var accountid = results.entities[i]["acc.accountid"];
                if (ss_startdate != undefined && ss_startdate != null) {
                    ss_startdate = ss_startdate.substring(0, 10);
                }
                else {
                    ss_startdate = "";
                }

                if (ss_monthlylicensefee_formatted === undefined || ss_monthlylicensefee_formatted === null || ss_monthlylicensefee_formatted === "undefined") {
                    ss_monthlylicensefee_formatted = "";
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

                if (modifyproductstatus == true) {
                    isModifiedPStatus = "checked";
                }

                if (ss_productstatus_formatted == undefined) {
                    setColor = "green";
                    textColor = "white";
                    ss_productstatus_formatted = "New";
                }
                else if (ss_productstatus_formatted == "New") {
                    setColor = "green";
                    textColor = "white";
                }
                else if (ss_productstatus_formatted == "Cancellation") {
                    setColor = "red";
                    textColor = "white";
                }
                //    else if (ss_productstatus_formatted == "Draft") {
                //        setColor = "yellow";
                //        textColor = "black";
                //    }
                else {
                    setColor = "white";
                    textColor = "white";
                }
                var noteFun = "getFile(\"" + annotationid + "\")";
                if (contractName === "No") {
                    noteFun = "";
                }
                //nh=================================================
                productTable = productTable + "<tr class='productstr' id='" + opportunityproductid + "_pd' ><td><a href='#' onclick='openAccountForm(\"" + accountid + "\")'>" + AccountName + "</a></td><td><a class='fileLink' href='#' onclick='" + noteFun + "'>" + contractName + "</a></td><td class='Prod-and-ContractName'>" + productname + "</td><td>" + ss_setupfee_formatted + "</td><td>" + ss_monthlylicensefee_formatted + "</td>"
                    + "<td>" + ss_licensefee_formatted + "</td><td>" + ss_startdate + "</td><td>" + ss_termenddate + "</td><td id=" + opportunityproductid + i + "S >"
                    + "<div style='color:" + textColor + ";background-color:" + setColor + "'>" + ss_productstatus_formatted + "</div></td><td><div class='dropdown'>"
                    + "<input type='checkbox' class='expandTbl2' id='" + opportunityproductid + "' name='contractCbox' " + isModifiedPStatus + " onclick='modifyProductStatusFunc(this)'/>"
                    + "<div class='dropdown-menu dropdownPosition' ><span class='statusoptionsText'>Please select</span><div class='selectedData'>"
                    + "<input type='radio' class='statusRadioBtn' value='Cancellation'  id='" + opportunityproductid + i + "S2' onclick='UpdateProductStatus(this)' name=" + opportunityproductid + "><span class='statusVal'>Cancellation</span><br>"
                    + "<input type='radio' class='statusRadioBtn' value='New'  id='" + opportunityproductid + i + "S3' onclick='UpdateProductStatus(this)' name=" + opportunityproductid + "><span class='statusVal'>New</span><br>"
                    + "</div></div></div></td><td style='display:none;'>" + opportunityproductid + "</td></tr>";

                //====================================================nh
            }
            $(".loader").hide();
            $("#backToHome").show();
            $("#trecordsText").empty();
            $("#trecordsText").html("Total no of Products : " + oppProductsIdsArray.length);
            $("#productsDetailsTblBody").empty();
            $("#productsDetailsTblBody").append(productTable);

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
//=-=-==-=-=-=-=-=-=-=-=-=-=-=
function SortByDescContractDetailsTblData(MainRecordsArray, sortByCreatedOn) {

    if (sortByCreatedOn.includes("false")) {

        MainRecordsArray.sort(function (a, b) { return new Date(a["ano.createdon"]) - new Date(b["ano.createdon"]) });
    }

    for (var i = 0; i < MainRecordsArray.length; i++) {

        var oppID = MainRecordsArray[i]["opportunityid"];
        var name = MainRecordsArray[i]["ano.filename"];
        var annotationid = MainRecordsArray[i]["ano.annotationid"];

        var createdOn = MainRecordsArray[i]["ano.createdon"];
        if (createdOn === "undefined" || createdOn === undefined || createdOn === null) {
            createdOn = "";
        }
        else {
            createdOn = createdOn.substring(0, 10);
        }


        var ownerName = MainRecordsArray[i]["_ownerid_value@OData.Community.Display.V1.FormattedValue"];
        var _parentaccount = MainRecordsArray[i]["_parentaccountid_value@OData.Community.Display.V1.FormattedValue"];

        var autoRenewal = MainRecordsArray[i]["ss_autorenewalforsubscriptionterm"];
        var bbo_navid = MainRecordsArray[i]["ac.bbo_navid"];
        var accountid = MainRecordsArray[i]["ac.accountid"];


        var country = MainRecordsArray[i]["ac.ss_countryfullname@OData.Community.Display.V1.FormattedValue"];

        var ss_contractstatus = MainRecordsArray[i]["ss_contractstatus@OData.Community.Display.V1.FormattedValue"];
        var modifycontractstatus = MainRecordsArray[i]["ss_modifycontractstatus"];
        var endDate = MainRecordsArray[i]["ss_contractenddate@OData.Community.Display.V1.FormattedValue"];
        var opportunityname = MainRecordsArray[i]["name"];
        var ss_contractnumber = MainRecordsArray[i]["ss_contractnumber"];
        if (ownerName === "undefined" || ownerName === undefined || ownerName === null) {
            ownerName = "";
        }
        if (bbo_navid === "undefined" || bbo_navid === undefined || bbo_navid === null) {
            bbo_navid = "";
        }
        if (name === "undefined" || name === undefined || name === null) {
            name = "No";
        }
        if (country === "undefined" || country === undefined || country === null) {
            country = "";
        }
        if (endDate == undefined) {
            endDate = "";
        }
        if (ss_contractstatus == undefined) {
            ss_contractstatus = "New";
        }
        if(ss_contractnumber === undefined) {
            ss_contractnumber = "";
        }

        createContractDetailsRow(accountid, bbo_navid, _parentaccount, oppID, name, createdOn, ownerName, country, endDate, autoRenewal, i, ss_contractstatus, modifycontractstatus, annotationid, opportunityname , ss_contractnumber);


    }//end of for loop
    $(".loader").fadeOut().delay(500);
    $("#contractDetailsTblBody").css({ 'background-color': '', 'opacity': '' });

}
//=-=-=-=-=-=-=-=-=-=-=-=-=-=
function nextContactsPage() {
    var otherCountryFilters = "";
    var otherDateFilters = "";
    var otherAccountTitleFilters = "";
    var otherEmployeeFilter = "";
    var otherSectorFilter = "";
    var selectedOpt = $("#filterby option:selected").val();

    if (selectedOpt === "1") {
        otherDateFilters = globalDateFilter;
    }
    else if (selectedOpt === "2") {
        otherCountryFilters = globalCountryFilter;
    }
    else if (selectedOpt === "3") {
        otherAccountTitleFilters = globalAccountTitleFilter;
    }
    else if (selectedOpt === "5") {
        otherEmployeeFilter = globalEmpoyeeFilter;
    }
    else if (selectedOpt === "6") {
        otherSectorFilter = globalSectorFilter;
    }
    cPageNumber++
    var sortByCreatedOn = '<order attribute="createdon" descending="true" />';
    RetrieveContractDetailsTblData(sortByCreatedOn, otherDateFilters, otherCountryFilters, otherAccountTitleFilters, otherEmployeeFilter, otherSectorFilter, false);
}
//=-=-=-=-=-=-=-=-=-=-=-=-=-=
function preContactsPage() {
    var otherCountryFilters = "";
    var otherDateFilters = "";
    var otherAccountTitleFilters = "";
    var otherEmployeeFilter = "";
    var otherSectorFilter = "";
    var selectedOpt = $("#filterby option:selected").val();

    if (selectedOpt === "1") {
        otherDateFilters = globalDateFilter;
    }
    else if (selectedOpt === "2") {
        otherCountryFilters = globalCountryFilter;
    }
    else if (selectedOpt === "3") {
        otherAccountTitleFilters = globalAccountTitleFilter;
    }
    else if (selectedOpt === "5") {
        otherEmployeeFilter = globalEmpoyeeFilter;
    }
    else if (selectedOpt === "6") {
        otherSectorFilter = globalSectorFilter;
    }
    var sortByCreatedOn = '<order attribute="createdon" descending="true" />';
    if (cPageNumber == 2) {
        cPageNumber--
        RetrieveContractDetailsTblData(sortByCreatedOn, otherDateFilters, otherCountryFilters, otherAccountTitleFilters, otherEmployeeFilter, otherSectorFilter, false);
        $("#preContactsPage").hide();
        $("#cHomePage").hide();
    }
    else if (cPageNumber > 2) {
        cPageNumber--
        RetrieveContractDetailsTblData(sortByCreatedOn, otherDateFilters, otherCountryFilters, otherAccountTitleFilters, otherEmployeeFilter, otherSectorFilter, false);
    }


}
//=-=-=-=-=-=-=-=-=-=-=-
function cHomePage() {
    var otherCountryFilters = "";
    var otherDateFilters = "";
    var otherAccountTitleFilters = "";
    var otherEmployeeFilter = "";
    var otherSectorFilter = "";
    var selectedOpt = $("#filterby option:selected").val();

    if (selectedOpt === "1") {
        otherDateFilters = globalDateFilter;
    }
    else if (selectedOpt === "2") {
        otherCountryFilters = globalCountryFilter;
    }
    else if (selectedOpt === "3") {
        otherAccountTitleFilters = globalAccountTitleFilter;
    }
    else if (selectedOpt === "5") {
        otherEmployeeFilter = globalEmpoyeeFilter;
    }
    else if (selectedOpt === "6") {
        otherSectorFilter = globalSectorFilter;
    }
    cPageNumber = 1;
    var sortByCreatedOn = '<order attribute="createdon" descending="true" />';
    RetrieveContractDetailsTblData(sortByCreatedOn, otherDateFilters, otherCountryFilters, otherAccountTitleFilters, globalEmpoyeeFilter, otherSectorFilter, false);

}
//End of Contacts pagging
//=-=-=-=-=-=-=-=-=-=-=-=-=-=
function nextProductsPage() {

    pPageNumber++
    getSearchedProductTable(globalProductsFilter);
}
//=-=-=-=-=-=-=-=-=-=-=-=-=-=
function preProductsPage() {
    if (pPageNumber == 2) {
        pPageNumber--
        $("#preProductsPage").hide();
        $("#pHomePage").hide();
        getSearchedProductTable(globalProductsFilter);
    }
    else if (pPageNumber > 2) {
        pPageNumber--
        getSearchedProductTable(globalProductsFilter);
    }


}
//=-=-=-=-=-=-=-=-=-=-=-
function pHomePage() {
    pPageNumber = 1;
    getSearchedProductTable(globalProductsFilter);
}
//End of products pagging