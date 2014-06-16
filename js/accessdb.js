(function () {
    window.accessdb = {
        Models: {},
        Collections: {},
        Views: {},
        config: {
            PAGE_ID_PREFIX: "axsdb-page-",
            URL_WEBAPP_ROOT: "http://www.w3.org/WAI/accessibility-support/dev/",
            URL_SITE_ROOT: "",
            URL_TESUITES_ROOT: "http://www.w3.org/WAI/accessibility-support/testfiles_dev/",
            FORM_TESTUNIT_FORMFIELD_TESTFILE: "testFile",
            FORM_TESTUNIT_FORMFIELD_TESTUNITDESCRIPTION: "TestUnitDescription",
            DEBUG: true,
            DATE_FORMAT: "yy-mm-dd",
            USER_ROLE_AXSDBADM_CODE: "69097",
            USER_ROLE_AXSDBCOL_CODE: "69096",
            USER_ROLE_AXSDBW3C_CODE: "102"
        },
        appRouter: null,
        session: null,
        filters : {},
        paramId: null,
        resultsviewdata: {}
    };


})();