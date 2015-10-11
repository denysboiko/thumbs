$(function(){

    var ul = $("#upload ul");
    var jqXHR;
    var ff;
    var filesList = []

    $("#drop a").click(function(){
        // Simulate a click on the file input button
        // to show the file browser dialog
        $(this).parent().find('input').click();
    });

    // Initialize the jQuery File Upload plugin
    $('#upload').fileupload({

        // This element will accept file drag/drop uploading
        dropZone: $('#drop'),
        singleFileUploads: false,
        // This function is called when a file is added to the queue;
        // either via the browse button, or via drag/drop:
        add: function (e, data) {

            console.log(data.files.length);

            for (var i=0; i < data.files.length; i++) {
                var tpl = $('<li class="working"><input type="text" value="0" data-width="48" data-height="48"'+
                    ' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p></p><span></span></li>');

                // Append the file name and file size
                tpl.find('p').text(data.files[i].name)
                    .append('<i>' + formatFileSize(data.files[i].size) + '</i>');

                // Add the HTML to the UL element

                console.log(tpl);
                tpl.appendTo(ul);


                data.files[i].uploadID = i+1;


                // Initialize the knob plugin
                tpl.find('input').knob();
            }

            data.context=ul;


            // Listen for clicks on the cancel icon
            tpl.find('span').click(function(){

                if(tpl.hasClass('working')){
                    jqXHR.abort();
                }

                tpl.fadeOut(function(){
                    tpl.remove();
                });

            });

            // Automatically upload the file once it is added to the queue
            ff=data;
            /*data.formData = {height: $("#height").val(), width: $("#width").val()};
            var jqXHR = data.submit();
            console.log(data);*/

        },

        progress: function(e, data){

            //console.log(data);


                console.log(data);
                var progress = parseInt(data.loaded / data.total * 100, 10);

                // Update the hidden input field and trigger a change
                // so that the jQuery knob plugin knows to update the dial
                data.context.find('input').val(progress).change();

                if(progress == 100){
                    data.context.removeClass('working');
                }

            // Calculate the completion percentage of the upload

        },

        fail:function(e, data){
            // Something has gone wrong!
            data.context.addClass('error');
        }

    });

    $("#go").on('click', function (e) {
        e.preventDefault();
        ff.formData = {height: $("#height").val(), width: $("#width").val()};
        jqXHR = ff.submit();
    });

    // Prevent the default action when a file is dropped on the window
    $(document).on('drop dragover', function (e) {
        e.preventDefault();
    });

    $("#drop").on('dragover', function (e) {
        $("#drop").css('background','#52575d');
    });
    $("#drop").on('dragleave drop', function (e) {
        $("#drop").css('background','#2E3134');
    });


    // Helper function that formats the file sizes
    function formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }

        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }

        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }

        return (bytes / 1000).toFixed(2) + ' KB';
    }

});