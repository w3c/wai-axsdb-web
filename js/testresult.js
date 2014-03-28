////////////  TestResultViewDataTechnique

function TestResultViewDataTechnique(techniqueNameId, data)
{
};
TestResultViewDataTechnique.loadResultArray = function(filter,techniqueNameId, callback)
{
    Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_VIEWTECHNIQUE + techniqueNameId, "POST", filter, function(data){
        callback(data);
    },false); 
};
TestResultViewDataTechnique.loadTable = function(filter, techniqueNameId)
{
    TestResultViewDataTechnique.loadResultArray(filter,techniqueNameId, function(data){
        var dataRowsHTML = TestResultViewDataTechnique.dataArrayToTableRows(data.list).html();
        $("#resultstestresultsviewTable tbody").empty();
        $(".resultsSummaryTechniquesFiltered").html(data.length);
        $("#resultstestresultsviewTable tbody").append(dataRowsHTML);
        $(".techniqueId").html(techniqueNameId);
    });  
};
TestResultViewDataTechnique.dataArrayToTableRows = function(dataArray)
{
    var tbody = $("<tbody/>");
    for ( var i = 0; i < dataArray.length; i++)
    {
        var data = dataArray[i];
        tbody.append(TestResultViewDataTechnique.dataToTableRow(data));
    }
    return tbody;
};
TestResultViewDataTechnique.dataToTableRow = function(data)
{
    var tr = $("<tr/>");
    // Test case    Result  OS  Plugin  Contributor Comment
    var row = [];
    row.push('<a href="#testdetails?id=' + data.testResult.testUnitDescription.testUnitId + '">' + data.testResult.testUnitDescription.testUnitId + '</a>');
    row.push(data.testResult.resultValue);
    if(data.testResult.testingProfile.platform.name)
        row.push(data.testResult.testingProfile.platform.name + " " +  data.testResult.testingProfile.platform.version.text);
    else
        row.push("None");
    if(data.testResult.testingProfile.plugin.name)
        row.push(data.testResult.testingProfile.plugin.name + " " +  data.testResult.testingProfile.plugin.version.text);
    else
        row.push("None");
    row.push(data.contributor);
    row.push(data.testResult.comment);
    for ( var i = 0; i < row.length; i++)
    {
        var td;
        if(i==0)
            td = $('<th scope="col" />').html(row[i]);
        else
            td = $("<td/>").html(row[i]);
        tr.append(td);
    }
    return tr;
};


////////////  TestResultFullViewTechnique

function TestResultFullViewTechnique(techniqueNameId, data)
{
    //this.data = data || []; //cols and rows
};
TestResultFullViewTechnique.loadTable = function(filter, techniqueNameId)
{
    TestResultFullViewTechnique.loadResultArray(filter,techniqueNameId, function(data){
        //var testResultFullViewTechnique = new TestResultFullViewTechnique(techniqueNameId,data);
        $(".techniqueId").html(techniqueNameId);
        accessdb.resultsviewdata={};
        accessdb.resultsviewdata.techId = techniqueNameId;
        TestResultFullViewTechnique.dataArrayToTable(data, "#testResultFullViewTechniqueDiv");
    });  
};

