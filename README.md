# Echo – text-based blog app

## Overview

**Echo** is a text based blog app where you can share, like and comment posts while
navigating a minimalistic UI. In individual profile sections you can view all
posts done by the person and in the future likes and comments will be visible as
well.

[Check it out here! (live demo)](https://echo-fullstack-blog-app.onrender.com)

This app showcases my skills in **fullstack programming** and enthusiasm towards
creating a polished project.

Project is done as a part of learning on a second year fullstack course in
Tampere University of Applied Sciences.

## Build status

Every push of commits to GitHub is done considering that the app is working, but
not all individual commits contain a working project.
Stable releases with realised functionalities are better found in releases.

## Screenshots

![image](./screenshots/home-page.png)
(Home page)
![image](./screenshots/post-view.png)
(Individual post view)
![image](./screenshots/profile-view.png)
(Profile view, desciprtion and switching between posts, likes and comments not implemented)

## Tech

- **Express.js**
- **Node.js**
- **PostgreSQL** on Render.com server
- **Docker**
- **React (Vite)**
- **JSDoc**
- **Passport** + **Session** + **bcrypt**
- **Joi**

## Link to the deployed project

[Check it out here!](https://echo-fullstack-blog-app.onrender.com)

## Features

- All **posts** visible in the home page with the latest **comment** showcased
  directly under it
- Individual **post** view when clicking on a post to see all comments
- **Likes** to show appreciation for a post
- **Editing a post** directly in a post card
- **Profile view** to view all posts, likes and comments made by user (still in development)
- **Description** can be edited in profile to showcase to other users (opening other profiles in development still)
- **Authentication, login and registration** with Passport, Session and Bcrypt. No one can change other persons data
- **Input validation with JOI**
- **Descriptive error messages** (not yet visible in frontend)

## Installation

1. Open a terminal and go to the `container` folder:
   ```
   cd container
   ```
2. Install dependencies for both frontend and backend:
   ```
   npm install
   ```
3. Start the app locally:
   ```
   npm run start
   ```

This runs the frontend with Vite and the backend together.

> For local database configuration, copy `container/backend/.env.example` to
> `container/backend/.env` and fill in your database values. Session secret can
> be randomly generated

## Database structure

```

        /---------------------\       /---------------------------------\
        | **users**           |       |        /--------------------\   |
    /-->| id          (PK)    |<------/        | **comments**       |   |
    |   | username            |                | id          (PK)   |   |
    |   | password            |                |                    |   |
    |   | description         |                |                    |   |
    |   \---------------------/          /---->| post_id     (FK)   |   |
    |                                    |     | user_id     (FK)   |---|
    |                                    |     | body               |   |
    |   /---------------------\          |     | created_at         |   |
    |   | **posts**           |          |     \--------------------/   |
    |   | id          (PK)    |<---------|                              |
    |   | user_id     (FK)    |          |     /--------------------\   |
    |   | body                |          |     | **likes**          |   |
    \---| created_at          |          \---->| post_id    (FK)    |   |
        \---------------------/                | user_id    (FK)    |---/
                                               \--------------------/
```

## AI Usage & Tutorial help

AI has been used through this project for debugging purposes especially in frontend
and searching for typos in routing. AI has been also used to describe concepts and
to help with SQL join queries.
While creating authentication logic AI was used to explain the theme and tools
available.

Tools used:

- ChatGPT
- GitHub Copilot

During creation of authentication, login and registering logic these tutorials
and articles were helpful:

- [Video I ended up using the most. Passport + Session + Bcrypt](https://www.youtube.com/watch?v=-RCnNyD0L-s&list=LL&index=3)
- [Another video that was helpful to understand the context](https://www.youtube.com/watch?v=nI8PYZNFtac&list=LL&index=5&t=532s)
- [Article I used to understand React and Passport interaction](https://www.freecodecamp.org/news/react-passport-authentication/)
