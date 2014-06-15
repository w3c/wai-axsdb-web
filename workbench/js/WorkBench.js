var nowDate = new Date();
var SERVICES_ROOT = window.accessdb.config.URL_API_ROOT;
var QUERY_URL = SERVICES_ROOT + "query/";

var WorkBench = {
	queries : [
			{
				name : "Get all Products with Max Version",
				value : "SELECT name, MAX(version.major)  FROM Product group by name"
			},
			{
				name : "Get all Products with MIN Version",
				value : "SELECT name, MIN(version.major)  FROM Product group by name"
			},
			{
				name : "Get Versions of specific product ordered ",
				value : "select distinct  version.text FROM Product  where name='JAWS' order by version"
			}

	],
	data : {
        webtechsTree : {
            text : "Web Technologies Tree Data",
            apiDocUrl : "",
            objDocUrl : "",
            url : SERVICES_ROOT + "wcag2/browse/webtechs/tree",
            method : "GET",
            obj : null
        },
		reqPrinciplesGetAll : {
			text : "Requirements Principles All",
			apiDocUrl : "",
			objDocUrl : "",
			url : SERVICES_ROOT + "requirements/principles",
			method : "GET",
			obj : null
		},
		reqGuidelinesGetAll : {
			text : "Requirements Guidelines All",
			apiDocUrl : "",
			objDocUrl : "",
			url : SERVICES_ROOT + "requirements/guidelines",
			method : "GET",
			obj : null
		},
	},
	selectedKey : null,
	showData : function() {
		var selectedExample = this.getSelectedExample();
		if (selectedExample.method == "GET" && selectedExample.obj != null) {
			selectedExample.url = selectedExample.url + "?"
					+ encodeURI(jQuery.param(selectedExample.obj));
			selectedExample.obj = undefined;
		}
		$("#rest_request_url").val(selectedExample.url);
		$("#rest_request_method").val(selectedExample.method);
		$("#rest_request_json").text(JSON.stringify(selectedExample.obj));
		$("#apihelp_a").attr("href", selectedExample.apiDocUrl).text(
				selectedExample.apiDocUrl);
		$("#apihelp").attr("src", selectedExample.apiDocUrl);
		$("#schemahelp_a").attr("href", selectedExample.objDocUrl).text(
				selectedExample.objDocUrl);
		$("#schemahelp").attr("src", selectedExample.objDocUrl);
	},
	getSelectedExample : function() {
		return this.data[this.selectedKey];
	},
	runQuery : function() {
		q = encodeURI($("#request_hql_query").val());
		$.ajax({
			beforeSend : function() {
				// $.mobile.loadingMessageTextVisible = true;
				// $.mobile.loadingMessage = "please wait...";
				// $.mobile.showPageLoadingMsg();
			}, // Show spinner
			complete : function() {
				// $.mobile.hidePageLoadingMsg(); //Hide spinner
			},
			type : "GET",
			url : QUERY_URL + q,
			dataType : "json",
			async : true,
			error : function() {
				console
						.log("ajax error: "
								+ arguments.callee.caller.toString());
				// $.mobile.loading( 'hide' ) ;
			},
			complete : function(jqXHR, statusText) {
				$("#rest_response_json").val(jqXHR.responseText);
				$("#rest_response_http").val(jqXHR.status);
			},
		});
	},
	run : function() {
		nowDate = new Date();
		var selectedExample = this.getSelectedExample();
		selectedExample.url = $("#rest_request_url").val();
		selectedExample.method = $("#rest_request_method").val();
		selectedExample.obj = JSON.parse($("#rest_request_json").val());
		if (jQuery.isEmptyObject(selectedExample.obj))
			selectedExample.obj = null;
		$.ajax({
			url : selectedExample.url,
			dataType : "json",
			contentType : "application/json",
			type : selectedExample.method,
			data : JSON.stringify(selectedExample.obj),
			async : true,
			cache : false,
			timeout : 30000,
			processData : false,
			complete : function(jqXHR, statusText) {
				$("#rest_response_json").val(jqXHR.responseText);
				$("#rest_response_http").val(jqXHR.status);
			},
			error : function() {
				console
						.log("ajax error: "
								+ arguments.callee.caller.toString());
				// $.mobile.loading( 'hide' ) ;
			},
			success : function(data) {
				// console.log("done " );
			}
		});
	}
};
WorkBench.showExamples = function() {
	var selectE = $("#examples");
	$(selectE).empty();
	var option = $("<option></option>").attr("value", "").text("Select");
	$(selectE).append(option);
	for ( var example_key in WorkBench.data) {
		// console.log(example_key);
		var example = WorkBench.data[example_key];
		// console.log(example);
		option = $("<option></option>").attr("value", example_key).text(
				example.text);
		$(selectE).append(option);
	}
};
