var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var customerModel = require('../modules/Customer');

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

      return res.render('signup', { title: 'Customer Details', msg: 'Username Already Exit' });

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

      return res.render('signup', { title: 'Customer Details', msg: 'Email Already Exit' });

    }
    next();
  });
}
router.get('/', function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var byLiginId = { "loginId": req.session.UserID }
  var getCustomer = customerModel.find();
  getCustomer.exec(function (err, data) {
    if (err) throw err;
    res.render('customerDetails', { title: 'Customer Details', loginUser: loginUser, records: data });
  });
});

router.get('/edit/:id', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var customer_id = req.params.id;
  var getCustomer = customerModel.findById(customer_id);
  getCustomer.exec(function (err, data) {
    if (err) throw err;
    res.render('customerUpdate', { title: 'Customer Details', loginUser: loginUser, errors: '', success: '', records: data, id: customer_id });
  });

});

router.post('/edit/', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var customer_id = req.body.id;
  var FirstName = req.body.FirstName;
  var LastName = req.body.LastName;
  var Mobile = req.body.Mobile;
  var Email = req.body.Email;
  var DOB = req.body.DOB;

  var updateCustomer = customerModel.findByIdAndUpdate(customer_id, { 
    FirstName: FirstName, 
    LastName: LastName, 
    Mobile: Mobile, 
    Email: Email, 
    DOB: DOB
  });

  updateCustomer.exec(function (err, doc) {
    if (err) throw err;

    res.redirect('/customers');
  });
});


router.get('/delete/:id', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var customer_id = req.params.id;
  var custdelete = customerModel.findByIdAndDelete(customer_id);
  custdelete.exec(function (err) {
    if (err) throw err;
    res.redirect('/customers');
  });
});


module.exports = router;