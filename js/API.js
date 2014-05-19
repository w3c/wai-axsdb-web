/**
 * The public read only API
 * require; accessdb.js, filter.js, utils.js
 */

accessdb.API = {
    ROOT : "http://www.w3.org/WAI/accessibility-support/api/",
    URL:{
        URL_SERVICE_TESTINGSESSION_LOAD: this.ROOT + "testingsession/browse/",
        URL_SERVICE_TESTINGSESSION_PERSIST: this.ROOT + "testingsession/commit/persist/",
        URL_SERVICE_TESTINGSESSION_SAVE: this.ROOT + "testingsession/commit",
        URL_SERVICE_LOGIN: this.ROOT + "testingsession/login",
        URL_SERVICE_LOGOUT: this.ROOT + "testingsession/logout/",
        URL_SERVICE_ADMIN_TECHNICKSPARSE: this.ROOT + "admin/techniques/",
        URL_SERVICE_INSERT_RATING: this.ROOT + "rating/commit",
        URL_SERVICE_SUBMITALL: this.ROOT + "testingsession/save",
        URL_SERVICE_GET_RATINGS_BYRATEDID: this.ROOT + "rating/browse",
        URL_SERVICE_TESTUNIT_UPDATEMETA: this.ROOT + "testunit/moderate/astext/",
        URL_SERVICE_INSERT_TESTUNIT: this.ROOT + "testunit/commit",
        URL_SERVICE_DELETE_RESOURCE_FILE: this.ROOT + "testunit/resource/",
        URL_SERVICE_DELETE_TESTUNIT: this.ROOT + "testunit/moderate/",
        URL_SERVICE_GET_TECHNIQUES: this.ROOT + "wcag2/techniques/",
        URL_SERVICE_CALCULATE_RATING: this.ROOT + "rating/browse/calculate",
        URL_SERVICE_GET_TESTUNITS: this.ROOT + "testunit/browse",
        URL_SERVICE_GET_TESTRESULTS: this.ROOT + "testresult/browse",
        URL_SERVICE_GET_TESTUNITS_ASTEXT: this.ROOT + "testunit/browse/astext/",
        URL_SERVICE_GET_RESUTLS: this.ROOT + "testresult/browse",

        URL_SERVICE_TECHNIQUES_BYQUERY: this.ROOT + "wcag2/browse/byquery/",
        URL_SERVICE_QUERY: this.ROOT + "query/",
        URL_SERVICE_TECHNIQUES_WCAG2: this.ROOT + "wcag2/browse/wcag2/tree/",
        //URL_SERVICE_TESTRESULT_TECHTREE:"testresult/browse/technologies/tree",
        URL_SERVICE_TESTRESULT_TREE_AT: this.ROOT + "testresult/browse/at/tree",
        URL_SERVICE_TESTRESULT_TREE_UA: this.ROOT + "testresult/browse/ua/tree",
        URL_SERVICE_TESTRESULT_TREE_OS: this.ROOT + "testresult/browse/os/tree",
        URL_SERVICE_TESTRESULT_BYQUERY: this.ROOT + "testresult/browse/byquery/",
        URL_SERVICE_TESTRESULT_PERSIST: this.ROOT + "testresult/commit/bunch",
        URL_SERVICE_TECHNIQUES_TECHS: this.ROOT + "wcag2/browse/webtechs/tree",
        URL_SERVICE_WEBTECHSWITHTECHNIQUES_TREE: this.ROOT + "wcag2/browse/webtechswithtechniques/tree",

        URL_SERVICE_ADMIN_DEL_TECHNIQUE_DEEP: this.ROOT + "admin/techniques/deepdelete/", //{sessionId}/{nameid}

        URL_SERVICE_GET_TESTUNITS_TREE: this.ROOT + "testunit/browse/tests/tree",
        URL_SERVICE_TESTRESULT_DATAOVERVIEW: this.ROOT + "testresult/browse/dataoverview",
        URL_SERVICE_TESTRESULT_FULLVIEWTECHNIQUE: this.ROOT + "testresult/browse/fullviewtechnique/",
        URL_SERVICE_TESTRESULT_VIEWTECHNIQUE: this.ROOT + "testresult/browse/resultsview/",

        // profiles management
        URL_SERVICE_GET_ALLUSERPROFILES: this.ROOT + "profile/", // profiles/{userId}/{sessionId}
        URL_SERVICE_POST_PROFILE: this.ROOT + "profile/", // profiles/{userId}/{sessionId}
        URL_SERVICE_PUT_PROFILE: this.ROOT + "profile/", // profiles/{sessionId}
        URL_SERVICE_DELETE_PROFILE: this.ROOT + "profile/", // profiles/{pid}/{sessionId
        URL_SERVICE_GET_ASSISTIVETECHNOLOGIES: this.ROOT + "profile/browse/ATs/",
        URL_SERVICE_GET_USERAGENTS: this.ROOT + "profile/browse/UAs/",
        URL_SERVICE_GET_PLUGINS: this.ROOT + "profile/browse/Plugins/",
        URL_SERVICE_GET_OSS: this.ROOT + "profile/browse/platforms/",
        //URL_SERVICE_TESTPROFILE_HEADERS : "profile/headers",
    },
    WCAG2: {
        findTEchnqueByName : function (techId) {

        },
        getWebtechsTreeData : function(callback){
            Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TECHNIQUES_TECHS , "GET", null, callback);
        },
        getWCAG2TreeData : function(level, callback){
            level = level || "AA";
            Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TECHNIQUES_WCAG2  + level, "GET", null, callback);
        }
    },
    TEST: {
        findById: function (testId, callback) {
            Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_GET_TESTUNITS + "/" + testId, "GET", null, callback);
        },
        countAll: function (callback) {
            var query = "select count(distinct u.testUnitId) from TestUnitDescription as u";
            Utils.doSelectQueryWithCallBack(accessdb.config.services.URL_SERVICE_TECHNIQUES_BYQUERY, query, function (error, data, status) {
                if (data && data.list && data.list[0])
                    data = data.list[0];
                else
                    data = null;
                callback(error, data, status);
            });
        },
        countFilteredTests: function (filter, callback) {
            var query = filter.buildCountQueryForTestCases();
            if (query == null)
                return;
            Utils.doSelectQueryWithCallBack(
                accessdb.config.services.URL_SERVICE_TECHNIQUES_BYQUERY,
                query, callback);
        }
    },
    RESULT: {
        getATTree : function(filter, callback){
            Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_TREE_AT, "POST", filter, callback);
        },
        getUATree : function(filter, callback){
            Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_TREE_UA, "POST", filter, callback);
        },
        getOSTree : function(filter, callback){
            Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_TREE_OS, "POST", filter, callback);
        }
    },
    WEBTECHNOLOGIES: {
        findAll: function (callback) {
            var query = "from WebTechnology as t order by t.nameId";
            Utils.doSelectQueryWithCallBack(accessdb.config.services.URL_SERVICE_TECHNIQUES_BYQUERY, query, function (error, data, status) {
                if (data && data.list)
                    data = data.list || null;
                callback(error, data, status);
            });
        }
    },
    TESTRESULT: {
        persistBunch: function (bunch, callback) {
            Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_PERSIST, 'POST', bunch, callback);
        },
        loadTestResultsDataOverview: function (filter, callback, targetE){
            var url = accessdb.config.services.URL_SERVICE_TESTRESULT_DATAOVERVIEW;
            Utils.ajaxAsyncWithCallBack(url, "POST", filter, function (error, data, status) {
                callback(error, data.list, status);
            }, targetE);
        }
    },
    TESTINGSESSION: {
        save: function (session, callback) {
            Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTINGSESSION_SAVE, 'POST', session, callback);
        },
        persist: function (session, callback) {
            Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTINGSESSION_PERSIST + session.get("sessionId"),
                'POST', session, function (error, data, status) {
                    callback(error, data, status);
                });
        },
        login: function (loginData, callback, targetE) {
            Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_LOGIN, 'POST', loginData, callback, targetE);
        },
        logout: function (session, callback) {
            Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_LOGOUT + session.get("sessionId"), 'POST', null, callback);
        }
    }
};
