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

- The purpose of this application is to create a flexible web-based tool for visualizing data related to actor
  nominations
  for the Screen Actors Guild (SAG) Awards. This will be achieved through a custom-developed REST/GraphQL API.
  Additional
  information about each actor and their film productions will be fetched from The Movie Database (TMDb). The
  application
  will generate statistics and visualizations in at least three different ways. Users will have the ability to export
  these visualizations in CSV, WebP, and SVG formats. The system will also support displaying news related to each
  nominated actor, sourced from configurable external data feeds within the developed application. Additional resources
  related to data visualization will be provided within the application.

### Document convention

- This document is written in Markdown format. The document is structured in sections, each section containing a title
- This document follows the template for software requirements documentation according to the IEEE Software Requirements
  Specification.

### Target audience

- The target audience for this application encompasses a broad range of users. Entertainment industry professionals,
  such as casting directors, producers, agents, and filmmakers, will find the tool valuable for tracking actor
  nominations for the SAG Awards and gathering additional information about actors and their film productions. Movie
  enthusiasts and fans who want to stay updated with the latest nominations, news, and statistics related to their
  favorite actors and movies will also benefit from the application.

### The purpose of the application

- The purpose of this application is to create a flexible web-based tool for visualizing data related to actor
  nominations for the Screen Actors Guild (SAG) Awards. This visualization is achieved through a custom-developed
  REST/GraphQL API. Additionally, the application fetches additional information about each actor and their film
  productions from The Movie Database (TMDb).

- The application aims to generate statistics and visualizations in at least three different formats. Users will have
  the ability to export these visualizations in CSV, WebP, and SVG formats. Furthermore, the system supports displaying
  news related to each nominated actor, sourced from configurable external data feeds within the developed application.

### Bibliography and references

- Dr. Buraga Sabin-Corneliu, Dr. Andrei Panu, Daniel Isepciuc, website Tehnologii Web, FII UAIC

- [The Movie Database (TMDb)](https://www.themoviedb.org/)

- [Screen Actors Guild (SAG) Awards](https://www.sagawards.org/)

- [IEEE Software Requirements Specification](https://standards.ieee.org/standard/29148-1-2018.html)

- [Markdown Guide](https://www.markdownguide.org/)

- [REST API Tutorial](https://www.restapitutorial.com/)

- [JavaScript Tutorial](https://www.javascripttutorial.net/)

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
 
 

 

