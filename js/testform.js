function TestForm(){
	
}

TestForm.initForm = function (sessionId)
{	
	$("#testunitform").attr("action",URL_SERVICE_INSERT_TESTUNIT+"/"+sessionId);
	var myDate = new Date();
	var cdate = myDate.getFullYear()+ '-' + (myDate.getMonth()+1)  + "-" + (myDate.getDate()) ;
	$("#date").attr("value",cdate);
	$("#status").attr("value","UNCONFIRMED");
	$("#language").attr("value","en");
	$("#testUnitId").attr("value",getURLParameter("testUnitId"));
	$( "#date" ).datepicker({ dateFormat: DATE_FORMAT });
	$("#sessionId").attr("value",sessionId);
};
TestForm.buildTestUnitDescription = function ()
{
	var testUnitDescription = new Object();
	testUnitDescription.testUnitId = $("#testUnitId").val();
	testUnitDescription.language = $("#language").val();
	testUnitDescription.title = $("#title").val();
	testUnitDescription.description = $("#description").val();
	testUnitDescription.status = $("#status").val();
	testUnitDescription.creator = $("#creator").val();
	testUnitDescription.version = $("#version").val();
	testUnitDescription.date = $("#date").val();
	testUnitDescription.creator = $("#creator").val();
	var technique = new Object();
	technique.nameId = $("#requirement").val();	
	testUnitDescription.technique = technique;
	
	var testProcedure = new Object();
	testProcedure.yesNoQuestion = $("#yesNoQuestion").text();
	testProcedure.expectedResult = $("#expectedResult").val();
	
	var list = new Array();
	$('textarea[id*="step_"]').each(function(){
			var step_ =  $(this).attr("value"); 
			list.push(step_);
		}
	);
	
	testProcedure.step = list;
	testUnitDescription.testProcedure = testProcedure;
	//var subject = new Object();
	//subject.testFile.src = 
	//testUnitDescription.subject = subject;
	return testUnitDescription;
};
TestForm.testUnitDescriptionSubmit = function ()
{	
	var json_text = JSON.stringify(testUnitDescription, null, 2);
	console.log(json_text);
	$.ajax({ 
		  type: "POST",
		  url: URL_SERVICE_INSERT_TESTUNIT,
		  dataType: "json",
		  async: false,
	      cache: false,
		  statusCode: {
			    404: function() {
			    	msg2user("page not found");
			    }
			  },
		  data: testUnitDescription,
		  success: function(data) {
			  	console.log( "Data Saved ");
			  	testUnitDescription = data; //get stored one
			  	console.log(testUnitDescription);
			  }		
		});	
	console.log("start file uploading");
	uploadFiles(testUnitDescription);
	console.log("done");
};
TestForm.uploadFiles = function (testUnitDescription)
{
	$.ajax({ 
		  type: "POST",
		  url: URL_SERVICE_INSERT_TESTUNIT,
		  dataType: "json",
		  async: false,
	      cache: false,
		  statusCode: {
			    404: function() {
			    	msg2user("page not found");
			    }
			  },
		  data: testUnitDescription,
		  success: function(data) {
			  	console.log( "Data Saved ");
			  	testUnitDescription = data; //get stored one
			  	console.log(testUnitDescription);
			  }		
		});	
	
};
TestForm.submitForm = function ()
{
	var testUnitDescription = buildTestUnitDescription();
	console.log(testUnitDescription);
	var json_text = JSON.stringify(testUnitDescription, null, 2);
	console.log(json_text);
	$("#TestUnitDescription").val(json_text);
	$("#testunitform").submit();
};
