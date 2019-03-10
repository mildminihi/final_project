const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.render('signin');
});

app.post('/', function(req, res) {
  res.render('signin');
});

app.get('/home', function(req, res) {
  res.render('index');
});

app.post('/home', function(req, res){
  res.render('index');
});

app.post('/api/ph', function(req, res){
  console.log(req.query.ph);
  var phValue = req.query.ph;
  res.send('success : ' + phValue);

app.get('/notification', function(req, res){
  res.render('notification');
});

app.get('/setting', function(req, res){
  res.render('setting');
});

app.post('/addPond', function(req, res) {
  if (req.body.saveBtn === "save") {
    console.log(req.body);
  }
  else {
    res.render('home');
  }
})

app.listen(3000, function() {
  console.log("Server are running on port 3000");
});
