/*

  Ontology Network Monitor App
  Owned by: Ryu Blockchain Technologies
  Written by: Wyatt Mufson
  Started: May 2019

*/

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const httpApp = express();

const http = require('http');
const https = require('https');
const routes = require('./routes.js');
const utils = require('./utils.js');
const ontology = require('./ontology.js');

let domain = 'monitor.ryu.games';
let credentials = {};

if (fs.existsSync(`/etc/letsencrypt/live/${domain}/privkey.pem`)) {
  const privateKey = fs.readFileSync(`/etc/letsencrypt/live/${domain}/privkey.pem`, 'utf8');
  const certificate = fs.readFileSync(`/etc/letsencrypt/live/${domain}/cert.pem`, 'utf8');
  const ca = fs.readFileSync(`/etc/letsencrypt/live/${domain}/chain.pem`, 'utf8');

  credentials = {
    key: privateKey,
    cert: certificate,
    ca,
  };
} else {
  domain = 'localhost';
}

const local = domain === 'localhost';

const httpServer = http.createServer(httpApp);
const httpsServer = local ? http.createServer(app) : https.createServer(credentials, app);
const io = require('socket.io')(httpsServer); // eslint-disable-line

const redirectServerPort = local ? 8080 : 80;
const mainServerPort = local ? 80 : 443;
let connections = 0;

app.use(bodyParser.json({ limit: '300KB' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '300KB' }));

routes(app);

io.on('connection', (socket) => {
  connections += 1;
  utils.showConnections(connections);
  socket.on('disconnect', () => {
    connections -= 1;
    utils.showConnections(connections);
  });
});

httpApp.get('*', (req, res) => {
  res.redirect(`https://${domain}${req.url}`);
});

httpServer.listen(redirectServerPort, () => {
  console.log(`Starting HTTP redirect Server running on port ${redirectServerPort}`);
});

httpsServer.listen(mainServerPort, () => {
  console.log(`Starting HTTPS Server running on port ${mainServerPort}`);
  ontology.heartBeat(io);
});
