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

app.get('/phDetail/:phValue', function(req, res) {
  var phValue = req.params.phValue;
  //res.render('phDetail');
  res.render('phDetail', {phValue: phValue});
});

app.get('/phDetail', function(req, res) {
  res.redirect("/phDetail");
});

app.listen(3000, function() {
  console.log("Server are running on port 3000");
})