TestResultFullViewTechnique.dataArrayToTable = function(testResultFullViewTechnique, selector)
{
    var table = $("<table/>");
    for ( var i = 0; i < testResultFullViewTechnique.rows.length; i++)
    {
        var rowData = testResultFullViewTechnique.rows[i];
        var row = TestResultFullViewTechnique.dataToTableRow(rowData);
        if(i==0)
            row.find("th:first()").html("");
        table.append(row);
    }
    $(selector).empty();
    $(selector).append(table);
    
};
TestResultFullViewTechnique.dataToTableRow = function(rowData)
{
    var tr = $("<tr/>");
    for ( var i = 0; i < rowData.length; i++)
    {
        var cellData = new TestResultFullViewTechniqueCell();
        cellData.load(rowData[i]);
        tr.append(cellData.toTableCell());
    }
    return tr;
};
function TestResultFullViewTechniqueCell(){
    this.type = "undefined";
    this.product = null; 
    this.noOfPass = "undefined";
    this.noOfAll = "undefined";
    this.load = function(obj){
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) this[attr] = obj[attr];
        }  
    };
    this.toTableCell = function(){
        var cell = null;;
        if(this.type !== "undefined")
        {
            if(this.type === "th")
            {
                if(!this.product)
                {
                    cell = $("<th />").append("No specified");
                }
                else{
                    if(this.product.name=="")
                    {
                        cell = $("<th />")
                        .attr("data-accessdbProductName", this.product.name)
                        .attr("data-accessdbProductVer", this.product.version.text)
                        .append("None");
                    }
                    else
                    {
                         cell = $("<th />")
                            .attr("data-accessdbProductName", this.product.name)
                            .attr("data-accessdbProductVer", this.product.version.text)
                            .append(this.product.name + " " + this.product.version.text);
                    }
                                       
                }
            }
            else if(this.type === "td")
            {
                if(parseInt(this.noOfAll)>0)
                {
                    var a = $('<a href="" class="" />')
                        .attr("title", "show test results of this combination")
                        .attr("class","TestResultFullViewTechniqueAnchor")
                        .append(this.noOfPass + " / " + this.noOfAll);
                    $(a).bind("click", function(e){
                        e.preventDefault();
                        var row = $(this).parent().index();
                        var col = $(this).parent().parent().index();
                        var selectorBrowser = "#testResultFullViewTechniqueDiv table tr:nth-child(1) th:nth-child("+(row+1)+")";
                        var agentP = new Product($(selectorBrowser).attr("data-accessdbproductname"),$(selectorBrowser).attr("data-accessdbproductver"));
                        var selectorAT = "#testResultFullViewTechniqueDiv table tr:nth-child("+(col+1)+") th:nth-child(1)";
                        var atP = new Product($(selectorAT).attr("data-accessdbproductname"),$(selectorAT).attr("data-accessdbproductver"));
                        accessdb.resultsviewdata.ua = agentP;
                        accessdb.resultsviewdata.at = atP;
                        
                        $.mobile.changePage( "#resultstestresultsview");
                        
                        
                        
                    });
                    cell = $("<td />").append(a);
                }
                else
                {
                     cell = $("<td />").html("No result");
                }
            }
        }
        return cell;
    };
};

TestResultFullViewTechnique.loadResultArray = function(filter,techniqueNameId, callback)
{
    Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_FULLVIEWTECHNIQUE + techniqueNameId, "POST", filter, function(data){
        callback(data);
    },false); 
};


