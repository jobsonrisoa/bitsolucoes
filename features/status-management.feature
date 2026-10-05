Feature: Status Management

  Scenario: Update request status
    Given the user is viewing a request
    When the user changes the status
    And saves the changes
    Then the request status should be updated
    And a notification should be sent
