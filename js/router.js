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
        "*actions": "defaultRoute"
    }
});
// Initiate the router
window.accessdb.appRouter = new window.accessdb.Models.AppRouter;

window.accessdb.appRouter.on('route:home', function () {
    $("main").load("pages/home.html");
});
window.accessdb.appRouter.on('route:results', function () {
    $("main").load("pages/results.html");
});
window.accessdb.appRouter.on('route:test-run', function (id) {
    $("main").load("pages/test-run.html");
});
window.accessdb.appRouter.on('route:test-submit', function () {
    $("main").load("pages/test-submit.html");
});
window.accessdb.appRouter.on('route:test-update', function (id) {
    $("main").load("pages/test-submit.html");
});
window.accessdb.appRouter.on('route:tests-finish', function () {
    $("main").load("pages/tests-finish.html");
});
window.accessdb.appRouter.on('route:tests-run', function () {
    $("main").load("pages/tests-run.html");
});
window.accessdb.appRouter.on('route:tests-run-submit', function () {
    $("main").load("pages/tests-run-submit.html");
});
window.accessdb.appRouter.on('route:user-profiles', function () {
    $("main").load("pages/user-profiles.html");
});
window.accessdb.appRouter.on('route:test', function (id) {
    $("main").load("pages/test.html");
    console.log( "Get post number " + id );
});
window.accessdb.appRouter.on('route:defaultRoute', function(actions) {
    $("main").load("pages/notfound.html");
    console.log(actions);
})

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();