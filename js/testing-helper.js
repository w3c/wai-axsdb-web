accessdb.Models.TestingHelper = function (){
    var handlersInited = false;
    var testIds = null;
    var holder = "#testingForm";
    var test, testResult, userProfile = null;
    var count = 0;
    return {
        initHandlers : function(){
            if(!handlersInited) {
                // on remove from the selected tests
                $(document).on("click", "span.icon.icon-remove", function (event) {
                    event.preventDefault();
                    var id = $(event.target).find("span").attr("aria-described-by");
                    accessdb.session.removeFromQueue(id);
                    accessdb.TreeHelper.updateTreeFromTestList();
                });

                // #/run-test.html
                $(document).on("click", ".do_next", function (event) {
                    event.preventDefault();
                    var hasNext = accessdb.testingRunner.saveAndLoadNext();
                    if (!hasNext) {
                        accessdb.appRouter.redirect("tests-finish.html")
                    }
                });
                $(document).on("click", ".skipme", function (event) {
                    event.preventDefault();
                    var hasNext = accessdb.testingRunner.skipAndNext();
                    if (!hasNext) {
                        accessdb.appRouter.redirect("tests-finish.html")
                    }
                });
                handlersInited = true;
            }
        },
        start: function () {
            count = 0;
            this.loadDataFromSession();
            userProfile = UserTestingProfile.getUserProfileById(accessdb.session.get("testProfileId"));
            console.log("TestingHelper started with " + testIds.length + " tests, profile id " + userProfile.id + " and count " + count);
        },
        loadDataFromSession: function () {
            testIds = _.clone(accessdb.session.get("testUnitIdList"));
            testIds.sort();
        },
        loadNext: function () {
            if(userProfile===null){
                console.error("TestingRunner has not been started");
                return false;
            }
            if(this.hasNext()){
                this.prepareTestData();
                test.showInTestingPage();
                this.progressUpdate();
                count ++;
                return true;
            }
            return false;
        },
        skipAndNext: function () {
            testIds = _.filter(testIds, function(item) {
                return item !== test.testUnitId;
            });
            accessdb.session.set("testUnitIdList", _.clone(testIds));
            //testIds.push(test.testUnitId);
            return this.loadNext();
        },
        inputIsValid : function(){
            return $(holder).find('input[name="result"]:checked').length > 0;

        },
        saveAndLoadNext : function(){
            if(this.inputIsValid()){
                this.prepareResult();
                this.saveDataToSession();
                Utils.resetForm(holder);
                return this.loadNext();
            }
            else{
                Utils.msg2user("It seems you have not responded the question. Please try again");
                return true;
            }

        },
        saveDataToSession: function (){
            testIds = _.filter(testIds, function(item) {
                return item !== test.testUnitId;
            });
            accessdb.session.set("testUnitIdList", _.clone(testIds));
            var testResultList = accessdb.session.get("testResultList");
            testResultList = _.filter(testResultList, function(item) {
                return item.testUnitId !== test.testUnitId;
            });
            testResultList.push(testResult);
            accessdb.session.set("testResultList", _.clone(testResultList));
            testResult = null;
            test = null;
        },
        prepareTestData: function () {
            var nextId = _.clone(testIds).shift();
            test = new TestUnit();
            test.loadByIdSync(nextId);
        },
        prepareResult: function () {
            testResult = new TestResult();
            testResult.comment = $("#cmnt").val();
            testResult.resultValue = $("input[name='result']:checked").val();
            testResult.testUnitDescription = test.testUnitId;
            testResult.testingProfile = new TestingProfile();
            testResult.testingProfile.setDataWithNoId(userProfile.profile);
            testResult.type = "RESULT";
            var nowD = new Date();
            testResult.runDate = nowD.toJSON();
            //FIXME: check format with server side
            testResult.runDate = null;
        },
        hasNext: function () {
            return testIds.length > 0;
        },
        countMore: function(){
            return testIds.length;
        },
        countDone: function(){
            return count;
        },
        progressUpdate : function (){
            var done = count;
            var all = this.countMore() + count;
            $("#axsdb-page-test-run h1 .subheading").html('Progress: ' + done + " of " + all + " Tests finished");
        }
    }
}
