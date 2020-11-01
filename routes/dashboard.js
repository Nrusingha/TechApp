var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var categoryModel = require('../modules/Customer');
var catModel = require('../modules/Customer');
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

router.get('/', checkLoginUser, function (req, res, next) {
  // var loginUser = localStorage.getItem('loginUser');
  var loginUser = req.session.userName;
  catModel.countDocuments({}).exec((err, count) => {
    categoryModel.countDocuments({}).exec((err, countasscat) => {
      res.render('dashboard', { title: 'Tech Assignment', loginUser: loginUser, msg: '',  totalCustomer: countasscat });
    });
  });
});

module.exports = router;