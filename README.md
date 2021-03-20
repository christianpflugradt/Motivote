# Motivote

[![pipeline status](https://gitlab.com/christianpflugradt/motivote/badges/main/pipeline.svg)](https://gitlab.com/christianpflugradt/motivote/-/commits/main) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Motivote is a web client for [Pollywog](https://gitlab.com/christianpflugradt/pollywog)
written in [Angular](https://angular.io/).

## Configuration

Motivote requires an instance of Pollywog which is part of Motivote's configuration.
As it is common with client-side JavaScript frameworks Motivote's configuration
is baked into the deployable app and thus it is necessary to adjust the configuration
before you build the app and deploy it on your server.

Motivote makes use of Angular environments. There is a default `environment.ts`
and a `environment.prod.ts` for production which only differ 
by the production flag being false or true.

To compile Motivote using your custom configuration you should copy the environment.ts
as a new file which you should name `environment.pollywog.ts`. There is a configuration in the 
[angular.json](angular.json)
file for this custom environment. There is also a script `buildpollywog` in the
[package.json](package.json)
which builds the Motivote app using this custom configuration.

The following properties currently exist and should be present in your environment 
configuration file:
 * **pollywogUrl**: The base url to your Pollywog instance, should not have a slash at the end
 * **production**: should be set to true, a default property in Angular apps
 * **version**: points to the [version constant](src/environments/version.ts) and should not be changed

## Compile Motivote

### Requirements

* Git (to clone the repository and checkout the latest version of Motivote)
* Npm (to compile Motivote)
* Docker (if you want to build a Motivote Docker image)

### How to compile

This instruction should work on Linux and Mac, and likely on Windows with Linux subsystem.
If it does not, you will probably be able to figure out yourself how to rewrite the scripts.

1. clone this repository: `git clone https://gitlab.com/christianpflugradt/motivote.git`
2. checkout the latest [Motivote version](https://gitlab.com/christianpflugradt/motivote/-/tags)
  , e.g. `git checkout 1.5.0`
3. write the version you checked out into the source code:
   `./set-version.sh 1.5.0` (exemplary for the version you checked out)   
4. create a configuration `environment.pollywog.ts` (see Configuration chapter)
5. compile Motivote: `./build-from-source.sh`

You will find the distributable in the folder `dist/main`. 
This distributable contain an index.html along with some script files. 
You can simply put it in a path inside your webserver root.

### Run Motivote as a standalone Docker container

1. build Motivote docker image: `docker build -t motivote .`
2. run Motivote docker container: `docker run -p 80:80 motivote`

### Deployment pitfalls
 
Please note that the `base-href` property in the distributable's `index.html`
is currently set to `/motivote/` which must correspond to the url suffix that your webserver associates
with this app. If you host Motivote as `www.your-server-name.tld/motivote/` nothing has to be changed
but if you want to use let's say `www.your-server-name.tld/myapps/motivote/` you need to update
the base-href to `/myapps/motivote` or else the `index.html` will not be able to include the script files.
You can change the `base-href` either directly in the [package.json](package.json)
(which I recommend) or after building the app, in the distributable's `index.html`.

Another thing you must pay attention to is [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing).
For local development you can use a browser plugin like "CORS Everywhere" for Firefox but for using
Motivote and Pollywog in production you must configure CORS in your webserver or make sure both
components run in the same domain on the same port. I recommend to do the latter and to put your Pollywog
instance behind a reverse proxy like Nginx. Simply run Pollywog on any port you like and configure
a proxy pass to route requests for `www.your-server-name.tld/pollywog/` to the port
Pollywog is listening to.
