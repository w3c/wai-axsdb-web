String.prototype.getNums= function(){
    var rx=/[+-]?((\.\d+)|(\d+(\.\d+)?)([eE][+-]?\d+)?)/g,
    mapN= this.match(rx) || [];
    return mapN.map(Number);
};
function Utils(){};

Utils.loadingStart=function(holder){
	var div = $('<div class="progress"><div>Loading…</div></div>');
	$(holder).append(div);
};
Utils.loadingEnd=function(holder){
	$(holder).find(".progress").remove();
};
Utils.treeNodeTolist=function(node, nodeType, list, parent){
	list = list || [];
	parent = $.trim($(node).parent().parent().parent().children().closest("label").text()) || null;
	if(node.type==nodeType && node.selected)
		list.push(node.value);
	if(node.children && node.children.length>0){
		var children = node.children;
		for ( var ind in children) {
			Utils.treeNodeTolist(children[ind], nodeType, list, parent);
		}
	}
	else
		return list;
};
Utils.listToTreeNode= function(list, collapsed){
    collapsed = collapsed || false;
    list = list || [];
    list = list.sort();
    var root = {
        children: [],
        collapsed: collapsed,
        description: null,
        disabled: false,
        label: list.length + " selected test cases",
        noOfChildren: 242,
        selectable: false,
        selected: true,
        subselector: true,
        type: "ROOT",
        value: null    
    };
    for ( var int = 0; int < list.length; int++)
    {
        var el = list[int];
        var node = {
                children: null,
                collapsed: true,
                description: el,
                disabled: false,
                label: el,
                noOfChildren: 242,
                selectable: true,
                selected: true,
                subselector: false,
                type: "testunit",
                value: el    
            };
        root.children.push(node);
    }
    return root;
};
Utils.UIRoleAdapt = function(){
	accessdb.session.userRoles = accessdb.session.userRoles || [];
	$(".accessdbUserMessage").html("");
	var currentPageId = $.mobile.activePage.attr('id');
	if(accessdb.session.isUserCollaborator()) {
		$(".roleExpertsOnly").show();
	}
	else
	{
		$("#" + currentPageId + " .roleExpertsOnly").hide();
		var msg = $('<p></p>').addClass("accessdbUserMessage").append("You need Collaborator Permission for this action!");
		$("#" + currentPageId + " .roleExpertsOnly").parent().append(msg);

	}
	if(accessdb.session.isUserAdmin()) {
		$(".roleAdminOnly").show();
	}
	else
	{
		$("#" + currentPageId + " .roleAdminOnly").hide();
		var msg = $('<p></p>').addClass("accessdbUserMessage").append("You need Admin Permission for this action!");
		$("#" + currentPageId + " .roleAdminOnly").parent().append(msg);
	}
};
Utils.getIDParam=function(){
	var id = Utils.getUrlVars()["id"];
	if((!id) && $.mobile.pageData!=null)
		id = $.mobile.pageData.id;
	if(!id)
	    id = accessdb.paramId;
	return id;
};
Utils.getUrlVars = function()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};
Utils.goBack=function(){
	//$.mobile.back();
};
Utils.activePageReload=function(){
	//$.mobile.activePage.trigger("refresh");
};
Utils.resetForm=function(id) {
	$(id).find("input[type=text], textarea").val("");
	$(id).find("select").prop('selectedIndex',0).selectmenu('refresh');;
	$(id).find("input:radio").attr("checked", false).checkboxradio("refresh");
	//$(id).trigger("create");
};
Utils.arrayToSqlVal=function(arr){
	arr = Utils.removeDuplicates(arr);
	var val = JSON.stringify(arr);
	val = val.substring(1,val.length-1);
	val =  val.replace(/\"/g,'\'');
	return val;
};
Utils.getUniqCol=function(matrix, col){
    var column = [];
    for(var i=0; i<matrix.length; i++){
    	if($.inArray(matrix[i][col], column))
    		column.push(matrix[i][col]);
    }
    return column;
 };

 Utils.removeDuplicates=function(inputArray) {
     var i;
     var len = inputArray.length;
     var outputArray = [];
     var temp = {};

     for (i = 0; i < len; i++) {
         temp[inputArray[i]] = 0;
     }
     for (i in temp) {
         outputArray.push(i);
     }
     return outputArray;
 };

function getURLParameter(name) {
	return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [
			, null ])[1]);
}
function msg2user(msg) {
	$("#msg").html(msg);
}

