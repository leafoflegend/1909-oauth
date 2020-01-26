const { sync, models } = require('./db.js');
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const axios = require('axios');
require('dotenv').config();

const { Session, User } = models;
const users = {};

const app = express();

const PORT = 3000;

const PUBLIC_PATH = path.join(__dirname, './static');

const COOKIE_NAME = 'session_id';

app.use(cookieParser());

app.use((req, res, next) => {
  if (!req.cookies[COOKIE_NAME]) {
    Session.create()
      .then(session => {
        res.cookie(COOKIE_NAME, session.id);
        next();
      })
      .catch(e => {
        console.log(chalk.red('Error creating session for user.'));
        console.error(e);
        res.redirect('/error');
      });
  } else {
    if (!users[req.cookies[COOKIE_NAME]]) {
      User.findOne({
        where: {
          sessionId: req.cookies[COOKIE_NAME],
        },
      })
        .then(userOrNull => {
          if (!userOrNull) {
            next();
          } else {
            req.github_access_token = userOrNull.github_access_token;
            users[req.cookies[COOKIE_NAME]] = userOrNull.github_access_token;
            next();
          }
        })
        .catch(e => {
          console.log(chalk.red('Error getting user using session_id'));
          console.error(e);
        });
    } else {
      req.github_access_token = users[req.cookies[COOKIE_NAME]];
      next();
    }
  }
});

app.use(express.static(PUBLIC_PATH));

app.get('/api/github/login', (req, res, next) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});

app.get('/api/github/callback', (req, res, next) => {
  const { code } = req.query;

  axios.post(`https://github.com/login/oauth/access_token?code=${code}&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`, {}, {
    headers: {
      Accept: 'application/json',
    },
  })
    .then(res => {
      console.log('Github Response: ', res.data);

      return User.create({
        github_access_token: res.data.access_token,
        sessionId: req.cookies[COOKIE_NAME],
      });
    })
    .then(() => {
      res.redirect('/user');
    })
    .catch(e => {
      console.log(chalk.red('Error authenticating with Github.'));
      console.error(e);
      res.redirect('/error');
    });
});

app.get('/api/github/user', (req, res, next) => {
  axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `token ${req.github_access_token}`,
    },
  })
    .then(axRes => {
      res.send(axRes.data);
    })
    .catch(e => {
      console.log(chalk.red('Error while getting response from github user route.'));
      console.error(e);
      res.redirect('/error');
    });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, './index.html'));
});

const promisifiedTimeout = (time = 3000) => {
  return new Promise((res, rej) => {
    setTimeout(() => rej(), time);
  });
};

const startServer = () => new Promise(res => {
  app.listen(PORT, () => {
    console.log(chalk.green(`App has started listening on PORT:${PORT}`));
    res();
  });
});

const safeStartServer = (time = 3000) => Promise.race([
  startServer(),
  promisifiedTimeout(time),
]);

sync()
  .then(result => {
    if (result) {
      return safeStartServer();
    }

    throw new Error('Failed to start!');
  })
  .catch(e => {
    console.log(chalk.red(e));
    process.exit(1);
  });
