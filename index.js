var express = require('express');
var router = express.Router();
var currTest = null;
var currSurvey = null; // 04/14/19


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});

//Get HELLO WORLD PAGE
router.get('/helloworld', function(req,res) {
  res.render('helloworld', {title: 'Hello, World!' });
});


// Display (load) a particlar test
router.post('/testquestionlist', async function(req,res) {
  var db = req.db;
  var collection = db.get('testcollection'); // 4/10/19
  var targetAccessCode = req.body.targetTestAccessCode;
  console.log(targetAccessCode);
  
  var testToPass = await collection.findOne({"testAccessCode": targetAccessCode});
    // if (testToPass === null) {
    //   alert("Invalid access code!");
    // }

  // try {
  //   var testToPass = await collection.findOne({"testAccessCode": targetAccessCode});
  //   if (testToPass === null) {
  //     alert("Invalid access code!");
  //   }
  //   console.log(testToPass);
  // } catch(e) {
  //   alert("Invalid access code!");
  //   console.log("Alert!");
  // }
  
  

  res.render('testquestionlist', {testquestionlist: testToPass});

});

// MAKER TEST QUESTION LIST
router.post('/makertestquestionlist', async function(req,res) {
  var db = req.db;
  var collection = db.get('testcollection'); // 4/10/19
  var targetAccessCode = req.body.targetTestAccessCode;
  console.log(targetAccessCode);
  
  var testToPass = await collection.findOne({"testAccessCode": targetAccessCode});
  currTest = testToPass;

  

  res.render('makertestquestionlist', {testquestionlist: testToPass});

});

// router.post("modifytest", async function(req, res) {
  
// })
var docID = null;
router.post('/modifynewquestion', async function(req, res) {
  var questiontitle = req.body.questiontitle;
  var db = req.db;
  var collection = await db.get("testcollection");
  var docToUpdate = await collection.findOneAndUpdate({
    "questions": [{
      "title":questiontitle}]},
      { $pull: {"questions": {"title":questiontitle}}},
      { returnOriginal: false}
      );
  docID = docToUpdate["_id"];
  res.render('modifynewquestion');
});

router.post('/modifytest', async function(req, res) {
  var db = req.db;
  var collection = await db.get('testcollection')

  var formTitle = req.body.newQuestion;
  var newChoice = req.body.mcChoice1;
  var newChoice2 = req.body.mcChoice2;
  var newChoice3 = req.body.mcChoice3;
  var newChoice4 = req.body.mcChoice4;
  var newChoice5 = req.body.mcChoice5;
  var answer = req.body.answer;

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

  collection.findOneAndUpdate({"_id":docID}, { 
    $set : {
      questions: [newEntry]
    }
  });

  res.redirect('makertestquestionlist');
});

// List of Tests
// router.get('/testlist', function(req,res) {
//   var db = req.db;
//   var collection = db.get('testcollection'); // 4/10/19
//   collection.find({}, {}, function(e, docs) {
//     res.render('testquestionlist', {
//       "testquestionlist" : docs
//     });
//   });
// });

// router.get('/surveyquestionlist', function(req,res) {
//   var db = req.db;
//   var collection = db.get('surveyquestioncollection');
//   collection.find({}, {}, function(e, docs) {
//     res.render('surveyquestionlist', {
//       "surveyquestionlist" : docs
//     });
//   });
// });

