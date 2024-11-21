# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. For this project an express server was created to run an API and interact with a database that was made with MongoDB. Models for a user and clothingItem were made so that controllers for the users and clothingItems documents in the database could edit their respective documents. They were then routed to the server using routing. Errors where handled by having requirments and validators set up in the models and error catchers in the controllers. An authorization middleware was created so that users can be authenticated and authorized.

## Tech Used

- Express Server
- MongoDB
- routers
- controllers
- mongoose schemas and models
- authorization middleware

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature
