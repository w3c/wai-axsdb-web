accessdb.Views.TestResultsDataOverview = function (){
    this.$el = $("#TestResultsDataOverviewDiv");
    this.results = null;
    this.params = null;
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
                if($(this).closest("tbody").next().children().length>0)
                    view.render();
                else
                    view.reload();
            });
        }
    };
    this.fetch = function (callback){
        var self = this;
        if (!this.params || this.params.length<1 ){
            console.warn("No filter defined!");
            callback("No filter defined!", null);
        }
        else {
            accessdb.API.TESTRESULT.findByFilterTestResultTechniqueOveview(this.params.filter, function (error, data, status) {
                if(!error){
                    console.log(data);
                    self.results = data;
                    callback(null, self.results);
                }
                else
                    callback(error);
            }, self.$el);
        }
    };
    this.reload = function(params){
        var pageId = accessdb.config.PAGE_ID_PREFIX+"results";
        if(accessdb.appRouter.page === pageId){
            var self = this;
            this.params = params || {};
            this.params.filter = accessdb.session.get("resultsFilter");
            this.fetch(function(error, data){
                if(!error)
                    self.render();
            });
        }
    }
};
accessdb.Views.TestResultsDataTestCaseOverview = function (){
    this.$el = null;
    this.results = null;
    this.params = null;
    this.render = function(){
        eltbody =  this.$el.parents('tbody');
        sistertbody = eltbody.next(); // tbody.testcases
        icon =  this.$el.find('.icon');
        iconlabel = icon.find('.visuallyhidden');
        eltbody.toggleClass('collapsed');
        if(this.results){
            var tctemplate = _.template( $("#TestResultsDataOverviewTestCases_template").html(), {results: this.results} );
            sistertbody.html( tctemplate );
        }
        sistertbody.find('.chart').peity("pie", {
            fill: ["green", "#f98"]
        });
        icon.toggleClass('icon-collapse icon-expand');
        if (icon.is('.icon-expand')) {
            iconlabel.text('Expand');
        } else {
            iconlabel.text('Collapse');
        }
    };
    this.fetch = function (callback){
        var self = this;
        if (!this.params || this.params.length<2 ){
            console.warn("No filter defined!");
            callback("No filter defined!", null);
        }
        else {
            var filter = this.params.filter;
            var techNameId = $(this.$el).val();
            accessdb.API.TESTRESULT.findByFilterTestResultTestOveview(this.params.filter, techNameId, function (error, data, status) {
                if(!error){
                    console.log(data);
                    self.results = data;
                    callback(null, self.results);
                }
                else
                    callback(error);
            }, self.$el.closest("tbody").next());
        }
    };
    this.reload = function(params){
        this.params = params || {};
        var pageId = accessdb.config.PAGE_ID_PREFIX+"results";
        if(accessdb.appRouter.page === pageId){
            var self = this;
            this.params.filter = accessdb.session.get("resultsFilter");
            this.fetch(function(error, data){
                if(!error)
                    self.render();
            });
        }
    }
};
accessdb.Views.TestResultsFullViewByTechnique = function (){
    this.$el = $("#TestResultsFullViewByTechniqueDiv");
    this.results = null;
    this.params = null;
    this.render = function(){
        if(this.results){
            var template = _.template( $("#TestResultsFullViewByTechnique_template").html(), {results: this.results, params: this.params} );
            this.$el.html( template );
            this.$el.find('.chart').peity("pie", {
                fill: ["green", "#f98"]
            });
            var table = this.$el.find('table').get();
            Utils.sortResultsTable(table, table);
        }
    };
    this.fetch = function (callback){
        var self = this;
        if (!this.params || this.params.length<1 ){
            console.warn("No filter defined!");
            callback("No filter defined!", null);
        }
        else {
            accessdb.API.TESTRESULT.getResultsFullViewByTechnique(this.params.filter, this.params.techNameId, function (error, data, status) {
                if(!error){
                    console.log(data);
                    self.results = data;
                    callback(null, self.results);
                }
                else
                    callback(error);
            }, this.$el);
        }
    };
    this.reload = function(params){
        var pageId = accessdb.config.PAGE_ID_PREFIX+"results-technique";
        if(accessdb.appRouter.page === pageId){
            var self = this;
            params = params || {};
            params.filter = accessdb.session.get("resultsFilter");
            params.type = "Technique";
            params.typeValue = params.techNameId;
            this.params = params;
            this.fetch(function(error, data){
                if(!error)
                    self.render();
            });
        }
    }
};
accessdb.Views.TestResultsFullViewByTechniqueRelatedTests = function (){
    this.$el = $("#RelatedTestCasesDiv");
    this.results = null;
    this.params = null;
    this.render = function(){
        if(this.results){
            var template = _.template( $("#RelatedTestCases_template").html(), {results: this.results} );
            this.$el.html( template );
            this.$el.find('.chart').peity("pie", {
                fill: ["green", "#f98"]
            });
        }
    };
    this.fetch = function (callback){
        var self = this;
        if (!this.params || this.params.length<2 ){
            console.warn("No filter defined!");
            callback("params not defined!", null);
        }
        else {
            accessdb.API.TESTRESULT.findByFilterTestResultTestOveview(this.params.filter, this.params.techNameId, function (error, data, status) {
                if(!error){
                    console.log(data);
                    self.results = data;
                    callback(null, self.results);
                }
                else
                    callback(error);
            }, this.$el);
        }
    };
    this.reload = function(params){
        var pageId = accessdb.config.PAGE_ID_PREFIX+"results-technique";
        if(accessdb.appRouter.page === pageId){
            var self = this;
            params = params || {};
            params.filter = accessdb.session.get("resultsFilter");
            this.params = params;
            this.fetch(function(error, data){
                if(!error)
                    self.render();
            });
        }
    }
};
accessdb.Views.TestResultsFullViewByTest = function (){
    this.$el = $("#TestResultsFullViewByTestDiv");
    this.results = null;
    this.params = null;
    this.render = function(){
        if(this.results){
            var filter = accessdb.session.get("resultsFilter");
            var template = _.template( $("#TestResultsFullViewByTechnique_template").html(), {
                results: this.results,
                params: this.params
            } );
            this.$el.html( template );
            var btnTechnique = $($("#" + accessdb.config.PAGE_ID_PREFIX + "results-test" + " .back-button").get(0));
            var technique = Utils.stripTechniqueFromTestID(this.params.typeValue);
            btnTechnique.attr("href","#/results-technique.html/"+technique);
            $(btnTechnique.find("span").get(1)).html("Back to technique " + technique);
            this.$el.find('.chart').peity("pie", {
                fill: ["green", "#f98"]
            });
        }
    };
    this.fetch = function (callback){
        var self = this;
        if (!this.params || this.params.length<1 ){
            console.warn("No filter defined!");
            callback("No filter defined!", null);
        }
        else {
            accessdb.API.TESTRESULT.getResultsFullViewByTest(this.params.filter, this.params.testUnitId, function (error, data, status) {
                if(!error){
                    console.log(data);
                    self.results = data;
                    callback(null, self.results);
                }
                else
                    callback(error);
            }, this.$el);
        }
    };
    this.reload = function(params){
        var pageId = accessdb.config.PAGE_ID_PREFIX+"results-test";
        if(accessdb.appRouter.page === pageId){
            var self = this;
            params = params || {};
            params.filter = accessdb.session.get("resultsFilter");
            params.type = "Test";
            params.typeValue = params.testUnitId;
            this.params = _.clone(params);
            this.fetch(function(error, data){
                if(!error)
                    self.render();
            });
        }
    }
};
accessdb.Views.TestResultsDetails = function (){
    this.$el = $("#Results");
    this.results = null;
    this.params = null;
    this.render = function(){
        if(this.results){
            var groupedResults = _.groupBy(this.results, 'testUnitId');
            var results = [];
            for (r in groupedResults){
                var resPerTest = groupedResults[r];
                var testResult = {
                    testUnitId: r,
                    testResults : []
                };
                for (ress in resPerTest) {
                    var res = resPerTest[ress];
                    if(res.testingProfile){
                        testResult.testResults.push({
                            resultId: res.resultId,
                            result: res.resultValue,
                            os: res.testingProfile.platform.name + " " + res.testingProfile.platform.version.text,
                            plugin: res.testingProfile.plugin.name ,
                            comment: res.comment,
                            contributor: res.userId
                        });
                    }
                }
                results.push(testResult);
            }
            var filter = accessdb.session.get("resultsFilter");
            var template = _.template($("#Results_template").html(), {
                results: results,
                params: this.params}
            );
            this.$el.html( template );
            var test = null;
            var technique = null;
            var btnTechnique = $($("#" + accessdb.config.PAGE_ID_PREFIX + "results-details" + " .back-button").get(0));
            var btnTest = $($("#" + accessdb.config.PAGE_ID_PREFIX + "results-details" + " .back-button").get(1));
            if(this.params.type==="Test"){
                test = this.params.typeValue;
                technique = Utils.stripTechniqueFromTestID(test);
            }
            else{
                technique = this.params.typeValue;
            }
            btnTechnique.attr("href","#/results-technique.html/"+technique);
            $(btnTechnique.find("span").get(1)).html("Back to technique " + technique);
            if(test){
                btnTest.attr("href","#/results-test.html/"+test);
                $(btnTest.find("span").get(1)).html("Back to test " + Utils.stripTestID(test));
                btnTest.show();
            }
            else
                btnTest.hide();
            Utils.UIRoleAdapt();
        }
    };
    this.fetch = function (callback){
        var self = this;
        if (!this.params || this.params.length<4 ){
            console.warn("No filter defined!");
            callback("No filter defined!", null);
        }
        else {
            var filter = _.clone(this.params.filter);
            if(this.params.type){
                if(this.params.type==="Test"){
                    filter.tests = [this.params.typeValue];
                }
                else if(this.params.type==="Technique"){
                    filter.techniques = [this.params.typeValue];
                }
            }
            if(this.params.ua)
                filter.uas = [{id: "0", name: this.params.ua, type:"UAgent", version: this.params.uaVer}];
            if(this.params.at)
                filter.ats = [{id:"0", name: this.params.at, type:"AssistiveTechnology", version: this.params.atVer}];
            else
                filter.ats = [];
            accessdb.API.TESTRESULT.filter(filter, function (error, data, status) {
                if(!error){
                    console.log(data);
                    self.results = data;
                    callback(null, self.results);
                }
                else
                    callback(error);
            }, this.$el);
        }
    };
    this.reload = function(params){
        var pageId = accessdb.config.PAGE_ID_PREFIX+"results-details";
        if(accessdb.appRouter.page === pageId){
            var self = this;
            params = params || {};
            params.filter = accessdb.session.get("resultsFilter");
            this.params = params;
            this.fetch(function(error, data){
                if(!error)
                    self.render();
            });
        }
    }
};