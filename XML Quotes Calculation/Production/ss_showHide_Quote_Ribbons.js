////////////////////////Show/Hide Quote Ribbons for Opportunity XML-DE Form//////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////ShowHideQuoteOOBRibbons//////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
function ShowHideQuoteOOBRibbons(PrimaryControl)
{
    var formContext = PrimaryControl;
    var PrimaryEntityFormName = formContext.ui.formSelector.getCurrentItem().getLabel();
   
    return PrimaryEntityFormName !== "XML - DE" && PrimaryEntityFormName !== "XML Quote" && PrimaryEntityFormName !== "EQS - XML" && PrimaryEntityFormName !== "EQS Sales - Germany";
    
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////ShowHideQuoteCustomRibbons///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
function ShowHideQuoteCustomRibbons(PrimaryControl)
{
    var formContext = PrimaryControl;
    var OppFormName = formContext.ui.formSelector.getCurrentItem().getLabel();
    
    return (OppFormName === "XML - DE" || OppFormName === "EQS - XML" || OppFormName === "EQS Sales - Germany");
}