$(document).ready(function () {
    // session initialization
    accessdb.session = new accessdb.Models.testingSession();
    accessdb.session.load();
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