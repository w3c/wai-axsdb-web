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
        "*actions": "defaultRoute"
    }
});
// Initiate the router
window.accessdb.appRouter = new window.accessdb.Models.AppRouter;

window.accessdb.appRouter.on('route:home', function () {
    $("main").load("pages/home.html");
});
window.accessdb.appRouter.on('route:log-in', function () {
    $("main").load("pages/log-in.html", function(){
        $("#doLogin").on("click", function(event){
            event.preventDefault();
            var lData = new Object();
            lData.userId = $("#userId").val();
            lData.pass = $("#pass").val();
            lData.sessionId =  accessdb.session.get("sessionId");
            accessdb.session.save(function(error, data)
            {
                if (!error) {
                    accessdb.session.login(lData, function(error, data)
                    {
                        if(!error && data){
                            if(data.userId!=null)                            {
                                console.log("login sucess");
                                $(".loginhidden").show();
                                $("#logoutInfo").show();
                                $("#loginform").hide();
                                //      $(".userid").html("Logout " + obj.userId);
                                // $(".here").trigger("click");
                                //Utils.goBack();
                                //msg2user("User with id: " + obj.userId + " has been successfully logged in.");
                            }
                            // else
                            //   msg2user("User failed to login. Please try again.");
                        }

                    });
                } else {
                    console.error(error);
                    return;
                }
            });
        });
        $('#login').on("keydown", function(e) {
            if (e.keyCode == $.ui.keyCode.ENTER) {
                if(accessdb.session.userId==null)
                    $("#doLogin").trigger("click");
                else
                    $("#doLogout").trigger("click");
            }
        });
    });

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
    $("main").load("pages/tests-run.html", function(){
        $("main").get(0).setAttribute("id", "tests");
        $("#tests .webTechTreeDiv").on('treevue:change', function (event) {
            accessdb.testsFilter.loadTrees(true,["WCAG","TESTS"]);
        });
        $("#tests input[name=conformance]").on('change', function (event) {
            accessdb.testsFilter.loadTrees(true,["WCAG","WEBTECHS","TESTS"]);
        });
        $("#tests .criteriaTreeDiv").on('treevue:change', function (event) {
            accessdb.testsFilter.loadTrees(true,["TESTS","WEBTECHS"]);
        });
        $("#thetestsTreeDiv").on('treevue:change', function (event) {
            Filter.importTests($("#thetestsTreeDiv ul"));
        });
        $("#tests .divTreeTestsSelected").on('treevue:change', function (event) {
            event.preventDefault();
            var id = $(event.target).attr("value");
            accessdb.session.removeFromQueue(id);
        });
        // on remove from the selected tests
        $(document).on("click", "span.icon.icon-remove", function (event) {
            event.preventDefault();
            var id = $(event.target).find("span").attr("aria-described-by");
            accessdb.session.removeFromQueue(id);
        });
        accessdb.testsFilter = accessdb.testsFilter || new Filter("tests");
        accessdb.testsFilter.loadTrees(false,["WCAG","WEBTECHS","TESTS"]);
    });

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