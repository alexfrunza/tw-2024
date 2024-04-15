
# AcVis (Actors Smart Visualiser)

## Contents

1. [Authors](#authors)

2. [Introduction](#introduction)
    
    1. [Purpose](#purpose)

    2. [Document convention](#document-convention)

    3. [Target audience](#target-audience)

    4. [The purpose of the application](#the-purpose-of-the-application)

    5. [Bibliography and references](#bibliography-and-references)

3. [General description](#general-description)

4. [Application Interface](#application-interface)
    
    1. [User interface](#user-interface)

5. [Characteristics of the application](#characteristics-of-the-application)
    
     1. [Session management](#session-management)
 
         1. [Description](#description)
 
         2. [Data flow](#data-flow)
 
         3. [Requirements and constraints](#requirements-and-constraints)
 
     2. [Other functionalities](#other-functionalities)
 
         1. [Description](#description)
 
         2. [Data flow](#data-flow)
 
         3. [Requirements and constraints](#requirements-and-constraints)


## Authors

Students in 2nd at UAIC, Faculty of Computer Science, group B4

- Frunză Alexandru-Ioan - [alex@alexfrunza.com](mailto:alex@alexfrunza.com)

- Ștefan Vlad - [vladstefan303@gmail.com](mailto:vladstefan303@gmail.com)

## Introduction

### Purpose
 
### Document convention
 
### Target audience
 
### The purpose of the application
 
### Bibliography and references

## General description

## Application Interface

### User Interface

## Characteristics of the application

### Session management

#### Description

- The application will have a session management system that will allow users to log in and log out.

- The session management system will be implemented using JWT tokens.
 
- The session management system will have a timeout of 30 minutes.

#### Data flow

- The user will log in using the login form.

- The server will validate the user's credentials.

- The server will generate a JWT token and send it to the user.

- The user will store the token in the local storage.

- The user will send the token in the header of each request.

#### Requirements and constraints

- The user must have an account to log in.

- The user must have a valid email and password to log in.
 
- The user must have a valid JWT token to access the application.

### Other functionalities

#### Description

- The application will crawl the movie database and get the latest movies.

- The application will allow users to search for actors and movies.

- The application will allow users to see the details of an actor or a movie.

- The application will allow users to see the connections between actors and movies.

#### Data flow

- The user will search for an actor or a movie.

- The application will send a request to the server.

- The server will search for the actor or movie in the database.

- The server will send the results to the user.

- The user will see the results on the screen.

#### Requirements and constraints

- The user must have an internet connection to use the application.

- The user must have a valid JWT token to access the application.

- The user must have an account to log in.


## Technologies for protection and security

### Description

- The application will encrypt the user's password before storing it in the database.

#### Data security

- Authorization is done with JWT tokens.

- Passwords are hashed with argon2.

- The application is using prepared statements to prevent SQL injection.

#### Software qualities

- The application is using a layered architecture to separate concerns.

- The application is using a RESTful API to separate the client from the server.

- The application is using a JWT token to authenticate users.
 
 

 

