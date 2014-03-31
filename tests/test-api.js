asyncTest( "API.WEBTECHNOLOGIES.findAll", function() {
    accessdb.API.WEBTECHNOLOGIES.findAll(function(error, data, status){
        if(data){
            console.log(data);
            ok(data.length === 1, "WEBTECHNOLOGIES found!" );
            start();
        }
    });
});
asyncTest( "API.TEST.countAll", function() {
    accessdb.API.TEST.countAll(function(error, data, status){
        if(data){
            console.log(data);
            ok(data === 2, "Tests found!" );
            start();
        }
    });
});