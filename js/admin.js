/**
 * Admin functoinality
 * NOTDEFINED = -1; SAME = 100; ONLY_IN_WCAG = 101; ONLY_IN_DB = 102; NEWER = 201; OLDER = 202; OK = 200; FAIL = 302;
 */
accessdb.admin = {};
accessdb.admin.init = function (){
    $("#admin-technique-results-div").empty();
    $("#techImportBtn").hide();

    $("#techImportBtn").click(function() {
        var selectedIds = [];
        $("input[name='admin-technique-sync']:checked").each(function(index, value){
            selectedIds.push($(value).attr("value"));
        });
        var selected = _.filter(accessdb.admin.responses, function(e){
            return _.contains(selectedIds, e.entity.technique);
        });
        Utils.loadingStart("#admin-technique-results-div");
        accessdb.admin.techniquesSync(selected, function(error, data, status) {
            Utils.loadingEnd("#admin-technique-results-div");
            if(error){
                if(error.status===302){
                    $("#admin-technique-results-div").html("GitHub REST timeout limit reached! Please try again in some minutes! ");
                }
                else{
                    $("#admin-technique-results-div").html(error.responseText);
                }
                return false;
            }
            if(status === 201){
                accessdb.admin.responses = [];
                if(data.length>0){
                    var template = _.template($('#admin-technique-sync-response-synced-template').html(), {results:data});
                    $("#admin-technique-results-div").empty();
                    $("#admin-technique-results-div").html(template);
                }
                else
                {
                    $("#admin-technique-results-div").html("Nothing new to add");
                }
                $("#techImportBtn").hide();
            }
        });
    });
    $("#techImportPrepareBtn").click(function() {
        var url = $("#techImportURL").val();
        Utils.loadingStart("#admin-technique-results-div");
        accessdb.admin.techniquesImportPrepare(url, function(error, data, status) {
            Utils.loadingEnd("#admin-technique-results-div");
            if(error){
                if(error.status===302){
                    $("#admin-technique-results-div").html("GitHub REST timeout limit reached! Please try again in some minutes! ");
                }
                else{
                    $("#admin-technique-results-div").html(error.responseText);
                }
                return false;
            }
            if(status === 200){
                accessdb.admin.responses = data;
                if(data.length>0){
                    var template = _.template($('#admin-technique-sync-response-prepare-template').html(), {results:data});
                    $("#admin-technique-results-div").empty();
                    $("#admin-technique-results-div").html(template);
                }
                else
                {
                    $("#admin-technique-results-div").html("Nothing new to add");
                }
                $("#techImportBtn").show();
            }
            else{
                $("#admin-technique-results-div").html("Unknown Problem");
                console.error(status)
            }
        });
    });

    /*
    $("#adminDoDeleteTechniques").click(function(){
        var nodeList = $("#adminWebTechAndTechniqueTreeDiv ul").treevueJson();
        var nodeListChildren = nodeList[0].children;
        var list = [];
        for ( var ind in nodeListChildren) {
            Utils.treeNodeTolist(nodeListChildren[ind], "Technique", list);
        }
        var r = confirm("You are about to delete " + list.length + " techniques including tests and test results");
        if (r == true)
        {
            console.log(list);
            for ( var i in list) {
     accessdb.API.WGAG2.deleteDeepTechnique(list[i], function(data, error){
                    if(error){
                        console.log(error);
                        return;
                    }
                    Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_WEBTECHSWITHTECHNIQUES_TREE, "GET", null, function(data){
                        $("#adminWebTechAndTechniqueTreeDiv").empty();
                        $.treevue([data], "adminWebTechAndTechniqueTree", {useAria: false}).appendTo('#adminWebTechAndTechniqueTreeDiv');
                    });
                    console.log(data);

                });
            }
        }
        else
        {
            console.log("cancel");
        }

    });
    */
};

accessdb.admin.techniquesImportPrepare = function(url, callback) {
    accessdb.admin.ajaxAsyncWithCallBack(
            accessdb.config.services.URL_SERVICE_ADMIN_TECHNICKSPARSE
            + accessdb.session.get("sessionId") +"/import-prepare", "POST", url,
        function(error, data, status) {
            callback(error, data, status);
        });
};
accessdb.admin.techniquesSync = function(selected, callback) {
    accessdb.admin.ajaxAsyncWithCallBack(
            accessdb.config.services.URL_SERVICE_ADMIN_TECHNICKSPARSE
            + accessdb.session.get("sessionId") +"/import-do", "POST", selected,
        function(error, data, status) {
            callback(error, data, status);
        });
};
accessdb.admin.ajaxAsyncWithCallBack = function (url, method, data, callback)
{
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
        success: function(data, textStatus, jqXHR){
            callback(null, data, jqXHR.status);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            callback(jqXHR, null, null);
        }
    });
};
