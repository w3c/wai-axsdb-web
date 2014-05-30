$(document).ready(function () {
    // session initialization
    accessdb.session = new accessdb.Models.testingSession();
    accessdb.session.load(function(error){
        if(error){
            $("body").html("<p>It seems there is a problem with the server side. Please contact admin</p>");
            return;
        }
        // save locally and remotely
        accessdb.session.save();
        // Start Backbone history a necessary step for bookmarkable URL's
        Backbone.history.start();
        // init Markup Handlers
        accessdb.session.initHandlers();
        accessdb.TreeHelper.initHandlers();
        UserTestingProfile.initHandlers();
        TestResult.initHandlers();
    });

});