function dialog2user(holder,msg) {
	$(holder).html(msg);
	//$(holder).dialog("destroy");
	$(holder).dialog({
		modal : true,
		buttons : {
			Ok : function() {
				$(this).dialog("close");
			}
		}
	});
}
function split( val ) {
	return val.split( /,\s*/ );
}
function extractLast( term ) {
	return split( term ).pop();
}
function debug(msg) {
	if(accessdb.config.DEBUG)
		console.log(msg);
}
function getFileNameWithNoExt(x) {
	return x.substr(0, x.lastIndexOf('.'));
}
function removeItemFromArray(thearray, itemtoRemove) {
	var i = thearray.indexOf(itemtoRemove);
	var newarray=[];
	if(i>=0)
	    newarray = thearray.splice(i, 1);
	return newarray;
}

Utils.doSelectQuery = function(url, q, async)
{
	$("#img_loading").show();
	debug(q);
	q = encodeURI(q);
	var out = new Array();
	$.ajax({
		type : "GET",
		url : url + q,
		dataType : "json",
		async: async,
		statusCode : {
			404 : function() {
				$("#img_loading").hide();
				debug("Problem with query "); 
			},
			500 : function() {
				$("#img_loading").hide();
				debug("500");
				debug("Problem with query "); 
			}
		},
		success : function(data) {
			//debug(data);
			out = data;		
			$("#img_loading").hide();
		}		
	});	
	return out;
};
Utils.ajaxAsyncWithCallBack = function (url, method, data, callback, showloading)
{
    $.ajax({
        url: url,
        dataType: "json",
        contentType: "application/json",
        type : method,
        data : JSON.stringify(data),
        async: true,
        cache: false,
        timeout: 30000,
        processData: false,
        success: function(res){
            callback(null, res);
        },
        error: function(request, status, error) {
            callback(error, null);
        }
    });
};
Utils.supports_html5_storage = function () {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
};

Utils.ajaxSync = function (url, method, data)
{
	var out=null;
	$.ajax({
        url: url,
        dataType: "json",
        contentType: "application/json",
        type : method,
		data : JSON.stringify(data),
        async: false,
        cache: false,
        timeout: 30000,
        processData: false,
        error: function(data){
        	debug("ajax error: "+arguments.callee.caller.toString());
        },
        success: function(data){ 
        	out=data;
        }
    });
	return out;
};
Utils.doSelectQueryWithCallBack = function(url, q, callback)
{
	debug(q);
	q = encodeURI(q);
	$.ajax({
		beforeSend: function() { 
			//$.mobile.loadingMessageTextVisible = true;
			//$.mobile.loadingMessage = "please wait...";
			//$.mobile.showPageLoadingMsg();
			}, //Show spinner
        complete: function() { 
        	//$.mobile.hidePageLoadingMsg(); //Hide spinner
        },
		type : "GET",
		url : url + q,
		dataType : "json",
		async: true,
		error: function(error){
        	debug("ajax query error: "+arguments.callee.caller.toString());
            callback(error, null);
        },
		success : function(data) {
			//debug(data);
			callback(null, data);
		}		
	});	
};
/**
* Create and return a "version 4" RFC-4122 UUID string.
*/
Utils.randomUUID = function() {
  var s = [], itoh = '0123456789ABCDEF';
 
  // Make array of random hex digits. The UUID only has 32 digits in it, but we
  // allocate an extra items to make room for the '-'s we'll be inserting.
  for (var i = 0; i <36; i++) s[i] = Math.floor(Math.random()*0x10);
 
  // Conform to RFC-4122, section 4.4
  s[14] = 4;  // Set 4 high bits of time_high field to version
  s[19] = (s[19] & 0x3) | 0x8;  // Specify 2 high bits of clock sequence
 
  // Convert to hex chars
  for (var i = 0; i <36; i++) s[i] = itoh[s[i]];
 
  // Insert '-'s
  s[8] = s[13] = s[18] = s[23] = '-';
 
  return s.join('');
};

