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
        accessdb.API.TESTINGSESSION.save(self, function(error, data){
            if(!error)
            {
                self.set(data);
            }
            callback(error, self);
        });

    },
    saveResultsBunch: function (callback) {
        var self = this;
        var bunch = {
            optionalName: $("#optional_name").val() || "",
            results: this.get("testResultList"),
            date: null,
            user: {
                id: -1,
                userId: "anon"
            }
        };
        if (this.userId != null)
            bunch.user.userId = this.userId;
        accessdb.API.TESTRESULT.persistBunch(bunch, function(error, data){
            if (!eroor && data != null)
                self.clearResults();
            callback(error, data);
        });
    },
    persistAll: function (callback) {
        var session = this;
        this.save(function (session) {
            console.log("session saved");
            session.persist(function (ses) {
                console.log("session persisted");
                return callback(ses);
            });
        });
    },
    persist: function (callback) {
        var self = this;
        accessdb.API.TESTINGSESSION.persist(self, function(error, data){
            self.clearRatings();
            self.clearResults();
            callback(error, self);
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
        if ($.inArray(unitId, this.get("testUnitIdList")) < 0){
            var newList = _.clone(this.get("testUnitIdList"));
            newList.push(unitId);
            this.set("testUnitIdList",newList)
        }
        this.saveLocalSession();
    },
    isTestInQueue: function (unitId) {
        return jQuery.inArray(unitId, this.get("testUnitIdList")) > 0;
    },
    removeFromQueue: function (unitId) {
        var newList = _.filter(this.get("testUnitIdList"), function(e){
            return unitId !== e;
        });
        this.set("testUnitIdList", newList);
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
    login: function (lData, callback) {
        var self = this;
        if(self.isValid()){
            accessdb.API.TESTINGSESSION.login(lData, function (error, data) {
                if(!error)
                {
                    self.set(data);
                    self.saveLocalSession();
                }
                else
                    console.error(error);
                callback(error, data);
            });
        }
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
    logout: function (callback) {
        var self = this;
        accessdb.API.TESTINGSESSION.logout(self, function(error, data){
            if(!error){
                self.resetLocalSession();
                console.log("doLogout");
                //$("#logoutInfo").hide();
                //$(".loginhidden").hide();
                //$("#loginform").show();
                self.resetLocalSession();
                //accessdb.session.updateUI();
            }
            callback(error, data);
        });
        
        Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_LOGOUT + obj.sessionId, 'POST', null,
            function (error, data) {
                
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
        console.log("session saved in local storage");
    },
    resetLocalSession: function () {
        $.removeCookie('accessdb-session-id');
        $.removeCookie('accessdb-session-userId');
        $.removeCookie('accessdb-session-userRole');
        accessdb.session = new TestingSession();
        accessdb.session.sessionId = accessdb.config.sessionId;
        this.saveLocalSession();
        console.log("session reset in local storage");
    }
});