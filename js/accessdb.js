(function () {
    window.accessdb = {
        Models: {},
        Collections: {},
        Views: {},
        config: {
            URL_API_ROOT : "http://www.w3.org/WAI/accessibility-support/api_dev/",
            URL_WEBAPP_ROOT: "http://www.w3.org/WAI/accessibility-support/axsdb/",
            URL_SITE_ROOT: "",
            URL_TESUITES_ROOT: "http://www.w3.org/WAI/accessibility-support/testfiles_dev/",
            FORM_TESTUNIT_FORMFIELD_TESTFILE: "testFile",
            FORM_TESTUNIT_FORMFIELD_TESTUNITDESCRIPTION: "TestUnitDescription",
            DEBUG: true,
            DATE_FORMAT: "yy-mm-dd",
            USER_ROLE_AXSDBADM_CODE: "69097",
            USER_ROLE_AXSDBCOL_CODE: "69096",
            USER_ROLE_AXSDBW3C_CODE: "102",
            services: {
                URL_SERVICE_TESTINGSESSION_LOAD: "testingsession/browse/",
                URL_SERVICE_TESTINGSESSION_PERSIST: "testingsession/commit/persist/",
                URL_SERVICE_TESTINGSESSION_SAVE: "testingsession/commit",

                URL_SERVICE_LOGIN: "testingsession/login",
                URL_SERVICE_LOGOUT: "testingsession/logout/",
                URL_SERVICE_ADMIN_TECHNICKSPARSE: "admin/techniques/",
                URL_SERVICE_INSERT_RATING: "rating/commit",
                URL_SERVICE_SUBMITALL: "testingsession/save",
                URL_SERVICE_GET_RATINGS_BYRATEDID: "rating/browse",
                URL_SERVICE_TESTUNIT_UPDATEMETA: "testunit/moderate/astext/",
                URL_SERVICE_INSERT_TESTUNIT: "testunit/commit",
                URL_SERVICE_DELETE_RESOURCE_FILE: "testunit/resource/",
                URL_SERVICE_DELETE_TESTUNIT: "testunit/moderate/",
                URL_SERVICE_GET_TECHNIQUES: "wcag2/techniques/",
                URL_SERVICE_CALCULATE_RATING: "rating/browse/calculate",
                URL_SERVICE_GET_TESTUNITS: "testunit/browse",
                URL_SERVICE_GET_TESTRESULTS: "testresult/browse",
                URL_SERVICE_GET_TESTUNITS_ASTEXT: "testunit/browse/astext/",
                URL_SERVICE_GET_RESUTLS: "testresult/browse",

                URL_SERVICE_TECHNIQUES_BYQUERY: "wcag2/browse/byquery/",
                URL_SERVICE_QUERY: "query/",
                URL_SERVICE_TECHNIQUES_WCAG2: "wcag2/browse/wcag2/tree/",
                //URL_SERVICE_TESTRESULT_TECHTREE:"testresult/browse/technologies/tree",
                URL_SERVICE_TESTRESULT_TREE_AT: "testresult/browse/at/tree",
                URL_SERVICE_TESTRESULT_TREE_UA: "testresult/browse/ua/tree",
                URL_SERVICE_TESTRESULT_TREE_OS: "testresult/browse/os/tree",
                URL_SERVICE_TESTRESULT_BYQUERY: "testresult/browse/byquery/",
                URL_SERVICE_TESTRESULT_PERSIST: "testresult/commit/bunch",
                URL_SERVICE_TECHNIQUES_TECHS: "wcag2/browse/webtechs/tree",
                URL_SERVICE_WEBTECHSWITHTECHNIQUES_TREE: "wcag2/browse/webtechswithtechniques/tree",

                URL_SERVICE_ADMIN_DEL_TECHNIQUE_DEEP: "admin/techniques/deepdelete/", //{sessionId}/{nameid}

                URL_SERVICE_GET_TESTUNITS_TREE: "testunit/browse/tests/tree",
                URL_SERVICE_TESTRESULT_DATAOVERVIEW: "testresult/browse/dataoverview",
                URL_SERVICE_TESTRESULT_FULLVIEWTECHNIQUE: "testresult/browse/fullviewtechnique/",
                URL_SERVICE_TESTRESULT_VIEWTECHNIQUE: "testresult/browse/resultsview/",

                // profiles management
                URL_SERVICE_GET_ALLUSERPROFILES: "profile/", // profiles/{userId}/{sessionId}
                URL_SERVICE_POST_PROFILE: "profile/", // profiles/{userId}/{sessionId}
                URL_SERVICE_PUT_PROFILE: "profile/", // profiles/{sessionId}
                URL_SERVICE_DELETE_PROFILE: "profile/", // profiles/{pid}/{sessionId
                URL_SERVICE_GET_ASSISTIVETECHNOLOGIES: "profile/browse/ATs/",
                URL_SERVICE_GET_USERAGENTS: "profile/browse/UAs/",
                URL_SERVICE_GET_PLUGINS: "profile/browse/Plugins/",
                URL_SERVICE_GET_OSS: "profile/browse/platforms/",
                //URL_SERVICE_TESTPROFILE_HEADERS : "profile/headers",
            }
        },
        appRouter: null,
        session: null,
        resultsFilter: null,
        testsFilter: null,
        paramId: null,
        resultsviewdata: {}
    };


})();