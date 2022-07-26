<h1 align="center">
    Cine
</h1>

# Index

- [Description](#-Project-description)

- [Documentation](#-Documentation)

- [Technologies used](#-Technologies-used)

- [Run API](#-Run-API)

- [Unit Test](#-Unit-Test)

---

## 🖋 Project description

The project follows the NestJs monorepo standard and should be able to create a user and login. In addition to viewing, editing, creating and deleting movie posters for a cinema. You can only access the ```Movies``` api by logging into the ```Authentication``` api.

---

## Documentation

To access the ```Authentication``` and ```User Registration``` documentation, go to:

```
http://localhost:8080/docs
```
To access the ```Movies``` go to:

```
http://localhost:3030/docs
```
---

## 🚀 Technologies used

The project was developed using the following technologies:

- [NestJs](https://docs.nestjs.com/)
- [Microsservices](https://docs.nestjs.com/techniques/serialization#websockets-and-microservices)
- [Swagger](https://docs.nestjs.com/openapi/introduction)
- [Postgresql](https://www.postgresql.org/docs/)
- [TypeORM](https://typeorm.io/)


---

## 💾 Run API

- First install the [Git](https://git-scm.com/), [Node.jS](https://nodejs.org/pt-br/download/) + [npm](https://www.npmjs.com/get-npm)
```bash
# clone the repository
git clone https://github.com/Isabelar07/auth-and-cine.git

# enter directory
cd auth-and-cine

# enter the branch
git checkout master

# install dependencies
npm install

# run api auth
npm run start:dev auth

# run api cine/crud movies
npm run start:dev
```

## Unit Test

to run the tests run the command:

``` npm run test```

---

** OBS

what still needs to be done:

Authentication unit tests and create user
