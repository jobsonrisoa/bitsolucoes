Feature: Motion Vocabulary

  Scenario: Consistent animations
    Given the user interacts with the UI
    When an element appears or disappears
    Then the animation should follow the motion vocabulary guidelines
    And should be smooth and performant
