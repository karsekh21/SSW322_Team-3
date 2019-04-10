var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});

//Get HELLO WORLD PAGE
router.get('/helloworld', function(req,res) {
  res.render('helloworld', {title: 'Hello, World!' });
});

//Get Userlist page
router.get('/testquestionlist', function(req,res) {
  var db = req.db;
  var collection = db.get('testquestioncollection');
  collection.find({}, {}, function(e, docs) {
    res.render('testquestionlist', {
      "testquestionlist" : docs
    });
  });
});

router.get('/surveyquestionlist', function(req,res) {
  var db = req.db;
  var collection = db.get('surveyquestioncollection');
  collection.find({}, {}, function(e, docs) {
    res.render('surveyquestionlist', {
      "surveyquestionlist" : docs
    });
  });
});

// //Get new user page
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
  var answer = req.body.answer;
  // var userName = req.body.username;
  // var userEmail = req.body.useremail;


  // Set our collection
  var collection = db.get('testcollection');

  var newEntry = {
    "title" : formTitle,
    "choice 1": newChoice,
    "choice 2": newChoice2,
    "choice 3": newChoice3,
    "choice 4": newChoice4,
    "choice 5": newChoice5,
    "Correct Answer": answer,
    "testMultChoice": true
  }

  collection.findOneAndUpdate(
    {"formType":"Test"},
    { $addToSet: {"questions": newEntry} }, {returnOriginal: false}, function (err, doc) {
          if (err) {
              // If it failed, return error
              res.send("There was a problem adding the information to the database.");
          }
          else {
              // And forward to success page
              res.redirect("testquestions");
          }
    });
  // Submit to the DB
  // collection.insert({
  //     "formId" : formId,
  //     "title" : formTitle,
  //     "choice 1": newChoice,
  //     "choice 2": newChoice2,
  //     "choice 3": newChoice3,
  //     "choice 4": newChoice4,
  //     "choice 5": newChoice5,
  //     "Correct Answer": answer,
  //     "testMultChoice": true
  // }, function (err, doc) {
  //     if (err) {
  //         // If it failed, return error
  //         res.send("There was a problem adding the information to the database.");
  //     }
  //     else {
  //         // And forward to success page
  //         res.redirect("testquestions");
  //     }
  // });
});




// For Survey Multiple Choice (newmultchoice2)
router.get('/newmultchoice2', function(req, res) {
  res.render('newmultchoice2', { title: 'Add New Survey Mult Choice Question'});
});

/* POST to Add User Service */
router.post('/addquestion2', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  // var formId = req.body.addquestion;
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
  var collection = db.get('surveyquestioncollection');

  // Submit to the DB
  collection.insert({
      // "formId" : formId,
      "title" : formTitle,
      "choice 1": newChoice,
      "choice 2": newChoice2,
      "choice 3": newChoice3,
      "choice 4": newChoice4,
      "choice 5": newChoice5,
      "Correct Answer": answer,
      "surveyMultChoice": true
  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // And forward to success page
          res.redirect("surveyquestions");
      }
  });
});





// For True/False
router.get('/newtruefalse', function(req, res) {
  res.render('newtruefalse', { title: 'Add New True/False'});
});

router.post('/addtruefalse', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var formId = req.body.formId;
  var formTitle = req.body.newTrueFalse;
  var correctAnswer = req.body.correctAnswer;

  // Set our collection
  var collection = db.get('surveyquestioncollection');

  // Submit to the DB
  collection.insert({
      "correctAnswer" : correctAnswer,
      "formId" : formId,
      "title" : formTitle,
      "truefalse" : true,

      // "correctAnswer" : correctAnswer,
      // "formId" : formId,
      // "title" : formTitle,
      // "truefalse" : true,
  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // And forward to success page
          res.redirect("surveyquestions");
      }
  });
});




// For Essay
router.get('/newessay', function(req, res) {
  res.render('newessay', { title: 'Add New Essay'});
});

router.post('/addessay', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var formId = req.body.formId;
  var formTitle = req.body.newEssay;
  var minWordCount = req.body.minWordCount;
  var maxWordCount = req.body.maxWordCount;

  // Set our collection
  var collection = db.get('testquestioncollection');

  // Submit to the DB
  collection.insert({
      "minWordCount" : minWordCount,
      "maxWordCount" : maxWordCount,
      "formId" : formId,
      "title" : formTitle,
      "essay" : true,
  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // And forward to success page
          res.redirect("testquestions");
      }
  });
});

//For Survey
router.get('/newessay2', function(req, res) {
  res.render('newessay', { title: 'Add New Essay'});
});

