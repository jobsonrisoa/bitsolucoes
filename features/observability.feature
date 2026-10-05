Feature: Observability

  Scenario: Log application events
    Given the application is running
    When an error occurs
    Then an error log should be generated
    And the log should include contextual information
