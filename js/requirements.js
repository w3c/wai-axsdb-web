function Requirements() {}

Requirements.deleteDeepTechnique = function (nameId, callback){
	var url = accessdb.config.services.URL_SERVICE_ADMIN_DEL_TECHNIQUE_DEEP + accessdb.session.sessionId + "/" +nameId;
	Utils.ajaxAsyncWithCallBack(url, "DELETE", null, callback, true);
};


Requirements.getCountFilteredTests = function(reqFilter)
{
	$(".tests_count_filter").html("0");
    accessdb.API.TEST.countFilteredTests(reqFilter, function(error, data, status){
        if(data){
            $(".tests_count_filter").html(data.list);
        }
    });
};




/*
 Requirements.getWebTechnologiesAsListSelect = function(holder,callback) {
 $(holder).empty();
 query = encodeURI("from WebTechnology as t order by t.nameId");
 var option = $("<option data-placeholder='true'>Select Web Technologies</option>");
 $(holder).append(option);
 Utils.doSelectQueryWithCallBack(accessdb.config.services.URL_SERVICE_TECHNIQUES_BYQUERY, query, function(data){
 var technologies = data.list;
 var technologiesIds = [];
 for ( var t in technologies) {
 var technology = technologies[t];
 technologiesIds.push(technology.nameId);
 var option = $("<option></option>")
 .attr("value", technology.nameId);
 if(technology.nameId=="HTML")
 option.attr("checked",true);
 $(option).append(technology.nameId);
 $(holder).append(option);
 }
 callback(holder,technologies.length);
 });
 };

Deprecated
 Requirements.getSCAsListSelect = function(holder,reqFilter,callback) {
 $(holder).empty();
 var q = reqFilter.getCriteriaWithTestsByLevelQuery();
 //console.log(q);
 //console.log("updating sc select");
 query = encodeURI(q);
 var option = $("<option data-placeholder='true' >Select Success Criteria</option>");
 $(holder).append(option);
 Utils.doSelectQueryWithCallBack(accessdb.config.services.URL_SERVICE_TECHNIQUES_BYQUERY, query, function(data){
 var criteria = data.list;
 var criteriaIds = [];
 for ( var c in criteria) {
 var criterio_ = criteria[c];
 var criterio = {
 number: criterio_[0],
 idRef: criterio_[1],
 title: criterio_[2]
 };
 criteriaIds.push(criterio.number);
 var option = $("<option></option>")
 .attr("value", criterio.idRef);
 var text = criterio.number +" "+ criterio.title;
 $(option).append(text);
 $(holder).append(option);
 }
 callback(holder,criteria.length);
 });
 };

 Requirements.getTechniquesAsListSelect = function(holder,reqFilter,callback) {
 $(holder).empty();
 var q = reqFilter.getTechniquesWithTestsByLevelQuery();
 console.log(q);
 console.log("updating tech select");
 query = encodeURI(q);
 var option = $("<option data-placeholder='true' >Select Techniques</option>");
 $(holder).append(option);
 Utils.doSelectQueryWithCallBack(accessdb.config.services.URL_SERVICE_TECHNIQUES_BYQUERY, query, function(data){
 var techniques = data.list;
 var techniquesIds = [];
 for ( var t in techniques) {
 var technique_ = techniques[t];
 var technique = {
 nameId: technique_[0],
 title: technique_[1]
 };
 techniquesIds.push(technique.nameId);
 var option = $("<option></option>")
 .attr("value", technique.nameId);
 var text = technique.nameId + ": " + technique.title;
 $(option).append(text);
 $(holder).append(option);
 }
 callback(holder,techniques.length);
 });
 };
 Requirements.getTests = function(holder,reqFilter,callback)
 {
 $(holder).empty();
 var q = reqFilter.buildQueryForTestCases();
 console.log(q);
 console.log("updating tests select");
 query = encodeURI(q);
 Utils.doSelectQueryWithCallBack(accessdb.config.services.URL_SERVICE_TECHNIQUES_BYQUERY, query, function(data){
 var tests = data.list;
 var testsIds = [];
 var inqueue = false;
 for ( var t in tests) {
 var test_ = tests[t];
 var test = {
 testUnitId: test_[0],
 title: test_[1]
 };
 if(TestResult.isInLocalResults(test.testUnitId)){ //ignore tested
 continue;
 }
 inqueue = accessdb.session.isTestInQueue(test.testUnitId);

 testsIds.push(test.testUnitId);

 var li = $("<li></li>");

 var href1 = $("<a href='#'></a>")
 .prop("role","checkbox")
 .prop("aria-checked","false")
 .attr("data-accessdb-testid",test.testUnitId);

 var id="test_" + test.testUnitId;
 var fieldset = $("<fieldset  data-role='controlgroup'></fieldset>");
 var input =$("<input type='checkbox' name='checkbox-1' id='checkbox-1' class='custom' />")
 .attr("data-accessdb-testid",test.testUnitId)
 .attr("name",test.testUnitId)
 .attr("id",id);

 var label =$("<label for='checkbox-1'>I agree</label>")
 .attr("data-accessdb-testid",test.testUnitId)
 .attr("for",id)
 .addClass("testSelectLabel")
 .html(test.testUnitId + ": " + test.title);

 $(fieldset).append(input);
 $(fieldset).append(label);
 $(href1).append(fieldset);

 var href2 = $("<a></a>")
 .attr("href","#testdetails?id=" + test.testUnitId)
 .attr("class","detailListText")
 .append("more details");

 $(li).append(href1);
 $(li).append(href2);

 if(inqueue)
 {
 $(input).attr("checked",true);
 $(input).removeClass('not-checked').addClass('checked');
 $(input).parent().addClass('checked');
 }
 else
 $(input).parent().addClass('not-checked');
 $(holder).append(li);
 }
 callback(holder,tests.length);
 });
 };
 */
