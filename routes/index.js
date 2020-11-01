var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var custmrModel = require('../modules/Customer');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');


function checkLoginUser(req, res, next) {
  var userToken = localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch (err) {
    res.redirect('/');
  }
  next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkUsername(req, res, next) {
  var uname = req.body.uname;
  var checkexitemail = userModule.findOne({ username: uname });
  checkexitemail.exec((err, data) => {
    if (err) throw err;
    if (data) {
      return res.render('signup', { title: 'Tech Assignment', msg: 'Username Already Exit' });
    }
    next();
  });
}

function checkEmail(req, res, next) {
  var email = req.body.email;
  var checkexitemail = userModule.findOne({ email: email });
  checkexitemail.exec((err, data) => {
    if (err) throw err;
    if (data) {
      return res.render('signup', { title: 'Tech Assignment', msg: 'Email Already Exit' });
    }
    next();
  });
}

router.get('/', function (req, res, next) {
  //var loginUser = localStorage.getItem('loginUser');
  var loginUser = req.session.userName;
  if (loginUser) {
    res.redirect('./dashboard');
  } else {
    res.render('index', { title: 'Tech Assignment', msg: '' });
  }
});

router.post('/', function (req, res, next) {
  var username = req.body.uname;
  var password = req.body.password;
  var checkUser = userModule.findOne({ username: username });
  checkUser.exec((err, data) => {
    //console.log(data._id)
    if (data == null) {
      res.render('index', { title: 'Tech Assignment', msg: "Invalid Username and Password." });

    } else {
      if (err) throw err;
      var getUserID = data._id;
      var getPassword = data.password;
      if (bcrypt.compareSync(password, getPassword)) {
        var token = jwt.sign({ userID: getUserID }, 'loginToken');

        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUser', username);
        req.session.userName = username;
        req.session.UserID = data._id;

        res.redirect('/dashboard');
      } else {
        res.render('index', { title: 'Tech Assignment', msg: "Invalid Username and Password." });

      }
    }
  });
});

router.get('/signup', function (req, res, next) {
  // var loginUser = localStorage.getItem('loginUser');
  var loginUser = req.session.userName;
  if (loginUser) {
    res.redirect('./dashboard');
  } else {
    res.render('signup', { title: 'Tech Assignment', msg: '' });
  }
});

router.post('/signup', checkUsername, checkEmail, function (req, res, next) {
  var username = req.body.uname;
  var email = req.body.email;
  var password = req.body.password;
  var confpassword = req.body.confpassword;
  if (password != confpassword) {
    res.render('signup', { title: 'Tech Assignment', msg: 'Password not matched!' });

  } else {
    password = bcrypt.hashSync(req.body.password, 10);
    var userDetails = new userModule({
      username: username,
      email: email,
      password: password
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      res.render('signup', { title: 'Tech Assignment', msg: 'User Registerd Successfully' });
    });
  }
});

router.get('/logout', function (req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  req.session.destroy(function (err) {
    if (err) {
      res.redirect('/');
    }
  })
  res.redirect('/');
});

module.exports = router;
