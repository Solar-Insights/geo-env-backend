# Development Lifecycle

The present section documents the ways Git is used during the development of the server.

### Ignored files

The `.gitignore` file is located at the root of the project. The file will be updated as the project evolves, but as a rule of thumb, it should include the following:

-   Dependency and build folders (e.g. `/node_modules/`, `/dist/`, `/build/` etc.)
-   Execution files (e.g. `.log`, `.tmp`, etc.)
-   Cached files (e.g. `.DS_store`)

The starting `.gitignore` of the project is based on Github's [Node .gitignore template](https://github.com/github/gitignore/blob/main/Node.gitignore).

### Commit names

The commit naming convention is heavily inspired by [Conventionnal Commits](https://www.conventionalcommits.org/en/v1.0.0/):

[Name] [Type]:[Description]\
[Optionnal body]\
[Optionnal footer]

-   Name : name of the person committing changes
-   Type : what is accomplished by the commit
    -   feature : adding or updating a feature
    -   fix : correcting a bug
    -   chore : maintenance that does not add a feature, solve a bug, or touch any src or test files (e.g. updating dependencies)
    -   refactor : refactoring that does not add a feature, or solve a bug (e.g. linting)
    -   docs : updating the documentation
    -   test : adding, updating, or deleting any of the project's tests
    -   perf : increasing the performance of the project's code
    -   ci : anything related to continuous integration
    -   build : change affecting the building process or external dependencies
    -   revert : revert changes from a previous commit
-   Description : short description of the committed changes
-   Body : detailed description of the committed changes (e.g. for large features or refactor jobs)
-   Optionnal footer : reference to issues, pull-requests or other changes

### Branching startegy

The branching strategy used in this project is very similar to Git Flow. There two main branches: `main` and `develop`.

-   `main`: contains officially integrated and deployable code
-   `develop`: serves as the integration branch for features

Every feature has its own branch named `feature/{name-of-feature}`, and is based on `develop`. Once the feature is implemented, its branch is merged with develop. Finally, when the develop branch contains all desired features and they are tested, it is merged with the main branch. Change/integration requests (pull request/merge request) occur whenever a feature is ready to be integrated into the develop branch and when the develop branch is ready to be integrated into the main branch.
