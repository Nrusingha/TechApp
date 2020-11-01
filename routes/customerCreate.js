var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var customerModel = require('../modules/Customer');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

function checkLoginUser(req, res, next) {
  var userToken = localStorage.getItem('userToken');
  var loginUser = req.session.userName;
  try {
    if (loginUser) {
      var decoded = jwt.verify(userToken, 'loginToken');
    } else {
      res.redirect('/');
    }
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
  //res.send("Customer");
  var loginUser = localStorage.getItem('loginUser');
  res.render('customerCreate', { title: 'Tech Assignment', loginUser: loginUser, errors: '', success: '' });
});

router.post('/create', function (req, res, next) {
  //res.send("New Customer");
  //console.log(req.body);

  var FirstName = req.body.FirstName;
  var LastName = req.body.LastName;
  var Mobile = req.body.Mobile;
  var Email = req.body.Email;
  var DOB = req.body.DOB;

  var customerData = new customerModel({
    FirstName: FirstName,
    LastName: LastName,
    Mobile: Mobile,
    Email: Email,
    DOB: DOB,
    loginId: req.session.UserID
  });

  customerData.save(function (err, doc) {
    if (err) throw err;
    res.redirect('/customers');
    //res.render('customerCreate', { title: 'Tech Assignment', loginUser: loginUser, errors: '', success: 'Customer inserted successfully' });
  })

});

module.exports = router;