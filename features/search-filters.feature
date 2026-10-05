Feature: Search, filters and pagination
  Scenario: Combine filters
    When I filter by category "TI", status "Aberto" and title containing "monitor"
    Then only requests matching all three criteria are returned
  Scenario: Period filter is inclusive
    When I filter from 2026-10-01 to 2026-10-02
    Then requests created on both boundary days are included
  Scenario: Paginate results
    Given 25 requests exist
    When I request page 2 with limit 10
    Then I receive 10 items, total 25, and total pages 3
