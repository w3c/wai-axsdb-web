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
            this.$el.find('.chart').peity("pie", {
                fill: ["green", "#f98"]
            });
            this.$el.find('button').on('click', function(){
                var view = new accessdb.Views.TestResultsDataTestCaseOverview();
                view.$el = $(this);
                view.reload();
            });
        }
    };
    this.fetch = function (params, callback){
        var self = this;
        if (!params || params.length<1 ){
            console.warn("No filter defined!");
            callback("No filter defined!", null);
        }
        else {
            accessdb.API.TESTRESULT.findByFilterTestResultTechniqueOveview(params.filter, function (error, data, status) {
                if(!error){
                    console.log(data);
                    self.results = data;
                    callback(null, self.results);
                }
                else
                    callback(error);
            });
        }
    };
    this.reload = function(){
        var pageId = accessdb.config.PAGE_ID_PREFIX+"results";
        if(accessdb.appRouter.page === pageId){
            var self = this;
            var params = {filter: accessdb.filters[pageId]};
            this.fetch(params, function(error, data){
                if(!error)
                    self.render();
            });
        }
    }
};

accessdb.Views.TestResultsDataTestCaseOverview = function (){
    this.$el = null;
    this.results = null;
    this.render = function(){
        if(this.results){
            eltbody =  this.$el.parents('tbody');
            sistertbody = eltbody.next(); // tbody.testcases
            icon =  this.$el.find('.icon');
            iconlabel = icon.find('.visuallyhidden');
            eltbody.toggleClass('collapsed');
            var tctemplate = _.template( $("#TestResultsDataOverviewTestCases_template").html(), {results: this.results} );
            sistertbody.html( tctemplate );
            sistertbody.find('.chart').peity("pie", {
                fill: ["green", "#f98"]
            });
            icon.toggleClass('icon-collapse icon-expand');
            if (icon.is('.icon-expand')) {
                iconlabel.text('Expand');
            } else {
                iconlabel.text('Collapse');
            }
        }
    };
    this.fetch = function (params, callback){
        var self = this;
        if (!params || params.length<2 ){
            console.warn("No filter defined!");
            callback("No filter defined!", null);
        }
        else {
            var filter = params.filter;
            var techNameId = $(this.$el).val();
            accessdb.API.TESTRESULT.findByFilterTestResultTestOveview(params.filter, techNameId, function (error, data, status) {
                if(!error){
                    console.log(data);
                    self.results = data;
                    callback(null, self.results);
                }
                else
                    callback(error);
            });
        }
    };
    this.reload = function(){
        var pageId = accessdb.config.PAGE_ID_PREFIX+"results";
        if(accessdb.appRouter.page === pageId){
            var self = this;
            var params = {filter:accessdb.filters[pageId]};
            this.fetch(params , function(error, data){
                if(!error)
                    self.render();
            });
        }
    }
};

