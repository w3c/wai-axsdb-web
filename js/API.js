/**
 * The public read only API
 * require; accessdb.js, filter.js, utils.js
 */
accessdb.API = {
    TECHNIQUE: {
        findByName: function (techId) {

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