////////////////
function TestResultDataOverview(technique, noOfPass, noOfAll, noOfUniqueCombinations, noOfUniqueContributors)
{
    this.technique = technique || undefined;
    this.noOfPass = noOfPass || undefined;
    this.noOfAll = noOfAll || undefined;
    this.noOfUniqueCombinations = noOfUniqueCombinations || undefined;
    this.noOfUniqueContributors = noOfUniqueContributors || undefined;
};
TestResultDataOverview.loadTable = function(filter)
{
    TestResultDataOverview.loadResultArray(filter, function(data){
        var dataRowsHTML = TestResultDataOverview.dataArrayToTableRows(data).html();
        $("#accessdbTestResultsOverviewTable tbody").empty();
        $(".resultsSummaryTechniquesFiltered").html(data.length);
        $("#accessdbTestResultsOverviewTable tbody").append(dataRowsHTML);
    });  
};
TestResultDataOverview.loadResultArray = function(filter, callback)
{
    var data = [ new TestResultDataOverview("H2", "12", "15", "2", "4"),
                 new TestResultDataOverview("H3", "12", "15", "2", "4"),
                 new TestResultDataOverview("H4", "12", "5", "2", "4"),
                 new TestResultDataOverview("H5", "12", "15", "2", "4")
                ];
    
    if(!filter)
        callback(data); 
    else
    {
        Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_DATAOVERVIEW, "POST", filter, function(data){
            callback(data.list);
        });  
    }

};
TestResultDataOverview.dataToTableRow = function(testResultDataOverview)
{
    var td1 = $("<td/>");
    td1.append(testResultDataOverview.technique);
    var a = $("<a />")
            .attr("title","load Full view for technique " + testResultDataOverview.technique)
            .attr("href","#resultstechniqueview?id="+testResultDataOverview.technique)
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
TestResultDataOverview.dataArrayToTableRows = function(testResultDataOverviewArray)
{
    var tbody = $("<tbody/>");
    var count = 0;
    var overallPass = 0;
    var overallAll = 0;
    for ( var i = 0; i < testResultDataOverviewArray.length; i++)
    {
        var testResultDataOverview = testResultDataOverviewArray[i];
    if(testResultDataOverview.noOfAll && parseInt(testResultDataOverview.noOfAll)>0)
    {
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

function TestResult(unitId, resultValue, testingProfile, rating) {
    this.testingProfile = testingProfile;
    this.testUnitId = unitId;
    this.testUnitDescription = null;
    this.resultValue = resultValue;
    this.runDate = "";
    this.setData=function(data)
    {
        for (var property in data) 
        {
            this[property] = data[property];
        }
    };
    this.commit = function()
    {
        var obj = this;
        $.ajax({ 
              type: "POST",
              url: URL_SERVICE_COMMIT_TESTRESULT,
              dataType: "json",
              statusCode: {
                    404: function() {
                        console.log(URL_SERVICE_COMMIT_RATING + " error");
                    }
                  },
              data: testUnitDescription,
              success: function(data) {
                  obj.setData(data);
                  }     
            }); 
    };
}

TestResult.viewTestingResultsBeforeSave = function(testResultList)
{
    $(".tests_done").html(accessdb.session.testResultList.length);
    var divListTestsSelected = $(".divPreSaveListTestsSelected").empty();
    if(accessdb.session.testResultList.length>0)
    {
        divListTestsSelected = $(divListTestsSelected).append("<ul />");
        accessdb.session.testResultList = accessdb.session.testResultList.sort();
        for ( var i = 0; i < accessdb.session.testResultList.length; i++)
        {
            var result = accessdb.session.testResultList[i];
            var a = $('<a class="testresultDelete" data-inline="true" data-mini="true" data-accessdb-id="" data-role="button" data-icon="delete" data-iconpos="notext">Delete</a>')
                .attr("data-accessdb-id",result.testUnitId);
            $(a).on('click', function (event) {
                event.preventDefault();
                var id = $(event.target).closest("a").attr("data-accessdb-id");
                accessdb.session.testResultList = jQuery.grep(accessdb.session.testResultList, function(el, i ) {
                    return ( el.testUnitId !== id);
                });
                TestResult.viewTestingResultsBeforeSave();
                $("#testingresults").trigger("create");
            }); 
            
            var aRetest = $('<a class="testresultRetest" data-inline="true" data-mini="true" data-accessdb-id="" data-role="button" data-icon="refresh" data-iconpos="notext">Put selected for re-testing</a>')
            .attr("data-accessdb-id",result.testUnitId);
            $(aRetest).on('click', function (event) {
                var id = $(event.target).closest("a").attr("data-accessdb-id");
                accessdb.session.testResultList = jQuery.grep(accessdb.session.testResultList, function(el, i ) {
                    return ( el.testUnitId !== id);
                });
                accessdb.session.testUnitIdList.push(id);
                accessdb.session.testUnitIdList.reverse();
                TestResult.viewTestingResultsBeforeSave();
                accessdb.session.updateUI();
                $("#testingresults").trigger("create");
            });  
            var li = $("<li />").html(result.testUnitId + " [Outcome: " + result.resultValue + " with Profile:  " + UserTestingProfile.toString(result.testingProfile)+ "]").append(a).append(aRetest);
            $(divListTestsSelected).find("ul").append(li);
        }
    }
    else{
        $(".divPreSaveListTestsSelected").html("<p>No results yet!</p>");
    }
};
TestResult.buildDataTable = function(filter, holder){
    var criterios = filter.criterios;
    var technologies = filter.technologies;
    
    var techniquesQuery = "";
    var atCombinationQuery = "";
    // load all techniques based on criteria and technologies that have test results
    Utils.doSelectQueryWithCallBack(accessdb.config.services.URL_SERVICE_TECHNIQUES_BYQUERY, techniquesQuery, function(atCombinations){
        // load AT combinations based on the techniques
        Utils.doSelectQueryWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_BYQUERY, atCombinationQuery, function(atCombinations){
            $(holder).append("<table>");
            $(holder).append("<tr>");
            $(holder).append("<td></td>");
            for ( var i in atCombinations) {
                $(holder).append("<th>"+atCombinations[i] + "</th>");
            }
            $(holder).append("</tr>");
            for ( var i in techniques) {
                $(holder).append("<tr>")
                    .attr("id",holder+"_"+techniques[i]);
                $(holder).append("<th>"+techniques[i] + "</th>");
                for ( var int = 0; int < atCombinations.length; int++) {
                    $(holder).append("<td class='loading'>loading...</td>")
                        .attr("id",holder+"_"+techniques[i] + "_" + int);
                }
                $(holder).append("<tr>");

            }
            $(holder).append("</table>");
            console.log("End loading init table data");
            TestResult.buildDataTableRows(techniques, atCombinations, holder, function(status){
                console.log("DONE");
            });
        });
    });
};
/**
 * resultsAvailable = Count number of tests results available 
   resultsPass = Count number of tests results PASS
   
 * @param techniques
 * @param atCombinations
 * @param holder
 */
TestResult.buildDataTableRows = function(techniques, atCombinations, holder, callback){
    try{
        for ( var techId in techniques) {
            for ( var combId in atCombinations) {
                var technique = techniques[techId];
                //var atCombination = atCombinations[combId];
                var resultsAvailableQuery = "";
                var resultsPassQuery = "";
                var resultsAvailable = Utils.doSelectQuery(accessdb.config.services.URL_SERVICE_TECHNIQUES_BYQUERY, resultsAvailableQuery, false);
                var resultsPass = Utils.doSelectQuery(accessdb.config.services.URL_SERVICE_TECHNIQUES_BYQUERY, resultsPassQuery, false);
                $(holder+"_"+technique + "_" + combId)
                    .append(resultsPass + "PASS out of "+ resultsAvailable)
                    .attr("class", TestResult.getDataTableCellClass(resultsAvailable, resultsPass))
                    ;
            }
        }   
        callback(true);
    }
    catch(err){
        console.log(err);
        callback(false);
    }
};
TestResult.getDataTableCellClass = function(resultsAvailable, resultsPass){
    var resultsTestsNumberMinimum = $().val() || 0;
    var resultsTestsPassPercentageMinimun = $().val() || 0;
    
    if(resultsAvailable<resultsTestsNumberMinimum){
        return "unknown";
    }
    else{
        if(resultsTestsPassPercentage >= resultsTestsPassPercentageMinimun){
            return "support";
        }
        else{
            return "no-support";
        }
    }
};



TestResult.isInLocalResults = function(unitid){
    return  accessdb.session.testResultList.some(function(element, index, array) {
            return (element.testUnitId == unitid);
    });
};
TestResult.removeByUnitId = function(unitid){
    var indx = -1;
    var filtered =   accessdb.session.testResultList.filter(function(element, index, array) {
        if(element.testUnitId == unitid)
            indx = index;
            return (element.testUnitId == unitid);
    });
    if(indx>-1){
        accessdb.session.testResultList.splice(indx , 1);
    }
    
};