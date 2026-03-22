# Echo – full stack blog app

A project made for a TAMK-fullstack course. Featuring:

- express
- node.js
- docker
- react

This README will be updated later during this project.

## ONRENDER LINK

[check the deployed progress here](https://echo-fullstack-blog-app.onrender.com)

## DATABASE STRUCTURE

```

        /---------------------\       /---------------------------------\
        | **users**           |       |        /--------------------\   |
    /-->| id          (PK)    |<------/        | **comments**       |   |
    |   | username            |                | id          (PK)   |   |
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
