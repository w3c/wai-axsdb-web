/**
 * assuming results an array of json objects ;
 * {
    noOfAll: "0"
    noOfPass: "0"
    technique: "ARIA6"
    techniqueTitle: "Using aria-label to provide labels for objects"
 * }
 *
 */
accessdb.Views.TestResultsDataOverview = function (){
    this.$el = $("#TestResultsDataOverviewDiv");
    this.results = null;
    this.render = function(){
        if(this.results){
            var template = _.template( $("#TestResultsDataOverview_template").html(), {results: this.results} );
            this.$el.html( template );
        }
    };
    this.fetch = function (filter, callback){
        var self = this;
        if (!filter){
            console.warn("No filter defined!");
            callback("No filter defined!", null);
        }
        else {
            accessdb.API.TESTRESULT.getDataOverview(filter, function (error, data, status) {
                if(!error){
                    console.log(data);
                    self.results = data;
                    callback(null, self.results);
                }
                callback(error);
            }, self.$el);
        }
    };
    this.reload = function(){
        var pageId = accessdb.config.PAGE_ID_PREFIX+"results";
        if(accessdb.appRouter.page === pageId){
            var self = this;
            this.fetch( accessdb.filters[pageId], function(error, data){
                if(!error)
                    self.render();
            });
        }
    }
};