router.post('/addessay', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var formId = req.body.formId;
  var formTitle = req.body.newEssay;
  var minWordCount = req.body.minWordCount;
  var maxWordCount = req.body.maxWordCount;

  // Set our collection
  var collection = db.get('surveyquestioncollection');

  // Submit to the DB
  collection.insert({
      "minWordCount" : minWordCount,
      "maxWordCount" : maxWordCount,
      "formId" : formId,
      "title" : formTitle,
      "essay" : true,
  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // And forward to success page
          res.redirect("surveyquestions");
      }
  });
});


// For Short Answer
router.get('/newshortanswer', function(req, res) {
  res.render('newshortanswer', { title: 'Add New Short Answer'});
});

router.post('/addshortanswer', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var formId = req.body.formId;
  var formTitle = req.body.newShortAnswer;
  var minWordCount = req.body.minWordCount;
  var maxWordCount = req.body.maxWordCount;

  // Set our collection
  var collection = db.get('testquestioncollection');

  // Submit to the DB
  collection.insert({
      "minWordCount" : minWordCount,
      "maxWordCount" : maxWordCount,
      "formId" : formId,
      "title" : formTitle,
      "shortanswer" : true,
  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // And forward to success page
          res.redirect("testquestions");
      }
  });
});

//For survey
router.get('/newshortanswer2', function(req, res) {
  res.render('newshortanswer', { title: 'Add New Short Answer'});
});

router.post('/addshortanswer', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var formId = req.body.formId;
  var formTitle = req.body.newShortAnswer;
  var minWordCount = req.body.minWordCount;
  var maxWordCount = req.body.maxWordCount;

  // Set our collection
  var collection = db.get('surveyquestioncollection');

  // Submit to the DB
  collection.insert({
      "minWordCount" : minWordCount,
      "maxWordCount" : maxWordCount,
      "formId" : formId,
      "title" : formTitle,
      "shortanswer" : true,
  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // And forward to success page
          res.redirect("surveyquestions");
      }
  });
});

// For True or False (TrueFalse2)
// For True/False
router.get('/newtruefalse2', function(req, res) {
  res.render('newtruefalse2', { title: 'Add New True or False'});
});

router.post('/addtruefalse2', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var formId2 = req.body.formId2;
  var formTitle2 = req.body.newTrueFalse2;
  var correctAnswer2 = req.body.correctAnswer2;

  // Set our collection
  var collection = db.get('testquestioncollection');

  // Submit to the DB
  collection.insert({
      "correctAnswer2" : correctAnswer2,
      "formId2" : formId2,
      "title2" : formTitle2,
      "truefalse2" : true,
  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // And forward to success page
          res.redirect("testquestions");
      }
  });
});




// Matching Question Route
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
  var collection = db.get('testquestioncollection');

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
          res.redirect("testquestions");
      }
  });
});

//For survey
router.get('/newMatching2', function(req, res) {
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
  var collection = db.get('surveyquestioncollection');

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
          res.redirect("surveyquestions");
      }
  });
});




// To display answer key
// For True or False (TrueFalse2)
// For True/False
router.get('/answerlist', function(req, res) {
  res.render('answerlist', { title: 'Answer Key'});
});

// router.post('/addtruefalse2', function(req, res) {

//   // Set our internal DB variable
//   var db = req.db;

//   // Get our form values. These rely on the "name" attributes
//   var formId2 = req.body.formId2;
//   var formTitle2 = req.body.newTrueFalse2;
//   var correctAnswer2 = req.body.correctAnswer2;

//   // Set our collection
//   var collection = db.get('questioncollection');

//   // Submit to the DB
//   collection.insert({
//       "correctAnswer2" : correctAnswer2,
//       "formId2" : formId2,
//       "title2" : formTitle2,
//       "truefalse2" : true,
//   }, function (err, doc) {
//       if (err) {
//           // If it failed, return error
//           res.send("There was a problem adding the information to the database.");
//       }
//       else {
//           // And forward to success page
//           res.redirect("questionlist");
//       }
//   });
// });

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
  var collection = db.get('testquestioncollection');

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
          res.redirect("testquestions");
      }
  });
});

//For survey
router.get('/newRanking2', function(req, res) {
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
  var collection = db.get('surveyquestioncollection');

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
          res.redirect("surveyquestions");
      }
  });
});




// Test or Survey Route
router.get('/testorsurvey', function(req, res) {
  res.render('testorsurvey', { title: 'Test Or Survey'});
});

// Test questions
router.get('/testquestions', function(req, res) {
  res.render('testquestions', { title: 'Test Or Survey'});
});

// Question Selection for Tests
router.get('/testentry', function(req, res) {
  var db = req.db;

  var collection = db.get('testcollection');

  collection.insert({
    "formType": "Test",
    "questions": []
  });

  res.redirect('testquestions');
});


// Question Selection for Index
router.get('/surveyquestions', function(req, res) {
  res.render('surveyquestions', { title: 'Survey Questions'});
});

/*GET generic*/
router.get('*', function(req, res) {
  res.redirect('testorsurvey');
});

module.exports = router;
