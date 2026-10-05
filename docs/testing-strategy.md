# Testing Strategy

## Test Pyramid

- **Unit Tests**: Test individual functions and classes in isolation.
- **Integration Tests**: Test the interaction between components (e.g., API endpoints and the database).
- **E2E Tests**: Test the entire system from the perspective of the user, simulating real browser interactions.

## Tools

- **Unit/Integration**: Jest (Backend), Vitest (Frontend)
- **E2E**: Playwright / Cypress
- **Load Testing**: k6

## Thresholds

- Unit test coverage: > 80%
- Integration test coverage: > 70%

## BDD Mapping

Feature files located in the `features/` directory serve as the source of truth for acceptance criteria. These Gherkin scenarios are mapped to automated E2E tests using tools like Cucumber.js or directly implemented in Playwright.
