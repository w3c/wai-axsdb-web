/**
 * assuming results an array of json objects ;
 * {
    noOfAll: "0"
    noOfPass: "0"
    technique: "ARIA6"
    techniqueTitle: "Using aria-label to provide labels for objects"
 * }
 *
 */
accessdb.Views.TestResultsDataOverview = function (){
    this.$el = $("#TestResultsDataOverviewDiv");
    this.results = null;
    this.render = function(){
        if(this.results){
            var template = _.template( $("#TestResultsDataOverview_template").html(), {results: this.results} );
            this.$el.html( template );
        }
    };
    this.fetch = function (filter, callback){
        var self = this;
        if (!filter){
            console.warn("No filter defined!");
        }
        else {
            accessdb.API.TESTRESULT.loadTestResultsDataOverview(filter, function (error, data, status) {
                if(!error){
                    console.log(data);
                    self.results = data;
                    callback(null, self.results);
                }
                callback(error);
            }, self.$el);
        }
    };
}


















////////////////
function TestResultDataOverview(technique, noOfPass, noOfAll, noOfUniqueCombinations, noOfUniqueContributors) {
    this.technique = technique || undefined;
    this.noOfPass = noOfPass || undefined;
    this.noOfAll = noOfAll || undefined;
    this.noOfUniqueCombinations = noOfUniqueCombinations || undefined;
    this.noOfUniqueContributors = noOfUniqueContributors || undefined;
};
TestResultDataOverview.loadTable = function (filter) {
    TestResultDataOverview.loadResultArray(filter, function (error, data, status) {
        var dataRowsHTML = TestResultDataOverview.dataArrayToTableRows(data).html();
        $("#accessdbTestResultsOverviewTable tbody").empty();
        $(".resultsSummaryTechniquesFiltered").html(data.length);
        $("#accessdbTestResultsOverviewTable tbody").append(dataRowsHTML);
    });
};
TestResultDataOverview.loadResultArray = function (filter, callback) {
    var data = [ new TestResultDataOverview("H2", "12", "15", "2", "4"),
        new TestResultDataOverview("H3", "12", "15", "2", "4"),
        new TestResultDataOverview("H4", "12", "5", "2", "4"),
        new TestResultDataOverview("H5", "12", "15", "2", "4")
    ];

    if (!filter)
        callback(data);
    else {
        Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_DATAOVERVIEW, "POST", filter, function (error, data, status) {
            callback(data.list);
        });
    }

};
TestResultDataOverview.dataToTableRow = function (testResultDataOverview) {
    var td1 = $("<td/>");
    td1.append(testResultDataOverview.technique);
    var a = $("<a />")
        .attr("title", "load Full view for technique " + testResultDataOverview.technique)
        .attr("href", "#resultstechniqueview?id=" + testResultDataOverview.technique)
        .append(testResultDataOverview.noOfPass + "/" + testResultDataOverview.noOfAll);
    var td2 = $("<td/>");
    td2.append(a);
    td2.append(" (" + testResultDataOverview.noOfUniqueCombinations + " unique combinations; " + testResultDataOverview.noOfUniqueContributors +
        " different contributors)");
    var tr = $("<tr/>");
    tr.append(td1);
    tr.append(td2);
    return tr;
};
TestResultDataOverview.dataArrayToTableRows = function (testResultDataOverviewArray) {
    var tbody = $("<tbody/>");
    var count = 0;
    var overallPass = 0;
    var overallAll = 0;
    for (var i = 0; i < testResultDataOverviewArray.length; i++) {
        var testResultDataOverview = testResultDataOverviewArray[i];
        if (testResultDataOverview.noOfAll && parseInt(testResultDataOverview.noOfAll) > 0) {
            tbody.append(TestResultDataOverview.dataToTableRow(testResultDataOverview));
            count++;
            overallPass = overallPass + parseInt(testResultDataOverview.noOfPass);
            overallAll = overallAll + parseInt(testResultDataOverview.noOfAll);

        }

    }
    $('.resultsSummaryTechniquesApply').html(count);
    $('.resultsSummaryPassed').html(overallPass);
    $('.resultsSummaryAll').html(overallAll);
    return tbody;
};


////////////  TestResultViewDataTechnique

function TestResultViewDataTechnique(techniqueNameId, data) {
};
TestResultViewDataTechnique.loadResultArray = function (filter, techniqueNameId, callback) {
    Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_VIEWTECHNIQUE + techniqueNameId, "POST", filter, function (data) {
        callback(data);
    }, false);
};
TestResultViewDataTechnique.loadTable = function (filter, techniqueNameId) {
    TestResultViewDataTechnique.loadResultArray(filter, techniqueNameId, function (data) {
        var dataRowsHTML = TestResultViewDataTechnique.dataArrayToTableRows(data.list).html();
        $("#resultstestresultsviewTable tbody").empty();
        $(".resultsSummaryTechniquesFiltered").html(data.length);
        $("#resultstestresultsviewTable tbody").append(dataRowsHTML);
        $(".techniqueId").html(techniqueNameId);
    });
};
TestResultViewDataTechnique.dataArrayToTableRows = function (dataArray) {
    var tbody = $("<tbody/>");
    for (var i = 0; i < dataArray.length; i++) {
        var data = dataArray[i];
        tbody.append(TestResultViewDataTechnique.dataToTableRow(data));
    }
    return tbody;
};
TestResultViewDataTechnique.dataToTableRow = function (data) {
    var tr = $("<tr/>");
    // Test case    Result  OS  Plugin  Contributor Comment
    var row = [];
    row.push('<a href="#testdetails?id=' + data.testResult.testUnitDescription.testUnitId + '">' + data.testResult.testUnitDescription.testUnitId + '</a>');
    row.push(data.testResult.resultValue);
    if (data.testResult.testingProfile.platform.name)
        row.push(data.testResult.testingProfile.platform.name + " " + data.testResult.testingProfile.platform.version.text);
    else
        row.push("None");
    if (data.testResult.testingProfile.plugin.name)
        row.push(data.testResult.testingProfile.plugin.name + " " + data.testResult.testingProfile.plugin.version.text);
    else
        row.push("None");
    row.push(data.contributor);
    row.push(data.testResult.comment);
    for (var i = 0; i < row.length; i++) {
        var td;
        if (i == 0)
            td = $('<th scope="col" />').html(row[i]);
        else
            td = $("<td/>").html(row[i]);
        tr.append(td);
    }
    return tr;
};
////////////  TestResultFullViewTechnique

