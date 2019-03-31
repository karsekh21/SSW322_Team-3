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
  res.render('testMC', { title: 'Add New Question'});
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
  var answer = req.body.answer;
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
      "Correct Answer": answer
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

router.get('/newquestion2', function(req, res) {
  res.render('surveyMC', { title: 'Add New Question'});
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
      "choice 5": newChoice5
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
