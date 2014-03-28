window.accessdb.Models.AppRouter = Backbone.Router.extend({
    routes: {
        "": "home",
        "home.html": "home",
        "results.html": "results",
        "test-run.html/:id": "test-run",
        "test-run.html": "test-run",
        "test-submit.html": "test-submit",
        "test-submit.html/:id": "test-update",
        "tests-finish.html": "tests-finish",
        "tests-run.html": "tests-run",
        "tests-run-submit.html": "tests-run-submit",
        "user-profiles.html": "user-profiles",
        "test.html/:id": "test",
        "log-in.html": "log-in",
        "log-out.html": "log-out",
        "*actions": "defaultRoute"
    }
});
// Initiate the router
window.accessdb.appRouter = new window.accessdb.Models.AppRouter;

window.accessdb.appRouter.on('route:home', function () {
    window.accessdb.appRouter.loadPage("home");
});
window.accessdb.appRouter.on('route:log-out', function () {
    if(window.accessdb.session){
        window.accessdb.session.logout(function(error, data){
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
});
window.accessdb.appRouter.on('route:test-run', function (id) {
    window.accessdb.appRouter.loadPage("test-run");
});
window.accessdb.appRouter.on('route:test-submit', function () {
    window.accessdb.appRouter.loadPage("test-submit");
});
window.accessdb.appRouter.on('route:test-update', function (id) {
    window.accessdb.appRouter.loadPage("test-update");
});
window.accessdb.appRouter.on('route:tests-finish', function () {
    window.accessdb.appRouter.loadPage("tests-finish");
});
window.accessdb.appRouter.on('route:tests-run', function () {
    window.accessdb.appRouter.loadPage("tests-run");
    accessdb.testsFilter = accessdb.testsFilter || new Filter(window.accessdb.config.PAGE_ID_PREFIX + "tests-run");
    accessdb.testsFilter.loadTrees(false,["WCAG","WEBTECHS","TESTS"]);

});
window.accessdb.appRouter.on('route:tests-run-submit', function () {
    window.accessdb.appRouter.loadPage("tests-run-submit");
});
window.accessdb.appRouter.on('route:user-profiles', function () {
    window.accessdb.appRouter.loadPage("user-profiles");
});
window.accessdb.appRouter.on('route:test', function (id) {
    window.accessdb.appRouter.loadPage("test");
    console.log( "Get post number " + id );
});
window.accessdb.appRouter.on('route:defaultRoute', function(actions) {
    window.accessdb.appRouter.loadPage("notfound");
    console.log(actions);
});

window.accessdb.appRouter.loadPage = function(id){
    $("article").hide();
    $("#"+accessdb.config.PAGE_ID_PREFIX + id).show();
};