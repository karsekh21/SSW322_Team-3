var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Get HELLO WORLD PAGE
router.get('/helloworld', function(req,res) {
  res.render('helloworld', {title: 'Hello, World!' });
});

//Get Userlist page
router.get('/questionlist', function(req,res) {
  var db = req.db;
  var collection = db.get('questioncollection');
  collection.find({}, {}, function(e, docs) {
    res.render('questionlist', {
      "questionlist" : docs
    });
  });
});



//Get new user page
router.get('/newquestion', function(req, res) {
  res.render('newquestion', { title: 'Add New Question'});
});

/* POST to Add User Service */
router.post('/addquestion', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var formId = req.body.addquestion;
  var formTitle = req.body.newQuestion;
  var newChoice = req.body.mcChoice1;
  var newChoice2 = req.body.mcChoice2;
  var newChoice3 = req.body.mcChoice3;
  var newChoice4 = req.body.mcChoice4;
  var newChoice5 = req.body.mcChoice5;
  var correctChoice = req.body.correctChoice;
  // var userName = req.body.username;
  // var userEmail = req.body.useremail;

  // Set our collection
  var collection = db.get('questioncollection');

  // Submit to the DB
  collection.insert({
      "formId" : formId,
      "title" : formTitle,
      "choice 1": newChoice,
      "choice 2": newChoice2,
      "choice 3": newChoice3,
      "choice 4": newChoice4,
	  "choice 5": newChoice5,
	  "correct choice": correctChoice,
	  "MCQ": true
  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // And forward to success page
          res.redirect("questionlist");
      }
  });
});



router.get('/newRanking', function(req, res) {
  res.render('newRanking', { title: 'Add New Question'});
});

/* POST to Add User Service */
router.post('/addRanking', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var formId = req.body.addRanking;
  var formTitle = req.body.newRanking;
  var bestChoice = req.body.bestChoice;
  var middleChoice = req.body.middleChoice;
  var worstChoice = req.body.worstChoice;

  // Set our collection
  var collection = db.get('questioncollection');

  // Submit to the DB
  collection.insert({
      "formId" : formId,
      "title" : formTitle,
      "best": bestChoice,
      "middle": middleChoice,
      "worst": worstChoice,
	  "ranking": true
  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // And forward to success page
          res.redirect("questionlist");
      }
  });
});



router.get('/newMatching', function(req, res) {
  res.render('newMatching', { title: 'Add New Question'});
});

/* POST to Add User Service */
router.post('/addMatching', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var formId = req.body.addMatching;
  var formTitle = req.body.newMatching;
  var firstKey = req.body.firstKey;
  var firstValue = req.body.firstValue;
  var secondKey = req.body.secondKey;
  var secondValue = req.body.secondValue;
  var thirdKey = req.body.thirdKey;
  var thirdValue = req.body.thirdValue;
  
  // Set our collection
  var collection = db.get('questioncollection');

  // Submit to the DB
  collection.insert({
      "formId" : formId,
      "title" : formTitle,
      "firstKey": firstKey,
      "firstValue": firstValue,
      "secondKey": secondKey,
      "secondValue": secondValue,
      "thirdKey": thirdKey,
      "thirdValue": thirdValue,
	  "matching": true
  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // And forward to success page
          res.redirect("questionlist");
      }
  });
});

module.exports = router;
