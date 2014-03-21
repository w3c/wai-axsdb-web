function AccessDBAdmin() {
};

AccessDBAdmin.techniquesParse = function(url, callback) {
	// techniques/{sessionId}/{url}
	AccessDBAdmin.ajaxAsyncWithCallBack(
			accessdb.config.services.URL_SERVICE_ADMIN_TECHNICKSPARSE
					+ accessdb.session.sessionId, "POST", url,
			function(data, textStatus) {
				callback(data, textStatus);
			}, true);
};
AccessDBAdmin.ajaxAsyncWithCallBack = function (url, method, data, callback, showloading)
{
   // url = accessdb.config.URL_WEBAPP_ROOT + url;
    if(showloading == undefined)
        showloading = true;
    if(showloading)
        $.mobile.loading( 'show', { theme: "b", text: "loading from server", textonly: false });
	$.ajax({
        url: url,
        dataType: "json",
        contentType: "application/json",
        type : method,
		data : JSON.stringify(data),
        async: true,
        cache: false,
        timeout: 30000000,
        processData: false,
        error: function(jqXHR, textStatus, errorThrown ){
        	debug("accessdb ajax error: "+errorThrown);
            if(showloading)
                $.mobile.loading( 'hide' ) ;
            callback(jqXHR, jqXHR.status);
        },
        
        success: function(data,textStatus,jqXHR){ 
            if(showloading)
                $.mobile.loading( 'hide' );
			callback(data,jqXHR.status);
        }
    });
};