const appRouter = (app, io) => {
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
    io.emit('Connection...');
    res.status(200).send('Connected to OntMonitor');
  });
};

// Allows other files (app.js) access to the code here
module.exports = appRouter;
