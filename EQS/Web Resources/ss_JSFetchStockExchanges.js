// JavaScript source code

var id;
var win;
var accountId = "";
function fetchData() {

    $("#dilistBTN").show();
    $("#UndoBTN").hide();
    //var FormType = parent.Xrm.Page.ui.getFormType();
    var disable = false;
    var undo = false;
    //if (FormType != 1) {
    var table = "";
    var frank = "";
    //    var account_id = parent.Xrm.Page.data.entity.getId();
    //    account_id = account_id.replace("{", "").replace("}", "");
    var form_type;
    if (location.search === "") {
        form_type = parent.Xrm.Page.ui.getFormType();
    }
    var Id = "";
    if (form_type !== 1) {
        tab = "";
        if (location.search !== "") {
            vals = location.search.substr(1).split("&");
            for (var i in vals) {
                vals[i] = vals[i].replace(/\+/g, " ").split("=");
            }

            //look for the parameter named 'data'
            var found = false;
            for (var i in vals) {
                if (vals[i][0].toLowerCase() === "data") {
                    parseDataValue(vals[i][1]);
                    found = true;
                    break;
                }
            }
            Id = accountId;
        }
        else {
            Id = parent.Xrm.Page.data.entity.getId();
        }

        Id = Id.replace("{", "").replace("}", "");

        
        //debugger;
        var req = new XMLHttpRequest();
        req.open("GET", parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.2/ss_account_stockexchanges?$select=ss_account_stockexchangeid,ss_isin,ss_stocksegmentissuer,ss_bondissuer,ss_market,ss_name,ss_segment,statecode,ss_stockexchange,ss_stocksymbol&$expand=ss_ss_account_stockexchange_ss_accountstockexchangeindex_AccountStockExchange($select=ss_exchangeindex)&$filter=_ss_accountid_value eq " + Id, true);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var results = JSON.parse(this.response);
                    //debugger;
                    id = results;
                    for (var i = 0; i < results.value.length; i++) {

                        if (results.value[i]["ss_stockexchange@OData.Community.Display.V1.FormattedValue"])
                            var ss_stockexchange_formatted = results.value[i]["ss_stockexchange@OData.Community.Display.V1.FormattedValue"];
                        else
                            var ss_stockexchange_formatted = "";
                        if (ss_stockexchange_formatted.indexOf('Frankfurt') !== -1) {
                            if (results.value[i]["statecode"] === 1) {
                                frank += "<tr class='greyOut' ondblclick='doubleclick(\"" + results.value[i]["ss_account_stockexchangeid"] + "\")' id=" + results.value[i]["ss_account_stockexchangeid"] + "><td>" + ss_stockexchange_formatted + "</td>";
                                frank += "<td> Delisted </td>";
                                undo = true;
                            }
                            else {
                                disable = true;
                                frank += "<tr class='blackOut' ondblclick='doubleclick(\"" + results.value[i]["ss_account_stockexchangeid"] + "\")' ><td>" + ss_stockexchange_formatted + "</td>";

                                if (results.value[i]["ss_market@OData.Community.Display.V1.FormattedValue"])
                                    var ss_market_formatted = results.value[i]["ss_market@OData.Community.Display.V1.FormattedValue"];
                                else
                                    var ss_market_formatted = "";

                                frank += "<td>" + ss_market_formatted + "</td>";
                            }
                            if (results.value[i]["ss_segment@OData.Community.Display.V1.FormattedValue"])
                                var ss_segment_formatted = results.value[i]["ss_segment@OData.Community.Display.V1.FormattedValue"];
                            else
                                var ss_segment_formatted = "";

                            frank += "<td>" + ss_segment_formatted + "</td>";
                            //index
                            var exchangeindex = results.value[i].ss_ss_account_stockexchange_ss_accountstockexchangeindex_AccountStockExchange;
                            var indexlength = results.value[i].ss_ss_account_stockexchange_ss_accountstockexchangeindex_AccountStockExchange.length;
                            var ExchangeIndex = "";
                            if (exchangeindex) {
                                for (var j = 0; j < indexlength; j++) {
                                    if(!ExchangeIndex.includes(results.value[i].ss_ss_account_stockexchange_ss_accountstockexchangeindex_AccountStockExchange[j]["ss_exchangeindex@OData.Community.Display.V1.FormattedValue"]))
                                    ExchangeIndex += results.value[i].ss_ss_account_stockexchange_ss_accountstockexchangeindex_AccountStockExchange[j]["ss_exchangeindex@OData.Community.Display.V1.FormattedValue"] + ",";
                                }
                            } else {
                                var ExchangeIndex = "";
                            }
                            frank += "<td>" + ExchangeIndex.substring(0, ExchangeIndex.length - 1) + "</td>";
                            ///index end
                            if (results.value[i]["ss_isin"])
                                var ss_isin = results.value[i]["ss_isin"];
                            else
                                var ss_isin = "";
                            frank += "<td>" + ss_isin + "</td>";

                            if (results.value[i]["ss_bondissuer"] != null || results.value[i]["ss_bondissuer"] !== undefined)
                                var bond = results.value[i]["ss_bondissuer@OData.Community.Display.V1.FormattedValue"];
                            else
                                var bond = "";
                            frank += "<td>" + bond + "</td>";

                            if (results.value[i]["ss_stocksegmentissuer"])
                                var stockSeg = results.value[i]["ss_stocksegmentissuer@OData.Community.Display.V1.FormattedValue"];
                            else
                                var stockSeg = "";

                            frank += "<td>" + stockSeg + "</td></tr>";



                        }
                        else {

                            if (results.value[i]["statecode"] === 1) {
                                table += "<tr class='greyOut' ondblclick='doubleclick(\"" + results.value[i]["ss_account_stockexchangeid"] + "\")' id=" + results.value[i]["ss_account_stockexchangeid"] + "><td>" + ss_stockexchange_formatted + "</td>";
                                undo = true;

                                table += "<td> Delisted </td>";
                            }

                            else {
                                disable = true;
                                table += "<tr class='blackOut' ondblclick='doubleclick(\"" + results.value[i]["ss_account_stockexchangeid"] + "\")' id=" + results.value[i]["ss_account_stockexchangeid"] + "><td>" + ss_stockexchange_formatted + "</td>";

                                if (results.value[i]["ss_market@OData.Community.Display.V1.FormattedValue"])
                                    var ss_market_formatted = results.value[i]["ss_market@OData.Community.Display.V1.FormattedValue"];
                                else
                                    var ss_market_formatted = "";
                                table += "<td>" + ss_market_formatted + "</td>";
                            }




                            if (results.value[i]["ss_segment@OData.Community.Display.V1.FormattedValue"])
                                var ss_segment_formatted = results.value[i]["ss_segment@OData.Community.Display.V1.FormattedValue"];
                            else
                                var ss_segment_formatted = "";

                            table += "<td>" + ss_segment_formatted + "</td>";
                            //index-2
                            var exchangeindex = results.value[i].ss_ss_account_stockexchange_ss_accountstockexchangeindex_AccountStockExchange;
                            var indexlength = results.value[i].ss_ss_account_stockexchange_ss_accountstockexchangeindex_AccountStockExchange.length;
                            var ExchangeIndex = "";
                            if (exchangeindex) {
                                for (var j = 0; j < indexlength; j++) {
                                    ExchangeIndex += results.value[i].ss_ss_account_stockexchange_ss_accountstockexchangeindex_AccountStockExchange[j]["ss_exchangeindex@OData.Community.Display.V1.FormattedValue"] + ",";
                                }
                            } else {
                                var ExchangeIndex = "";
                            }
                            table += "<td>" + ExchangeIndex.substr(0, ExchangeIndex.length - 1) + "</td>";
                            ///index end


                            if (results.value[i]["ss_isin"])
                                var ss_isin = results.value[i]["ss_isin"];
                            else
                                var ss_isin = "";

                            table += "<td>" + ss_isin + "</td>";

                            if (results.value[i]["ss_bondissuer"] != null || results.value[i]["ss_bondissuer"] !== undefined)
                                var bond = results.value[i]["ss_bondissuer@OData.Community.Display.V1.FormattedValue"];
                            else
                                var bond = "";
                            table += "<td>" + bond + "</td>";

                            if (results.value[i]["ss_stocksegmentissuer"])
                                var stockSeg = results.value[i]["ss_stocksegmentissuer@OData.Community.Display.V1.FormattedValue"];
                            else
                                var stockSeg = "";

                            table += "<td>" + stockSeg + "</td></tr>";
                        }

                    } //for loop end
                    if (disable === false) {
                        $("#dilistBTN").hide();
                    }
                    if (undo === true) {
                        $("#UndoBTN").show();
                    }
                    if (results.value.length > 0) {
                        var comText = frank + table;
                        document.getElementById("tbody").innerHTML = comText;
                    }
                    else {
                        document.getElementById("tbody").innerHTML = "Data Not Found!!";
                    }
                }
                else {
                    // V 8.00 Open Alert Dialog Method:   
                    //parent.Xrm.Utility.alertDialog(this.statusText);

                    // V9.00 Open Alert Dialog Method, SS_A.Jawad Cahnges:

                    var StatusTxt = this.statusText;
                    var alertStrings = { confirmButtonLabel: "Ok", text: StatusTxt };
                    var alertOptions = { height: 120, width: 260 };
                    parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                        function success(result) {
                           
                        },
                        function (error) {
                            
                        }
                    );

                }
            }
        };
        req.send();
    }
}

