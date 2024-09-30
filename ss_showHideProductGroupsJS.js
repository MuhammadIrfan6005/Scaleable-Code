// Written By Nadeem Hasan
//==========================================================================================
function ShowHideProductGroups(executionContext) {
    var formContext = executionContext.getFormContext();


    if (formContext.getAttribute("ss_productmaincategory") && formContext.getControl("ss_crmproductgroups")) {

        var control = formContext.getControl("ss_crmproductgroups");

        control.clearOptions();
        var mainGroup = formContext.getAttribute("ss_productmaincategory").getValue();
        if (mainGroup == 1) {
            control.addOption({ value: 5, text: "Contact Manager" });
            control.addOption({ value: 16, text: "Regulatory & News" });
            control.addOption({ value: 28, text: "EQS IR Cockpit" });

        }
        else if (mainGroup == 2) {
            control.addOption({ value: 2, text: "App" });
            control.addOption({ value: 9, text: "IR Website" });
            control.addOption({ value: 6, text: "Corp Web & Micro" });
            control.addOption({ value: 4, text: "Charts & Invest. Calc." });
            control.addOption({ value: 7, text: "Fact Sheet" });
            control.addOption({ value: 11, text: "Newsfeed" });
            control.addOption({ value: 14, text: "Portal Network" });
            control.addOption({ value: 15, text: "Quick Analyzer" });
            control.addOption({ value: 13, text: "Others" });
            control.addOption({ value: 18, text: "Video Webcast" });
            control.addOption({ value: 3, text: "Audio Webcast" });
            control.addOption({ value: 17, text: "Telco" });
            control.addOption({ value: 12, text: "Online Report" });
        }
        else if (mainGroup == 3) {
            control.addOption({ value: 8, text: "Insider Manager" });
            control.addOption({ value: 20, text: "Integrity Line" });
            control.addOption({ value: 22, text: "Policy Manager" });
            control.addOption({value: 29, text: "Compliance Cockpit Applications"});
            control.addOption({ value: 30, text: "Compliance Cockpit Addon" });
            control.addOption({ value: 31, text: "Others" });
            control.addOption({ value: 32, text: "C2S2" });

        }
        else if (mainGroup == 4) {
            control.addOption({ value: 19, text: "XML Conversion" });
            control.addOption({ value: 10, text: "LEI" });
            control.addOption({ value: 21, text: "Translation" });
            control.addOption({ value: 24, text: "XML PR Cockpit" });
            control.addOption({ value: 25, text: "XML Konzerngesellschaften ( Töchter)" });
            control.addOption({ value: 26, text: "XML Konzern" });
            control.addOption({ value: 27, text: "XML Fonds" });
        }
        else if (mainGroup == "" || mainGroup == null) {
            showAllOptions(control);
        }

    }


}

function showAllOptions(control) {
    control.addOption({ value: 22, text: "Policy Manager" });
    control.addOption({ value: 23, text: "K3/K4" });
    control.addOption({ value: 5, text: "Contact Manager" });
    control.addOption({ value: 16, text: "Regulatory & News" });
    control.addOption({ value: 1, text: "Media Plan" });
    control.addOption({ value: 2, text: "App" });
    control.addOption({ value: 9, text: "IR Website" });
    control.addOption({ value: 6, text: "Corp Web & Micro" });
    control.addOption({ value: 4, text: "Charts & Invest. Calc." });
    control.addOption({ value: 7, text: "Fact Sheet" });
    control.addOption({ value: 11, text: "Newsfeed" });
    control.addOption({ value: 14, text: "Portal Network" });
    control.addOption({ value: 15, text: "Quick Analyzer" });
    control.addOption({ value: 13, text: "Others" });
    control.addOption({ value: 18, text: "Video Webcast" });
    control.addOption({ value: 3, text: "Audio Webcast" });
    control.addOption({ value: 17, text: "Telco" });
    control.addOption({ value: 12, text: "Online Report" });

    control.addOption({ value: 8, text: "Insider Manager" });
    control.addOption({ value: 20, text: "Integrity Line" });
    control.addOption({value: 29, text: "Compliance Cockpit Applications"});
    control.addOption({ value: 30, text: "Compliance Cockpit Addon" });
    control.addOption({ value: 31, text: "Others" });
    control.addOption({ value: 32, text: "C2S2" });

    control.addOption({ value: 19, text: "XML Conversion" });
    control.addOption({ value: 10, text: "LEI" });
    control.addOption({ value: 21, text: "Translation" });

    control.addOption({ value: 24, text: "XML PR Cockpit" });
    control.addOption({ value: 25, text: "XML Konzerngesellschaften ( Töchter)" });
    control.addOption({ value: 26, text: "XML Konzern" });
    control.addOption({ value: 27, text: "XML Fonds" });


}

