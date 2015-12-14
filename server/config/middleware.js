var bodyParser = require('body-parser');
var partials = require('express-partials');


module.exports = function (app, express) {
  app.use(partials());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static(__dirname +'/../../public'));
};