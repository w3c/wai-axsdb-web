(function () {
    /**
     * axsDB REST API implementation
     * @See https://github.com/w3c/wai-axsdb-services
     */
    window.accessdb = window.accessdb || {};
    window.accessdb.config = window.accessdb.config || {};

    // Config to override
    window.accessdb.config.URL_API_ROOT = "http://www.w3.org/WAI/accessibility-support/api_dev/";
    window.accessdb.config.loadingStart = function(holder){
        var div = $('<div class="progress"><div>Loading…</div></div>');
        $(holder).attr("aria-busy", true);
        $(holder).empty();
        $(holder).append(div);
    };
    window.accessdb.config.loadingEnd = loadingEnd=function(holder){
        $(holder).attr("aria-busy", false);
        $(holder).find(".progress").remove();
    };
    // end config

    window.accessdb.sessionId = null,
    window.accessdb.Models = window.accessdb.Models || {};
    window.accessdb.Models.Filter = function (page) {
        this.page = page || "";
        this.statusList = ["ACCEPTED"];
        this.userName = null;
        this.lastModified;
        this.criteriosLevel = "AAA";
        this.criterios = [];
        this.technologies = [];
        this.techniques = [];
        this.tests = [];
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
        URL_SERVICE_DELETE_DEEP_TESTUNIT: "admin/tests/deepdelete/", //{sessionId}/{nameid}",
        URL_SERVICE_GET_TESTUNITS: "test",
        URL_SERVICE_GET_TESTUNITS_TREE: "test/tree",
        // TestResult resource
        URL_SERVICE_TESTRESULT_BYTECHNIQUE_OVERVIEW: "testresult/browse/bytechnique/overview",
        URL_SERVICE_TESTRESULT_BYTEST_OVERVIEW: "testresult/browse/bytest/overview/", //{techNameId}

        URL_SERVICE_TESTRESULT_FULLVIEWTECHNIQUE: "testresult/browse/fullviewtechnique/",
        URL_SERVICE_TESTRESULT_FULLVIEWTEST: "testresult/browse/fullviewtest/", //{testUnitId}
        URL_SERVICE_TESTRESULT_FILTER: "testresult/filter",
        URL_SERVICE_TESTRESULT_VIEWTECHNIQUE: "testresult/browse/resultsview/",
        URL_SERVICE_TESTRESULT_TREE_AT: "testresult/browse/at/tree",
        URL_SERVICE_TESTRESULT_TREE_UA: "testresult/browse/ua/tree",
        URL_SERVICE_TESTRESULT_TREE_OS: "testresult/browse/os/tree",
        URL_SERVICE_TESTRESULT_PERSIST: "testresult/commit/bunch",
        URL_SERVICE_TESTRESULT_DELETE: "testresult/",
        URL_SERVICE_TESTRESULT_EDIT: "testresult/put/",
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
        URL_SERVICE_ADMIN_IMPORT_TESTS: "admin/import/tests",
        URL_SERVICE_ADMIN_EXPORT_TESTS: "admin/export/tests",//{path}
        URL_SERVICE_ADMIN_IMPORT_TESTRESULTS: "admin/import/testresults/", //{path}
        URL_SERVICE_ADMIN_EXPORT_TESTRESULTS: "admin/export/testresults/",
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
            deleteDeepTechnique: function (nameId, callback) {
                var url = accessdb.config.services.URL_SERVICE_ADMIN_DEL_TECHNIQUE_DEEP + accessdb.sessionId + "/" + nameId;
                ajax(url, "DELETE", null, callback, true);
            },
            getWebtechsTreeData: function (callback) {
                ajax(accessdb.config.services.URL_SERVICE_TECHNIQUES_TECHS, "GET", null, callback);
            },
            getWCAG2TreeData: function (level, callback) {
                level = level || "AA";
                ajax(accessdb.config.services.URL_SERVICE_TECHNIQUES_WCAG2 + level, "GET", null, callback);
            }
        },
        QUERY: {
            doQuery: function (query, callback) {
                var url = accessdb.config.services.URL_SERVICE_QUERY + encodeURI(query);
                ajax(url, "GET", null,  function (error, data, status) {
                    if(!error){
                        callback(null, data.list);
                    }
                    else{
                        console.warn("error while querying" + error);
                        callback(error);
                    }
                });
            }
        },
        TEST: {
            findByUnitId: function (testId, callback) {
                ajax(accessdb.config.services.URL_SERVICE_GET_TESTUNITS + "/" + testId, "GET", null, callback);
            },
            countAll: function (callback) {
                var query = "select count(distinct u.testUnitId) from TestUnitDescription as u";
                accessdb.API.QUERY.doQuery(query, function (error, rows) {
                    if(!error && rows && rows[0]){
                        callback(rows[0]);
                    }
                    callback(null);
                });
            },
            getTestsTreeData : function (filter, callback){
                ajax(accessdb.config.services.URL_SERVICE_GET_TESTUNITS_TREE, "POST", filter, callback);
            },
            deleteResourceFile : function(fileId, callback, tatgetE){
                ajax(accessdb.config.services.URL_SERVICE_DELETE_RESOURCE_FILE + accessdb.sessionId + "/" + fileId , "DELETE", null, callback, tatgetE);
            },
            deleteTest : function(id, callback) {
                var url = accessdb.config.services.URL_SERVICE_DELETE_TESTUNIT + accessdb.sessionId + "/" + id;
                ajax(url , "DELETE", null, callback);

            }

        },
        TESTRESULT: {
            deleteTestResultById : function(id, callback){
                var url = accessdb.config.services.URL_SERVICE_TESTRESULT_DELETE + accessdb.sessionId + "/" + id;
                ajax(url , "DELETE", null, callback);
            },
            filter: function(filter, callback){
                ajax(accessdb.config.services.URL_SERVICE_TESTRESULT_FILTER, "POST", filter, callback);
            },
            getATTree: function (filter, callback) {
                ajax(accessdb.config.services.URL_SERVICE_TESTRESULT_TREE_AT, "POST", filter, callback);
            },
            getUATree: function (filter, callback) {
                ajax(accessdb.config.services.URL_SERVICE_TESTRESULT_TREE_UA, "POST", filter, callback);
            },
            getOSTree: function (filter, callback) {
                ajax(accessdb.config.services.URL_SERVICE_TESTRESULT_TREE_OS, "POST", filter, callback);
            },
            persistBunch: function (bunch, callback) {
                ajax(accessdb.config.services.URL_SERVICE_TESTRESULT_PERSIST, 'POST', bunch, callback);
            },
            findByFilterTestResultTechniqueOveview: function (filter, callback, targetE) {
                var url = accessdb.config.services.URL_SERVICE_TESTRESULT_BYTECHNIQUE_OVERVIEW;
                ajax(url, "POST", filter, function (error, data, status) {
                    if(data)
                        data = data.list;
                    callback(error, data, status);
                }, targetE);
            },
            findByFilterTestResultTestOveview: function (filter,techNameId, callback, targetE) {
                var url = accessdb.config.services.URL_SERVICE_TESTRESULT_BYTEST_OVERVIEW + techNameId;
                ajax(url, "POST", filter, function (error, data, status) {
                    if(data)
                        data = data.list;
                    callback(error, data, status);
                }, targetE);
            },

            getResultsByTechnique : function(filter, techniqueNameId, callback, targetE){
                ajax(accessdb.config.services.URL_SERVICE_TESTRESULT_VIEWTECHNIQUE + techniqueNameId, "POST", filter, callback, targetE);
            },
            getResultsFullViewByTechnique : function(filter, techniqueNameId, callback, targetE){
                ajax(accessdb.config.services.URL_SERVICE_TESTRESULT_FULLVIEWTECHNIQUE + techniqueNameId, "POST", filter, callback, targetE);
            },
            getResultsFullViewByTest : function(filter, testId, callback, targetE){
                ajax(accessdb.config.services.URL_SERVICE_TESTRESULT_FULLVIEWTEST + testId, "POST", filter, callback, targetE);
            },
            getATVersionsOfATName : function(name, callback){
                var query = "select distinct testingProfile.assistiveTechnology.version.text " +
                    "from TestResult where testingProfile.assistiveTechnology.name='"+name+"'";
                accessdb.API.QUERY.doQuery(query, callback);
            }
        },
        WEBTECHNOLOGIES: {
            findAll: function (callback) {
                var query = "from WebTechnology as t order by t.nameId";
                accessdb.API.QUERY.doQuery(query, callback);
            }
        },
        PROFILE: {
            findByUserId: function (userId, callback) {
                ajax(accessdb.config.services.URL_SERVICE_GET_ALLUSERPROFILES + userId + "/" + accessdb.sessionId, "GET", null, callback);
            },
            insertUserProfile: function (userId, profile, callback) {
                ajax(accessdb.config.services.URL_SERVICE_POST_PROFILE + userId + "/" + accessdb.sessionId,
                    "POST", profile, callback);
            },
            updateUserProfile: function (userId, profile, callback) {
                ajax(accessdb.config.services.URL_SERVICE_PUT_PROFILE + accessdb.sessionId, "POST", profile, callback);
            },
            deleteUserProfile: function (id, callback) {
                ajax(accessdb.config.services.URL_SERVICE_DELETE_PROFILE + id + "/" + accessdb.sessionId,
                    "DELETE", {}, callback);
            }
        },
        TESTINGSESSION: {
            getSession: function (callback) {
                ajax(accessdb.config.services.URL_SERVICE_TESTINGSESSION_LOAD + accessdb.sessionId, 'GET', null, function (error, data, status) {
                    if(!error){
                        accessdb.sessionId = data.sessionId;
                    }
                    callback(error, data, status);
                });
            },
            save: function (session, callback) {
                accessdb.sessionId = session.get("sessionId");
                ajax(accessdb.config.services.URL_SERVICE_TESTINGSESSION_SAVE, 'POST', session, callback);
            },
            persist: function (session, callback) {
                ajax(accessdb.config.services.URL_SERVICE_TESTINGSESSION_PERSIST + accessdb.sessionId,
                    'POST', session, callback);
            },
            login: function (loginData, callback, targetE) {
                ajax(accessdb.config.services.URL_SERVICE_LOGIN, 'POST', loginData, callback, targetE);
            },
            logout: function (session, callback) {
                ajax(accessdb.config.services.URL_SERVICE_LOGOUT + accessdb.sessionId, 'POST', null, callback);
            }
        },
        ADMIN: {
            deleteDeepTest : function(testUnitId, callback) {
                var url = accessdb.config.services.URL_SERVICE_DELETE_DEEP_TESTUNIT + accessdb.sessionId + "/" + testUnitId;
                ajax(url , "DELETE", null, callback);
            },
            exportTests : function(callback) {
                var url = accessdb.config.services.URL_SERVICE_ADMIN_EXPORT_TESTS;
                ajax(url , "GET", null, callback);
            },
            exportTestResults : function(callback) {
                var url = accessdb.config.services.URL_SERVICE_ADMIN_EXPORT_TESTRESULTS;
                ajax(url , "GET", null, callback);
            },
            importTests : function(serverPath, callback) {
                serverPath = serverPath || "/tmp/accessdbexports/index.xml";
                var url = accessdb.config.services.URL_SERVICE_ADMIN_IMPORT_TESTS + "?path=" + serverPath;
                ajax(url , "GET", null, callback);
            },
            importTestResults : function(serverPath, callback) {
                serverPath = serverPath || "/tmp/accessdbexports/testresults.xml";
                var url = accessdb.config.services.URL_SERVICE_ADMIN_IMPORT_TESTRESULTS + "?path=" + serverPath;
                ajax(url , "GET", null, callback);
            }
        }
    };

    function ajax(url, method, data, callback, targetE)
    {
        if(targetE){
            window.accessdb.config.loadingStart(targetE);
        }
        $.ajax({
            url: url,
            dataType: "json",
            contentType: "application/json",
            type : method,
            data : JSON.stringify(data),
            async: true,
            cache: false,
            timeout: 40000,
            processData: false,
            success: function(data, textStatus, jqXHR){
                if(targetE){
                    window.accessdb.config.loadingEnd(targetE);
                }
                callback(null, data, jqXHR.status);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if(targetE){
                    window.accessdb.config.loadingEnd(targetE);
                }
                if(jqXHR.status===200){
                    callback(null, jqXHR.responseJSON, jqXHR.status);
                    return;
                }
                if(jqXHR.status===403){
                    callback(null, jqXHR.responseJSON, jqXHR.status);
                    return;
                }
                callback(jqXHR, null, null);
            }
        });
    };
})();