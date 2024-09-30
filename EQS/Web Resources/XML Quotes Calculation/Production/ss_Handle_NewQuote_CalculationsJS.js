//////////////////////// Added By Nadeem Hasan //////////////////////////26-Sep-2021/////////////////////////

//////////////////////// Handle new Quote Calculations for Opportunity XML-DE Form //////////////////////////

function On_Load(ExecutionContext) {
    var formContext = ExecutionContext.getFormContext();

    var currentForm = formContext.ui.formSelector.getCurrentItem().getLabel();
    var IsXMLQuote = formContext.getAttribute("ss_isxmlquote_q") ? formContext.getAttribute("ss_isxmlquote_q").getValue() : false;
    if (!IsXMLQuote && currentForm !== "Quote") {
        navigateToSpecificForm(formContext, "Quote");
    }
    else if (IsXMLQuote && currentForm !== "XML Quote") {
        navigateToSpecificForm(formContext, "XML Quote");
    }
    else if (IsXMLQuote && currentForm === "XML Quote") {

        // parent.$("Div[aria-label='XML Quote']", parent.document).bind('click', function(){ return false; });

    }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////Navigate To Specific Form////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
function navigateToSpecificForm(formContext, formLable) {
    var items = formContext.ui.formSelector.items.get();

    for (var i in items) {

        var item = items[i];

        //var itemId = item.getId();

        var itemLabel = item.getLabel()

        if (itemLabel === formLable) {

            //navigate to the form

            item.navigate();
            return;

        } //endif

    } //end for

}
/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////OpenXMLQuote/////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
function OpenXMLQuote(PrimaryControl) {
    var PriceLevelDefaultValue = [{ entityType: 'pricelevel', id: '2D94C494-804F-E811-8154-70106FA9E1E1', name: 'Sales Products Price List' }];
    var formContext = PrimaryControl;
    var PrimaryEntityName = formContext.data.entity.getEntityName();
    var ParentAccount = (PrimaryEntityName === "opportunity") ? formContext.getAttribute("parentaccountid") : null;
    var CurrentRecordId = formContext.data.entity.getId();
    var CurrentRecordName = formContext.getAttribute("name").getValue();
    var OppPriceList = formContext.getAttribute("pricelevelid") ? formContext.getAttribute("pricelevelid").getValue() : null;
    var parameters = {};
    //Set the Default Values
    //Account  
    if (ParentAccount) {
        parameters["ss_firmaid"] = ParentAccount.getValue()[0].id;
        parameters["ss_firmaidname"] = ParentAccount.getValue()[0].name;
        parameters["ss_firmaidtype"] = ParentAccount.getValue()[0].entityType;
    }
    else if (PrimaryEntityName === "account") {
        parameters["ss_firmaid"] = CurrentRecordId;
        parameters["ss_firmaidname"] = CurrentRecordName;
        parameters["ss_firmaidtype"] = "account";
    }
    //Opportunity
    if (PrimaryEntityName === "opportunity") {
        parameters["ss_xmlopportunityid"] = CurrentRecordId;
        parameters["ss_xmlopportunityidname"] = CurrentRecordName;
        parameters["ss_xmlopportunityidtype"] = "opportunity";
    }
    //Price List
    if (OppPriceList) {
        parameters["pricelevelid"] = OppPriceList[0].id;
        parameters["pricelevelidname"] = OppPriceList[0].name;
        parameters["pricelevelidtype"] = OppPriceList[0].entityType;
    }
    else {
        parameters["pricelevelid"] = PriceLevelDefaultValue[0].id;
        parameters["pricelevelidname"] = PriceLevelDefaultValue[0].name;
        parameters["pricelevelidtype"] = PriceLevelDefaultValue[0].entityType;
    }

    //Is XML Quote
    parameters["ss_isxmlquote_q"] = true;
    //Quote Name
    parameters["name"] = CurrentRecordName;
    //Populating Parent Firma 



    var pageInput = {
        pageType: "entityrecord",
        entityName: "quote",
        formId: "844e9be0-c9ff-47db-9a41-fe5c11200e24",
        data: parameters
    };

    var navigationOptions = {
        title: "New XML Quote Calculation",
        target: 2,
        height: { value: 75, unit: "%" },
        width: { value: 100, unit: "%" },
        position: 1
    };
    Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
        function success(result) {
            //console.log("Record created with ID: " + result.savedEntityReference[0].id + 
            //" Name: " + result.savedEntityReference[0].name)
            // Handle dialog closed
        },
        function error() {
            // Handle errors
        }
    );

}
/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////SetParentFirma/////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
function SetParentFirma(ExecutionContext) {
    var formContext = ExecutionContext.getFormContext();
    var QuoteId = formContext.data.entity.getId();
    var FirmaId = formContext.getAttribute("ss_firmaid") ? formContext.getAttribute("ss_firmaid").getValue() : null;
    var ParentFirma = formContext.getAttribute("ss_parentfirmaid");
    var ParentFirmaVal = ParentFirma.getValue();
    if (FirmaId && (ParentFirmaVal !== null && ParentFirmaVal !== undefined)) {
        if (FirmaId[0].id === ParentFirmaVal[0].id) {
            formContext.getControl("ss_parentfirmaid").setDisabled(true);
        }
    }
    if (FirmaId && FirmaId.length > 0) {
        Xrm.WebApi.online.retrieveMultipleRecords("account", "?$select=name,_parentaccountid_value&$filter=_parentaccountid_value eq " + FirmaId[0].id).then(
            function success(results) {
                if (results.entities.length > 0) {
                    ParentFirma.setValue([{ entityType: 'account', id: FirmaId[0].id, name: FirmaId[0].name }]);
                    formContext.getControl("ss_parentfirmaid").setDisabled(true);
                }
                else {
                    formContext.getControl("ss_parentfirmaid").setDisabled(false);
                    UpdateQuoteParentFirma(ParentFirma, FirmaId[0].id);
                }
            },
            function (error) {
                ShowErrorDialog(error.message);
            }
        );

    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////UpdateQuoteParentFirma///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
function UpdateQuoteParentFirma(ParentFirma, FirmaId) {

    Xrm.WebApi.online.retrieveRecord("account", FirmaId, "?$select=_parentaccountid_value").then(
        function success(result) {
            var _parentaccountid_value = result["_parentaccountid_value"];
            var _parentaccountid_value_formatted = result["_parentaccountid_value@OData.Community.Display.V1.FormattedValue"];
            var _parentaccountid_value_lookuplogicalname = result["_parentaccountid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
            if (_parentaccountid_value) {
                ParentFirma.setValue([{ entityType: _parentaccountid_value_lookuplogicalname, id: _parentaccountid_value, name: _parentaccountid_value_formatted }]);
            }
            else {
                ParentFirma.setValue(null);
            }

        },
        function (error) {
            ShowErrorDialog(error.message);
        }
    );
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////UpdateParentAccountofFirma///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
function UpdateParentAccountofFirma(ExecutionContext) {
    var formContext = ExecutionContext.getFormContext();
    var Firma = formContext.getAttribute("ss_firmaid").getValue();
    var ParentFirma = formContext.getAttribute("ss_parentfirmaid").getValue();
    if (Firma && ParentFirma) {
        var entity = {};
        var parentAccountId = ParentFirma[0].id.replace("{", "").replace("}", "");
        var FirmaId = Firma[0].id.replace("{", "").replace("}", "");
        entity["parentaccountid@odata.bind"] = "/accounts(" + parentAccountId + ")";

        Xrm.WebApi.online.updateRecord("account", FirmaId, entity).then(
            function success(result) {
                var updatedEntityId = result.id;
            },
            function (error) {
                ShowErrorDialog(error.message);
            }
        );
    }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////ShowHideGrids////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
function ShowHideGrids(ExecutionContext) {
    var formContext = ExecutionContext.getFormContext();
    var formType = formContext.ui.getFormType();
    if (formType === 1) {
        return;
    }
    var CurrentRecordId = formContext.data.entity.getId();
    var XML_QuotesBy_Firma = formContext.ui.tabs.get("tab_xml_quotes").sections.get("section_XMLQuotesByFirma");
    var XML_QuotesBy_ParentFirma = formContext.ui.tabs.get("tab_xml_quotes").sections.get("section_XMLQuotesByParentFirma");
    Xrm.WebApi.online.retrieveMultipleRecords("account", "?$select=name&$filter=_parentaccountid_value eq " + CurrentRecordId).then(
        function success(results) {
            if (results.entities.length > 0) {
                XML_QuotesBy_Firma.setVisible(false);
                XML_QuotesBy_ParentFirma.setVisible(true);
            }
            else {
                XML_QuotesBy_Firma.setVisible(true);
                XML_QuotesBy_ParentFirma.setVisible(false)
            }
        },
        function (error) {
            ShowErrorDialog(error.message);
        }
    );
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// All Calculations ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//     K == Konvertierungskosten
//     S == Standard XML
//     P == Konvertierungspreis
//     T == XML Vertragstyp
//     G == Größe der Gesellschaft
//     X == Anzahl Zeichen
//     GK == K + S  //  GK => Gesamtkosten der Einreichnung mit EQS GK
//////////////////////////////////////////////////////////////////////////////////////////////////
function ApplyXMLCalculations(ExecutionContext) {

    var formContext = ExecutionContext.getFormContext();
    var T = formContext.getAttribute("ss_xmlvertragstyp_q") ? formContext.getAttribute("ss_xmlvertragstyp_q").getValue() : null;
    var G = formContext.getAttribute("ss_grobedergesellschaft_q") ? formContext.getAttribute("ss_grobedergesellschaft_q").getValue() : null;
    var X = formContext.getAttribute("ss_anzahlzeichen_q") ? formContext.getAttribute("ss_anzahlzeichen_q").getValue() : null;
    var GK_Field = formContext.getAttribute("ss_gesamtkostendeme_q");
    var KB_Field = formContext.getAttribute("ss_kostenbanz_q");

    if (T && G && X) {
        //Setting Kosten Banz
        var KB = parseFloat(Calculate_KostenBanzKB(T, X));
        var GK = parseFloat(Calculate_GesamtkostenderEinreichnungMitEQSGK(KB, T, G, X));
        KB_Field.setValue(Number(KB));
        //Setting Gesamtkosten der Einreichnung mit EQS
        GK_Field.setValue(Number(GK));
    }

}
//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////Calculating Kosten Banz KB ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function Calculate_KostenBanzKB(T, X) {

    if (T === 10 || T === 12 || T === 15 || T === 20 || T === 25 || T === 30 || T === 35 || T === 40) {
        return (X * 0.0165 < 40) ? 40 : (X * 0.0165);
    }
    else if (T === 41 || T === 42) {
        return (X * 0.025 < 40) ? 40 : (X * 0.025);
    }

}
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////Calculating Gesamtkosten der Einreichnung mit EQS GK ///////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function Calculate_GesamtkostenderEinreichnungMitEQSGK(KB, T, G, X) {

    var S = Calculate_StandardXML(G, X);
    S = S < 30 ? 30 : S;
    var K = Calculate_Konvertierungskosten(KB, T, G, S, X);
    return K + S;
}
//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// Calculating Standard XML S ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function Calculate_StandardXML(G, X) {

    if (G === 1) // Groß
    {
        if (X <= 7000) { return (0.014 * X); }
        else if (X > 7000 && X <= 15000) { return (0.01 * (X - 7000)) + 98; }
        else if (X > 15000 && X <= 26000) { return (0.0055 * (X - 15000)) + 98 + 79.99; }
        else if (X > 26000 && X <= 60000) { return (0.0028 * (X - 26000)) + 98 + 79.99 + 60.49; }
        else { return (0.0015 * (X - 60000)) + 98 + 79.99 + 60.49 + 95.2; }
    }
    else if (G === 2) // Mittelgroß
    {
        return 60;
    }
    else if (G === 3) // Klein
    {
        return 30;
    }
    else if (G === 4) // Kleinst
    {
        return 30;
    }

}
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Calculating Konvertierungskosten K //////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function Calculate_Konvertierungskosten(KB, T, G, S, X) {
    //var P = Calculate_Konvertierungspreis(T, X);
    var P = Calculate_Konvertierungspreis(KB, S, T, X);
    var TM = (T > 40) ? 0.9 : (1 - parseFloat("0." + T));
    if (T === 10) {
        if (G === 1) // Case1: Groß
        {
            if (P < 105) { return 105; }
            else { return P; }

        }
        else if ((G === 2 || G === 3 || G === 4) && (T === 10)) // Case2: G=[Mittelgroß, Klein, Kleinst]
        {
            if ((KB * 0.9 - S) < 105) { return 105; }
            else { return (KB * 0.9) - S; }
        }
    }
    if (T === 12) {
        if (G === 1) // Case1: Groß
        {
            if (P < 105) { return 105; }
            else { return P; }
        }
        else if ((G === 2 || G === 3 || G === 4) && (T === 12)) {
            if ((KB * 0.88) - S < 105) { return 105; }
            else { return (KB * 0.88) - S; }
        }
    }
    if (T === 15) {
        if (G === 1) // Case1: Groß
        {
            if (P < 105) { return 105; }
            else { return P; }
        }
        else if ((G === 2 || G === 3 || G === 4) && (T === 15)) {
            if ((KB * 0.85) - S < 105) { return 105; }
            else { return (KB * 0.85) - S; }
        }
    }
    if (T === 20) {
        if (G === 1) // Case1: Groß
        {
            if (P < 105) { return 105; }
            else { return P; }
        }
        else if ((G === 2 || G === 3 || G === 4) && (T === 20)) {
            if ((KB * 0.8) - S < 105) { return 105; }
            else { return (KB * 0.8) - S; }
        }
    }
    if (T === 25) {
        if (G === 1) // Case1: Groß
        {
            if (P < 105) { return 105; }
            else { return P; }
        }
        else if ((G === 2 || G === 3 || G === 4) && (T === 25)) {
            if ((KB * 0.75) - S < 105) { return 105; }
            else { return (KB * 0.75) - S; }
        }
    }
    if (T === 30) {
        if (G === 1) // Case1: Groß
        {
            if (P < 105) { return 105; }
            else { return P; }
        }
        else if ((G === 2 || G === 3 || G === 4) && (T === 30)) {
            if ((KB * 0.7) - S < 105) { return 105; }
            else { return (KB * 0.7) - S; }
        }
    }
    if (T === 35) {
        if (G === 1) // Case1: Groß
        {
            if (P < 105) { return 105; }
            else { return P; }
        }
        else if ((G === 2 || G === 3 || G === 4) && (T === 35)) {
            if ((KB * 0.65) - S < 105) { return 105; }
            else { return (KB * 0.65) - S; }
        }
    }
    if (T === 40) {
        if (G === 1) // Case1: Groß
        {
            if (P < 105) { return 105; }
            else { return P; }
        }
        else if ((G === 2 || G === 3 || G === 4) && (T === 40)) {
            if ((KB * 0.6) - S < 105) { return 105; }
            else { return (KB * 0.6) - S; }
        }
    }
    if (T === 41) {
        if (G === 1) // Case1: Groß
        {
            if (P < 105) { return 105; }
            else { return P; }
        }
        else if ((G === 2 || G === 3 || G === 4) && (T === 41)) {
            if ((KB * 0.9) - S < 105) { return 105; }
            else { return (KB * 0.9) - S; }
        }
    }
    if (T === 42) {
        if (G === 1) // Case1: Groß
        {
            if (P < 105) { return 105; }
            else { return P; }
        }
        else if ((G === 2 || G === 3 || G === 4) && (T === 42)) {
            if ((KB * 0.75) - S < 105) { return 105; }
            else { return (KB * 0.75) - S; }
        }
    }

}
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Calculating Konvertierungspreis P ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function Calculate_Konvertierungspreis(KB, S, T, X) {

    switch (T) {
        case 10:

            return (KB * 0.9) - S;
            // if ( X > 0 && X <= 7000 ) { return (( 0.015 * 0.9 ) - 0.0125) * X; }
            // else if ( X > 7000 && X <= 15000 ) { return ( ( 0.015 * 0.9 ) - 0.0088) * ( X - 7000 ) +7; }
            // else if ( X > 15000 && X <= 26000 ) { return ( 0.015 * 0.9 - 0.005 ) * ( X - 15000 ) + 7 +37.6; }
            // else if ( X > 26000 && X <= 60000 ) { return ( 0.015 * 0.9- 0.0025 ) * ( X - 26000 ) + 7 + 37.6 + 93.5; } 
            // else if ( X > 60000 ) { return ( 0.015*0.9- 0.0013 ) * ( X - 60000 ) + 7 + 37.6 + 93.5 + 374; }
            break;

        case 12:

            return (KB * 0.88) - S;
            // if ( X > 0 && X <= 7000 ) { return (( 0.015 * 0.88 ) - 0.0125) * X; }
            // else if ( X > 7000 && X <= 15000 ) { return (( 0.015 * 0.88 ) - 0.0088 ) * ( X - 7000 ) + 4.9; }
            // else if ( X > 15000 && X <= 26000 ) { return (( 0.015 * 0.88 ) - 0.005 ) * ( X - 15000 ) + 4.9 + 35.2; }
            // else if ( X > 26000 && X <= 60000 ) { return (( 0.015 * 0.88 ) - 0.0025 ) * ( X - 26000 ) + 4.9 + 35.2 + 90.2; } 
            // else if ( X > 60000 ) { return ((0.015 * 0.88) - 0.0013 ) * ( X - 60000 ) + 4.9 + 35.2 + 90.2 + 363.8; }
            break;

        case 15:

            return (KB * 0.85) - S;
            // if ( X > 0 && X <= 7000 ) { return (( 0.015 * 0.85 ) - 0.0125) * X; }
            // else if ( X > 7000 && X <= 15000 ) { return (( 0.015 * 0.85 ) - 0.0088 ) * ( X-7000 ) + 1.75; }
            // else if ( X > 15000 && X <= 26000 ) { return (( 0.015 * 0.85 ) - 0.005 ) * ( X - 15000 ) + 1.75 + 31.6; }
            // else if ( X > 26000 && X <= 60000 ) { return (( 0.015 * 0.85 ) - 0.0025 ) * ( X - 26000 ) + 1.75 + 31.6 + 85.25; } 
            // else if ( X > 60000 ) { return  (( 0.015 * 0.85 ) - 0.0013 ) * ( X - 60000 ) + 1.75 + 31.6 + 85.25 + 348.5; }
            break;

        case 20:

            return (KB * 0.8) - S;
            // if ( X > 0 && X <= 7000 ) { return (( 0.015 * 0.88 ) - 0.0125) * X; }
            // else if ( X > 7000 && X <= 15000 ) { return (( 0.015 * 0.8 ) - 0.0088 ) * ( X - 7000 ) - 3.5; }
            // else if ( X > 15000 && X <= 26000 ) { return (( 0.015 * 0.8 ) - 0.005 ) * ( X - 15000 ) - 3.5 + 25.6; }
            // else if ( X > 26000 && X <= 60000 ) { return (( 0.015 * 0.8 ) - 0.0025 ) * ( X - 26000 ) - 3.5 + 25.6 + 77; } 
            // else if ( X > 60000 ) { return (( 0.015 * 0.8 ) - 0.0013 ) * ( X - 60000 ) - 3.5 + 25.6 + 77 + 323; }
            break;

        case 25:

            return (KB * 0.75) - S;
            //if ( X > 0 && X <= 7000 ) { return (( 0.015 * 0.75 ) - 0.0125 ) * X; }
            // else if ( X > 7000 && X <= 15000 ) { return (( 0.015 * 0.75 ) - 0.0088 ) * ( X - 7000 ) - 8.75; }
            // else if ( X > 15000 && X <= 26000 ) { return (( 0.015 * 0.75 ) - 0.005 ) * ( X - 15000 ) - 8.75 + 19.6; }
            // else if ( X > 26000 && X <= 60000 ) { return (( 0.015 * 0.75 ) - 0.0025 ) * ( X - 26000 ) - 8.75 + 19.6 + 68.75; } 
            // else if ( X > 60000 ) { return (( 0.015 * 0.75 ) - 0.0013 ) * ( X - 60000 ) - 8.75 + 19.6 + 68.75 + 297.5; }
            break;

        case 30:

            return (KB * 0.7) - S;
            // if ( X > 0 && X <= 7000 ) { return ( 0.015 * 0.7 - 0.0125 ) * X; }
            // else if ( X > 7000 && X <= 15000 ) { return (( 0.015 * 0.7 ) - 0.0088 ) * ( X - 7000 ) - 14; }
            // else if ( X > 15000 && X <= 26000 ) { return (( 0.015 * 0.7 ) - 0.005) * ( X - 15000 ) - 14 + 13.6; }
            // else if ( X > 26000 && X <= 60000 ) { return (( 0.015 * 0.7 ) - 0.0025 ) * ( X - 26000 ) - 14 + 13.6 + 60.5; } 
            // else if ( X > 60000 ) { return (( 0.015 * 0.7 ) - 0.0013 ) * ( X - 60000 ) - 14 + 13.6 + 60.5 + 272; }
            break;

        case 35:

            return (KB * 0.65) - S;
            // if ( X > 0 && X <= 7000 ) { return ( (0.015 * 0.65) - 0.0125 ) * X; }
            // else if ( X > 7000 && X <= 15000 ) { return (( 0.015 * 0.65 ) - 0.0088 ) * ( X - 7000 ) - 19.25; }
            // else if ( X > 15000 && X <= 26000 ) { return (( 0.015 * 0.65 ) - 0.005 ) * ( X - 15000 ) - 19.25 + 7.6; }
            // else if ( X > 26000 && X <= 60000 ) { return (( 0.015 * 0.65 ) - 0.0025 ) * ( X - 26000 ) - 19.25 + 7.6 + 52.25; } 
            // else if ( X > 60000 ) { return (( 0.015 * 0.65 ) - 0.0013 ) * ( X - 60000 ) - 19.25 + 7.6 + 52.25 + 246.5; }
            break;

        case 40:

            return (KB * 0.6) - S;
            // if ( X > 0 && X <= 7000 ) { return (( 0.015 * 0.6 ) - 0.0125) * X; }
            // else if ( X > 7000 && X <= 15000 ) { return (( 0.015 * 0.6 ) - 0.0088 ) * ( X - 7000 ) - 24.5; }
            // else if ( X > 15000 && X <= 26000 ) { return (( 0.015 * 0.6 ) - 0.005 ) * ( X - 15000 ) - 24.5 + 1.6; }
            // else if ( X > 26000 && X <= 60000 ) { return (( 0.015 * 0.6 ) - 0.0025) * ( X - 26000 ) - 24.5 + 1.6 + 44; } 
            // else if ( X > 60000 ) { return (( 0.015 * 0.6 ) - 0.0013 ) * ( X - 60000 ) - 24.5 + 1.6 + 44 + 221; }
            break;

        case 41: //Paper 10

            if ((X * 0.0165) < 40) {
                return (40 * 0.9) - S;
            }
            else {
                return (X * 0.0165 * 0.9) - S;
            }
            // else if ( X > 7000 && X <= 15000 ) { return (( 0.025 * 0.9 ) - 0.0088 ) * ( X - 7000 ) + 70; }
            // else if ( X > 15000 && X <= 26000 ) { return (( 0.025 * 0.9 ) - 0.005 ) * ( X - 15000 ) + 70 + 109.6; }
            // else if ( X > 26000 && X <= 60000 ) { return (( 0.025 * 0.9) - 0.0025 ) * ( X - 26000 ) + 70 + 109.6 + 192.5; } 
            // else if ( X > 60000 ) { return  (( 0.025 * 0.9 ) - 0.0013 ) * ( X - 60000 ) + 70 + 109.6 + 192.5 + 680; }
            break;

        case 42: //Paper 25

            if (X * 0.0165 < 40) {
                return (40 * 0.75) - S;
            }
            else {
                return (X * 0.0165 * 0.75) - S
            }
            // else if ( X > 7000 && X <= 15000 ) { return (( 0.025 * 0.75 ) - 0.0088 ) * ( X - 7000 ) + 43.75; }
            // else if ( X > 15000 && X <= 26000 ) { return (( 0.025 * 0.75 ) - 0.005 ) * ( X - 15000 ) + 43.75 + 79.6; }
            // else if ( X > 26000 && X <= 60000 ) { return (( 0.025 * 0.75 ) - 0.0025 ) * ( X - 26000 ) + 43.75 + 79.6 + 151.25; } 
            // else if ( X > 60000 ) { return  (( 0.025 * 0.75 ) - 0.0013 ) * ( X - 60000 ) + 43.75 + 79.6 + 151.25 + 552.5; }
            break;

    }

}

//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////Set Field Values ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function SetValueToQuoteFields(executionContext) {
    var formContext = executionContext.getFormContext();
    debugger;
    var formName = formContext.ui.formSelector.getCurrentItem().getLabel();
    if (formName === "XML Quote") {
        var ss_gesamtkostenaufgerundent = formContext.getAttribute("ss_gesamtkostenaufgerundent").getValue();
        var ss_kostenbanzaufgerundent = formContext.getAttribute("ss_kostenbanzaufgerundent").getValue();
        var ss_gesamtkostendeme_q = formContext.getAttribute("ss_gesamtkostendeme_q").getValue();
        var ss_kostenbanz_q = formContext.getAttribute("ss_kostenbanz_q").getValue();
        if (ss_gesamtkostenaufgerundent === null || ss_gesamtkostenaufgerundent === "") {
            formContext.getAttribute("ss_gesamtkostenaufgerundent").setValue(ss_gesamtkostendeme_q);
        }
        if (ss_kostenbanzaufgerundent === null || ss_kostenbanzaufgerundent === "") {
            formContext.getAttribute("ss_kostenbanzaufgerundent").setValue(ss_kostenbanz_q);
        }
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////ShowErrorDialog//////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
function ShowErrorDialog(ErrorMessage) {
    var alertStrings = { confirmButtonLabel: "OK", text: ErrorMessage, title: "Error" };
    var alertOptions = { height: 120, width: 260 };
    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
        function (success) {
            console.log("Alert dialog closed");
        },
        function (error) {
            console.log(error.message);
        }
    );
}