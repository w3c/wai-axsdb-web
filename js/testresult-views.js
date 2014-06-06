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

accessdb.Views.TestResultsFullViewByTechnique = function (){
    this.$el = $("#TestResultsFullViewByTechniqueDiv");
    this.results = null;
    this.render = function(){
        if(this.results){
            var filter = accessdb.filters[accessdb.appRouter.page];
            var template = _.template( $("#TestResultsFullViewByTechnique_template").html(), {results: this.results, filter: filter} );
            this.$el.html( template );
            this.$el.find('.chart').peity("pie", {
                fill: ["green", "#f98"]
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
            accessdb.API.TESTRESULT.getResultsFullViewByTechnique(params.filter, params.techNameId, function (error, data, status) {
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
    this.reload = function(params){
        var pageId = accessdb.config.PAGE_ID_PREFIX+"results-technique";
        if(accessdb.appRouter.page === pageId){
            var self = this;
            params = params || {};
            params.filter = accessdb.filters[pageId];
            this.fetch(params, function(error, data){
                if(!error)
                    self.render();
            });
        }
    }
};
accessdb.Views.TestResultsFullViewByTechniqueRelatedTests = function (){
    this.$el = $("#RelatedTestCasesDiv");
    this.results = null;
    this.render = function(){
        if(this.results){
            var template = _.template( $("#RelatedTestCases_template").html(), {results: this.results} );
            this.$el.html( template );
            this.$el.find('.chart').peity("pie", {
                fill: ["green", "#f98"]
            });
        }
    };
    this.fetch = function (params, callback){
        var self = this;
        if (!params || params.length<2 ){
            console.warn("No filter defined!");
            callback("params not defined!", null);
        }
        else {
            accessdb.API.TESTRESULT.findByFilterTestResultTestOveview(params.filter, params.techNameId, function (error, data, status) {
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
    this.reload = function(params){
        var pageId = accessdb.config.PAGE_ID_PREFIX+"results-technique";
        if(accessdb.appRouter.page === pageId){
            var self = this;
            params = params || {};
            params.filter = accessdb.filters[pageId];
            this.fetch(params, function(error, data){
                if(!error)
                    self.render();
            });
        }
    }
};

accessdb.Views.TestResultsFullViewByTest = function (){
    this.$el = $("#TestResultsFullViewByTestDiv");
    this.results = null;
    this.render = function(){
        if(this.results){
            var filter = accessdb.filters[accessdb.appRouter.page];
            var template = _.template( $("#TestResultsFullViewByTechnique_template").html(), {results: this.results, filter: filter} );
            this.$el.html( template );
            this.$el.find('.chart').peity("pie", {
                fill: ["green", "#f98"]
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
            accessdb.API.TESTRESULT.getResultsFullViewByTest(params.filter, params.testUnitId, function (error, data, status) {
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
    this.reload = function(params){
        var pageId = accessdb.config.PAGE_ID_PREFIX+"results-test";
        if(accessdb.appRouter.page === pageId){
            var self = this;
            params = params || {};
            params.filter = accessdb.filters[pageId];
            this.fetch(params, function(error, data){
                if(!error)
                    self.render();
            });
        }
    }
};

accessdb.Views.TestResultsDetails = function (){
    this.$el = $("#Results");
    this.results = null;
    this.render = function(){
        if(this.results){
            var groupedResults = _.groupBy(this.results, 'testUnitDescription');
            var results = [];
            for (r in groupedResults){
                var resPerTest = groupedResults[r];
                var testResult = {
                    testUnitId: r,
                    testResults : []
                }
                for (ress in resPerTest) {
                    var res = resPerTest[ress];

                    if(res.testingProfile){
                        testResult.testResults.push({
                            id: res.id,
                            result: res.resultValue,
                            os: res.testingProfile.platform.name + " " + res.testingProfile.platform.version.text,
                            plugin: res.testingProfile.plugin.name ,
                            comment: res.comment,
                            contributor: "TODO"
                        });
                    }
                }
                results.push(testResult);
            }
            var filter = accessdb.filters[accessdb.appRouter.page];
            var template = _.template( $("#Results_template").html(), {results: results} );
            this.$el.html( template );
            Utils.UIRoleAdapt();
        }
    };
    this.fetch = function (params, callback){
        var self = this;
        console.log(params);
        if (!params || params.length<4 ){
            console.warn("No filter defined!");
            callback("No filter defined!", null);
        }
        else {
            var filter = _.clone(params.filter);
            if(params.ua)
            filter.uas = [{name: params.ua, version: params.uaVer}];
            if(params.at)
                filter.ats = [{name: params.at, version: params.atVer}];
            else
                filter.ats = [];

            console.log(filter);

            accessdb.API.TESTRESULT.filter(filter, function (error, data, status) {
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
    this.reload = function(params){
        var pageId = accessdb.config.PAGE_ID_PREFIX+"results-details";
        if(accessdb.appRouter.page === pageId){
            var self = this;
            params = params || {};
            params.filter = accessdb.filters[pageId];
            this.fetch(params, function(error, data){
                if(!error)
                    self.render();
            });
        }
    }
};