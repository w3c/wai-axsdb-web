function TestResult(unitId, resultValue, testingProfile, rating) {
    this.testingProfile = testingProfile;
    this.testUnitDescription = unitId;
    this.resultValue = resultValue;
    this.runDate = "";
    this.setData = function (data) {
        for (var property in data) {
            this[property] = data[property];
        }
    };
};
TestResult.initHandlers = function(){
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
    if(_.contains(accessdb.session.get("resultsFilter").statusList, "UNCONFIRMED")){
        $("#showResultsUnconfirmed").prop( "checked", true );
    }
    $(document).on("click", "#showResultsUnconfirmed", function(event){
        if($(this).is(':checked')) {
            accessdb.session.get("resultsFilter").statusList = ["ACCEPTED", "UNCONFIRMED"];
        } else {
            accessdb.session.get("resultsFilter").statusList = ["ACCEPTED"];
        }
        window.accessdb.session.save();
        //window.accessdb.appRouter.reload();
        accessdb.TreeHelper.loadDataViews();

    });
    $(document).on("click", ".deleteTestResult", function (event) {
        event.preventDefault();
        var id = $(event.target).attr("value");
        var txt;
        var r = confirm("Are you sure you want to delete this test result?");
        if (r == true) {
            accessdb.API.TESTRESULT.deleteTestResultById(id, function (error, data, status) {
                if(!error){
                    Utils.msg2user("deleted");
                    window.accessdb.appRouter.reload();
                }
                else
                    Utils.msg2user("not deleted");
            });
        }
    });
};
TestResult.viewTestingResultsBeforeSave = function () {
    var testResultList = accessdb.session.get("testResultList");
    if(testResultList && testResultList.length>0){
        var tmp = _.template($('#test-run-finish-resultsList').html(), {
            results: accessdb.session.get("testResultList")
        });
        $("#testingResultsDiv").empty();
        $("#testingResultsDiv").append(tmp);
    }
    else {
        $("#testingResultsDiv").html("<p>Currently found no test result data into your session.</p>");
    }
};
TestResult.isInLocalResults = function (unitid) {
    return  accessdb.session.testResultList.some(function (element, index, array) {
        return (element.testUnitId == unitid);
    });
};
TestResult.removeByUnitId = function (unitid) {
    var indx = -1;
    var filtered = accessdb.session.get("testResultList").filter(function (element, index, array) {
        if (element.testUnitId == unitid)
            indx = index;
        return (element.testUnitId == unitid);
    });
    if (indx > -1) {
        accessdb.session.get("testResultList").splice(indx, 1);
    }
};