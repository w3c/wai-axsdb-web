accessdb.code = {
    libraries: [
        {
            name: "jQuery latest",
            value: "<script src='http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'></script>",
            group: "jQuery"
        },
        {
            name: "jQuery UI latest",
            value: "<link href='http://code.jquery.com/ui/1.9.2/themes/smoothness/jquery-ui.css' rel='stylesheet' type='text/css' />" +
                    "<script src='http://code.jquery.com/jquery-1.8.3.min.js'></script>"+
                    "<script src='http://code.jquery.com/ui/1.9.2/jquery-ui.js'></script>",
            group: "jQuery UI"
        }
    ],
    addLibrary: function () {
        var source = $('#test-form-code-library').find(":selected").val();
        var result = $.grep(accessdb.code.libraries, function (e) {
            return e.name == source;
        });
        var newhead = "<head>\n" + result[0].value;
        var current = accessdb.code.editorDoc.getValue();
        current = current.replace(/<head>/gi, newhead);
        $("#test-form-code").val(current);
        accessdb.code.editorDoc.setValue(current);

    }
};
accessdb.code.updateTitle = function () {
    var newtitle = $('#test-form-title').val();
    newtitle = accessdb.session.get("select_test_case").technique.nameId + ": " + newtitle;
    var el = $('<html></html>');
    var editorVal = accessdb.code.editorDoc.getValue();
    el.html(editorVal);
    var aa = $(el).find("title")[0];
    $(aa).text(newtitle);
    var newCode = "<!DOCTYPE html>\n<html lang=\"en\">\n";
    newCode = newCode + $(el).html().replace(new RegExp('\n\n', 'gim'), '');
    newCode = newCode + "\n</html>";
    accessdb.code.editorDoc.setValue(newCode);
};

accessdb.code.showLibraries = function () {
    var selectE = $("#test-form-code-library");
    $(selectE).empty();
    var option = $("<option></option>")
        .attr("value", "")
        .text("Select");
    $(selectE).append(option);
    for (var lib_key in accessdb.code.libraries) {
        //console.log(example_key);
        var lib = accessdb.code.libraries[lib_key];
        //console.log(example);
        option = $("<option></option>")
            .attr("value", lib.name)
            .text(lib.name);
        $(selectE).append(option);
    }
};
accessdb.code.initeditor = function () {
    if(!accessdb.code.editorDoc){

        var mixedMode = {
            name: "htmlmixed",
            scriptTypes: [
                {matches: /\/x-handlebars-template|\/x-mustache/i,
                    mode: null},
                {matches: /(text|application)\/(x-)?vb(a|script)/i,
                    mode: "vbscript"}
            ]
        };
        accessdb.code.editorDoc = CodeMirror.fromTextArea(document.getElementById('test-form-code'), {
            // your settings here
            lineNumbers: true,
            smartIndent: true,
            tabSize: 4,
            indentWithTabs: true,
            matchBrackets: true,
            //  tabMode: "indent",
            //  smartIndent :true,
            mode: mixedMode
        });
        accessdb.code.editorDoc.setValue( _.template($('#test-submit-code-template').html(), { title : "Test file title"}));
       // accessdb.code.editorDoc.focus();
    }

};
accessdb.code.reseteditor = function () {
    accessdb.code.editorDoc.setValue( _.template($('#test-submit-code-template').html(), { title : "Test file title"}));
};