function TestResultFullViewTechnique(techniqueNameId, data) {
    //this.data = data || []; //cols and rows
};
TestResultFullViewTechnique.loadTable = function (filter, techniqueNameId) {
    TestResultFullViewTechnique.loadResultArray(filter, techniqueNameId, function (data) {
        //var testResultFullViewTechnique = new TestResultFullViewTechnique(techniqueNameId,data);
        $(".techniqueId").html(techniqueNameId);
        accessdb.resultsviewdata = {};
        accessdb.resultsviewdata.techId = techniqueNameId;
        TestResultFullViewTechnique.dataArrayToTable(data, "#testResultFullViewTechniqueDiv");
    });
};

TestResultFullViewTechnique.dataArrayToTable = function (testResultFullViewTechnique, selector) {
    var table = $("<table/>");
    for (var i = 0; i < testResultFullViewTechnique.rows.length; i++) {
        var rowData = testResultFullViewTechnique.rows[i];
        var row = TestResultFullViewTechnique.dataToTableRow(rowData);
        if (i == 0)
            row.find("th:first()").html("");
        table.append(row);
    }
    $(selector).empty();
    $(selector).append(table);

};
TestResultFullViewTechnique.dataToTableRow = function (rowData) {
    var tr = $("<tr/>");
    for (var i = 0; i < rowData.length; i++) {
        var cellData = new TestResultFullViewTechniqueCell();
        cellData.load(rowData[i]);
        tr.append(cellData.toTableCell());
    }
    return tr;
};
function TestResultFullViewTechniqueCell() {
    this.type = "undefined";
    this.product = null;
    this.noOfPass = "undefined";
    this.noOfAll = "undefined";
    this.load = function (obj) {
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) this[attr] = obj[attr];
        }
    };
    this.toTableCell = function () {
        var cell = null;
        ;
        if (this.type !== "undefined") {
            if (this.type === "th") {
                if (!this.product) {
                    cell = $("<th />").append("No specified");
                }
                else {
                    if (this.product.name == "") {
                        cell = $("<th />")
                            .attr("data-accessdbProductName", this.product.name)
                            .attr("data-accessdbProductVer", this.product.version.text)
                            .append("None");
                    }
                    else {
                        cell = $("<th />")
                            .attr("data-accessdbProductName", this.product.name)
                            .attr("data-accessdbProductVer", this.product.version.text)
                            .append(this.product.name + " " + this.product.version.text);
                    }

                }
            }
            else if (this.type === "td") {
                if (parseInt(this.noOfAll) > 0) {
                    var a = $('<a href="" class="" />')
                        .attr("title", "show test results of this combination")
                        .attr("class", "TestResultFullViewTechniqueAnchor")
                        .append(this.noOfPass + " / " + this.noOfAll);
                    $(a).bind("click", function (e) {
                        e.preventDefault();
                        var row = $(this).parent().index();
                        var col = $(this).parent().parent().index();
                        var selectorBrowser = "#testResultFullViewTechniqueDiv table tr:nth-child(1) th:nth-child(" + (row + 1) + ")";
                        var agentP = new Product($(selectorBrowser).attr("data-accessdbproductname"), $(selectorBrowser).attr("data-accessdbproductver"));
                        var selectorAT = "#testResultFullViewTechniqueDiv table tr:nth-child(" + (col + 1) + ") th:nth-child(1)";
                        var atP = new Product($(selectorAT).attr("data-accessdbproductname"), $(selectorAT).attr("data-accessdbproductver"));
                        accessdb.resultsviewdata.ua = agentP;
                        accessdb.resultsviewdata.at = atP;

                        $.mobile.changePage("#resultstestresultsview");


                    });
                    cell = $("<td />").append(a);
                }
                else {
                    cell = $("<td />").html("No result");
                }
            }
        }
        return cell;
    };
};

TestResultFullViewTechnique.loadResultArray = function (filter, techniqueNameId, callback) {
    Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_FULLVIEWTECHNIQUE + techniqueNameId, "POST", filter, function (data) {
        callback(data);
    }, false);
};




function Results() {
}

Results.getATVersionsOfATName=function(){
	var name = $("#userAgent").val(); 
	var q = "select distinct testingProfile.assistiveTechnology.version.text " +
			"from TestResult where testingProfile.assistiveTechnology.name='"+name+"'";
	q = encodeURI(q);
	var data = Utils.doSelectQuery(accessdb.config.services.URL_SERVICE_QUERY , q);
	return data.list;	
};

Results.getAllResults=function(where)
{
	console.log(reqFilter);
	if(where==null)
		query = encodeURI("select count(u) from TestUnitDescription as u ");
	else
		query = encodeURI("select count(u) from TestUnitDescription as u where "+where);
	var no = Utils.doSelectQuery(accessdb.config.services.URL_SERVICE_QUERY, query, false).list;
	console.log(no);
	return no;
};
