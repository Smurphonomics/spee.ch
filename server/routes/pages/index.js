const handlePageRequest = require('../../controllers/pages/sendReactApp');
const handleEmbedRequest = require('../../controllers/pages/sendEmbedPage');
const redirect = require('../../controllers/pages/redirect');

module.exports = (app) => {
  app.get('/', handlePageRequest);
  app.get('/login', handlePageRequest);
  app.get('/about', handlePageRequest);
  app.get('/trending', redirect('/popular'));
  app.get('/popular', handlePageRequest);
  app.get('/new', handlePageRequest);
  app.get('/embed/:claimId/:name', handleEmbedRequest);  // route to send embedable video player (for twitter)
};
