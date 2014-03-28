$(document).ready(function () {
    for (var property in accessdb.config.services) {
        accessdb.config.services[property] = accessdb.config.URL_API_ROOT + accessdb.config.services[property];
    }
    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();
    // session initialization
    accessdb.session = new accessdb.Models.testingSession();
    accessdb.session.load();
    accessdb.session.save();


    $(".webTechTreeDiv").on('treevue:change', function (event) {
        accessdb.testsFilter.loadTrees(true, ["WCAG", "TESTS"]);
    });
    $("input[name=conformance]").on('change', function (event) {
        accessdb.testsFilter.loadTrees(true, ["WCAG", "WEBTECHS", "TESTS"]);
    });
    $(".criteriaTreeDiv").on('treevue:change', function (event) {
        accessdb.testsFilter.loadTrees(true, ["TESTS", "WEBTECHS"]);
    });
    $("#thetestsTreeDiv").on('treevue:change', function (event) {
        accessdb.TreeHelper.importTests($("#thetestsTreeDiv ul"));
    });
    /*
    $("#selected").find("ul").on('treevue:change', function (event) {
        event.preventDefault();
        var id = $(event.target).attr("value");
        accessdb.session.removeFromQueue(id);
    });
    */
    // on remove from the selected tests
    $(document).on("click", "span.icon.icon-remove", function (event) {
        event.preventDefault();
        var id = $(event.target).find("span").attr("aria-described-by");
        accessdb.session.removeFromQueue(id);
    });
    $("#doLogin").on("click", function (event) {
        var lData = {
            userId: $("#userId").val(),
            pass: $("#pass").val(),
            sessionId: accessdb.session.get("sessionId")
        };
        var pass = false;
        try{
            pass = document.getElementById("loginform").checkValidity();
        }
        catch(e){
            if(lData.userId.length>0 && lData.pass.length>0)
                pass = true;
            if(!pass)
            {
                Utils.msg2user("Invalid input. Please try again.");
            }
        }
        if(!pass)
        {
            return false;
        }
        event.preventDefault();
        accessdb.session.login(lData, function (result) {
            if (result) {
                console.log("login success");
                $("#logoutInfo").show();
                $("#loginform").hide();
                //accessdb.appRouter.loadPage("home");
            }
            else
            {
                Utils.msg2user("User failed to login. Please try again.");
            }
        });
    });
    $('#login').on("keydown", function (e) {
        if (e.keyCode == $.ui.keyCode.ENTER) {
            if (accessdb.session.userId == null)
                $("#doLogin").trigger("click");
            else
                $("#doLogout").trigger("click");
        }
    });
});

