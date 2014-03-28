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
