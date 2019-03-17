const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var gamepad = require("gamepad");

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
});

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
});

app.get('/control', function(req, res) {
  var status = gamepadCotrol();
  scanGamepad();
  res.render('control', {status: status});
});

app.listen(3000, function() {
  console.log("Server are running on port 3000");
});

function gamepadCotrol() {
  gamepad.init();
  if (gamepad.numDevices() == "1") {
    status = "connected"
    return status;
  }
  else {
    return "Not connected"
  }
}

function scanGamepad() {
  setInterval(gamepad.processEvents, 16);
  setInterval(gamepad.detectDevices, 500);
  gamepad.on("up", function(id, num) {
    if (num == 5 || num == 6 || num == 7 || num == 8) {
        console.log("Stop");
    }
  });
  gamepad.on("down", function(id, num) {
    switch (num) {
      case 5:
        console.log("forward");
        break;
      case 6:
        console.log("backward");
        break;
      case 7:
        console.log("turn left");
        break;
      case 8:
        console.log("turn right");
        break;
      default:
      console.log("Can't use this button");
    }
  });
}
