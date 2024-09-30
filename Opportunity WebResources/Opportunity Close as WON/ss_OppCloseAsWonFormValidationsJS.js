function CheckFormValidation(primaryControl) {
    var formContext = primaryControl;
    var formLabel = formContext.ui.formSelector.getCurrentItem().getLabel();
    var OppID = formContext.data.entity.getId();
    if (formLabel === "Partner Opportunity") {
        var ActiveBusinessStage = formContext.data.process.getActiveStage();
        var ActiveStageID = formContext.data.process.getActiveStage().getId();
        if (ActiveBusinessStage && ActiveBusinessStage.getName() === "Close") {
            Xrm.WebApi.retrieveMultipleRecords("annotation", "?$select=subject&$filter=_objectid_value eq " + OppID + " and notetext eq '{{Partner--'").then(
                function success(result) {
                    if (result.entities.length <= 0) {
                        var alertStrings = { confirmButtonLabel: "OK", text: "Please Upload the Contract", title: "Warning!" };
                        var alertOptions = { height: 120, width: 260 };
                        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
                    }
                    else {
                        ProcessPartnerOpp(formContext);
                    }
                },
                function (error) {
                    var alertStrings = { confirmButtonLabel: "OK", text: error.message, title: "Error" };
                    var alertOptions = { height: 120, width: 260 };
                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
                }
            );
        }
        else {
            var alertStrings = { confirmButtonLabel: "OK", text: "Please Complete Business Stages first", title: "Warning!" };
            var alertOptions = { height: 120, width: 260 };
            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
        }
    }
    // else {
    //     Xrm.Navigation.openUrl("../WebResources/ss_OppCloseAsWon.html");
    // }
    else if (formLabel !== "Partner Opportunity") {
        var ActiveBusinessStage = formContext.data.process.getActiveStage();
        var ActiveStageID = formContext.data.process.getActiveStage().getId();
        if (ActiveBusinessStage && (ActiveStageID === "bb7e830a-61bd-441b-b1fd-6bb104ffa027" || ActiveStageID === "7f5247fe-cfc3-42bc-aa77-b1d836d9b7c0")) {
            Xrm.WebApi.retrieveMultipleRecords("annotation", "?$select=subject&$filter=_objectid_value eq " + OppID + " and notetext eq '{{Contract--'").then(
                function success(result) {
                    contractsCount = result.entities.length;
                    if (contractsCount > 0) {
                        CheckForProdcut(OppID, formContext);
                    }
                    else {
                        var alertStrings = { confirmButtonLabel: "OK", text: "Business Process Flow Stage should be Close (4) \n Contract should be uploaded", title: "Warning!" };
                        var alertOptions = { height: 120, width: 260 };
                        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
                    }
                },
                function (error) {
                    console.log("Error from Display Rule WR => " + error);
                }
            );
        }
        else {
            var alertStrings = { confirmButtonLabel: "OK", text: "Please Complete Business Stages first", title: "Warning!" };
            var alertOptions = { height: 120, width: 260 };
            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
        }
    }
}
function CheckForProdcut(OppID,formContext) {
    Xrm.WebApi.retrieveMultipleRecords("opportunityproduct", "?$filter=_opportunityid_value eq " + OppID + "&$top=1").then(
        function success(results) {
            console.log(results);
            var result = results.entities.length;
            if (result <= 0) {
                var alertStrings = { confirmButtonLabel: "OK", text: "Business Process Flow Stage should be Close (4) \n Contract should be uploaded \n Product must be Selected", title: "Warning!" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
            }
            else {
                Xrm.Navigation.openUrl("../WebResources/ss_OppCloseAsWon.html");
            }
        },
        function (error) {
            console.log(error.message);
        }
    );
}
function ProcessPartnerOpp(formContext) {

    var ss_controlcenter = formContext.getAttribute("ss_controlcenter").getValue();
    var ss_iscompliancepartner = formContext.getAttribute("ss_iscompliancepartner").getValue();
    var ss_partnercompanies = formContext.getAttribute("ss_partnercompanies").getValue();
    var ss_countryiso = formContext.getAttribute("ss_countryiso").getValue();
    var parentaccountid = formContext.getAttribute("parentaccountid").getValue();

    if (ss_controlcenter != null && ss_iscompliancepartner != null && ss_partnercompanies != null && ss_partnercompanies != undefined && ss_countryiso && parentaccountid && parentaccountid[0]) {

        var entity = {};
        entity.ss_ispartner = true;
        entity.new_iscompliancepartner = ss_iscompliancepartner;
        entity.ss_controlcenter = ss_controlcenter;
        entity.ss_partnercompanies = ss_partnercompanies;
        entity.ss_countryiso = ss_countryiso;
        entity.ss_countryfullname = ss_countryiso;
        var CountryObj = getCountryInfo(ss_countryiso);
        entity.address1_country = CountryObj ? CountryObj.fullname : "";
        Xrm.WebApi.online.updateRecord("account", parentaccountid[0].id, entity).then(
            function success(result) {
                var updatedEntityId = result.id;
                CloseOpportuntiy(formContext);
            },
            function (error) {
                var alertStrings = { confirmButtonLabel: "OK", text: error.message, title: "Error" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
            }
        );



    }
    else {

        formContext.getAttribute("ss_controlcenter").setRequiredLevel("required");
        formContext.getAttribute("ss_iscompliancepartner").setRequiredLevel("required");
        formContext.getAttribute("ss_partnercompanies").setRequiredLevel("required");
        formContext.getAttribute("ss_countryiso").setRequiredLevel("required");


    }

}
function CloseOpportuntiy(formContext) {

    var OppID = formContext.data.entity.getId();
    OppID = OppID.replace(/[{}]/g, "");

    ///new request
    var Sdk = window.Sdk || {};
    /**
    * Request to win an opportunity
    * @param {Object} opportunityClose - The opportunity close activity associated with this state change.
    * @param {number} status - Status of the opportunity.
    */
    Sdk.WinOpportunityRequest = function (opportunityClose, status) {
        this.OpportunityClose = opportunityClose;
        this.Status = status;

        this.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    "OpportunityClose": {
                        "typeName": "mscrm.opportunityclose",
                        "structuralProperty": 5 // Entity Type
                    },
                    "Status": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1 // Primitive Type
                    }
                },
                operationType: 0, // This is an action. Use '1' for functions and '2' for CRUD
                operationName: "WinOpportunity",
            };
        };
    };
    var opportunityClose = {
        "opportunityid@odata.bind": "/opportunities(" + OppID + ")",//replace with id of opportunity
    };
    var winOpportunityRequest = new Sdk.WinOpportunityRequest(opportunityClose, 3);

    // Use the request object to execute the function

    Xrm.WebApi.online.execute(winOpportunityRequest).then(
        function (result) {
            if (result.ok) {
                formContext.data.refresh(true);
            }
        },
        function (error) {
            var alertStrings = { confirmButtonLabel: "OK", text: error.message, title: "Error" };
            var alertOptions = { height: 120, width: 260 };
            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
        }
    );


}
//Get Country Details 
function getCountryInfo(ISO_value) {
    var countries = [{ name: "AD", fullname: "Andorra", code: 20 },
    { name: "AR", fullname: "Argentina", code: 32 },
    { name: "AU", fullname: "Australia", code: 36 },
    { name: "AT", fullname: "Austria", code: 40 },
    { name: "BS", fullname: "Bahamas", code: 44 },
    { name: "BH", fullname: "Bahrain", code: 48 },
    { name: "BE", fullname: "Belgium", code: 56 },
    { name: "BM", fullname: "Bermuda", code: 60 },
    { name: "BR", fullname: "Brazil", code: 76 },
    { name: "BG", fullname: "Bulgaria", code: 100 },
    { name: "CA", fullname: "Canada", code: 124 },
    { name: "KY", fullname: "Cayman Islands", code: 136 },
    { name: "CL", fullname: "Chile", code: 152 },
    { name: "CN", fullname: "China", code: 156 },
    { name: "HR", fullname: "Croatia", code: 191 },
    { name: "CW", fullname: "Curaçao", code: 531 },
    { name: "CY", fullname: "Cyprus", code: 196 },
    { name: "CZ", fullname: "Czechia", code: 203 },
    { name: "DK", fullname: "Denmark", code: 208 },
    { name: "EG", fullname: "Egypt", code: 818 },
    { name: "EE", fullname: "Estonia", code: 233 },
    { name: "FI", fullname: "Finland", code: 246 },
    { name: "FR", fullname: "France", code: 250 },
    { name: "GE", fullname: "Georgia", code: 268 },
    { name: "DE", fullname: "Germany", code: 276 },
    { name: "GH", fullname: "Ghana", code: 288 },
    { name: "GI", fullname: "Gibraltar", code: 292 },
    { name: "GR", fullname: "Greece", code: 300 },
    { name: "GG", fullname: "Guernsey", code: 831 },
    { name: "HK", fullname: "Hong Kong", code: 344 },
    { name: "HU", fullname: "Hungary", code: 348 },
    { name: "IN", fullname: "India", code: 356 },
    { name: "IQ", fullname: "Iraq", code: 368 },
    { name: "IE", fullname: "Ireland", code: 372 },
    { name: "IM", fullname: "Isle of Man", code: 833 },
    { name: "IL", fullname: "Israel", code: 376 },
    { name: "IT", fullname: "Italy", code: 380 },
    { name: "JP", fullname: "Japan", code: 392 },
    { name: "JE", fullname: "Jersey", code: 832 },
    { name: "JO", fullname: "Jordan", code: 400 },
    { name: "KZ", fullname: "Kazakstan", code: 398 },
    { name: "KE", fullname: "Kenya", code: 404 },
    { name: "KR", fullname: "Korea, Republic of", code: 410 },
    { name: "KW", fullname: "Kuwait", code: 414 },
    { name: "LV", fullname: "Latvia", code: 428 },
    { name: "LB", fullname: "Lebanon", code: 422 },
    { name: "LI", fullname: "Liechtenstein", code: 438 },
    { name: "LT", fullname: "Lithuania", code: 440 },
    { name: "LU", fullname: "Luxembourg", code: 442 },
    { name: "MY", fullname: "Malaysia", code: 458 },
    { name: "MT", fullname: "Malta", code: 470 },
    { name: "MU", fullname: "Mauritius", code: 480 },
    { name: "MX", fullname: "Mexico", code: 484 },
    { name: "MD", fullname: "Moldova, Republic of", code: 498 },
    { name: "MC", fullname: "Monaco", code: 492 },
    { name: "MA", fullname: "Morocco", code: 504 },
    { name: "NL", fullname: "Netherlands", code: 528 },
    { name: "NZ", fullname: "New Zealand", code: 554 },
    { name: "NG", fullname: "Nigeria", code: 566 },
    { name: "NO", fullname: "Norway", code: 578 },
    { name: "OM", fullname: "Oman", code: 512 },
    { name: "PK", fullname: "Pakistan", code: 586 },
    { name: "PS", fullname: "Palestinian Territory, Occupied", code: 275 },
    { name: "PA", fullname: "Panama", code: 591 },
    { name: "PG", fullname: "Papua New Guinea", code: 598 },
    { name: "PE", fullname: "Peru", code: 604 },
    { name: "PH", fullname: "Philippines", code: 608 },
    { name: "PL", fullname: "Poland", code: 616 },
    { name: "PT", fullname: "Portugal", code: 620 },
    { name: "QA", fullname: "Qatar", code: 634 },
    { name: "RO", fullname: "Romania", code: 642 },
    { name: "RU", fullname: "Russia Federation", code: 643 },
    { name: "SA", fullname: "Saudi Arabia", code: 682 },
    { name: "SC", fullname: "Seychelles", code: 690 },
    { name: "SG", fullname: "Singapore", code: 702 },
    { name: "SK", fullname: "Slovakia", code: 703 },
    { name: "SI", fullname: "Slovenia", code: 705 },
    { name: "ZA", fullname: "South Africa", code: 710 },
    { name: "ES", fullname: "Spain", code: 724 },
    { name: "SE", fullname: "Sweden", code: 752 },
    { name: "CH", fullname: "Switzerland", code: 756 },
    { name: "SY", fullname: "Syrian Arab Republic", code: 760 },
    { name: "TW", fullname: "Taiwan, Province of China", code: 158 },
    { name: "TH", fullname: "Thailand", code: 764 },
    { name: "TR", fullname: "Turkey", code: 792 },
    { name: "UA", fullname: "Ukraine", code: 804 },
    { name: "AE", fullname: "United Arab Emirates", code: 784 },
    { name: "GB", fullname: "United Kingdom", code: 826 },
    { name: "US", fullname: "United States", code: 840 },
    { name: "UY", fullname: "Uruguay", code: 858 },
    { name: "VG", fullname: "Virgin Islands, British", code: 92 },
    { name: "AF", fullname: "Afghanistan", code: 4 },
    { name: "AL", fullname: "Albania", code: 8 },
    { name: "DZ", fullname: "Algeria", code: 12 },
    { name: "AS", fullname: "American Samoa", code: 16 },
    { name: "AO", fullname: "Angola", code: 24 },
    { name: "AG", fullname: "Antigua and Barbuda", code: 28 },
    { name: "AM", fullname: "Armenia", code: 51 },
    { name: "AZ", fullname: "Azerbaijan", code: 31 },
    { name: "BD", fullname: "Bangladesh", code: 50 },
    { name: "BB", fullname: "Barbados", code: 52 },
    { name: "BY", fullname: "Belarus", code: 112 },
    { name: "BZ", fullname: "Belize", code: 84 },
    { name: "BJ", fullname: "Benin", code: 204 },
    { name: "BT", fullname: "Bhutan", code: 64 },
    { name: "BO", fullname: "Bolivia", code: 68 },
    { name: "BA", fullname: "Bosnia and Herzegovina", code: 70 },
    { name: "BW", fullname: "Botswana", code: 72 },
    { name: "BN", fullname: "Brunei Darussalam", code: 96 },
    { name: "BF", fullname: "Burkina Faso", code: 854 },
    { name: "BI", fullname: "Burundi", code: 108 },
    { name: "CV", fullname: "Cabo Verde", code: 132 },
    { name: "KH", fullname: "Cambodia", code: 116 },
    { name: "CM", fullname: "Cameroon", code: 120 },
    { name: "CF", fullname: "Central African Republic", code: 140 },
    { name: "TD", fullname: "Chad", code: 148 },
    { name: "CO", fullname: "Colombia", code: 170 },
    { name: "KM", fullname: "Comoros", code: 174 },
    { name: "CG", fullname: "Congo", code: 178 },
    { name: "CD", fullname: "Congo, Democratic Republic of the", code: 180 },
    { name: "CR", fullname: "Costa Rica", code: 188 },
    { name: "CI", fullname: "Côte d'Ivoire", code: 384 },
    { name: "CU", fullname: "Cuba", code: 192 },
    { name: "DJ", fullname: "Djibouti", code: 262 },
    { name: "DM", fullname: "Dominica", code: 212 },
    { name: "DO", fullname: "Dominican Republic", code: 214 },
    { name: "EC", fullname: "Ecuador", code: 218 },
    { name: "SV", fullname: "El Salvador", code: 222 },
    { name: "GQ", fullname: "Equatorial Guinea", code: 226 },
    { name: "ER", fullname: "Eritrea", code: 232 },
    { name: "SZ", fullname: "Eswatini", code: 748 },
    { name: "ET", fullname: "Ethiopia", code: 231 },
    { name: "FO", fullname: "Faroe Islands", code: 234 },
    { name: "FJ", fullname: "Fiji", code: 242 },
    { name: "GA", fullname: "Gabon", code: 266 },
    { name: "GM", fullname: "Gambia", code: 270 },
    { name: "GD", fullname: "Grenada", code: 308 },
    { name: "GT", fullname: "Guatemala", code: 320 },
    { name: "GN", fullname: "Guinea", code: 324 },
    { name: "GW", fullname: "Guinea-Bissau", code: 624 },
    { name: "GY", fullname: "Guyana", code: 328 },
    { name: "HT", fullname: "Haiti", code: 332 },
    { name: "VA", fullname: "Holy See", code: 336 },
    { name: "HN", fullname: "Honduras", code: 340 },
    { name: "IS", fullname: "Iceland", code: 352 },
    { name: "ID", fullname: "Indonesia", code: 360 },
    { name: "IR", fullname: "Iran", code: 364 },
    { name: "JM", fullname: "Jamaica", code: 388 },
    { name: "KI", fullname: "Kiribati", code: 296 },
    { name: "KP", fullname: "Korea (Democratic People's Republic of)", code: 408 },
    { name: "KG", fullname: "Kyrgyzstan", code: 417 },
    { name: "LA", fullname: "Lao People's Democratic Republic", code: 418 },
    { name: "LS", fullname: "Lesotho", code: 426 },
    { name: "LR", fullname: "Liberia", code: 430 },
    { name: "LY", fullname: "Libya", code: 434 },
    { name: "MO", fullname: "Macao", code: 446 },
    { name: "MG", fullname: "Madagascar", code: 450 },
    { name: "MW", fullname: "Malawi", code: 454 },
    { name: "MV", fullname: "Maldives", code: 462 },
    { name: "ML", fullname: "Mali", code: 466 },
    { name: "MH", fullname: "Marshall Islands", code: 584 },
    { name: "MR", fullname: "Mauritania", code: 478 },
    { name: "FM", fullname: "Micronesi", code: 583 },
    { name: "MN", fullname: "Mongolia", code: 496 },
    { name: "ME", fullname: "Montenegro", code: 499 },
    { name: "MZ", fullname: "Mozambique", code: 508 },
    { name: "MM", fullname: "Myanmar", code: 104 },
    { name: "NA", fullname: "Namibia", code: 516 },
    { name: "NR", fullname: "Nauru", code: 520 },
    { name: "NP", fullname: "Nepal", code: 524 },
    { name: "NI", fullname: "Nicaragua", code: 558 },
    { name: "NE", fullname: "Niger", code: 562 },
    { name: "MK", fullname: "North Macedonia", code: 807 },
    { name: "PW", fullname: "Palau", code: 585 },
    { name: "PY", fullname: "Paraguay", code: 600 },
    { name: "PR", fullname: "Puerto Rico", code: 630 },
    { name: "RE", fullname: "Réunion", code: 638 },
    { name: "RW", fullname: "Rwanda", code: 646 },
    { name: "KN", fullname: "Saint Kitts and Nevis", code: 659 },
    { name: "LC", fullname: "Saint Lucia", code: 662 },
    { name: "VC", fullname: "Saint Vincent and the Grenadines", code: 670 },
    { name: "WS", fullname: "Samoa", code: 882 },
    { name: "SM", fullname: "San Marino", code: 674 },
    { name: "ST", fullname: "Sao Tome and Principe", code: 678 },
    { name: "SN", fullname: "Senegal", code: 686 },
    { name: "RS", fullname: "Serbia", code: 688 },
    { name: "SL", fullname: "Sierra Leone", code: 694 },
    { name: "SB", fullname: "Solomon Islands", code: 90 },
    { name: "SO", fullname: "Somalia", code: 706 },
    { name: "SS", fullname: "South Sudan", code: 728 },
    { name: "LK", fullname: "Sri Lanka", code: 144 },
    { name: "SD", fullname: "Sudan", code: 729 },
    { name: "SR", fullname: "Suriname", code: 740 },
    { name: "TJ", fullname: "Tajikistan", code: 762 },
    { name: "TZ", fullname: "Tanzania", code: 834 },
    { name: "TL", fullname: "Timor-Leste", code: 626 },
    { name: "TG", fullname: "Togo", code: 768 },
    { name: "TO", fullname: "Tonga", code: 776 },
    { name: "TT", fullname: "Trinidad and Tobago", code: 780 },
    { name: "TN", fullname: "Tunisia", code: 788 },
    { name: "TM", fullname: "Turkmenistan", code: 795 },
    { name: "TV", fullname: "Tuvalu", code: 798 },
    { name: "UG", fullname: "Uganda", code: 800 },
    { name: "UZ", fullname: "Uzbekistan", code: 860 },
    { name: "VU", fullname: "Vanuatu", code: 548 },
    { name: "VE", fullname: "Venezuela", code: 862 },
    { name: "VN", fullname: "Viet Nam", code: 704 },
    { name: "YE", fullname: "Yemen", code: 887 },
    { name: "ZM", fullname: "Zambia", code: 894 },
    { name: "ZW", fullname: "Zimbabwe", code: 716 }
    ];
    for (var i = 0; i < countries.length; i++) {
        if (countries[i].code == ISO_value) {
            return countries[i];
        }
    }
    return null;
}