test( "TestingSession Init", function() {
    var session = new accessdb.Models.testingSession;
    session.on('change', function(){
        console.log("session changed");
    });
    session.on('invalid', function(model,error){
        console.warn("session invalid: "+ error); // printing the error message on console.
    });
    ok( session.isValid() === false, "Session is initially invalid!" );
});
asyncTest( "TestingSession fetch", function() {
    var session = new accessdb.Models.testingSession;
    session.on('change', function(){
        console.log("session changed");
        console.log(session);
    });
    session.on('invalid', function(model,error){
        console.warn("session invalid: "+ error); // printing the error message on console.
    });
    session.set("testProfileId","10");
    session.fetch().then(function (s) {
        session.set(s);
        console.log(session.isValid());
        ok( session.isValid() === true, "Session is valid!" );
        start();
    });
});
asyncTest( "TestingSession save", function() {
    var session = new accessdb.Models.testingSession;
    session.on('change', function(){
        console.log("session changed");
        console.log(session);
    });
    session.on('invalid', function(model,error){
        console.warn("session invalid: "+ error); // printing the error message on console.
    });
    session.set("testProfileId","10");
    session.save(function (error, data, status) {
        console.log(session.isValid());
        ok( session.get("testProfileId") === "10", "Session is saved!" );
        start();
    });
});