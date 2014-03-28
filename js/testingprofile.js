function Product(name, textVer) {
    this.name = name || "";
    this.version =
    {
        text: textVer || "",
        major: 0,
        minor: 0,
        revision: textVer || 0
    };
};
function TestingProfile() {
    this.id = -1;
    this.profileComment = null;
    this.type = null;
    this.userAgent = new Product();
    this.userAgent.name = getUAgent();
    this.userAgent.version.text = getUAgentVersion();
    this.platform = new Product();
    this.platform.name = getPlaform();
    this.platform.architecture = getPlaformArchitecture();
    this.assistiveTechnology = new Product();
    this.plugin = new Product();
    this.setData = function (data) {
        for (var property in data) {
            this[property] = data[property];
            if (this.plugin == null)
                this.plugin = new Product();
            if (this.assistiveTechnology == null)
                this.assistiveTechnology = new Product();
        }
    };
    this.setDataWithNoId = function (data) {
        this.profileComment = data.profileComment;
        this.type = data.type;
        this.userAgent = data.userAgent;
        this.platform = data.platform;
        this.assistiveTechnology = data.assistiveTechnology;
        this.plugin = data.plugin;
        if (this.plugin == null)
            this.plugin = new Product();
        if (this.assistiveTechnology == null)
            this.assistiveTechnology = new Product();
        this.id = -1;
        this.assistiveTechnology.id = -1;
        this.platform.id = -1;
        this.userAgent.id = -1;
        this.plugin.id = -1;
    };
};
function UserTestingProfile() {
    this.profileName = "Temp Profile";
    this.profile = new TestingProfile();
    this.setData = function (data) {
        for (var property in data) {
            this[property] = data[property];
            if (this.plugin == null)
                this.plugin = new Product();
            if (this.assistiveTechnology == null)
                this.assistiveTechnology = new Product();
        }
    };
};
UserTestingProfile.toString = function (testProfile) {
    var text = testProfile.platform.name + "  " + testProfile.platform.version.text;
    if (testProfile.userAgent.name)
        text = text + ", " + testProfile.userAgent.name + " " + testProfile.userAgent.version.text;
    if (testProfile.assistiveTechnology.name)
        text = text + ", " + testProfile.assistiveTechnology.name + " " + testProfile.assistiveTechnology.version.text;
    if (testProfile.plugin.name)
        text = text + ", " + testProfile.plugin.name + " " + testProfile.plugin.version.text;
    return text;
};
UserTestingProfile.loadUserProfilesByUserId = function (callback) {
    var sessionId = accessdb.session.get("sessionId");
    var userId = accessdb.session.get("userId");
    if (userId) {
        // profiles/{userId}/{sessionId}
        Utils.ajaxAsyncWithCallBack(
                accessdb.config.services.URL_SERVICE_GET_ALLUSERPROFILES + userId + "/" + sessionId, "GET", null,
            function (error, data) {
                callback(error, data);
            });
    }
    else {
        callback(null, accessdb.session.get("userTestingProfiles"));
    }
};
UserTestingProfile.persistUserProfile = function (p, callback) {
    var sessionId = accessdb.session.get("sessionId");
    var userId = accessdb.session.get("userId");
    if (userId) {
        if (p.id > 0) {
            // PUT profiles/{sessionId}
            Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_PUT_PROFILE + sessionId, "PUT", p,
                function (error, data) {
                    callback(error, data);
                });
        }
        else {
            // POST profiles/{userId}/{sessionId}
            Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_POST_PROFILE + userId + "/" + sessionId,
                "POST", p, function (error, data) {
                    callback(error, data);
                });
        }
    }
    else {
        if (p.id < -10) {
            UserTestingProfile.updateTestingProfile(p);
        }
        else {
            accessdb.session.set("pCounter", accessdb.session.get("pCounter") - 1);
            p.id = accessdb.session.get("pCounter");
            accessdb.session.get("userTestingProfiles").push(p);
            accessdb.session.set("userTestingProfiles", accessdb.session.get("userTestingProfiles"));
        }
        accessdb.session.save(function (data) {
            callback(data.userTestingProfiles);
        });
    }
};
UserTestingProfile.updateTestingProfile = function (p) {
    var userTestingProfiles = _.clone(accessdb.session.get("userTestingProfiles"));
    for (var int = 0; int < userTestingProfiles.length; int++) {
        var pp = userTestingProfiles[int];
        if (parseInt(pp.id) == parseInt(p.id)) {
            userTestingProfiles[int] = p;
            break;
        }
    }
    accessdb.session.set("userTestingProfiles", userTestingProfiles);
};
UserTestingProfile.deleteUserProfilesById = function (pid, callback) {
    var sessionId = accessdb.session.get("sessionId");
    var userId = accessdb.session.get("userId");
    if (userId) {
        Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_DELETE_PROFILE + pid + "/" + sessionId,
            "DELETE", null, function (error, data) {
                callback(error, data);
            });
    }
    else {
        UserTestingProfile.removeTestingProfile(pid);
        accessdb.session.save(function (data) {
            callback(data.userTestingProfiles);
        });
    }
};
UserTestingProfile.removeTestingProfile = function (id) {
    var userTestingProfiles = _.clone(accessdb.session.get("userTestingProfiles"));
    userTestingProfiles = jQuery.grep(userTestingProfiles, function (el, i) {
        return (el.id !== parseInt(id));
    });
    accessdb.session.set("userTestingProfiles", userTestingProfiles);
    UserTestingProfile.showTestingProfiles();
};
UserTestingProfile.getUserProfileById = function (id) {
    var session = accessdb.session;
    for (var int = 0; int < session.userTestingProfiles.length; int++) {
        if (session.userTestingProfiles[int].id == id)
            return session.userTestingProfiles[int];
    }
    return null;
};
UserTestingProfile.showTestingProfiles = function () {
    var session = accessdb.session;
    $(".userProfilesDiv").empty();
    if (session.get("userTestingProfiles").length > 0) {
        for (var testProfileId in session.get("userTestingProfiles")) {
            var userProfile = session.get("userTestingProfiles")[testProfileId];
            var testProfile = userProfile.profile;
            testProfile.platform = testProfile.platform || new Product();
            testProfile.userAgent = testProfile.userAgent || new Product();
            testProfile.assistiveTechnology = testProfile.assistiveTechnology || new Product();
            testProfile.plugin = testProfile.plugin || new Product();
            testProfile.platform.name = testProfile.platform.name || "";
            testProfile.userAgent.name = testProfile.userAgent.name || "";
            testProfile.assistiveTechnology.name = testProfile.assistiveTechnology.name || "";
            testProfile.plugin.name = testProfile.plugin.name || "";
            console.log(testProfile);
            var pTemplate = _.template($('#user-profile-template').html(), {
                p: testProfile,
                id: userProfile.id
            });
            if(accessdb.session.get("testProfileId")===userProfile.id){
                $(pTemplate).prop('checked', true);
                selected = true;
            }
            $(".userProfilesDiv").append(pTemplate);
        }
    }
    return session.get("userTestingProfiles").length;
};
UserTestingProfiletoDetailsText = function (p) {
    var s = "";
    if (p.platform != null) {
        s = s + p.platform.name;
        if (p.platform.architecture != undefined)
            s = s + " " + p.platform.architecture;
    }
    if (p.userAgent != null)
        s = s + ", " + p.userAgent.name + " " + p.userAgent.version.text;
    if (p.assistiveTechnology != null && p.assistiveTechnology.name != undefined) {
        s = s + ", " + p.assistiveTechnology.name;
        if (p.assistiveTechnology.version.text != undefined)
            s = s + " " + p.assistiveTechnology.version.text;
    }
    if (p.plugin != null && p.plugin.name != undefined) {
        s = s + ", " + p.plugin.name;
        if (p.plugin.version.text != undefined)
            s = s + " " + p.plugin.version.text;
    }
    // Windows X.Y.Z, Firefox X.Y.Z, Assistive Technology X.Y.Z
    return s;
};

