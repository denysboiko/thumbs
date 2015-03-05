app.get('/thumbs', function (req, res){
    res.render('mini-upload-form/thumbs');
});

app.post('/thumbs', function (req, res){
    var form = new formidable.IncomingForm();
    var h;
    var w;
    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
        h = fields.height;
        w = fields.width;
        console.log(fields)
    });

    form.on('end', function(fields, files) {

        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location = 'uploads/';

        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log(file_name)
            }
        });

        gm(new_location + file_name)
            .resize(w, h, "^")
            .autoOrient()
            .gravity('Center')
            .extent(w, h)
            .write(new_location + 'thumbs/' + file_name, function (err) {
                if (err) throw err
                else
                    console.log(' hooray! ');
            });

    });
});