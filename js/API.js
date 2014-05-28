(function () {
    /**
     * The public read only API
     * require; utils.js
     */
    window.accessdb = window.accessdb || {};
    window.accessdb.config = window.accessdb.config || {};
    window.accessdb.config.URL_API_ROOT = "http://www.w3.org/WAI/accessibility-support/api/";
    window.accessdb.sessionId = null,
    window.accessdb.Models = window.accessdb.Models || {};
    window.accessdb.Models.Filter = function (page) {
        this.page = page || "";
        this.userName = null;
        this.lastModified;
        this.criteriosLevel = "AAA";
        this.criterios = [];
        this.technologies = [];
        this.ats = [];
        this.uas = [];
        this.oss = [];
    };
    window.accessdb.config.services = {
        // testingsession resource
        URL_SERVICE_TESTINGSESSION_LOAD: "testingsession/browse/",
        URL_SERVICE_TESTINGSESSION_PERSIST: "testingsession/commit/persist/",
        URL_SERVICE_TESTINGSESSION_SAVE: "testingsession/commit",
        URL_SERVICE_LOGIN: "testingsession/login",
        URL_SERVICE_LOGOUT: "testingsession/logout/",
        URL_SERVICE_SUBMITALL: "testingsession/save",
        // profile resource
        URL_SERVICE_GET_ALLUSERPROFILES: "profile/", // profiles/{userId}/{sessionId}
        URL_SERVICE_POST_PROFILE: "profile/", // profiles/{userId}/{sessionId}
        URL_SERVICE_PUT_PROFILE: "profile/put/", // profiles/{sessionId}
        URL_SERVICE_DELETE_PROFILE: "profile/", // profiles/{pid}/{sessionId
        URL_SERVICE_GET_ASSISTIVETECHNOLOGIES: "profile/browse/ATs/",
        URL_SERVICE_GET_USERAGENTS: "profile/browse/UAs/",
        URL_SERVICE_GET_PLUGINS: "profile/browse/Plugins/",
        URL_SERVICE_GET_OSS: "profile/browse/platforms/",
        // test resource
        URL_SERVICE_INSERT_TESTUNIT: "test/commit",
        URL_SERVICE_DELETE_RESOURCE_FILE: "test/resource/",
        URL_SERVICE_DELETE_TESTUNIT: "test/",
        URL_SERVICE_GET_TESTUNITS: "test",
        URL_SERVICE_GET_TESTUNITS_TREE: "test/tree",
        // TestResult resource
        URL_SERVICE_TESTRESULT_DATAOVERVIEW: "testresult/browse/dataoverview",
        URL_SERVICE_TESTRESULT_FULLVIEWTECHNIQUE: "testresult/browse/fullviewtechnique/",
        URL_SERVICE_TESTRESULT_VIEWTECHNIQUE: "testresult/browse/resultsview/",
        URL_SERVICE_TESTRESULT_TREE_AT: "testresult/browse/at/tree",
        URL_SERVICE_TESTRESULT_TREE_UA: "testresult/browse/ua/tree",
        URL_SERVICE_TESTRESULT_TREE_OS: "testresult/browse/os/tree",
        URL_SERVICE_TESTRESULT_PERSIST: "testresult/commit/bunch",
        URL_SERVICE_GET_RESUTLS: "testresult/browse",
        // Query resource
        URL_SERVICE_QUERY: "query/",
        // WCAG2 Resource
        URL_SERVICE_TECHNIQUES_WCAG2: "wcag2/browse/wcag2/tree/",
        URL_SERVICE_TECHNIQUES_TECHS: "wcag2/browse/webtechs/tree",
        URL_SERVICE_WEBTECHSWITHTECHNIQUES_TREE: "wcag2/browse/webtechswithtechniques/tree",
        URL_SERVICE_GET_TECHNIQUES: "wcag2/techniques/",
        // Admin resource
        URL_SERVICE_ADMIN_DEL_TECHNIQUE_DEEP: "admin/techniques/deepdelete/", //{sessionId}/{nameid}
        URL_SERVICE_ADMIN_TECHNICKSPARSE: "admin/techniques/",
        // Rating Resource
        URL_SERVICE_INSERT_RATING: "rating/commit",
        URL_SERVICE_GET_RATINGS_BYRATEDID: "rating/browse",
        URL_SERVICE_CALCULATE_RATING: "rating/browse/calculate"

    };
    for (var property in accessdb.config.services) {
        accessdb.config.services[property] = accessdb.config.URL_API_ROOT + accessdb.config.services[property];
    }
    window.accessdb.API = {
        WCAG2: {
            findTechnqueByName: function (techId) {

            },
            deleteDeepTechnique: function (nameId, callback) {
                var url = accessdb.config.services.URL_SERVICE_ADMIN_DEL_TECHNIQUE_DEEP + accessdb.sessionId + "/" + nameId;
                Utils.ajaxAsyncWithCallBack(url, "DELETE", null, callback, true);
            },
            getWebtechsTreeData: function (callback) {
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TECHNIQUES_TECHS, "GET", null, callback);
            },
            getWCAG2TreeData: function (level, callback) {
                level = level || "AA";
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TECHNIQUES_WCAG2 + level, "GET", null, callback);
            }
        },
        TEST: {
            findByUnitId: function (testId, callback) {
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_GET_TESTUNITS + "/" + testId, "GET", null, callback);
            },
            countAll: function (callback) {
                var query = "select count(distinct u.testUnitId) from TestUnitDescription as u";
                Utils.doSelectQueryWithCallBack(accessdb.config.services.URL_SERVICE_QUERY, query, function (error, data, status) {
                    if (data && data.list && data.list[0])
                        data = data.list[0];
                    else
                        data = null;
                    callback(error, data, status);
                });
            },
            getTestsTreeData : function (filter, callback){
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_GET_TESTUNITS_TREE, "POST", filter, callback);
            },
            deleteResourceFile : function(fileId,testId, callback, tatgetE){
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_DELETE_RESOURCE_FILE + accessdb.sessionId + "/" + testId+ "/" + fileId , "DELETE", null, callback, tatgetE);
            }
        },
        TESTRESULT: {
            getATTree: function (filter, callback) {
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_TREE_AT, "POST", filter, callback);
            },
            getUATree: function (filter, callback) {
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_TREE_UA, "POST", filter, callback);
            },
            getOSTree: function (filter, callback) {
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_TREE_OS, "POST", filter, callback);
            },
            persistBunch: function (bunch, callback) {
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_PERSIST, 'POST', bunch, callback);
            },
            getDataOverview: function (filter, callback, targetE) {
                var url = accessdb.config.services.URL_SERVICE_TESTRESULT_DATAOVERVIEW;
                Utils.ajaxAsyncWithCallBack(url, "POST", filter, function (error, data, status) {
                    if(data)
                        data = data.list;
                    callback(error, data, status);
                }, targetE);
            }
        },
        WEBTECHNOLOGIES: {
            findAll: function (callback) {
                var query = "from WebTechnology as t order by t.nameId";
                Utils.doSelectQueryWithCallBack(accessdb.config.services.URL_SERVICE_QUERY, query, function (error, data, status) {
                    if (data && data.list)
                        data = data.list || null;
                    callback(error, data, status);
                });
            }
        },

        PROFILE: {
            findByUserId: function (userId, callback) {
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_GET_ALLUSERPROFILES + userId + "/" + accessdb.sessionId, "GET", null, callback);
            },
            insertUserProfile: function (userId, profile, callback) {
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_POST_PROFILE + userId + "/" + accessdb.sessionId,
                    "POST", profile, callback);
            },
            updateUserProfile: function (userId, profile, callback) {
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_PUT_PROFILE + accessdb.sessionId, "POST", profile, callback);
            },
            deleteUserProfile: function (id, callback) {
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_DELETE_PROFILE + id + "/" + accessdb.sessionId,
                    "DELETE", {}, callback);
            }
        },
        TESTINGSESSION: {
            save: function (session, callback) {
                accessdb.sessionId = session.get("sessionId");
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTINGSESSION_SAVE, 'POST', session, callback);
            },
            persist: function (session, callback) {
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTINGSESSION_PERSIST + accessdb.sessionId,
                    'POST', session, callback);
            },
            login: function (loginData, callback, targetE) {
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_LOGIN, 'POST', loginData, callback, targetE);
            },
            logout: function (session, callback) {
                Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_LOGOUT + accessdb.sessionId, 'POST', null, callback);
            }
        }
    };
})();