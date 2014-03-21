accessdb.TestingManager = {};
TestingManager.loadLocalSession = function()
{
    if (accessdb.session == undefined)
        accessdb.session = new TestingManager();
    if (Utils.supports_html5_storage() && sessionStorage["accessdb-session"])
    {
        accessdb.session.setData(JSON.parse(sessionStorage["accessdb-session"]));
    }
    else
    {
        // TODO: cookie + server side
    }
    /*accessdb.session.sessionId = $.cookie("accessdb-session-id") || eval(accessdb.session.sessionId);
     accessdb.session.userId = $.cookie("accessdb-session-userId") || eval(accessdb.session.userId);
     accessdb.session.userRole = $.cookie("accessdb-session-userRole") || eval(accessdb.session.userRole);*/
    debug("session loaded from local storage");

};
TestingManager.create = function loadTestingManager()
{
    TestingManager.loadLocalSession();
    if (accessdb.session.sessionId  && accessdb.session.userId!=null)
    {
        if (accessdb.session.isSessionAuthenticated())
        {
            $(".userid").html("Logout " + accessdb.session.userId);
        }
    }
    else
        accessdb.session.sessionId = accessdb.config.sessionId;

};
TestingManager.run = function(lastTestUnit, skipme)
{
    skipme = skipme || false;
    var nextTestUnit = null;
    if (lastTestUnit != null) // not the first
    {
        // validate
        if (!$("input[name='result']:checked").val() && !skipme)
        {
            $.mobile.changePage('#testing_dialog', 'pop', true, true);
            return lastTestUnit;
        }
        accessdb.session.saveTestingData(lastTestUnit, skipme);
        Utils.resetForm('#testingForm');
    }
    if (accessdb.session.testUnitIdList.length > 0)
    {
        $("#testing_msg").empty();
        $("#testingForm").show();
        nextTestUnit = new TestUnit();
        accessdb.session.currentTestUnitId = accessdb.session.testUnitIdList.pop();
        // put back in case of cancel and remove on save
        accessdb.session.testUnitIdList.push(accessdb.session.currentTestUnitId);
        nextTestUnit.loadByIdSync(accessdb.session.currentTestUnitId);
        nextTestUnit.showInTestingPage();
        // $("#testing").trigger("create");
        var moretests = accessdb.session.testUnitIdList.length - 1;
        $(".next_tests_count").attr("href", "#testing").html(moretests);
    }
    else
    { // finished
        $("#testingForm").hide();
        accessdb.session.currentTestUnitId = -1;
        $("#testing_msg").html("<p>No test in your list. Either <a href='#tests'>add more tests</a> or consider <a href='#testingresults'>submiting the existing ones</a></p>");
        accessdb.session.updateUI();
        // $.mobile.changePage("#testingresults");
    }
    return nextTestUnit;
};

