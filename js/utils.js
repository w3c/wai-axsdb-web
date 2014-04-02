String.prototype.getNums= function(){
    var rx=/[+-]?((\.\d+)|(\d+(\.\d+)?)([eE][+-]?\d+)?)/g,
    mapN= this.match(rx) || [];
    return mapN.map(Number);
};
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


function Utils(){};

Utils.loadingStart=function(holder){
	var div = $('<div class="progress"><div>Loading…</div></div>');
	$(holder).append(div);
};
Utils.loadingEnd=function(holder){
	$(holder).find(".progress").remove();
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

Utils.eraseCookie = function (name) {
    Utils.createCookie(name,"",-1);
}
Utils.readCookie = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
};
Utils.createCookie = function (name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
};

Utils.resetForm=function(id) {
	$(id).find("input[type=text], textarea").val("");
	$(id).find("select").prop('selectedIndex',0);
	$(id).find("input:radio").attr("checked", false);
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
Utils.msg2user = function (msg) {
    //window.alert(msg);
	$("#msg2user").html(msg);
    $("#msg2user" ).dialog();
}

function split( val ) {
	return val.split( /,\s*/ );
}
function extractLast( term ) {
	return split( term ).pop();
}
function getFileNameWithNoExt(x) {
	return x.substr(0, x.lastIndexOf('.'));
}
Utils.removeItemFromArray = function (thearray, itemtoRemove) {
    thearray = _.filter(thearray, function(item) {
        return item === itemtoRemove;
    });
	return thearray;
}

Utils.doSelectQuery = function(url, q, async)
{
	$("#img_loading").show();
	console.log(q);
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
				console.log("Problem with query ");
			},
			500 : function() {
				$("#img_loading").hide();
				console.log("500");
				console.log("Problem with query ");
			}
		},
		success : function(data) {
			//console.log(data);
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
        success: function(data, textStatus, jqXHR){
            callback(null, data, jqXHR.status);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            callback(jqXHR, null, null);
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
        	console.log("ajax error: "+arguments.callee.caller.toString());
        },
        success: function(data){ 
        	out=data;
        }
    });
	return out;
};
Utils.doSelectQueryWithCallBack = function(url, q, callback)
{
	console.log(q);
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
        	console.log("ajax query error: "+arguments.callee.caller.toString());
            callback(error, null);
        },
		success : function(data) {
			//console.log(data);
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

