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
  res.render('index');
});

app.post('/api/ph', function(req, res){
  console.log(req.query.ph);
  var phValue = req.query.ph;
  res.send('success : ' + phValue);
});

app.listen(3000, function() {
  console.log("Server are running on port 3000");
});
