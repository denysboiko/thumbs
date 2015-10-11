var express = require('express');
var router = express.Router();
var async=require('async');
var gm = require('gm').subClass({ imageMagick: true });
var crypto = require('crypto');
var fs   = require('fs-extra');

var formidable = require('formidable');
var util = require('util');
var sess;
var zip = require ('zip');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Thumbs' });
  sess=req.session;
  console.log(sess);
});

router.get('/zip', function(req, res, next) {
    res.download('thumbs.zip');
    //if (err) next(err);
});



router.post('/thumbs', function (req, res) {
    var form = new formidable.IncomingForm();
    var h;
    var w;
    form.parse(req, function (err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
        h = fields.height;
        w = fields.width;
    });

    form.on('end', function (fields, files) {

        var uploadedFiles = this.openedFiles;
        var numberOfFiles = this.openedFiles.length;
        var newLocation = 'public/uploads/';

        //var current_date = (new Date()).valueOf().toString();
        //var random = Math.random().toString();
        //var id = crypto.createHash('sha1').update(current_date + random).digest('hex');

        /*for (var i = 0; i <= uploadedFiles.length-1; i++) {
            var temp_path = uploadedFiles[i].path;
            var file_name = uploadedFiles[i].name;
            console.log(uploadedFiles[i].name);
            var new_file = newLocation + file_name;*/

            async.waterfall([
                 function (callback) {

                     for (var i = 0; i < numberOfFiles; i++) {

                         fs.copy(uploadedFiles[i].path, newLocation + uploadedFiles[i].name, function (err) {
                         if (err) throw err;
                         //else console.log(file_name);
                         }, callback(null, uploadedFiles[i].name, newLocation + uploadedFiles[i].name));
                     }

                 },
                 function (file_name, new_file, callback) {
                     gm(new_file)
                         .resize(w, h, "^")
                         .autoOrient()
                         .gravity('Center')
                         .extent(w, h)
                         .write('public/uploads/thumbs/' + file_name, function() {
                             callback(null, file_name, arguments);
                         });
                 }
             ], function (err, file_name, arguments) {
                if (err) throw (err);
                else console.log("Successfully resized " + file_name);
             });
            console.log('Success!');
            zip();
    });
});



module.exports = router;