Feature: Authentication

  Scenario: User login
    Given the user is on the login page
    When the user enters valid credentials
    And submits the form
    Then the user should be redirected to the dashboard
    And should see a welcome message
