require('dotenv').config();
const app = require('./server/app');

app.listen(process.env.PORT ? process.env.PORT : 80, () => {
  console.log('Listening...');
});
