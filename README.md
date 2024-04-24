# geo-env-backend

geo-env-backend is an Express + TypeScript project aiming to provide an easy-to-use and easy-to-setup server-template for developpers wanting to use geographic and solar data. The first version of the project is still under development and uses solely the different Google APIs.

The project's default settings forces the use of Auth0 authentication for every route. This means the server will refuse any request that does not bear an Auth0 token. This is achieved with the `withAuth()` method in `@/index.ts`. Also, the `authRequiredPermissions` is applied to pretty much every route, and requires the user to have specific Auth0 user permissions to access them.

Thus, before starting to use the server, you will need to create an Auth0 account, add an API to your application, and follow their tutorials for setting up a project. See the next section to understand the environnment variables used at runtime and for testing.

## Running the Express server

The following section describes a step-by-step guide to launch your server locally, for testing and development purposes.

1. Install all dependencies using `npm install`
2. In a `.env` file at the route of the project, setup all the variables found inside the `src/config.ts` file
    - `PORT` can be skipped to let the OS select the appropriate port for the server
    - `GOOGLE_KEY` should have authorisation to use the Geocoding, Places and Solar API for all routes to be available. For local use, application restriction is not absolutely required, **as long as you keep your API key secure**. For production use, see the next section regarding deployment
    - `BACKEND_URL` is a variable used by AUTH0 to identify where your backend is served (IIRC, it can be pretty much anything, and does not even need to be valid)
    - `AUTH0_BASE_URL` is the URL used by your Auth0 team to authenticate user
    - `AUTH0_TESTING_CLIENT_ID` and `AUTH0_TESTING_CLIENT_SECRET` are credentials used by Auth0 to generate tokens of logged-in users
3. Run `npm run start`
4. HTTP requests can now be sent to the routes provided in `src/routes/*` to retrieve data
5. A `500` status will be returned if any of the 3rd party API encounters an error. Otherwise, middlewares will validate authentication and data, while logging everything that is relevant.

## Use the Express Server without authentication

The server was developped with thinking that authentication was mandatory. If you wish to completely remove Auth0 authentication from the project, here are a list of steps you should take:

-   In the `@/index.ts` file, remove the `withAuth()` middleware that is added to the app on startup
-   In every route, remove the `authRequiredPermissions(...)` middleware that is called every navigation
-   In the test files, remove the `.set('Authorization', Bearer ${token})` attribute for the SuperTest calls
-   In the test files, remove the call to `await getAuthTokenForTest()`
-   Remove any test related to authentication
