const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');


const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(3000, function() {
  console.log("Server are running on port 3000");
})
