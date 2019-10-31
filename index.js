const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');
const session = require('express-session');
const crypto = require('crypto');

dotenv.config();

const PUBLIC_PATH = path.join(__dirname, './static');

const app = express();
app.use(session({
  secret: 'cool cats',
  resave: false,
  saveUninitialized: true,
  cookie: {
    name: process.env.COOKIE_NAME,
  },
}));

const PORT = 3000;

app.use((req, res, next) => {
  if (!req.session.session_uuid) {
    req.session.access_token = null;
    req.session.session_uuid = crypto.randomBytes(16).toString("hex");
  }

  console.log(`Request to: ${req.path}`);

  next();
});
app.use(express.static(PUBLIC_PATH));

app.get('/', (req, res, next) => {
  if (req.session.access_token) {
    res.redirect('/user');
  }
});

app.get('/user', (req, res, next) => {
  if (!req.session.access_token) {
    res.sendStatus(401);
  } else {
    next();
  }
});

app.get('/api/user',  (req, res, next) => {
  if (!req.session.access_token) {
    res.sendStatus(401);
  } else {
    axios.get(`${process.env.GITHUB_API_URL}user`, {
      headers: {
        authorization: `token ${req.session.access_token}`,
      },
    })
      .then(axRes => {
        req.session.user = axRes.data;
        res.send(axRes.data);
      })
      .catch(e => {
        console.error(e);
        res.sendStatus(500);
      });
  }
});

app.get('/api/github/login', (req, res, next) =>  {
  res.redirect(`${process.env.GITHUB_OAUTH_URL}authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});

app.get('/api/github/callback', (req, res, next) => {
  const code = req.query && req.query.code || null;

  if (!code) {
    const errString = 'Missing code in response from GitHub!';
    console.error(errString);
    throw new Error(errString);
  }

  axios.post(`https://github.com/login/oauth/access_token`, {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  },{
    headers: {
      Accept: 'application/json'
    }
  })
    .then(axRes => {
      req.session.access_token = axRes.data.access_token;
      res.redirect('/user');
    })
    .catch(error => {
      console.error(error.response);
      next(error);
    });
});

app.get('*', (req, res, next) => {
  res.sendFile(path.join(PUBLIC_PATH, './index.html'));
});

app.use((err, req, res, next) => {
  res.status(500).send(err);
});

app.listen(PORT, () => {
  console.log(`App has started listening on PORT:${PORT}`);
});
