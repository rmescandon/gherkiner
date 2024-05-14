Feature: sections

     @<product> @android @manual @ios @jira.cv.14.5 @mobile
    @qa @smoke @w@qa @smoke @webapp
  Scenario Outline: A user can see a page with several sections
                A dummy example for testing purposes
    Given               the "Sections" modular page has been configured in CMS with "2" sections
And the "Module" module is configured in CMS in the section "0" of the "Sections" page
      And the "Module" module is configured in CMS in the section "1" of the "Sections" page
            And user is in the "Sections" modular page
     Then the "action_row_section_0" module is displayed
      And the "action_row_section_1" module is displayed

  Examples:
    | product | 
          | brand1          | 
          | brand2      | 
          | the last brand   | 
