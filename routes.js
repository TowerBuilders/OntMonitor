const ontology = require('./ontology.js');

const appRouter = (app) => {
  /*

    CORS (Cross Origin Request) configuration
    allows browsers to call the API endpoints

  */
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  /*

    Test that the API is active

  */
  app.get('/', (req, res) => {
    res.status(200).send('Connected to OntMonitor');
  });

  /*

    Gets the current running statistics

  */
  app.get('/getStats', (req, res) => {
    const stats = ontology.getStats();
    const string = JSON.stringify(stats);
    res.status(200).send(string);
  });

  app.get('/html', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
  });

  app.get('/index.js', (req, res) => {
    res.sendFile(`${__dirname}/index.js`);
  });

  app.get('/socket.io.js', (req, res) => {
    res.sendFile(`${__dirname}/socket.io.js`);
  });
};

// Allows other files (app.js) access to the code here
module.exports = appRouter;
