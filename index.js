require('dotenv').config();

/* Uncomment when enabling https
const path = require('path');
const fs = require('fs');
const https = require('https');
*/
const http = require('http'); // delete when https is enabled.
const express = require('express');
const cors = require('cors');
const basicAuth = require('express-basic-auth');
const morgan = require('morgan')
const DarkSky = require('dark-sky');

const app = express();
const forecast = new DarkSky(process.env.API_KEY);

app.use(morgan('combined'));

app.use(
  basicAuth({
    users: {
      ios: 'wordbook_hitch_swear_deflect',
    },
    unauthorizedResponse: getUnauthorizedResponse,
  }),
);

function getUnauthorizedResponse(req) {
  return req.auth
    ? 'Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected'
    : 'No credentials provided';
}

app.use(cors());
app.set('port', process.env.PORT || 3000);
app.enable('trust proxy');

app.get('/', (req, res) => {
  res.send(`<div>Current time is: ${new Date().toLocaleString()}</div>`);
});

app.get('/api/v1/forecast/:lat,:long', (req, res) => {
  const lat = req.params.lat;
  const long = req.params.long;

  forecast
    .latitude(lat)
    .longitude(long)
    .get()
    .then(weather => res.status(200).json(weather))
    .catch(error => res.send(error));
});

http
  .createServer(app)
  .listen(app.get('port'), () =>
    console.log(`Server is listening at port ${app.get('port')}`),
  );

/* Uncomment to enable https
  https
  .createServer(
    {
      key: [ENTER KEY DETAILS HERE],
      cert: [ENTER CERT DETAILS HERE],
      passphrase: 'password',
    },
    app
  )
  .listen(app.get('port'), () =>
    console.log(`Server is listening at port ${app.get('port')}`),
  );
  */
