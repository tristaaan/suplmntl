var app = require('./server/app');
var dotenv = require('dotenv');

dotenv.load();

app.listen(process.env.PORT ? process.env.PORT : 8000, () => {
  console.log('Listening...');
});
