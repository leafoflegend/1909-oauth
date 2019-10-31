const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const axios = require('axios');
const crypto = require('crypto');

dotenv.config();

const app = express();
app.use(session({
  secret: 'monkeys paw',
  saveUninitialized: true,
  resave: false,
}));
app.use(express.json());

const PORT = 3000;
const PUBLIC_PATH = path.join(__dirname, './static');

app.use(express.static(PUBLIC_PATH));

app.use((req, res, next) => {
  if (!req.session.uuid) {
    req.session.uuid = crypto.randomBytes(16).toString('hex');
  }

  if (req.session.user && req.path === '/') {
    res.redirect('/user');
  } else {
    next();
  }
});

app.get('/user', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
});

app.get('/api/user', (req, res, next) => {
  if (!req.session.user) {
    res.sendStatus(401);
  } else {
    res.send(req.session.user);
  }
});

app.get('/api/github/login', (req, res, next) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});

app.get('/api/github/callback',  (req, res, next) => {
  const code = req.query.code || '';

  if (!code) throw new Error('Code not returned from GitHub.');

  axios.post('https://github.com/login/oauth/access_token', {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  })
    .then(axRes => {
      const jsonResponse = axRes.data.split('&').reduce((dict, keyValString) => {
        const [key, val] = keyValString.split('=');
        return {
          ...dict,
          [key]: val,
        }
      }, {});

      req.session.access_token = jsonResponse.access_token;

      return axios.get('https://api.github.com/user', {
        headers: {
          authorization: `token ${req.session.access_token}`,
        },
      });
    })
    .then(axRes => {
      req.session.user = axRes.data;
      res.redirect('/user');
    })
    .catch(err => {
      console.error(err.response);
      next(err);
    })
});

app.get('*', (req, res, next) => {
  res.sendFile(path.join(PUBLIC_PATH, './index.html'));
});

app.listen(PORT, () => {
  console.log(`App has started listening on PORT:${PORT}`);
});
