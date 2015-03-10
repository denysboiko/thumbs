require('node-zip');
var fs   = require('fs-extra');

/*fs.readFile("spot.png", function(err, data) {
    if (err) throw err;
    var zip = new JSZip();
    console.log(data);
    zip.file("spot.png", data);
    var content = zip.generate({type:"nodebuffer",compression:"DEFLATE"});
    fs.writeFileSync('thumbs.zip', content, 'binary');
});*/

/*var dir = "uploads/thumbs/";

fs.readdir(dir, function(err, files) {
    if (err) throw err;
    var zip = new JSZip();
    //var thumbs = zip.folder("thumbs");
    for (var i=0; i<files.length; i++) {
        var data = fs.readFileSync(dir + files[i]);
        zip.file(files[i], data);
    }

    *//*for (var i=0; i<files.length; i++) {
        fs.readFile(dir + files[i], function(err, data) {
         if (err) throw err;
         zip.file(dir + files[i], data);
         console.log(data);
         });
        zip.file(files[i], data);
    }*//*

    var content = zip.generate({type:"nodebuffer",compression:"DEFLATE"});
    fs.writeFileSync('thumbs.zip', content, 'binary');
});*/

module.exports = function () {
    var dir = "uploads/thumbs/";

    fs.readdir(dir, function(err, files) {
        if (err) throw err;
        var zip = new JSZip();
        for (var i=0; i<files.length; i++) {
            var data = fs.readFileSync(dir + files[i]);
            zip.file(files[i], data);
        }

        var content = zip.generate({type:"nodebuffer",compression:"DEFLATE"});
        fs.writeFileSync('thumbs.zip', content, 'binary');
    });
};

