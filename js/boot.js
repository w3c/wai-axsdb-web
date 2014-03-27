(function () {
    //$.cookie.json = true; //TODO need jq lib enabled
    for (var property in accessdb.config.services) {
        accessdb.config.services[property] = accessdb.config.URL_API_ROOT + accessdb.config.services[property];
    }
    // session initialization
    accessdb.TestingManager.create();


    // Event Handlers
    accessdb.session.on('change', function () {
        //update UI login/out
        if (accessdb.session.get("userId") != null) {
            $(".login-info").html("Log out " + accessdb.session.get("userId"));
            $(".login-info").parent().attr("href","#/log-out.html")
        }
        else {
            $(".login-info").html("Log in");
            $(".login-info").parent().attr("href","#/log-in.html")
        }
    });
    accessdb.session.on('change:userId', function (o) {

    });
    accessdb.session.on('change:testResultList', function (o) {
        //update UI for results
    });
    accessdb.session.on('change:testUnitIdList', function (o) {
        console.log("change:testUnitIdList");
        var ul = $("#selected").find("ul")[0];
        $(ul).empty();
        for (testId in accessdb.session.get("testUnitIdList")) {
            var testId = accessdb.session.get("testUnitIdList")[testId];
            accessdb.API.TEST.findById(testId, function (error, data) {
                var test = data;
                var li = _.template($('#test-selected-list-template').html(), {test: test});
                $(ul).append(li);
            })
        }
        accessdb.TreeHelper.updateTreeFromTestList();
        $(".inqueuetest").html(accessdb.session.get("testUnitIdList").length);
        /*
         $(".tests_count_all").html(Requirements.getCountAllTests());

         if (UserTestingProfile.getUserProfileById(this.get("testProfileId")))
         $(".currentprofile").html(UserTestingProfile.getUserProfileById(this.get("testProfileId")).profileName);
         else
         $(".currentprofile").html("None");
         */
    });
    accessdb.session.on('invalid', function (model, error) {
        console.warn("session invalid: " + error); // printing the error message on console.
    });
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
        Filter.importTests($("#thetestsTreeDiv ul"));
    });
    $("#selected").find("ul").on('treevue:change', function (event) {
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
    $("#doLogin").on("click", function (event) {
        event.preventDefault();
        var lData = {
            userId: $("#userId").val(),
            pass: $("#pass").val(),
            sessionId: accessdb.session.get("sessionId")
        };
        accessdb.session.save(function (error, data) {
            if (!error) {
                accessdb.session.login(lData, function (error, data) {
                    if (!error && data) {
                        if (data.userId != null) {
                            console.log("login success");
                            $("#logoutInfo").show();
                            $("#loginform").hide();
                            accessdb.appRouter.loadPage("home");
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
    $('#login').on("keydown", function (e) {
        if (e.keyCode == $.ui.keyCode.ENTER) {
            if (accessdb.session.userId == null)
                $("#doLogin").trigger("click");
            else
                $("#doLogout").trigger("click");
        }
    });

})
();

//
//TestingManager.create();
//

