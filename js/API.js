/**
 * The public read only API
 * require; accessdb.js, filter.js, utils.js
 */
accessdb.API = {
    TECHNIQUE : {
        findByName : function(techId){

        }

    },
    TEST : {
        findById : function(testId, callback){
            Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_GET_TESTUNITS + "/" + testId, "GET", null, function(error, data){
                callback(error, data);
            });
        },
        countAll : function(callback){
            var query="select count(distinct u.testUnitId) from TestUnitDescription as u";
            Utils.doSelectQueryWithCallBack(accessdb.config.services.URL_SERVICE_TECHNIQUES_BYQUERY, query, function(error, data){
                if(data && data.list && data.list[0] )
                    data = data.list[0];
                else
                    data = null;
                callback(error, data);
            });
        },
        countFilteredTests : function(filter, callback)
        {
            var query = filter.buildCountQueryForTestCases();
            if(query==null)
                return;
            Utils.doSelectQueryWithCallBack(
                accessdb.config.services.URL_SERVICE_TECHNIQUES_BYQUERY,
                query, callback );
        }
    },
    RESULT : {

    },
    WEBTECHNOLOGIES : {
        findAll : function (callback){
            var query = "from WebTechnology as t order by t.nameId";
            Utils.doSelectQueryWithCallBack(accessdb.config.services.URL_SERVICE_TECHNIQUES_BYQUERY, query, function(error, data){
                if(data && data.list)
                    data = data.list || null;
                callback(error, data);
            });
        }
    }
};