UserTestingProfile.prototype.prepareAddForm = function () {
    initAutoCompleteField("#assistiveTechnology", accessdb.config.services.URL_SERVICE_GET_ASSISTIVETECHNOLOGIES);
    initAutoCompleteField("#os", accessdb.config.services.URL_SERVICE_GET_OSS);
    initAutoCompleteField("#userAgent", accessdb.config.services.URL_SERVICE_GET_USERAGENTS);
    initAutoCompleteField("#plugin", accessdb.config.services.URL_SERVICE_GET_PLUGINS);
    // $("#profileName").val("A friendly name for identifying it");
    $("#profileComment").val("Some comment");
    $("#userAgent").val(this.profile.userAgent.name);
    $("#userAgent_ver").val(this.profile.userAgent.version.text);
    $("#os").val(this.profile.platform.name);
    $("#os_ver").val(window.navigator.appVersion.getNums()[1]);
    $("#os_arch").val(window.navigator.platform);
    $(".testprofileSave").removeClass("testprofileEdit");
    $("#testProfileId").val("-1");
};
UserTestingProfile.prototype.prepareEditForm = function () {
    initAutoCompleteField("#assistiveTechnology", accessdb.config.services.URL_SERVICE_GET_ASSISTIVETECHNOLOGIES);
    initAutoCompleteField("#os", accessdb.config.services.URL_SERVICE_GET_OSS);
    initAutoCompleteField("#userAgent", accessdb.config.services.URL_SERVICE_GET_USERAGENTS);
    initAutoCompleteField("#plugin", accessdb.config.services.URL_SERVICE_GET_PLUGINS);
    // $("#profileName").val("A friendly name for identifying it");
    $("#profileComment").val(this.profile.profileComment);
    $("#userAgent").val(this.profile.userAgent.name);
    $("#userAgent_ver").val(this.profile.userAgent.version.text);
    $("#assistiveTechnology").val(this.profile.assistiveTechnology.name);
    $("#assistiveTechnology_ver").val(this.profile.assistiveTechnology.version.text);
    $("#os").val(this.profile.platform.name);
    $("#os_ver").val(this.profile.platform.version.text);
    $("#os_arch").val(this.profile.platform.architecture);
    $(".testprofileSave").addClass("testprofileEdit");
    $("#testProfileId").val(this.id);
};
UserTestingProfile.prototype.loadDataFromForm = function () {
    this.profile.assistiveTechnology = extractProductInfo("#assistiveTechnology");
    this.profile.platform = extractProductInfo("#os");
    this.profile.userAgent = extractProductInfo("#userAgent");
    this.profile.plugin = extractProductInfo("#plugin");
    this.profile.profileName = $("#profileName").val();
    this.profileComment = $("#profileComment").val();
    this.id = parseInt($("#testProfileId").val());
};

