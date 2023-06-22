const express = require('express');
const router = express.Router();
const  AWS = require('aws-sdk');
require('dotenv').config()

// Configure AWS credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

let rekognition = new AWS.Rekognition();

router.post('/classify', function(req, res, next) {
  // Access the uploaded image file
  const uploadedFile = req.files.file;

  let params = {
    Image: {
      Bytes: uploadedFile.data
    },
    MaxLabels: 10 // Maximum number of labels to retrieve
  };

  rekognition.detectLabels(params, function(err, data) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Unable to process the request' });
    } else {
      // Extract the labels from the API response
      let labels = data.Labels.map(function(label) {
        return label.Name;
      });

      res.json({
        labels: labels
      });
    }
  });
});

module.exports = router;
