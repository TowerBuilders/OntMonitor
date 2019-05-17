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

  app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
  });

  app.get('/index.js', (req, res) => {
    res.sendFile(`${__dirname}/index.js`);
  });

  app.get('/index.css', (req, res) => {
    res.sendFile(`${__dirname}/index.css`);
  });

  app.get('/socket.io.js', (req, res) => {
    res.sendFile(`${__dirname}/socket.io.js`);
  });

  app.get('/socket.io.js.map', (req, res) => {
    res.sendFile(`${__dirname}/socket.io.js.map`);
  });

  app.get('/bootstrap/css/bootstrap.min.css', (req, res) => {
    res.sendFile(`${__dirname}/bootstrap/css/bootstrap.min.css`);
  });

  app.get('/bootstrap/css/bootstrap.min.css.map', (req, res) => {
    res.sendFile(`${__dirname}/bootstrap/css/bootstrap.min.css.map`);
  });
};

// Allows other files (app.js) access to the code here
module.exports = appRouter;
