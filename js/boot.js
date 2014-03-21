
(function(){
    for ( var property in accessdb.config.services)
    {
        accessdb.config.services[property] = accessdb.config.URL_API_ROOT + accessdb.config.services[property];
    }

    accessdb.session = new accessdb.Models.testingSession;
    accessdb.session.on('change', function(){
        console.log("session changed");
    });
    accessdb.session.on('invalid', function(model,error){
        console.warn("session invalid: "+ error); // printing the error message on console.
    });
})();

//$.cookie.json = true;
//TestingManager.create();
//accessdb.session.updateUI();
//accessdb.session.profiles_index = 0;

