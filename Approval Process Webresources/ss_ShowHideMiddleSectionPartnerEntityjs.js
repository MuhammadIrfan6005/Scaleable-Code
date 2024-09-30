function ShowHideMiddleSection(excutionContext) {
    var formContext = excutionContext.getFormContext();
    var activestage = formContext.data.process.getActiveStage().getName();
    if(activestage === "Presentation & Contract") {
        formContext.ui.tabs.get("general_tab").sections.get("middle_section").setVisible(true);
        
    }
}