Feature: Search Filters and Pagination

  Scenario: Filter and paginate requests
    Given the user is on the requests list
    When the user applies a filter
    And navigates to the next page
    Then the displayed requests should match the filter
    And should show the next set of results
