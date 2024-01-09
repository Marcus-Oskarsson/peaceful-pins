Feature: Friends list

There should be a list of friends with their name and image on the profile page of each user.

Scenario: On render
  Given I'm visiting the profile page
  When The page loads
  Then Client sends a request for users friends

Scenario: On response
  Given I'm visiting the profile page
  When The page loads
  Then A list of the users friends are shown