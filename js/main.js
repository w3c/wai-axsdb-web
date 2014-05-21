$(document).ready(function () {

    // session initialization
    accessdb.session = new accessdb.Models.testingSession();
    accessdb.session.load();
    accessdb.session.save();
    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();

    $(".webTechTreeDiv").on('treevue:change', function (event) {
        accessdb.TreeHelper.loadTrees(event);
        if(accessdb.TestResultsDataOverview)
            accessdb.TestResultsDataOverview.reload();
    });
    $("input[name=conformance]").on('change', function (event) {
        accessdb.TreeHelper.loadTrees(event);
        if(accessdb.TestResultsDataOverview)
            accessdb.TestResultsDataOverview.reload();
    });
    $(".criteriaTreeDiv").on('treevue:change', function (event) {
        accessdb.TreeHelper.loadTrees(event);
        if(accessdb.TestResultsDataOverview)
            accessdb.TestResultsDataOverview.reload();
    });
    $("#thetestsTreeDiv").on('treevue:change', function (event) {
        accessdb.TreeHelper.importTests($("#thetestsTreeDiv ul"));
    });
    // on remove from the selected tests
    $(document).on("click", "span.icon.icon-remove", function (event) {
        event.preventDefault();
        var id = $(event.target).find("span").attr("aria-described-by");
        accessdb.session.removeFromQueue(id);
        accessdb.TreeHelper.updateTreeFromTestList();
    });
    $(document).on("click", ".userProfilesDiv input", function (event) {
        var id = $(event.target).attr("value");
        console.log(id);
        accessdb.session.set("testProfileId",id);
        $("#editProfileBtn").attr("href","#/user-profile-edit.html/"+id);
    });
    $("#deleteProfileBtn").on("click", function(event)
    {
        UserTestingProfile.deleteUserProfilesById(accessdb.session.get("testProfileId"), function(error, data, status)
        {
            if(!error){
                UserTestingProfile.loadUserProfilesByUserId(function(error, data, status){ });
            }
        });
    });
    // #/run-test.html
    $(document).on("click", ".do_next", function (event) {
        event.preventDefault();
        var hasNext = accessdb.testingRunner.saveAndLoadNext();
        if(!hasNext){
            accessdb.appRouter.redirect("tests-finish.html")
        }
    });
    $(document).on("click", ".skipme", function (event) {
        event.preventDefault();
        var hasNext = accessdb.testingRunne.loadNext();
        if(!hasNext){
            accessdb.appRouter.redirect("tests-finish.html")
        }
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
                Utils.msg2user("Invalid input. Please try again.");
        }
        if(pass)
        {
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
                    return false;
                }
            }, "#infodiv");
            return false;
        }
    });
    $('#login').on("keydown", function (e) {
        if (e.keyCode == $.ui.keyCode.ENTER) {
            if (accessdb.session.userId == null)
                $("#doLogin").trigger("click");
            else
                $("#doLogout").trigger("click");
        }
    });
    $(".testprofileSave").on("click", function(event){
        var p = new UserTestingProfile();
        p.loadDataFromForm();
        UserTestingProfile.persistUserProfile(p, function(out){
            UserTestingProfile.loadUserProfilesByUserId(function(error, data, status){
                accessdb.session.set("userTestingProfiles", data);
            });
        });
    });

    // #tests-finish
     $(document).on("click", ".removeTestingResult", function (event) {
        var testResultList = accessdb.session.get("testResultList");
        event.preventDefault();
        var testUnitId = $(event.target).attr("value");
         testResultList = _.filter(testResultList, function(item) {
             return item.testUnitDescription !== testUnitId;
         });
        accessdb.session.set("testResultList", testResultList);
    });
    $(document).on("click", "#testResultsPersist", function (event) {
        event.preventDefault();
        var tests_done = accessdb.session.get("testResultList").length;
        accessdb.session.tests_done = tests_done;//temp
        accessdb.session.saveResultsBunch(function(){
            accessdb.appRouter.redirect("tests-run-submit.html");
        });
    });
});

