Feature: sections

     @<product> @android @manual @ios @jira.cv.14.5 @mobile
    @qa @smoke @w@qa @smoke @webapp
  Scenario Outline: A user can see a page with several sections
                To be executed in QA
    Given               the "Sections Modular Page" modular page has been configured in CMS with "2" sections
And the "Action Row" module is configured in CMS in the section "0" of the "Sections Modular Page" page
      And the "Action Row" module is configured in CMS in the section "1" of the "Sections Modular Page" page
            And user is in the "Sections Modular Page" modular page
     Then the "action_row_section_0" module is displayed
      And the "action_row_section_1" module is displayed

  Examples:
    | product | 
          | vivobr          | 
          | o2uk      | 
          | moves   | 
