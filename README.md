# Project

geo-env-backend is an Express + TypeScript project aiming to provide an easy-to-use and easy-to-setup server-template for developpers wanting to use geographic, solar and air-quality data. The first version of the project is still under development and uses solely the different Google APIs.

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
