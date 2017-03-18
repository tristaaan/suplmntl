var app = require('./server/app');
var dotenv = require('dotenv');

try {
  dotenv.load();
  console.log('using .env file');
} catch (e) {
  console.log('no .env file, make sure these are set:\n- TOKEN_SECRET\n- MONGODB_URI\n');
}

app.listen(process.env.PORT ? process.env.PORT : 80, () => {
  console.log('Listening...');
});
