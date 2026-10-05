Feature: Dashboard and cache
  Scenario: Counters reflect the data
    Given 5 Aberto, 3 Em Atendimento and 2 Concluído requests
    Then the dashboard shows Total 10, Abertas 5, Em atendimento 3, Concluídas 2
  Scenario: Dashboard is fresh after a write
    Given the dashboard was loaded and cached
    When I create a new request
    Then the next dashboard load shows the new totals
  Scenario: System works without Redis
    Given Redis is unavailable
    When I list requests
    Then I receive correct results from the database
