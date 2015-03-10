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


router.post('/thumbs', function (req, res){
    var form = new formidable.IncomingForm();
    var h;
    var w;
    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
        h = fields.height;
        w = fields.width;
    });

    form.on('end', function(fields, files) {

        var uploadedFiles = this.openedFiles;
        var new_location = 'public/uploads/';

        //var current_date = (new Date()).valueOf().toString();
        //var random = Math.random().toString();
        //var id = crypto.createHash('sha1').update(current_date + random).digest('hex');

        for (var i = 0; i <= uploadedFiles.length-1; i++) {
            var temp_path = uploadedFiles[i].path;
            var file_name = uploadedFiles[i].name;
            console.log(uploadedFiles[i].name);
            var new_file = new_location + file_name;
            (function () {
                fs.copy(temp_path, new_file, function(err) {
                    if (err) throw err;
                    else console.log(uploadedFiles);
                });
            })();
            (function () {
                gm(new_file)
                    .resize(w, h, "^")
                    .autoOrient()
                    .gravity('Center')
                    .extent(w, h)
                    .write('public/uploads/thumbs/' + file_name, function (err) {
                        if (err) throw err;
                        else
                            console.log(' hooray! ');


                        //zip.file(new_file, 'hello there');
                        //var data = zip.generate({base64:false,compression:'DEFLATE'});
                        //fs.writeFileSync('uploads/ras.zip', data, 'binary');

                    });
                    zip();
                    //res.download('/thumbs.zip');
            })();


        }



    });
});


module.exports = router;