function DelistSE() {

    var r = confirm("Are you sure to Delist the Stock Exchange?");
    if (r === true) {
        for (var i = 0; i < id.value.length; i++) {
            var newid = id.value[i]["ss_account_stockexchangeid"];
            newid = newid.replace("{", "").replace("}", "")
            var entity = {};
            entity.statecode = 1;
            var req = new XMLHttpRequest();
            req.open("PATCH", parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.2/ss_account_stockexchanges(" + newid + ")", true);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 204) {




                    } else {
                        //parent.Xrm.Utility.alertDialog(this.statusText);

                        // V9.00 Open Alert Dialog Method, SS_A.Jawad Cahnges:

                        var StatusTxt = this.statusText;
                        var alertStrings = { confirmButtonLabel: "Ok", text: StatusTxt };
                        var alertOptions = { height: 120, width: 260 };
                        parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                            function success(result) {
                                
                            },
                            function (error) {
                                
                            }
                        );

                    }
                }
            };
            req.send(JSON.stringify(entity));
        }

        var entity = {};
        entity.ss_isdelisted = true;

        var req = new XMLHttpRequest();
        req.open("PATCH", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/accounts(" + parent.Xrm.Page.data.entity.getId().replace("{", "").replace("}", "") + ")", true);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 204) {
                    //Success - No Return Data - Do Something
                } else {
                    //Xrm.Utility.alertDialog(this.statusText);

                    // V9.00 Open Alert Dialog Method, SS_A.Jawad Cahnges:

                    var StatusTxt = this.statusText;
                    var alertStrings = { confirmButtonLabel: "Ok", text: StatusTxt };
                    var alertOptions = { height: 120, width: 260 };
                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                        function success(result) {
                           
                        },
                        function (error) {
                            
                        }
                    );
                }
            }
        };
        req.send(JSON.stringify(entity));
        fetchData();

    }
}

