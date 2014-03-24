window.accessdb.Models.testingSession = Backbone.Model.extend({
    // Backbone
    defaults: {
        // if this structure changed need to change server side object also
        sessionName: null,
        sessionId: null,
        testProfileId: "-1",
        testUnitIdList: [],
        testResultList: [],
        ratings: [],
        currentTestUnitId: "-1", // the id of the array : -1 * testprofileid
        userTestingProfiles: [],
        userId: null,
        userRoles: [],
        lastTestUnit: null,        //TODO: put this and more from accessdb to java session for sync
        pCounter: -10
    },
    url: function(){
        return accessdb.config.URL_API_ROOT + "testingsession/browse/" + this.get("sessionId");
    },

    initialize: function () {

    },
    validate: function(attrs, options){
        if ( attrs.sessionId === null  ){
            return 'Session ID must be set.';
        }
    },
    // Not Backbone
    isUserAdmin: function () {
        return this.hasUserRole(accessdb.config.USER_ROLE_AXSDBADM_CODE)
            || this.hasUserRole(accessdb.config.USER_ROLE_AXSDBW3C_CODE);
    },
    isUserCollaborator: function () {
        return this.hasUserRole(accessdb.config.USER_ROLE_AXSDBCOL_CODE)
            || this.hasUserRole(accessdb.config.USER_ROLE_AXSDBW3C_CODE);
    },
    hasUserRole: function (r) {
        for (var int = 0; int < this.userRoles.length; int++) {
            var role = this.userRoles[int];
            if (role === r)
                return true;
        }
        return false;
    },
    save: function (callback) {
        var self = this;
        Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTINGSESSION_SAVE, 'POST', self, function (error, data) {
            if(data)
            {
                self.set(data);
                callback(true);
            }
            else
                callback(false);
        });
    },
    saveResultsBunch: function (callback) {
        var bunch =
        {
            optionalName: $("#optional_name").val() || "",
            results: this.get("testResultList"),
            date: null,
            user: {
                id: -1,
                userId: "anon"
            }
        };
        var that = this;
        if (this.userId != null)
            bunch.user.userId = this.userId;
        Utils.(accessdb.config.services.URL_SERVICE_TESTRESULT_PERSIST, 'POST', bunch, function (error, data) {
            if (data != null)
                that.clearResults();
            return callback(data);
        });
    },
    persistAll: function (callback) {
        var session = this;
        this.save(function (session) {
            debug("session saved");
            debug(session);
            session.persist(function (ses) {
                debug("session persisted");
                debug(ses);
                return callback(ses);
            });
        });
    },
    persist: function (callback) {
        var obj = this;
        // debug(JSON.stringify(obj));
        Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTINGSESSION_PERSIST + this.this.get("sessionId"),
            'POST', obj, function (error, data) {

                // obj.clearRatings();
                // obj.clearResults();
                return callback(obj);
            });
    },
    clearResults: function () {
        this.set("testResultList", []);
        this.saveLocalSession();
    },
    clearQueue: function () {
        this.set("testUnitIdList", []);
        this.saveLocalSession();
    },
    isTestUnitInResults: function (unitid) {
        for (var resId in this.get("testResultList")) {
            var result = this.get("testResultList")[resId];
            if (result.testUnitId == unitid)
                return true;
        }
        return false;
    },
    addToQueue: function (unitId) {
        if ($.inArray(unitId, this.get("testUnitIdList")) < 0)
            this.get("testUnitIdList").push(unitId);
        this.saveLocalSession();
    },
    isTestInQueue: function (unitId) {
        return jQuery.inArray(unitId, this.get("testUnitIdList")) > 0;
    },
    removeFromQueue: function (unitId) {
        var index = $.inArray(unitId, this.get("testUnitIdList"));
        if (index >= 0)
            this.get("testUnitIdList").splice(index, 1);
        this.saveLocalSession();
    },
    saveTestingData: function (testUnit, skipme) {
        if (testUnit.id > 0) {
            TestResult.removeByUnitId(testUnit.testUnitId);
            var testResult = new TestResult();
            testResult.comment = $("#testing_comment").val();
            var testUnit = new TestUnit();
            testUnit.loadByIdSync(this.currentTestUnitId);
            testResult.testUnitDescription =
            {
                id: testUnit.id
            };
            testResult.testUnitId = this.get("currentTestUnitId");
            var p = UserTestingProfile.getUserProfileById(this.get("testProfileId"));
            testResult.testingProfile = new TestingProfile();
            testResult.testingProfile.setDataWithNoId(p.profile);
            testResult.type = "RESULT";
            var nowD = new Date();
            testResult.runDate = nowD.toJSON();
            removeItemFromArray(accessdb.session.testUnitIdList, testUnit.testUnitId);
            if (!skipme)
                testResult.resultValue = $('input[name=result]:checked').val();
            else {
                accessdb.session.testUnitIdList.unshift(testUnit.testUnitId);
                return false; //skip test
            }
            if (testResult.resultValue === "skip")
                return false;
            this.get("testResultList").push(testResult);
            $("#testUnitId").html("");
            $("#testHref").attr("href", "");
            $("#question").html("");
            $("#steps").html("");
            $("#result").val("");
        }
        this.saveLocalSession();
    },
    login: function (callback) {
        var lData = new Object();
        lData.userId = $("#userId").val();
        lData.pass = $("#pass").val();
        lData.sessionId = this.get("sessionId");
        var obj = this;
        Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_LOGIN, 'POST', lData, function (error, data) {
            obj.setData(data);
            obj.saveLocalSession();
            obj.updateUI();
            callback(obj);
        });
    },
    isSessionAuthenticated: function () {
        var data = Utils.ajaxSync(accessdb.config.services.URL_SERVICE_TESTINGSESSION_LOAD + this.get("sessionId"), 'GET',
            null);
        var auth = false;
        if (!data)
            $("body").html("<p>It seems there is a problem with the server side. Please contact admin</p>");
        if (data.sessionId)
            auth = true;
        return auth;
    },
    logout: function () {
        var obj = this;
        Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_LOGOUT + obj.sessionId, 'POST', null,
            function (error, data) {
                obj.resetLocalSession();
                debug("doLogout");
                msg2user("User logged out!");
                $("#logoutInfo").hide();
                $(".loginhidden").hide();
                $("#loginform").show();
                accessdb.session.resetLocalSession();
                accessdb.session.updateUI();
            });
    },
    saveLocalSession: function () {
        /*if(this.get("sessionId"))
         $.cookie("accessdb-session-id", this.get("sessionId"), { path: '/', expires : 15 });
         if(this.userId)
         $.cookie("accessdb-session-userId", this.userId , { path: '/', expires : 15 });
         if(this.userId)
         $.cookie("accessdb-session-userRole", this.userRole, { path: '/', expires : 15 });
         */
        if (Utils.supports_html5_storage()) {
            sessionStorage.setItem("accessdb-session", JSON.stringify(this));
        }
        else {

        }
        debug("session saved in local storage");
    },
    resetLocalSession: function () {
        $.removeCookie('accessdb-session-id');
        $.removeCookie('accessdb-session-userId');
        $.removeCookie('accessdb-session-userRole');
        accessdb.session = new TestingSession();
        accessdb.session.sessionId = accessdb.config.sessionId;
        this.saveLocalSession();
        debug("session reset in local storage");
    },
    updateQueueView: function (id) {
        var input = $("#thetestsTreeDiv input[value='" + id + "'] ")[0];
        $(input).attr("checked", false);
        if ($(input).parent().parent().find("input:checked").length < 1)
            $(input).parent().parent().parent().find("input").attr("checked", false);
        this.updateUI();
    },
    updateUI: function () {
        $(".tests_count_all").html(Requirements.getCountAllTests());
        $(".inqueuetest").html(this.get("testUnitIdList").length);
        if (UserTestingProfile.getUserProfileById(this.get("testProfileId")))
            $(".currentprofile").html(UserTestingProfile.getUserProfileById(this.get("testProfileId")).profileName);
        else
            $(".currentprofile").html("None");
        // $(".next_tests_count").html();
        // $(".tests_done").html();
        if (this.userId) {
            $(".userid").html("Logout " + this.get("userId"));
        }
        else
            $(".userid").html("Login");

        var divListTestsSelected = $(".divListTestsSelected").empty();
        if (accessdb.session.testUnitIdList.length > 0) {
            divListTestsSelected = $(divListTestsSelected).append("<ul />");
            accessdb.session.testUnitIdList = accessdb.session.testUnitIdList.sort();
        }
        for (var i = 0; i < accessdb.session.testUnitIdList.length; i++) {
            var id = accessdb.session.testUnitIdList[i];
            var a = $(
                '<a class="removeMeFromQueue" data-inline="true" data-mini="true" data-accessdb-id="" data-role="button" data-icon="delete" data-iconpos="notext">Delete</a>')
                .attr("data-accessdb-id", id);
            $(a).on('click', function (event) {
                var id = $(event.target).closest("a").attr("data-accessdb-id");
                accessdb.session.removeFromQueue(id);
                accessdb.session.updateQueueView(id);
            });

            var li = $("<li />").html(id).append(a);
            $(divListTestsSelected).find("ul").append(li);
        }
        //$("#tests").trigger("create");
    }
});