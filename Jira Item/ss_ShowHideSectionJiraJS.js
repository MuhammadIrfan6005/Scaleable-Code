function ShowHideSectionJira(executionContext) {
    var formContext = executionContext.getFormContext();
    var new_issuetype = formContext.getAttribute("new_issuetypeid").getValue();
    var issuetype = "";
    if (new_issuetype !== null) {
        issuetype = new_issuetype[0].name;
        if (issuetype === "Policy Manager" || issuetype === "Approval Manager" || issuetype === "Single Sign-On" || issuetype === "Data Sync") {
            makegeneralfieldreadonly(formContext);
            formContext.ui.tabs.get("jira_template_tab").sections.get("jira_template_section").setVisible(false);
            formContext.ui.tabs.get("jira_template_tab").sections.get("jira_template_tab_section_2").setVisible(false);
        }
        else if (issuetype === "New Integrity Line (GE)") {
            makegeneralfieldreadonly(formContext);
            formContext.ui.tabs.get("jira_template_tab").sections.get("jira_template_tab_section_2").setVisible(false);
        }
        else if (issuetype === "Classic Integrity Line (IL)") {
            makegeneralfieldreadonly(formContext);
            formContext.getControl("new_specificationofaddmoduleother").setVisible(false);
            formContext.getControl("new_gotehicsplatformlink").setVisible(false);
            formContext.getControl("new_gotethicshosting").setVisible(false);
            formContext.getControl("new_furtherdetails").setVisible(false);
            formContext.getControl("new_gotethicspackage").setVisible(false);
        }
    }
}
function makegeneralfieldreadonly(formContext) {
    formContext.getControl("new_issuetypeid").setDisabled(true);
    //formContext.getControl("new_opportunityid").setDisabled(true);
    //formContext.getControl("new_opportunityproductid").setDisabled(true);
    formContext.getControl("new_name").setDisabled(true);
}