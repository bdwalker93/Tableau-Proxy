Table of Contents
=================

   * [Tableau Proxy](#tableau-proxy)
      * [Introduction](#introduction)
         * [About the Backend](#about-the-backend)
         * [About the Frontend](#about-the-frontend)
      * [Platform Dependencies](#platform-dependencies)
      * [Instructions](#instructions)
   * [Deployment Guide](#deployment-guide)
      * [Install Node.js](#install-nodejs)
      * [Get PM2](#get-pm2)
      * [Set PM2 to run on startup](#set-pm2-to-run-on-startup)
      * [Deploying Tableau-Proxy with PM2](#deploying-tableau-proxy-with-pm2)

# Tableau Proxy

## Introduction

This project serves a mobile-web client for Tableau.

In order to utilize Tableau's rich, but unpublished REST API (`/vizportal/api/web/v1`) certain steps had to be taken, such as the inclusion of a proxy server with this project. This project server deals with delivering the correct HTML, however, and stays out of the way.

### About the Backend

The backend is effectively a webserver which mostly serves the purpose of proxying requests to the selected Tableau server, rewriting and injecting styling where appropriate for mobile, and providing new web routes for serving files related to the frontend.

The proxy server is required in order for us to be able to avoid the complexity of reverse-engineering the authentication and handshaking protocol between the Tableau clients and this REST API. Instead, the proxy server allows us to present the true authentication screen, with improved styling.

Once the user logs in, the cookie is stored by the browser as usual, but for the proxy's origin, not the Tableau server. In this way, all future calls to the API are authenticated by the cookie by virtue of the proxy allowing it to pass through calls into the API.

### About the Frontend

The frontend is written in [React](https://facebook.github.io/react/), and state management is handled by [Redux](http://redux.js.org/). It tries hard to look exactly like the Tableau iPhone app.

By using React on the frontend, we hope to influence Tableau's mobile app team to look into using [react-native](http://facebook.github.io/react-native/) in order to deliver mobile-web, ios, and iphone with a relatively consistent codebase.

## Platform Dependencies

* [node v6.9.0 or newer](https://nodejs.org/en/)

## Instructions

You can use these simple steps to test or work on this project

0. Install nodejs
0. Clone the repo `git clone https://github.com/bdwalker93/Tableau-Proxy`
0. `cd` into the repo
0. `npm install` to download node modules
0. `npm start` to start the server

# Deployment Guide

The rest of this document will walk you through installation of the application on Amazon Linux (EC2).

*Do all of this as the root user.*

## Install Node.js

```
curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
yum -y install nodejs gcc-c++ make
```

## Get PM2

PM2 is a production process manager for Node.js apps with a built-in load balancer. We use it in deployment.

```
npm install -g pm2
```

## Set PM2 to run on startup

```
pm2 startup amazon
```

## Deploying Tableau-Proxy with PM2

```
git clone https://github.com/bdwalker93/Tableau-Proxy
cd Tableau-Proxy
npm install
```

Because this is a deployment, you probably want to use a real certificate (ask your network administrator) and bind to port 443. This is done by creating a new config file in the project root:

```
cat <<EOF > config.json
{
  "key": "/path/to/your-real-key.key",
  "cert": "/path/to/your-real-cert.cert",
  "port": 443
}
```

You can test this by running `npm start` -- if it works, then continue to deploy:

```
pm2 start Tableau-Proxy
```

`Tableau-Proxy` should now be accessible, and should automatically start if you restart the server.
