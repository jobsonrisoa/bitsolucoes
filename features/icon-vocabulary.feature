Feature: Icon Vocabulary

  Scenario: Consistent iconography
    Given the user views the interface
    When an icon is displayed
    Then the icon should belong to the standard icon set
    And should match the visual style of the application
