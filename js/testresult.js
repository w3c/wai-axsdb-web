

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
    this.commit = function () {
        var obj = this;
        $.ajax({
            type: "POST",
            url: URL_SERVICE_COMMIT_TESTRESULT,
            dataType: "json",
            statusCode: {
                404: function () {
                    console.log(URL_SERVICE_COMMIT_RATING + " error");
                }
            },
            data: testUnitDescription,
            success: function (data) {
                obj.setData(data);
            }
        });
    };
}

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
        $("#testingResultsDiv").html("<p>No results yet!</p>");
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




/*


TestResult.buildDataTable = function (filter, holder) {
    var criterios = filter.criterios;
    var technologies = filter.technologies;

    var techniquesQuery = "";
    var atCombinationQuery = "";
    // load all techniques based on criteria and technologies that have test results
    Utils.doSelectQueryWithCallBack(accessdb.config.services.URL_SERVICE_TECHNIQUES_BYQUERY, techniquesQuery, function (atCombinations) {
        // load AT combinations based on the techniques
        Utils.doSelectQueryWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_BYQUERY, atCombinationQuery, function (atCombinations) {
            $(holder).append("<table>");
            $(holder).append("<tr>");
            $(holder).append("<td></td>");
            for (var i in atCombinations) {
                $(holder).append("<th>" + atCombinations[i] + "</th>");
            }
            $(holder).append("</tr>");
            for (var i in techniques) {
                $(holder).append("<tr>")
                    .attr("id", holder + "_" + techniques[i]);
                $(holder).append("<th>" + techniques[i] + "</th>");
                for (var int = 0; int < atCombinations.length; int++) {
                    $(holder).append("<td class='loading'>loading...</td>")
                        .attr("id", holder + "_" + techniques[i] + "_" + int);
                }
                $(holder).append("<tr>");

            }
            $(holder).append("</table>");
            console.log("End loading init table data");
            TestResult.buildDataTableRows(techniques, atCombinations, holder, function (status) {
                console.log("DONE");
            });
        });
    });
};
 */
/**
 * resultsAvailable = Count number of tests results available
 resultsPass = Count number of tests results PASS

 * @param techniques
 * @param atCombinations
 * @param holder

TestResult.buildDataTableRows = function (techniques, atCombinations, holder, callback) {
    try {
        for (var techId in techniques) {
            for (var combId in atCombinations) {
                var technique = techniques[techId];
                //var atCombination = atCombinations[combId];
                var resultsAvailableQuery = "";
                var resultsPassQuery = "";
                var resultsAvailable = Utils.doSelectQuery(accessdb.config.services.URL_SERVICE_TECHNIQUES_BYQUERY, resultsAvailableQuery, false);
                var resultsPass = Utils.doSelectQuery(accessdb.config.services.URL_SERVICE_TECHNIQUES_BYQUERY, resultsPassQuery, false);
                $(holder + "_" + technique + "_" + combId)
                    .append(resultsPass + "PASS out of " + resultsAvailable)
                    .attr("class", TestResult.getDataTableCellClass(resultsAvailable, resultsPass))
                ;
            }
        }
        callback(true);
    }
    catch (err) {
        console.log(err);
        callback(false);
    }
};
TestResult.getDataTableCellClass = function (resultsAvailable, resultsPass) {
    var resultsTestsNumberMinimum = $().val() || 0;
    var resultsTestsPassPercentageMinimun = $().val() || 0;
    if (resultsAvailable < resultsTestsNumberMinimum) {
        return "unknown";
    }
    else {
        if (resultsTestsPassPercentage >= resultsTestsPassPercentageMinimun) {
            return "support";
        }
        else {
            return "no-support";
        }
    }
};
 */
