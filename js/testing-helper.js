accessdb.Models.TestingHelper = function (){
    var testIds = null; // ["ARIA1_0000001", "ARIA2_0000002"]
    var holder = "#testingForm";
    var test, testResult, userProfile = null;
    return {
        start: function () {
            this.loadDataFromSession();
            userProfile = UserTestingProfile.getUserProfileById(accessdb.session.get("testProfileId"));
        },
        loadDataFromSession: function () {
            testIds = _.clone(accessdb.session.get("testUnitIdList"));
        },
        loadNext: function () {
            if(userProfile===null){
                console.error("TestingRunner has not been started");
                return false;
            }
            if(this.hasNext()){
                this.prepareTestData();
                test.showInTestingPage();
                return true;
            }
            return false;
        },
        saveAndLoadNext : function(){
            this.prepareResult();
            this.saveDataToSession();
            Utils.resetForm(holder);
            this.loadNext();
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
            var nextId = _.clone(testIds).pop();
            test = new TestUnit();
            test.loadByIdSync(nextId);
        },
        prepareResult: function () {
            testResult = new TestResult();
            testResult.comment = $("#testing_comment").val();
            testResult.resultValue = $("input[name='result']:checked").val();
            testResult.testUnitDescription =
            {
                id: test.id
            };
            testResult.testUnitId = test.testUnitId;
            testResult.testingProfile = new TestingProfile();
            testResult.testingProfile.setDataWithNoId(userProfile.profile);
            testResult.type = "RESULT";
            var nowD = new Date();
            testResult.runDate = nowD.toJSON();
        },
        hasNext: function () {
            return testIds.length >=0;
        }
    }
}