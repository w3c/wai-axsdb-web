asyncTest( "API.WEBTECHNOLOGIES.findAll", function() {
    accessdb.API.WEBTECHNOLOGIES.findAll(function(error, data, status){
        if(data){
            console.log(data);
            ok(data.length > 0, "WEBTECHNOLOGIES found! "+data.length );
            start();
        }
    });
});
asyncTest( "API.TEST.countAll", function() {
    accessdb.API.TEST.countAll(function(error, data, status){
        if(data){
            console.log(data);
            ok(data > 0, "Tests found! "+data );
            start();
        }
    });
});
asyncTest( "API.TESTRESULT.loadTestResultsDataOverview", function() {
    var filter = new window.accessdb.Models.Filter("axsdb-page-results");
    accessdb.API.TESTRESULT.loadTestResultsDataOverview(filter, function (error, data, status) {
        if(!error){
            console.log(data);
            ok(data.length >=0, "Results found! "+data.length );
            start();
        }
    },$("#loading"));
});