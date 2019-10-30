const express = require('express');
const path = require('path');

const app = express();

const PORT = 3000;

app.use(express.static(path.join(__dirname, './static')));

app.listen(PORT, () => {
  console.log(`App has started listening on PORT:${PORT}`);
});
