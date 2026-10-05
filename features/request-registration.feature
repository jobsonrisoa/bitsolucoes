Feature: Request Registration

  Scenario: Create a new request
    Given the user is on the dashboard
    When the user clicks "New Request"
    And fills in the request form
    And submits the form
    Then the request should be created
    And the user should see a success message
