window.accessdb.Models.AppRouter = Backbone.Router.extend({
    page : null,
    routes: {
        "": "home",
        "home.html": "home",
        "results.html": "results",
        "results-technique.html/:id": "results-technique",
        "results-test.html/:id": "results-test",
        "test-run.html/:id": "test-run",
        "test-run.html": "test-run",
        "test.html/:id": "test",
        "test-delete.html/:id": "test-delete",
        "test-submit.html": "test-submit",
        "test-submit.html/:id": "test-edit",
        "tests-finish.html": "tests-finish",
        "tests-run.html": "tests-run",
        "tests-run-submit.html": "tests-run-submit",
        "user-profiles.html": "user-profiles",
        "user-profile-add.html": "user-profile-add",
        "user-profile-edit.html/:id": "user-profile-edit",
        "log-in.html": "log-in",
        "log-out.html": "log-out",
        "admin.html": "admin-techniques",
        "*actions": "defaultRoute"
    }
});
// Initiate the router
window.accessdb.appRouter = new window.accessdb.Models.AppRouter;

window.accessdb.appRouter.on('route:admin-techniques', function () {
    window.accessdb.appRouter.loadPage("admin-techniques");
    accessdb.admin.init();
});
window.accessdb.appRouter.on('route:home', function () {
    window.accessdb.appRouter.loadPage("home");
});
window.accessdb.appRouter.on('route:log-out', function () {
    if(window.accessdb.session){
        window.accessdb.session.logout(function(error, data, status){
            accessdb.session = new accessdb.Models.testingSession();
            // hack for triggering the useId change event
            accessdb.session.set("userId", "anon");
            accessdb.session.set("userId", null);
            $("#logoutInfo").hide();
            $("#loginform").show();
            window.accessdb.appRouter.loadPage("home");
        });
    }
    else{
        window.accessdb.appRouter.loadPage("home");
    }
});
window.accessdb.appRouter.on('route:log-in', function () {
    window.accessdb.appRouter.loadPage("log-in");
});
window.accessdb.appRouter.on('route:results', function () {
    window.accessdb.appRouter.loadPage("results");
    accessdb.TreeHelper.loadTrees();
    accessdb.TestResultsDataOverview = new accessdb.Views.TestResultsDataOverview();
    accessdb.TestResultsDataOverview.reload();
});
window.accessdb.appRouter.on('route:results-technique', function (id) {
    window.accessdb.appRouter.loadPage("results-technique");
    $(".results-technique-id").html(id);
    accessdb.TreeHelper.loadTrees();
    accessdb.TestResultsFullViewByTechniqueRelatedTests = new accessdb.Views.TestResultsFullViewByTechniqueRelatedTests();
    accessdb.TestResultsFullViewByTechniqueRelatedTests.reload({techNameId : id});
    accessdb.TestResultsFullViewByTechnique = new accessdb.Views.TestResultsFullViewByTechnique();
    accessdb.TestResultsFullViewByTechnique.reload({techNameId : id});
});
window.accessdb.appRouter.on('route:results-test', function (id) {
    window.accessdb.appRouter.loadPage("results-test");
    //accessdb.TreeHelper.loadTrees();
    //accessdb.TestResultsDataOverview = new accessdb.Views.TestResultsDataOverview();
    //accessdb.TestResultsDataOverview.reload();
});
window.accessdb.appRouter.on('route:user-profiles', function () {
    window.accessdb.appRouter.loadPage("user-profiles");
    if(accessdb.session && accessdb.session.get("userTestingProfiles")){
        if(accessdb.session.get("userTestingProfiles").length<1){
            UserTestingProfile.loadUserProfilesByUserId(function(error, data, status){
                accessdb.session.set("userTestingProfiles", data);
            });
        }
    }
    else{
        console.warn("user profiles not in session :");
        console.log(accessdb.session);
    }
    UserTestingProfile.showTestingProfiles();

});

window.accessdb.appRouter.on('route:user-profile-add', function () {
    window.accessdb.appRouter.loadPage("user-profile-form");
    var p = new UserTestingProfile();
    p.prepareAddForm();
});
window.accessdb.appRouter.on('route:user-profile-edit', function (id) {
    window.accessdb.appRouter.loadPage("user-profile-form");
    var p = new UserTestingProfile();
    p.setData(UserTestingProfile.getUserProfileById(accessdb.session.get("testProfileId")));
    p.prepareEditForm();
});

window.accessdb.appRouter.on('route:test-run', function (id) {
    if(accessdb.session.get("testProfileId")==-1){
        Utils.msg2user("You have not setup or select a profile for the testing.");
        return false;
    }
    if(accessdb.session.get("testUnitIdList").length<1){
        Utils.msg2user("You have selected no test to run.");
        return false;
    }
    window.accessdb.appRouter.loadPage("test-run");
    accessdb.testingRunner = new accessdb.Models.TestingHelper();
    accessdb.testingRunner.initHandlers();
    Utils.resetForm('#testingForm');
    accessdb.testingRunner.start();
    accessdb.testingRunner.loadNext();
});
window.accessdb.appRouter.on('route:test-submit', function () {
    window.accessdb.appRouter.loadPage("test-submit");
    TestUnit.initFormPage();
});
window.accessdb.appRouter.on('route:test-edit', function (id) {
    window.accessdb.appRouter.loadPage("test-submit");
    TestUnit.initFormPage(id);
});
window.accessdb.appRouter.on('route:test-delete', function (id) {
    TestUnit.delete(id, function(res){
        if(res && res.status===200){
            Utils.msg2user("Delete done");
            window.accessdb.appRouter.loadPage("test-submit");
        }
        else{
            Utils.msg2user("Delete not done");
            console.warn(error);
        }
    })
});
window.accessdb.appRouter.on('route:test-update', function (id) {
    window.accessdb.appRouter.loadPage("test-update");
});
window.accessdb.appRouter.on('route:tests-finish', function () {
    window.accessdb.appRouter.loadPage("tests-finish");
    TestResult.viewTestingResultsBeforeSave();
});
window.accessdb.appRouter.on('route:tests-run', function () {
    window.accessdb.appRouter.loadPage("tests-run");
    accessdb.TreeHelper.loadTrees(null, function(){
        TestUnit.loadTestsTree();
    });
});
window.accessdb.appRouter.on('route:tests-run-submit', function () {
    window.accessdb.appRouter.loadPage("tests-run-submit");
});

window.accessdb.appRouter.on('route:test', function (id) {
    window.accessdb.appRouter.loadPage("test");
    TestUnit.loadAndViewTestDetails(id);
});
window.accessdb.appRouter.on('route:defaultRoute', function(actions) {
    window.accessdb.appRouter.loadPage("notfound");
    console.log(actions);
});

window.accessdb.appRouter.loadPage = function(id){
    $("article").hide();
    this.page = accessdb.config.PAGE_ID_PREFIX + id;
    $("#"+accessdb.config.PAGE_ID_PREFIX + id).show();
    Utils.UIRoleAdapt();
};
window.accessdb.appRouter.redirect = function(page){
    window.location.href = "#/" + page;
};