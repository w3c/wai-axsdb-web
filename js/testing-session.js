window.accessdb.Models.testingSession = Backbone.Model.extend({
    // Backbone
    defaults: {
        //Note that if this structure changes need to change server side object also
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
        pCounter: -10,
        resultsFilter : new window.accessdb.Models.Filter({statusList: ["ACCEPTED"]}),
        testsFilter : new window.accessdb.Models.Filter({statusList: ["ACCEPTED"]})
    },
    url: function () {
        return accessdb.config.URL_API_ROOT + "testingsession/browse/" + this.get("sessionId");
    },
    initialize: function () {
        var self = this;
        this.set("profiles_index", 0);
        this.on('change:userId', function (o) {
            console.log("change:userId");
            //update UI login/out
            if (self.get("userId") != null) {
                $(".login-info").html("Log out " + self.get("userId"));
                $(".login-info").parent().attr("href","#/log-out.html")
            }
            else {
                $(".login-info").html("Log in");
                $(".login-info").parent().attr("href","#/log-in.html")
            }
            $(".userid").html(self.get("userId") || "anon");
        });

        this.on('change:testProfileId', function (o) {
            console.log("change:testProfileId");
            console.log("testProfileId: " + this.get("testProfileId"));
            self.save();
        });
        this.on('change:testResultList', function (o) {
            console.log("change:testResultList");
            TestResult.viewTestingResultsBeforeSave();
            //update UI for results
        });
        this.on('change:userTestingProfiles', function (o) {
            console.log("change:userTestingProfiles");
            UserTestingProfile.showTestingProfiles();
            //update UI for results
        });
        this.on('change:testUnitIdList', function (o) {
            console.log("change:testUnitIdList");
            TestUnit.viewTestUnitIdList();
        });
        this.on('change', function () {
            console.log("session changed");
            // update client and server session
            self.save();
        });
        this.on('invalid', function (model, error) {
            console.warn("session invalid: " + error); // printing the error message on console.
        });
    },
    validate: function (attrs, options) {
        if (attrs.sessionId === null) {
            return 'Session ID must be set.';
        }
    },
// Not Backbone
    isLoggedIn: function() {
        if(this.get("userId")!=null &&  this.get("userRoles")!=null &&  this.get("userRoles").length>0)
            return true;
        return false;
    },
    isUserAdmin: function () {
        return this.hasUserRole(accessdb.config.USER_ROLE_AXSDBADM_CODE)
            || this.hasUserRole(accessdb.config.USER_ROLE_AXSDBW3C_CODE);
    },
    isUserCollaborator: function () {
        return this.hasUserRole(accessdb.config.USER_ROLE_AXSDBCOL_CODE)
            || this.hasUserRole("35422") //FIXME: as const
            || this.hasUserRole(accessdb.config.USER_ROLE_AXSDBW3C_CODE);
    },
    hasUserRole: function (r) {
        for (var int = 0; int < this.get("userRoles").length; int++) {
            var role = this.get("userRoles")[int];
            if (role === r)
                return true;
        }
        return false;
    },
    save: function (callback) {
        this.saveLocalSession();
        var self = this;
        accessdb.API.TESTINGSESSION.save(self, function (error, data, status) {
            if (!error)
                console.log("server session updated");
            else
                console.error("server session update failed");
            if (callback)
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
        if (this.get("userId") != null)
            bunch.user.userId = this.get("userId");
        accessdb.API.TESTRESULT.persistBunch(bunch, function (error, data, status) {
            if (!error && data != null)
                self.clearResults();
            callback(error, data, status);
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
        accessdb.API.TESTINGSESSION.persist(self, function (error, data, status) {
            self.clearRatings();
            self.clearResults();
            callback(error, self);
        });
    },
    clearResults: function () {
        this.set("testResultList", []);
    },
    clearQueue: function () {
        this.set("testUnitIdList", []);
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
        if ($.inArray(unitId, this.get("testUnitIdList")) < 0) {
            var newList = _.clone(this.get("testUnitIdList"));
            newList.push(unitId);
            this.set("testUnitIdList", newList)
        }
    },
    isTestInQueue: function (unitId) {
        return jQuery.inArray(unitId, this.get("testUnitIdList")) > 0;
    },
    removeFromQueue: function (unitId) {
        var newList = _.filter(this.get("testUnitIdList"), function (e) {
            return unitId !== e;
        });
        this.set("testUnitIdList", newList);
    },
    login: function (lData, callback, targetE) {
        //this.resetLocalSession();
        var self = this;
        this.load(function(error){
            if(error){
                console.warn("session invalid for login");
                callback(false);
            }
           // if (self.isValid()) {
                lData.sessionId = accessdb.sessionId;
                accessdb.API.TESTINGSESSION.login(lData, function (error, data, status) {
                    if (!error) {
                        if (data.userId !== null && status===200) {
                            self.set(data);
                            self.set("userId",data.userId);
                            self.load(function(error){
                                UserTestingProfile.loadUserProfilesByUserId(function(error, data1){
                                    accessdb.session.set("userTestingProfiles", data1);
                                    Utils.msg2user("Logged in successfully!");
                                    window.accessdb.appRouter.loadPage("home");
                                });
                                callback(true);
                                return;
                            });
                        }
                        else{
                            callback(false);
                            return;
                        }
                    }
                    else{
                        console.error(error.status);
                        callback(false);
                        return;
                    }
                }, targetE);
           // }
        })
    },
    logout: function (callback) {
        var self = this;
        accessdb.API.TESTINGSESSION.logout(self, function (error, data, status) {
            if (!error) {
                self.resetLocalSession();
                console.log("logout success");
            }
            callback(error, data, status);
        });
    },

    resetLocalSession: function () {
        Utils.eraseCookie('accessdb-session-id');
        /*
        Utils.eraseCookie('accessdb-session-userId');
        Utils.eraseCookie('accessdb-session-userRoles');
        sessionStorage.removeItem("accessdb-session");
        console.log("session reset in local storage");
    */
    },
    loadLocalSession: function () {
        this.set("sessionId", Utils.readCookie("accessdb-session-id") || accessdb.sessionId);
        /*
         if(Utils.readCookie("accessdb-session-userId"))
            this.set("userId", Utils.readCookie("accessdb-session-userId"));
        if(Utils.readCookie("accessdb-session-userRoles"))
            this.set("userRoles", Utils.readCookie("accessdb-session-userRoles"));

        if (Utils.supports_html5_storage() && sessionStorage["accessdb-session"]) {
            this.set(JSON.parse(sessionStorage["accessdb-session"]));
        }
        */
        console.log("session loaded from local storage");
    },
    saveLocalSession: function () {
        if (this.get("sessionId"))
            Utils.createCookie("accessdb-session-id", this.get("sessionId"), 10);
        /*
        if (this.get("userId"))
            Utils.createCookie("accessdb-session-userId", this.get("userId"), 10);
        if (this.get("userRoles"))
            Utils.createCookie("accessdb-session-userRoles", this.get("userRoles"), 10);

        if (Utils.supports_html5_storage()) {
            sessionStorage.setItem("accessdb-session", JSON.stringify(this));
        }
        else {
            console.error("No html5 storage supported by your browser");
        }
         */
        console.log("session saved in local storage");
    },
    isSessionAuthenticated: function () {
        var auth = false;
        if (this.get("userId")!==null && this.get("userId")!=="anon")
            auth = true;
        return auth;
    },
    load: function (callback) {
        var self = this;
        accessdb.sessionId = Utils.readCookie("accessdb-session-id") || accessdb.sessionId;
        accessdb.API.TESTINGSESSION.getSession(function(error, data, status){
            if(error){
                callback(error);
                return;
            }
            if(status===403){ // not auth
               // accessdb.session.set("sessionId", data.sessionId);
                //self.saveLocalSession();
                accessdb.session.attributes = data;
                console.log("unauth session: " + accessdb.sessionId);
            }
            else if(status>=200){ // auth session
                accessdb.session.attributes = data;
                    if(self.get("userId")!=null){
                        //accessdb.session.set("sessionId", data.sessionId);
                        $(".login-info").html("Log out " + self.get("userId"));
                        $(".login-info").parent().attr("href","#/log-out.html");
                        $(".userid").html(self.get("userId"));
                    }

            }
            else{
                console.warn("unknown state");
                callback("error");
            }
            callback();
        });


        this.set("profiles_index", 0);
    },
    initHandlers : function(){
        $("#doLogin").on("click", function (event) {
            var lData = {
                userId: $("#userId").val(),
                pass: $("#pass").val(),
                sessionId: accessdb.session.get("sessionId")
            };
            var pass = false;
            try{
                pass = document.getElementById("loginform").checkValidity();
            }
            catch(e){
                if(lData.userId.length>0 && lData.pass.length>0)
                    pass = true;
                if(!pass)
                    Utils.msg2user("Invalid input. Please try again.");
            }
            if(pass)
            {
                accessdb.session.login(lData, function (result) {
                    if (result) {
                        console.log("login success");
                        $("#logoutInfo").show();
                        $("#loginform").hide();
                        //accessdb.appRouter.loadPage("home");
                    }
                    else
                    {
                        Utils.msg2user("The username or password entered is not correct. Please try again.");
                        return false;
                    }
                }, "#infodiv");
                return false;
            }
        });
        $('#login').on("keydown", function (e) {
            if (e.keyCode == $.ui.keyCode.ENTER) {
                if (accessdb.session.userId == null)
                    $("#doLogin").trigger("click");
                else
                    $("#doLogout").trigger("click");
            }
        });
    }
})
;
