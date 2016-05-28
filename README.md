## Synopsis

The webpack powered platform.

## Description 
Gives you the platform to build a single page application with an express server powered by  mongodb
and a frontend application primitives to interact with it

### Folders

    - server/controllers/ � defines your app routes and their logic
    - app/                � defines your app scripts and their logic
    - config              � configs for app and dependencies
    - server/models/      � represents data, implements business logic and handles storage
    - public/             � contains all static files like images, styles and javascript
    - server/views/       � provides templates which are rendered and served by your routes
    - server/tests/       � TDD BDD Functional Regressive Integration
    - package.json        � remembers all packages that your app depends on and their versions

# Installation

### Install nodejs 
sxhttps://nodejs.org/

### Install mongodb 
https://docs.mongodb.com/manual/installation/#mongodb-community-edition

### Download the Source
```bash
$ git clone https://github.com/NVBespalov/platform
$ cd ./platform
```

### Installing node modules
```bash
$ npm i 
$ npm run dev ```


### Tools
``` $ npm run bundle ``` - build client bundle to execute on a production server
``` $ npm run doc  ``` - Build documentation from a source code

## Express

templates engine - swig


## API Reference


## Contributors

Nikolay Bespalov <nvbespalov@gmail.com>  

## License

MIT