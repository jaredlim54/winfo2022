import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  
  //header
  //file uploader
    //description
    //File accepter
      //Big image plane
      //Button to accept file input
  //Preview of accepted file (?)
  //Button to download file
  //Button to play audio
  //Button to download audio file (?)

  //send request to get text of the file
  // if the request exists (if text exists), render text of the file
  
});

export default router;
