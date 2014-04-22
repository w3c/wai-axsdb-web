accessdb.admin = {};
accessdb.admin.init = function (){

    $("#techImportBtn").click(function() {
        var selectedIds = [];
        $("input[name='admin-technique-sync']:checked").each(function(index, value){
            selectedIds = selectedIds.push($(value).attr("value"));
        });
        var selected = _.filter(accessdb.admin.responses, function(e){
            return _.contains(selectedIds, e.entity.technique);
        });
        accessdb.admin.techniquesSync(url, function(error, data, status) {
            if(error){
                $("#admin-technique-results-div").html(data.responseText);
                return;
            }
            if(status === 200){
                accessdb.admin.responses = [];
                if(data.length>0){
                    var template = _.template($('#admin-technique-sync-response-synced-template').html(), {results:data});
                    $("#admin-technique-results-div").html(template);
                }
                else
                {
                    $("#admin-technique-results-div").html("Nothing new to add");
                }
            }
        });
    });
    $("#techImportPrepareBtn").click(function() {
        var url = $("#techImportURL").val();
        $("#techImportList").empty();
        accessdb.admin.techniquesImportPrepare(url, function(error, data, status) {
            if(error){
                $("#admin-technique-results-div").html(data.responseText);
                return;
            }
            if(status === 200){
                accessdb.admin.responses = data;
                if(data.length>0){
                    var template = _.template($('#admin-technique-sync-response-prepare-template').html(), {results:data});
                    $("#admin-technique-results-div").html(template);
                }
                else
                {
                    $("#admin-technique-results-div").html("Nothing new to add");
                }
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
                Requirements.deleteDeepTechnique(list[i], function(data, error){
                    if(error){
                        console.log(error);
                        return;
                    }
                    Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_WEBTECHSWITHTECHNIQUES_TREE, "GET", null, function(data){
                        $("#adminWebTechAndTechniqueTreeDiv").empty();
                        $.treevue([data], "adminWebTechAndTechniqueTree").appendTo('#adminWebTechAndTechniqueTreeDiv');
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
}
accessdb.admin.techniquesImportPrepare = function(url, callback) {
    accessdb.admin.ajaxAsyncWithCallBack(
            accessdb.config.services.URL_SERVICE_ADMIN_TECHNICKSPARSE
            + accessdb.session.get("sessionId") +"/import-prepare", "POST", url,
        function(error, data, status) {
            callback(error, data, status);
        });
};
accessdb.admin.techniquesSync = function(url, callback) {
    accessdb.admin.ajaxAsyncWithCallBack(
            accessdb.config.services.URL_SERVICE_ADMIN_TECHNICKSPARSE
            + accessdb.session.get("sessionId") +"/import-do", "POST", url,
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
/*
accessdb.Models.GitHubTechniqueInfo = new function(){
    this.date = "0000-03-28T17:18:24.000+0000";
    this.technique = "AA1";
    this.webTechnology = {};
    this.sha = "";
    this.diffUrl = "";
    this.url = "";

}
accessdb.Models.ImportResponse = new function(){
   accessdb.Models.ImportResponse.UNDEFINED = -1;
    accessdb.Models.ImportResponse.SAME = 100;
    accessdb.Models.ImportResponse.ONLY_IN_WCAG = 101;
    accessdb.Models.ImportResponse.ONLY_IN_DB = 102;
    accessdb.Models.ImportResponse.NEWER = 201;
    accessdb.Models.ImportResponse.OLDER = 202;
    accessdb.Models.ImportResponse.SUCCESS = 301;
    accessdb.Models.ImportResponse.FAIL = 302;

    this.statusCode = -1;
    this.entity = new accessdb.Models.GitHubTechniqueInfo;
}*/