// Display (load) a particlar survey
router.post('/surveyquestionlist', async function(req,res) {
  var db = req.db;
  var collection = db.get('surveycollection'); // 4/10/19
  var surveyTargetAccessCode = req.body.targetSurveyAccessCode;
  
  var surveyToPass = await collection.findOne({"surveyAccessCode": surveyTargetAccessCode});
  console.log(surveyToPass);

  res.render('surveyquestionlist', {surveyquestionlist: surveyToPass});

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
    {"testFormName": currTest["testFormName"]},
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
  var collection = db.get('surveycollection');

  var newSurveyMultChoiceEntry = {
    "title" : formTitle,
    "choice 1": newChoice,
    "choice 2": newChoice2,
    "choice 3": newChoice3,
    "choice 4": newChoice4,
    "choice 5": newChoice5,
    "Correct Answer": answer,
    "testMultChoice": true
  }

  // Submit to the DB

  collection.findOneAndUpdate(
    {"surveyFormName": currSurvey["surveyFormName"]},
    { $addToSet: {"questions": newSurveyMultChoiceEntry} }, {returnOriginal: false}, function (err, doc) {
          if (err) {
              // If it failed, return error
              res.send("There was a problem adding the information to the database.");
          }
          else {
              // And forward to success page
              res.redirect("surveyquestions");
          }
    });

  // collection.insert({
  //     // "formId" : formId,
  //     "title" : formTitle,
  //     "choice 1": newChoice,
  //     "choice 2": newChoice2,
  //     "choice 3": newChoice3,
  //     "choice 4": newChoice4,
  //     "choice 5": newChoice5,
  //     "Correct Answer": answer,
  //     "surveyMultChoice": true
  // }, function (err, doc) {
  //     if (err) {
  //         // If it failed, return error
  //         res.send("There was a problem adding the information to the database.");
  //     }
  //     else {
  //         // And forward to success page
  //         res.redirect("surveyquestions");
  //     }
  // });
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
  // var correctAnswer = req.body.correctAnswer;

  // Submit to the DB
  // collection.insert({
  //     // "correctAnswer" : correctAnswer,
  //     "formId" : formId,
  //     "title" : formTitle,
  //     "truefalse" : true,

  //     // "correctAnswer" : correctAnswer,
  //     // "formId" : formId,
  //     // "title" : formTitle,
  //     // "truefalse" : true,
  // }, function (err, doc) {
  //     if (err) {
  //         // If it failed, return error
  //         res.send("There was a problem adding the information to the database.");
  //     }
  //     else {
  //         // And forward to success page
  //         res.redirect("surveyquestions");
  //     }
  // });

    // Set our collection
    var collection = db.get('surveycollection');

    // Submit to the DB
    var newSurveyTrueFalseEntry = {
        // "correctAnswer2" : correctAnswer2,
        "formId" : formId,
        "title" : formTitle,
        "truefalse" : true,
    }
  
    collection.findOneAndUpdate(
      {"surveyFormName": currSurvey["surveyFormName"]},
      { $addToSet: {"questions": newSurveyTrueFalseEntry} }, {returnOriginal: false}, function (err, doc) {
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
  var collection = db.get('testcollection');

  // Submit to the DB
  var newEntry = {
      "minWordCount" : minWordCount,
      "maxWordCount" : maxWordCount,
      "formId" : formId,
      "title" : formTitle,
      "essay" : true,
  }

  collection.findOneAndUpdate(
  {"testFormName": currTest["testFormName"]},
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

});

//For Survey Essay
router.get('/newsurveyessay', function(req, res) {
  res.render('newsurveyessay', { title: 'Add New Essay'});
});

router.post('/addsurveyessay', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var formId = req.body.formId;
  var formTitle = req.body.newEssay;
  var minWordCount = req.body.minWordCount;
  var maxWordCount = req.body.maxWordCount;

  // Set our collection
  // Set our collection
  var collection = db.get('surveycollection');

  // Submit to the DB
  var newSurveyEssayEntry = {
      "minWordCount" : minWordCount,
      "maxWordCount" : maxWordCount,
      "formId" : formId,
      "title" : formTitle,
      "essay" : true,
  }

  collection.findOneAndUpdate(
  {"surveyFormName": currSurvey["surveyFormName"]},
  { $addToSet: {"questions": newSurveyEssayEntry} }, {returnOriginal: false}, function (err, doc) {
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
  var collection = db.get('testcollection');

  // Submit to the DB
  var newEntry = {
      "minWordCount" : minWordCount,
      "maxWordCount" : maxWordCount,
      "formId" : formId,
      "title" : formTitle,
      "shortanswer" : true,
  }

  collection.findOneAndUpdate(
    {"testFormName": currTest["testFormName"]},
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
});

// For survey short answer
router.get('/newsurveyshortanswer', function(req, res) {
  res.render('newsurveyshortanswer', { title: 'Add New Short Answer'});
});

router.post('/addsurveyshortanswer', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var formId = req.body.formId;
  var formTitle = req.body.newShortAnswer;
  var minWordCount = req.body.minWordCount;
  var maxWordCount = req.body.maxWordCount;

    // Set our collection
    var collection = db.get('surveycollection');

    // Submit to the DB
    var newSurveyShortAnswer = {
        "minWordCount" : minWordCount,
        "maxWordCount" : maxWordCount,
        "formId" : formId,
        "title" : formTitle,
        "shortanswer" : true,
    }
  
    collection.findOneAndUpdate(
      {"surveyFormName": currSurvey["surveyFormName"]},
      { $addToSet: {"questions": newSurveyShortAnswer} }, {returnOriginal: false}, function (err, doc) {
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
  var collection = db.get('testcollection');

  // Submit to the DB
  var newEntry = {
      "correctAnswer2" : correctAnswer2,
      "formId2" : formId2,
      "title2" : formTitle2,
      "truefalse2" : true,
  }

  collection.findOneAndUpdate(
    {"testFormName": currTest["testFormName"]},
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
  var collection = db.get('testcollection');

  // Submit to the DB
  var newEntry = {
      "formId" : formId,
      "title" : formTitle,
      "firstKey": firstKey,
      "firstValue": firstValue,
      "secondKey": secondKey,
      "secondValue": secondValue,
      "thirdKey": thirdKey,
      "thirdValue": thirdValue,
	  "matching": true
  }

  collection.findOneAndUpdate(
    {"testFormName": currTest["testFormName"]},
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
});

// Matching Question For Survey
router.get('/newsurveymatching', function(req, res) {
  res.render('newsurveymatching', { title: 'Add New Question'});
});

/* POST to Add User Service */
router.post('/addSurveyMatching', function(req, res) {

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
    var collection = db.get('surveycollection');

    // Submit to the DB
    var newSurveyMatchingEntry = {
        "formId" : formId,
        "title" : formTitle,
        "firstKey": firstKey,
        "firstValue": firstValue,
        "secondKey": secondKey,
        "secondValue": secondValue,
        "thirdKey": thirdKey,
        "thirdValue": thirdValue,
      "matching": true
    }
  
    collection.findOneAndUpdate(
      {"surveyFormName": currSurvey["surveyFormName"]},
      { $addToSet: {"questions": newSurveyMatchingEntry} }, {returnOriginal: false}, function (err, doc) {
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
  var collection = db.get('testcollection');

  // Submit to the DB
  var newEntry = {
      "formId" : formId,
      "title" : formTitle,
      "best": bestChoice,
      "middle": middleChoice,
      "worst": worstChoice,
	  "ranking": true
  }

  collection.findOneAndUpdate(
    {"testFormName": currTest["testFormName"]},
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
});

// Ranking Question For Survey
router.get('/newsurveyranking', function(req, res) {
  res.render('newsurveyranking', { title: 'Add New Question'});
});

/* POST to Add User Service */
router.post('/addSurveyRanking', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var formId = req.body.addRanking;
  var formTitle = req.body.newRanking;
  var bestChoice = req.body.bestChoice;
  var middleChoice = req.body.middleChoice;
  var worstChoice = req.body.worstChoice;

  // Set our collection
  var collection = db.get('surveycollection');

  // Submit to the DB
  var newSurveyRankingEntry = {
      "formId" : formId,
      "title" : formTitle,
      "best": bestChoice,
      "middle": middleChoice,
      "worst": worstChoice,
	  "ranking": true
  }

  collection.findOneAndUpdate(
    {"surveyFormName": currSurvey["surveyFormName"]},
    { $addToSet: {"questions": newSurveyRankingEntry} }, {returnOriginal: false}, function (err, doc) {
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




// Test or Survey Route for Makers
router.get('/testorsurvey', function(req, res) {
  res.render('testorsurvey', { title: 'Test Or Survey'});
});

// Test or Survey Route for Takers
router.get('/takertestorsurvey', function(req, res) {
  res.render('takertestorsurvey', { title: 'Taker Test Or Survey'});
});


router.get('/testformname', function(req, res) {
  res.render('testformname', { title: 'Name Your Form'});
});

// Name Your Form for Tests
router.post('/testformname', async function(req, res) {

  var testFormName = req.body.newTestFormName;
  var accessCode = req.body.testAccessCode;

  var db = req.db;

  var collection = db.get('testcollection');

  collection.insert({
    "formType": "Test",
    "testFormName": testFormName,
    "testAccessCode": accessCode,
    "questions": []
  });

  currTest = await collection.findOne({"testFormName": testFormName});
  console.log(currTest);

  res.redirect('testquestions');
});




// Same as above (naming forms) but for surveys
router.get('/surveyformname', function(req, res) {
  res.render('surveyformname', { title: 'Name Your Form'});
});

// Name Your Form for Surveys
router.post('/surveyformname', async function(req, res) {

  var surveyFormName = req.body.newSurveyFormName;
  var accessCode = req.body.surveyAccessCode;

  var db = req.db;

  var collection = db.get('surveycollection');

  collection.insert({
    "formType": "Survey",
    "surveyFormName": surveyFormName,
    "surveyAccessCode": accessCode,
    "questions": []
  });

  currSurvey = await collection.findOne({"surveyFormName": surveyFormName});
  console.log(currSurvey);

  res.redirect('surveyquestions');
});

// Maker or Taker Views
router.get('/makerortaker', function(req, res) {
  res.render('makerortaker', { title: 'Maker or Take'});
});

// Test or Survey Route
// router.get('/selecttesttotake', function(req, res) {
//   res.render('selecttesttotake', { title: 'Select a Test'});
// });

// Written on 04/15/19
router.get('/testlist', function(req,res) {
  var db = req.db;
  var collection = db.get('testcollection'); // 4/10/19
  collection.find({}, {}, function(e, docs) {
    res.render('testlist', {
      "testlist" : docs
    });
    // for (i = 0; i < testlist.length; i++) {
    //   var strLink = testlist[i].testFormName;
    //   list += strLink.link('/makerortaker') + "<br>";
    // }
  });
});

// Maker Test List
router.get('/makertestlist', function(req,res) {
  var db = req.db;
  var collection = db.get('testcollection'); // 4/10/19
  collection.find({}, {}, function(e, docs) {
    res.render('makertestlist', {
      "testlist" : docs
    });
    // for (i = 0; i < testlist.length; i++) {
    //   var strLink = testlist[i].testFormName;
    //   list += strLink.link('/makerortaker') + "<br>";
    // }
  });
});

// The same for surveys
router.get('/surveylist', function(req,res) {
  var db = req.db;
  var collection = db.get('surveycollection'); // 4/10/19
  collection.find({}, {}, function(e, docs) {
    res.render('surveylist', {
      "surveylist" : docs
    });
  });
});

// Test questions
router.get('/testquestions', function(req, res) {
  res.render('testquestions', { title: 'Test Or Survey'});
});


// Question Selection for Index
router.get('/surveyquestions', function(req, res) {
  res.render('surveyquestions', { title: 'Survey Questions'});
});

router.get('/enteraccesscode', function(req, res) {
  res.render('enteraccesscode', { title: 'Enter Access Code'});
});

router.get('/surveyenteraccesscode', function(req, res) {
  res.render('surveyenteraccesscode', { title: 'Survey Enter Access Code'});
});




// TAKE an exam
router.post('/testquestionlist', function(req, res) { // not sure if this should be testquestionlist or a new route

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var formId = req.body.formId;
  var formTitle = req.body.newEssay;
  var minWordCount = req.body.minWordCount;
  var maxWordCount = req.body.maxWordCount;

  // Set our collection
  var collection = db.get('testcollection');

  // Submit to the DB
  var newEntry = {
      "minWordCount" : minWordCount,
      "maxWordCount" : maxWordCount,
      "formId" : formId,
      "title" : formTitle,
      "essay" : true,
  }

  collection.findOneAndUpdate(
  {"testFormName": currTest["testFormName"]},
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

});

// Modify a test
router.post("/newquestion")



// Maker testquestionlist route (for loading)
router.get('/makertestquestionlist', function(req, res) {
  res.render('makertestquestionlist', { title: 'Maker Test Question List'});
});

router.get('/testcreatetestview', function(req, res) {
  res.render('testcreatetestview', { title: 'Test Create Test View'});
});

router.post('/selectquestiontomodify', function(req, res) {
  var questionType = req.body.questiontype;
  console.log(questionType);
  res.render('selectquestiontomodify', { title: 'Select Question to Modify'});
});

router.get('/selectquestiontype', function(req, res) {
  res.render('selectquestiontype', { title: 'Select Question Type'});
});

router.get('/makerenteraccesscode', function(req, res) {
  res.render('makerenteraccesscode', { title: 'Maker Enter Access Code'});
});

router.post('/questionsofspecifiedtype', function(req, res) {
  var chosenType = req.body.questionType;
  res.render('questionsofspecifiedtype', {chosenType : chosenType});
});

/*GET generic*/
router.get('*', function(req, res) {
  res.redirect('testorsurvey');
});


module.exports = router;