(function(){
    //$.cookie.json = true; //TODO need jq lib enabled
    for ( var property in accessdb.config.services)
    {
        accessdb.config.services[property] = accessdb.config.URL_API_ROOT + accessdb.config.services[property];
    }
    // session initialization
    accessdb.session = new accessdb.Models.testingSession;
    accessdb.session.profiles_index = 0;
    accessdb.session.save(function(error, data){
        if(error){
            console.error("session not initialized" + error)
        }
        else
            console.info("Test session initialize: " + accessdb.session.get("sessionId"));
    })

    // Event Handlers
    accessdb.session.on('change', function(){
        if (accessdb.session.get("userId")) {
            $(".userid").html("Logout " + accessdb.session.get("userId"));
        }
        else
            $(".userid").html("Login");
    });
    accessdb.session.on('change:userId', function(o){
        //update UI login/out
        /*
        if(accessdb.session.userId!=null)
        {
            $("#loginform").hide();
            $("#logoutInfo").show();
            $(".userid").html(accessdb.session.userId);
            $(".loginhidden").show();
        }
        else
        {
            $("#loginform").show();
            $("#logoutInfo").hide();
        }
        */
    });
    accessdb.session.on('change:testResultList', function(o){
        //update UI for results

    });
    accessdb.session.on('change:testUnitIdList', function(o){
        console.log("change:testUnitIdList");
        var ul = $("#selected").find("ul")[0];
        $(ul).empty();
        for(testId in accessdb.session.get("testUnitIdList")){
            var testId = accessdb.session.get("testUnitIdList")[testId];

            accessdb.API.TEST.findById(testId, function(error, data){
                var test = data;
                var li = _.template($('#test-selected-list-template').html(), {test: test});
                $(ul).append(li);
            })


        }
        accessdb.TreeHelper.updateTreeFromTestList();
        $(".inqueuetest").html(accessdb.session.get("testUnitIdList").length);


      /*
       $(".tests_count_all").html(Requirements.getCountAllTests());

        if (UserTestingProfile.getUserProfileById(this.get("testProfileId")))
            $(".currentprofile").html(UserTestingProfile.getUserProfileById(this.get("testProfileId")).profileName);
        else
            $(".currentprofile").html("None");
            */
    });

    accessdb.session.on('invalid', function(model,error){
        console.warn("session invalid: "+ error); // printing the error message on console.
    });



})();

//
//TestingManager.create();
//

