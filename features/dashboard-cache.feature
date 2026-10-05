Feature: Dashboard Cache

  Scenario: Retrieve cached dashboard data
    Given the dashboard data is cached
    When the user navigates to the dashboard
    Then the data should load quickly from cache
    And should match the latest state