function UndoDelistSE() {
    var r = confirm("Are you sure ?");
    if (r === true) {
        for (var i = 0; i < id.value.length; i++) {
            var newid = id.value[i]["ss_account_stockexchangeid"];
            newid = newid.replace("{", "").replace("}", "");
            var entity = {};
            entity.statecode = 0;
            var req = new XMLHttpRequest();
            req.open("PATCH", parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.2/ss_account_stockexchanges(" + newid + ")", true);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 204) {

                    } else {
                        //parent.Xrm.Utility.alertDialog(this.statusText);

                        // V9.00 Open Alert Dialog Method, SS_A.Jawad Cahnges:

                        var StatusTxt = this.statusText;
                        var alertStrings = { confirmButtonLabel: "Ok", text: StatusTxt };
                        var alertOptions = { height: 120, width: 260 };
                        parent.Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                            function success(result) {
                                
                            },
                            function (error) {
                                
                            }
                        );
                    }
                }
            };
            req.send(JSON.stringify(entity));
        }
        var entity = {};
        entity.ss_isdelisted = false;

        var req = new XMLHttpRequest();
        req.open("PATCH", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/accounts(" + parent.Xrm.Page.data.entity.getId().replace("{", "").replace("}", "") + ")", true);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 204) {
                    //Success - No Return Data - Do Something
                } else {
                    //Xrm.Utility.alertDialog(this.statusText);

                    // V9.00 Open Alert Dialog Method, SS_A.Jawad Cahnges:

                    var StatusTxt = this.statusText;
                    var alertStrings = { confirmButtonLabel: "Ok", text: StatusTxt };
                    var alertOptions = { height: 120, width: 260 };
                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                        function success(result) {
                            
                        },
                        function (error) {
                            
                        }
                    );
                }
            }
        };
        req.send(JSON.stringify(entity));
        fetchData();
    }

}
function AddStockExchange() {
    var id = parent.Xrm.Page.data.entity.getId();
    var name = parent.Xrm.Page.data.entity.attributes.get('name').getValue();

    // Commented code is V8.00, Method for OpenEntity Form:

    //var windowOptions = {
    //   openInNewWindow: true
    // };

    // Set default values for the ss_account_stockexchange form

    var param = {};
    param["ss_accountid"] = id;
    param["ss_accountidname"] = name;

    //V8 Method for open entity form (Create New Record)
    //Xrm.Utility.openEntityForm("ss_account_stockexchange", null, param, windowOptions);
    //timeout();

    //V9.00, Method for OpenEntity Form(Create New Record): Changed By A.Jawad.

    var entityFormOptions = {};
    entityFormOptions["entityName"] = "ss_account_stockexchange";
    entityFormOptions["openInNewWindow"] = true;

    // Open the form.
    Xrm.Navigation.openForm(entityFormOptions, param).then(
        function (success) {
            timeout();
        },
        function (error) {
            
        });

}
function doubleclick(id) {

    //V8 Method for open entity form(Open Existing Record form)
    //var name = 'ss_account_stockexchange';
    //var window = { openInNewWindow: true };
    //parent.Xrm.Utility.openEntityForm(name, id, null, window);
    //timeout();

    //V9.00, Method for OpenEntity Form(Open Existing Record form): Changed By A.Jawad.

    var entityFormOptions = {};
    entityFormOptions["entityName"] = "ss_account_stockexchange";
    entityFormOptions["entityId"] = id;
    entityFormOptions["openInNewWindow"] = true;

    parent.Xrm.Navigation.openForm(entityFormOptions).then(
        function (success) {
            timeout();
        },
        function (error) {
           
        }
    );


}

function timeout() {
    setTimeout(function () {
        if (document.hasFocus()) {
            fetchData();
        }
        else {
            timeout();
        }
    }, 500);
}

function openStockExchanges() {
    var form_type = parent.Xrm.Page.ui.getFormType();
    if (form_type !== 1) {
        var accountId = parent.Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");
        var customParameters = encodeURIComponent("\"" + accountId + "\"");
        var url = "/webresources/ss_HTMLGridForStockExchange?data=" + customParameters;
        if (!win || win.closed)
            win = window.open(url, null, "width=1030px,height=630px,fullscreen=yes, resizable=yes, scrollbars=yes");
        else
            win.focus();
    }
}
function parseDataValue(datavalue) {

    if (datavalue !== "") {
        var vals = new Array();
        vals = decodeURIComponent(datavalue).split("&");
        for (var i in vals) {
            vals[i] = vals[i].replace(/\+/g, " ").split("=");
        }
    }
    var id = "";
    id = vals[0];
    id = id.toString();
    id = id.replace('"', '');
    id = id.replace('"', '');
    accountId = id;

}
