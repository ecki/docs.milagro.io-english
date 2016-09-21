# Conribution guide

## Before coding


Before starting to work on something file an issue (or claim an existing issue).

Significant changes must go through the change proposal process (TODO: TBD) before they can be accepted.
This process gives everyone a chance to validate the design, helps prevent duplication of effort, and ensures that the idea fits inside the goals of the project. It also checks that the design is sound before code is written; the code review tool is not the place for high-level discussions.

### TODO: Change proposal process

- Could be in a form of an Github issue (with specific label - Proposal) or as a tread in the mailing list followed with issue summarizing the problem and the final solution.


## Git

### Work-flow

- Fork repository
- Create feature branch (from master branch)
- Commit changes in branch
- Push
- Create pull request

### Commits and pull requests

 Commit messages are important in every project, but they are especially important in open source projects when lots of people contribute to the project.
 Commit messages are important for ease of reviewing the history of the project, for finding bugs (git bisect) and much more.

 So, some rules:
 - Changes on one commit should be logically related. If there is a need for refactoring, it should be in separate commit. This makes code reviews more readable.
 - Commit messages should be structured - subject, blank line, description. [template](contribution/.gitcommit)
 	- Subject:
 		- should summarize what the commit does
 		- should start with capital letter and not end with a period
 		- should be in present-tense, imperative-style ("change", not "changes" or "changed")
 		- should be limited to 50 characters
 		- if the project has multiple components, prefix the subject with identifier of the component. e.g. ("api: Add authentication end point")
 	- Description:
 		- should be wrapped in 72 characters - can be multiple lines each with length limited to 72 characters
 		- should explain what and why not how
 		- should end with references to issues (Closes #XXXX or Fixes #XXXX)
 - Pull/Merge requests
 	- should consist of logical units of work (preferably one). It is OK to make many small commits while developing, but before pull request is merged into master - they should be squashed into logical units of work using `git rebase -i` and `git push -f`.
 	- tests should be passing in each commit of the pull request, not just the last one.
 	- one piece of code should be changed only once in one pull request unless there is reason for the opposite like refactoring.
 	- pull requests must be cleanly rebased on top of master without multiple branches mixed into the pull request.
 	- documentation should be in the same pull request as the feature.
 - .gitignore should contain patterns relevant to the project. For everything else use [global .gitignore](https://help.github.com/articles/ignoring-files/#create-a-global-gitignore)

### TODO: Change logs OPTIONAL

We can generate Change logs from commit messages.


## Testing

- Code should be reasonably test covered.
- It should be obvious what a test is testing.
- 100% coverage does not mean code is well tested. Test should cover specific use case, not be just so those rows are covered!
- When refactoring avoid changing tests. They should run the same way before and after the refactoring.
- Run the full test suite before submitting a pull request.