function extractProductInfo(iNselector) {
    if ($(iNselector).val() == null || $(iNselector).val() == "")
        return new Product();
    var p = new Product();
    p.name = $(iNselector).val();
    p.version.text = $(iNselector + "_ver").val();
    return p;
}

function initAutoCompleteField(holder, url) {
    var cache =
    {}, lastXhr;
    $(holder).autocomplete(
        {
            minLength: 1,
            focus: function (event, ui) {
                $(holder).val(ui.item.value);
                return false;
            },
            select: function (event, ui) {
                $(holder).val(ui.item.value);
                // console.log($(holder).val());
                return false;
            },
            source: function (request, response) {
                var term = request.term;
                if (term in cache) {
                    response(cache[term]);
                    return;
                }
                lastXhr = $.getJSON(url + term, request, function (data, status, xhr) {
                    list = data.list.filter(function (element, index, array) {
                        return element != null;
                    });
                    cache[term] = list;
                    if (xhr === lastXhr) {
                        response(list);
                    }
                });
            }
        }).data("ui-autocomplete")._renderItem = function (ul, item) {
        // console.log(item);
        item.label += '';// make sure it is string
        // if ( !typeof item === "string" )
        // return false;
        return $("<li></li>").data("item.autocomplete", item).append("<a>" + item.label + "</a>").appendTo(ul);
    };
}