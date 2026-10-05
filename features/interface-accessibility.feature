Feature: Interface Accessibility

  Scenario: Navigate using keyboard
    Given the user is on any page
    When the user navigates using the Tab key
    Then all interactive elements should be reachable
    And focus states should be clearly visible
