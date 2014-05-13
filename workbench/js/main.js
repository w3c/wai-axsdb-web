$(function() {
	WorkBench.showExamples();
	$("input[type=submit], button,  a").each(function() {
		$(this).button();
	});
	$("#examples").change(function(event) {
		event.preventDefault();
		WorkBench.selectedKey = $(this).find(":selected").attr("value");
		WorkBench.showData();
		console.log(WorkBench.getSelectedExample());
	});

	$("#runQuery").click(function(event) {
		event.preventDefault();
		WorkBench.runQuery();
	});

	$("#runExample").click(function(event) {
		event.preventDefault();
		WorkBench.run();
	});

});

function getJsonToObj(id) {
	var json = $.ajax({
		type : "GET",
		url : "./json/" + id + ".json",
		async : false,
	}).responseText;
	return JSON.parse(json);
};