function showOptionsRelatedToMainGroup(executionContext) {
    var formContext = executionContext.getFormContext();
    if (formContext.getAttribute("ss_productmaincategory") && formContext.getControl("ss_crmproductgroups")) {

        var control = formContext.getControl("ss_crmproductgroups");

        var mainGroup = formContext.getAttribute("ss_productmaincategory").getValue();
        if (mainGroup == 1) {
            control.removeOption(1);
            control.removeOption(2);
            control.removeOption(3);
            control.removeOption(4);
            control.removeOption(6);
            control.removeOption(7);
            control.removeOption(8);
            control.removeOption(9);
            control.removeOption(10);
            control.removeOption(11);
            control.removeOption(12);
            control.removeOption(13);
            control.removeOption(14);
            control.removeOption(15);
            control.removeOption(17);
            control.removeOption(18);
            control.removeOption(19);
            control.removeOption(20);
            control.removeOption(21);
            control.removeOption(22);
            control.removeOption(23);

            control.removeOption(24);
            control.removeOption(25);
            control.removeOption(26);
            control.removeOption(27);
            control.removeOption(29);
            control.removeOption(30);
            control.removeOption(31);
            control.removeOption(32);

        }
        else if (mainGroup == 2) {
            control.removeOption(1);
            control.removeOption(5);
            control.removeOption(8);
            control.removeOption(10);
            control.removeOption(19);
            control.removeOption(20);
            control.removeOption(21);
            control.removeOption(22);
            control.removeOption(23);
            control.removeOption(24);
            control.removeOption(25);
            control.removeOption(26);
            control.removeOption(27);
            control.removeOption(29);
            control.removeOption(30);
            control.removeOption(31);
            control.removeOption(32);

        }
        else if (mainGroup == 3) {

            control.removeOption(1);
            control.removeOption(2);
            control.removeOption(3);
            control.removeOption(4);
            control.removeOption(5);
            control.removeOption(6);
            control.removeOption(7);
            control.removeOption(9);
            control.removeOption(10);
            control.removeOption(11);
            control.removeOption(12);
            control.removeOption(13);
            control.removeOption(14);
            control.removeOption(15);
            control.removeOption(16);
            control.removeOption(17);
            control.removeOption(18);
            control.removeOption(19);
            control.removeOption(21);
            //control.removeOption(22);
            control.removeOption(23);
            control.removeOption(24);
            control.removeOption(25);
            control.removeOption(26);
            control.removeOption(27);

        }
        else if (mainGroup == 4) {
            control.removeOption(1);
            control.removeOption(2);
            control.removeOption(3);
            control.removeOption(4);
            control.removeOption(5);
            control.removeOption(6);
            control.removeOption(7);
            control.removeOption(8);
            control.removeOption(9);
            control.removeOption(11);
            control.removeOption(12);
            control.removeOption(13);
            control.removeOption(14);
            control.removeOption(15);
            control.removeOption(16);
            control.removeOption(17);
            control.removeOption(18);
            control.removeOption(20);
            control.removeOption(22);
            control.removeOption(23);
            control.removeOption(29);
            control.removeOption(30);
            control.removeOption(31);
            control.removeOption(32);
        }
    }
}
