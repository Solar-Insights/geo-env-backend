# Solar backend
Solar-backend is an Express + TypeScript project aiming to provide an easy-to-use and easy-to-setup server-template for developpers wanting to use geographic, solar and air-quality data. The first version of the project is still under development and uses solely the different Google APIs. 

# Running the Express server
The following section describes a step-by-step guide to launch your server locally, for testing and development purposes. 

1. Install all dependencies using `npm install`
2. In a `.env` file at the route of the project, setup all the variables found inside the `src/config.ts` file
   - The `GOOGLE_KEY` should have authorisation to use the Air Quality, Geocoding, Places and Solar API for all routes to be available. For local use, application restriction is not absolutely required, **as long as you keep your API key secure**. For production use, see the next section regarding deployment
3. Run `npm run start`
4. HTTP requests can now be sent to the routes provided in `src/routes/*` to retrieve data
5. A `500` status will be returned if an error was encountered at any point during the request

# Deploy the Express server
The following section describes **an extremely simplified way** of deploying your server using Heroku. Before making the server accessible to the public, you need to make sure that your code is functionnal and safe, but also that any credentials are properly secured. This **step-by-step process should not be followed blindfully**, as deploying a server can be costly, especially if security is considered lightly. 

1. Create a new application on the `Heroku` console and assign it the ressources needed to operate the server
2. In the `Deploy` tab, under `Deployment method` use GitHub to connect to the repository that contains the server
3. Under `Automatic deploys`, you can activate Automatique Deploys on a certain branch if any change to the said branch should automatically be put in production
4. If Automatique Deploys are not activated, manually deploy the wanted branch under `Manual Deploy`
5. Since `.env` files should not be put into repositories, go in the `Settings` tab and under `Config Vars` to setup your environnement variables. These should use the same names as the ones found inside the `src/config.ts` file. Make sure you use the right credentials with application restrictions to make sure only your endpoint can use the credentials
6. Deploy the server
7. HTTP requests can now be sent to the routes provided in `src/routes/*` to retrieve data. Make sure to make request to the right endpoint. Your domain can be found in the `Settings` tab and under `Domains`


# Development Lifecycle
The present section documents the ways Git is used during the development of the server.

### Commit names
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
There two main branches: `main` and `develop`.

-   `main`: contains officially integrated and deployable code
-   `develop`: serves as the integration branch for features

Every feature has its own branch named `feature/{name-of-feature}`, and is based on `develop`. Once the feature is implemented, its branch is merged with develop. Finally, when the develop branch contains all desired features and they are tested, it is merged with the main branch. Change/integration requests (pull request/merge request) occur whenever a feature is ready to be integrated into the develop branch and when the develop branch is ready to be integrated into the main branch.
