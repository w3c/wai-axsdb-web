accessdb.TestingHelper = {
    run : function (lastTestUnit, skipme) {
        var session = accessdb.session;
        var testUnitIdList = session.get("testUnitIdList");
        skipme = skipme || false;
        var nextTestUnit = null;
        if (lastTestUnit != null) // not the first
        {
            // validate
            if (!$("input[name='result']:checked").val() && !skipme) {
                // change page
                return lastTestUnit;
            }
            accessdb.TestingHelper.saveTestingData(lastTestUnit, skipme);
            Utils.resetForm('#testingForm');
        }
        if (testUnitIdList.length > 0) {
            $("#testing_msg").empty();
            $("#testingForm").show();
            nextTestUnit = new TestUnit();
            session.set("currentTestUnitId", testUnitIdList.pop());
            // put back in case of cancel and remove on save
            testUnitIdList.push(session.get("currentTestUnitId"));
            nextTestUnit.loadByIdSync(session.get("currentTestUnitId"));
            nextTestUnit.showInTestingPage();
            var moretests = testUnitIdList.length - 1;
            $(".next_tests_count").attr("href", "#/test-run.html").html(moretests);
        }
        else { // finished
            $("#testingForm").hide();
            session.set("currentTestUnitId", -1);
            accessdb.appRouter.loadPage("test-finish");
            //$("#testing_msg").html("<p>No test in your list. Either <a href='#tests'>add more tests</a> or consider <a href='#testingresults'>submiting the existing ones</a></p>");
        }
        return nextTestUnit;
    },
    saveTestingData: function (testUnit, skipme) {
        var testUnitIdList = accessdb.session.get("testUnitIdList");
        if (testUnit.id > 0) {
            TestResult.removeByUnitId(testUnit.testUnitId);
            var testResult = new TestResult();
            testResult.comment = $("#testing_comment").val();
            var testUnit = new TestUnit();
            testUnit.loadByIdSync(accessdb.session.currentTestUnitId);
            testResult.testUnitDescription =
            {
                id: testUnit.id
            };
            testResult.testUnitId = accessdb.session.get("currentTestUnitId");
            var p = UserTestingProfile.getUserProfileById(accessdb.session.get("testProfileId"));
            testResult.testingProfile = new TestingProfile();
            testResult.testingProfile.setDataWithNoId(p.profile);
            testResult.type = "RESULT";
            var nowD = new Date();
            testResult.runDate = nowD.toJSON();
            removeItemFromArray(testUnitIdList, testUnit.testUnitId);
            if (!skipme)
                testResult.resultValue = $('input[name=result]:checked').val();
            else {
                testUnitIdList.unshift(testUnit.testUnitId);
                return false; //skip test
            }
            if (testResult.resultValue === "skip")
                return false;
            accessdb.session.get("testResultList").push(testResult);
            $("#testUnitId").html("");
            $("#testHref").attr("href", "");
            $("#question").html("");
            $("#steps").html("");
            $("#result").val("");
        }
    }
}