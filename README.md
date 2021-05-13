# express-mods-server

This is the back end repo for my Express Mods project. 

## Tech Stack
This project uses Node.js and Express to implement a GraphQL API with a PostgreSQL database. It's written entirely in Typescript, and it combines type-graphql and TypeORM to obtain a single source of truth for both GraphQL Schema definitions and database entities.

## Features
The API has fully-functioning CRUD operations, one-to-many and many-to-many relations set up with the ability to allow users to 'like' mods, user authentication & authorization using cookies and storing sessions in Redis, cursor-based pagination for displaying all mods, and a functioning password reset flow.
