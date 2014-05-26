function TestUnit() {
    this.id = -1;
    this.testUnitId = null;
    this.language = "en";
    this.title = null;
    this.description = null;
    this.status = "UNCONFIRMED";
    this.creator = "W3C";
    this.version = "0.1";
    this.comment = "[no comment]";
    var myDate = new Date();    
    this.creator = accessdb.session.get("userId");
    var cdate = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + "-"
            + (myDate.getDate());
    this.date = cdate;
    this.technique = {
            id:-1,
            nameId:"",
            title:"",
            webTechnology:""
    };
    this.testProcedure = {
            step :[{
                id:-1,
                step:""
            }],
            yesNoQuestion:"",
            expectedResult:""
    };
    this.subject = {
            testFile:{
                id:-1,
                mediatype:"",
                src:""
            },
            resourceFiles:[{
                id:-1,
                mediatype:"",
                src:""
            }]  
    };
    $("#test-form-status").val(this.status.toLowerCase());
};
TestUnit.prototype.showTestUnitsDetails = function()
{
    var testurl = this.getTestFileUrl();
    $("#tu_testUnitId").html(this.testUnitId);
    $("#tu_title").html(this.title);
    $("#tu_description").html(this.description);
    $("#tu_requirement").html(this.technique.nameId + ": " + this.technique.title);
    $("#tu_webTechnology").html(this.technique.webTechnology);
    $("#tu_status").html(this.status);
    $("#tu_date").html(this.date);
    $("#tu_testurl a").attr("href",this.getTestFileUrl());
    $("#tu_comment").html(this.comment);
    $("#tu_question").html(this.testProcedure.yesNoQuestion);
    $("#tu_expected").html(this.testProcedure.expectedResult);
    var steps=TestUnit.loadStepsData(this.testProcedure);

    var stepsH = "";
    for ( var stepId in steps) {
        var step = steps[stepId].step;
        stepsH+="<li>"+step+"</li>";
    }
    $("#tu_steps").html(stepsH);
    //this.showResourceFilesList();

};
TestUnit.prototype.setData = function(data) {
    for (var property in data) {
        this[property] = data[property];
    }
};
TestUnit.prototype.showInTestingPage = function(){
    var testRef = this.getTestFileUrl();
    this.testFile = testRef;
    var tmp = _.template($('#test-run-template').html(), {
        test: this
    });
    $("#test-run-holder").empty();
    $("#test-run-holder").append(tmp);
};
TestUnit.prototype.getTestFileUrl = function() {
    var testurl=accessdb.config.URL_TESUITES_ROOT + "notest.html";
    try{
        testurl = accessdb.config.URL_TESUITES_ROOT + this.technique.webTechnology + "/" + getFileNameWithNoExt(this.subject.testFile.src) + "/"+ this.subject.testFile.src;
    }
    catch (e) {
        // TODO: handle exception
    }
    return testurl;
};
TestUnit.prototype.getResourceFileUrl = function(src) {
    var testurl=accessdb.config.URL_TESUITES_ROOT + "notest.html";
    try{
        testurl = accessdb.config.URL_TESUITES_ROOT + this.technique.webTechnology + "/" + getFileNameWithNoExt(this.subject.testFile.src) + "/"+ src;
    }
    catch (e) {
        // TODO: handle exception
    }
    return testurl;
};
TestUnit.prototype.loadById = function(id,callback) {
    var obj = this;
    accessdb.API.TEST.findById(id, function(error, data, status){
        obj.setData(data);
        callback(obj);
    }); 
};
TestUnit.prototype.deleteTest = function(callback) {
    var url = accessdb.config.services.URL_SERVICE_DELETE_TESTUNIT +accessdb.session.get("sessionId") + "/" + this.id; 
    $.ajax({
        'url': url,
        data: {}, 
        type : "DELETE",
        error: function(xhr, status) {
            callback(xhr.status); 
        },
        complete: function(xhr, statusText){
            callback(xhr.status); 
        }
    });
};
TestUnit.prototype.loadByIdSync = function(id) {
    var obj = this;
    var data = Utils.ajaxSync(accessdb.config.services.URL_SERVICE_GET_TESTUNITS + "/" + id, "GET",null);   
    if(obj)
        obj.setData(data);
    return obj;
};
TestUnit.prototype.buildFromForm = function()
{
    if(this.testProcedure.steps){ //FIXME
        delete this.testProcedure.steps;
        delete this.subject.resources;
    }
    var editorVal = accessdb.code.editorDoc.getValue();
    $("#test-form-code").val(editorVal);
    this.testUnitId = $("#test-form-testUnitId").val();
    this.title = $("#test-form-title").val();
    this.description = $("#test-form-description").val();
    this.status = $("#test-form-status option:selected").val().toUpperCase();
    this.creator = accessdb.session.get("userId");
    var datenow = new Date();
    this.date = datenow.toJSON();
    this.testProcedure.yesNoQuestion = $("#test-form-yesNoQuestion").val();
    this.testProcedure.expectedResult = $("#test-form-expectedResult").val();
    var testProcedure = this.testProcedure;
    testProcedure.step=[];
    var stepIndex=0;
    $('.test-form-step').each(function() {
        var val = $(this).val();
        if(val.trim()!=""){
            var iid= -1;
            var step_={
                    step: val,
                    id:-1,
                    orderId:stepIndex
            };
            stepIndex++;
            testProcedure.step.push(step_);
        }
    });
    this.testProcedure = testProcedure;
    this.subject.resourceFiles = [];
    this.comment = $("#test-form-comment").val();
    console.log(this);
};
TestUnit.prototype.buildForm = function()
{
    $("#test-form-testUnitId").val(this.testUnitId);
    $("#test-form-language").val(this.language);
    $("#test-form-title").val(this.title);
    $("#test-form-description").val(this.description);
    $("#test-form-status").val(""+this.status );
    $("#test-form-creator").val(this.creator);
    $("#test-form-version").val(this.version);
    $("#test-form-date").val(this.date);
    $("#test-form-requirement").val(this.technique.nameId);
    $("#test-form-reqRef").prop('disabled', true);
    $("#test-form-reqRef").val(this.technique.title);
    $("#test-form-yesNoQuestion").val(this.testProcedure.yesNoQuestion);
    $("#test-form-expectedResult").val(""+this.testProcedure.expectedResult );
    $("#test-form-comment").val(this.comment);
    $("#test-form-status").val(this.status);
    var testurl = this.getTestFileUrl();    
    //avoid caching my passing random param
    testurl = testurl + "?date="+new Date().toString();
    $.get(testurl, function(data) {
      accessdb.code.editorDoc.setValue(data);
    });
    var stepsData=TestUnit.loadStepsData(this.testProcedure);
    $("#test-form-steps ol li + li").remove();
    $("#test-form-steps ol li").EnableMultiField({
        linkText: 'Add more',
        linkClass: 'addMoreFields',
        enableRemove: true,
        removeLinkText: 'Remove',
        removeLinkClass: 'removeFields',
        confirmOnRemove: false,
        confirmationMsgOnRemove: 'Are you sure you wish to remove this step?',
        beforeAddEventCallback: null,
        addEventCallback : function(newElem, clonnedFrom){
       },
       removeEventCallback: null,
        maxItemsAllowedToAdd: null,
        maxItemReachedCallback: null,
        data: stepsData
        }); 
    var resourceFilesData=[];
    $("#test-form-resourceFiles ol li + li").remove();
    $("#test-form-resourceFiles ol li").EnableMultiField({
        linkText: 'Add more',
        linkClass: 'addMoreFields',
        enableRemove: true,
        removeLinkText: 'Remove',
        removeLinkClass: 'removeFields',
        confirmOnRemove: false,
        confirmationMsgOnRemove: 'Are you sure you wish to remove this file?',
        beforeAddEventCallback: null,
        addEventCallback : function(newElem, clonnedFrom){
       },
       removeEventCallback: null,
        maxItemsAllowedToAdd: null,
        maxItemReachedCallback: null,
        data: resourceFilesData
        }); 
    this.showResourceFilesList(true);
};
TestUnit.prototype.showResourceFilesList = function (edit)
{
    edit = edit || false;
    if(this.subject.resources && this.subject.resources.length>0)
    {
        var filesUL = $("<ul/>");
        for ( var i = 0; i < this.subject.resources.length; i++)
        {
            var file = this.subject.resources[i];
            var a = $('<a />')
                .attr("href",this.getResourceFileUrl(file.src))
                .attr("target","new")
                .attr("title","open file in new window")
                .html(file.src);
            var filesLI = $("<li/>");
            filesLI.append(a);
            if(edit){
                var aDel = $('<a class="removeMe" data-accessdb-id="">Delete</a>')
                    .attr("data-accessdb-id", file.id);
                $(aDel).on('click', function(event)
                {
                    var fileId = $(event.target).closest(".removeMe").attr("data-accessdb-id");
                    var testUnitId = accessdb.session.get("currentTestUnit").testUnitId;
                    var sessionId = accessdb.session.get("sessionId");
                    TestUnit.deleteResourceFile(sessionId,fileId,testUnitId, function(error, data, status){
                        console.log(data.status);
                        if(error){
                            Utils.msg2user("There was a problem deleting the resource file. Please try again");
                        }
                        else{
                            if(data.status===200)
                            {
                                accessdb.session.get("currentTestUnit").subject.resources = jQuery.grep(accessdb.session.get("currentTestUnit").subject.resources, function( a ) {
                                    return (a.id+"") !== fileId;
                                });
                                accessdb.session.get("currentTestUnit").showResourceFilesList(true);
                            }
                            else if(data.status === 401)
                                Utils.msg2user("It seems you are not authorized to delete this resource. Please logout and login again.");
                        }
                    });
                });
                filesLI.append(aDel);
            } 
            filesUL.append(filesLI);
        }
        $(".testCaseResourceFilesDiv").html(filesUL);
        $(".testCaseResourceFilesDiv").find("a.removeMe").button();
    }
    else
           $(".testCaseResourceFilesDiv").html("Currently no resource file saved");
};
TestUnit.prototype.initForm = function (sessionId)
{
    $("#test-form").find("input[type=text], textarea").val("");
    $("#test-form").find("input:radio").attr("checked", false);
    var myDate = new Date();
    var cdate = myDate.getFullYear()+ '-' + (myDate.getMonth()+1)  + "-" + (myDate.getDate()) ;
    $("#test-form-date").attr("value",cdate);
    //$("#test-form-status").attr("value","UNCONFIRMED");
    $("#test-form-language").attr("value","en");
   // $("#test-form-testUnitId").attr("value",getURLParameter("testUnitId"));
   // $("#test-form-date" ).datepicker( "option", "dateFormat", accessdb.config.DATE_FORMAT );
    $("#test-form-sessionId").attr("value",sessionId);
    var stepsE = $("#test-form-steps ol li:first");
    stepsE.EnableMultiField({
        linkText: 'Add more',
        linkClass: 'addMoreFields',
        enableRemove: true,
        removeLinkText: 'Remove',
        removeLinkClass: 'removeFields',
        confirmOnRemove: false,
        confirmationMsgOnRemove: 'Are you sure you wish to remove this step?',
        beforeAddEventCallback: null,
        addEventCallback : function(newElem, clonnedFrom){
       },
       removeEventCallback: null,
        maxItemsAllowedToAdd: null,
        maxItemReachedCallback: null,
        data: []
    });
    var fileE = $("#test-form-resourceFiles ol li:first");
    //$(fileE).replaceWith( fileE = $(fileE).clone( true ) );
    fileE.EnableMultiField({
        linkText: 'Add more',
        linkClass: 'addMoreFields',
        enableRemove: true,
        removeLinkText: 'Remove',
        removeLinkClass: 'removeFields',
        confirmOnRemove: false,
        confirmationMsgOnRemove: 'Are you sure you wish to remove this resource?',
        beforeAddEventCallback: null,
        addEventCallback : function(newElem, clonnedFrom){
            //$("#testform").trigger('create');
       },
       removeEventCallback: null,
        maxItemsAllowedToAdd: null,
        maxItemReachedCallback: null,
        data: []
    });
};
TestUnit.prototype.isValid = function()
{
    var errors = [];
    if(this.title.length<5)
        errors.push("Please type a valid (more than 5 chars) title");
    if(this.technique.nameId.length<2)
        errors.push("Please select a valid technique"); 
    if(this.testProcedure.step.length<1)
        errors.push("Please insert steps for test procedure");
    if(this.testProcedure.yesNoQuestion.length<2)
        errors.push("Please type criteria for test procedure"); 
    this.reportValidation(errors);  
    return errors.length < 1;
};
TestUnit.prototype.reportValidation = function(errors){
    $("#testformValidation").empty();
    if(errors.length>0){
        var h = $("<h3></h3>");
        h.text(errors.length+ " error(s) in Submission");
        $("#testformValidation").append(h);
        var ul = $("<ol></ol>");
        $("#testform_erros").append("<li></li>");
        for(var errorId in errors){
            var li = $("<li></li>").append(errors[errorId]);
            ul.append(li);          
        }
        $("#testformValidation").append(ul);
        $("#testformValidation").scrollTop();
        $("#testformValidation").focus();
        $("html, body").animate({ scrollTop: 0 }, "slow");
    }
};
TestUnit.prototype.submitForm = function ()
{
    this.buildFromForm();
    if(this.isValid())
    {
        var json_text = JSON.stringify(this, null, 2);
        $("#test-form-TestUnitDescription").val(json_text);
        $("#test-form").submit();    
        return true;
    }   
    else
        return false;
};
TestUnit.deleteResourceFile = function(sessionId,fileId,testUnitId, callback) {
    accessdb.API.TEST.deleteResourceFile(fileId, testUnitId, callback);
};
TestUnit.getTestsTreeData = function(callback){
    accessdb.API.TEST.getTestsTreeData(accessdb.filters["axsdb-page-tests-run"], callback);
};
TestUnit.loadStepsData = function(testProcedure)
{
    function SortByOrder(a, b){
        var aOrder= parseInt(a.orderId);
        var bOrder = parseInt(b.orderId);
        return ((aOrder < bOrder) ? -1 : ((aOrder > bOrder) ? 1 : 0));
    };
    var stepsData=[];
    var steps = testProcedure.steps;
    for ( var stepId in steps) {
        var step = steps[stepId];
        var txt = step.step;
        var stepData = {
            step : txt,
            orderId : step.orderId
        };
        stepsData.push(stepData);
    }
    stepsData.sort(SortByOrder);
    return stepsData;
};
TestUnit.initFormPage = function (id) {
    var cache = {}, lastXhr;
    var bar = $('.bar');
    var percent = $('.percent');
    var status = $('#status');
    $("#test-form-testformValidation").empty();
    $("#test-form-technique").prop('disabled', false);
    var select_test_case = new  TestUnit();
    accessdb.session.set("select_test_case", TestUnit());
    accessdb.code.initeditor();
    accessdb.code.reseteditor();
    $("#test-form").attr("action", accessdb.config.services.URL_SERVICE_INSERT_TESTUNIT + "/" + accessdb.session.get("sessionId"));
    if (accessdb.session.get("userId") != null) {
        accessdb.code.showLibraries();
        /*for edit*/
        if (id) {
            select_test_case.loadById(id, function (obj) {
                accessdb.session.set("currentTestUnitId", id);
                select_test_case.buildForm();
                $("#test-form").show();
                $("#test-form-submit").val("Save Test Case");
                $('#test-form-technique').focus();
            });
        }
        else {
            select_test_case.initForm(accessdb.session.get("sessionId"));
            $("#test-form").show();
            $("#test-form-submit").val("Submit Test Case");
        }
        $('#test-form-technique').focus();
    }
    else {
        accessdb.appRouter.redirect("log-in.html")
    }
    accessdb.session.set("select_test_case", select_test_case);

    $("#test-form-technique").autocomplete({
        minLength: 2,
        focus: function (event, ui) {
            $("#test-form-technique").val(ui.item.nameId + ": " + ui.item.title);
            $("#test-form-requirement").val(ui.item.specRef + "#" + ui.item.nameId);
            return false;
        },
        select: function (event, ui) {
            $("#test-form-technique").val(ui.item.nameId + ": " + ui.item.title);
            $("#test-form-requirement").val(ui.item.nameId);
            accessdb.session.get("select_test_case").technique = ui.item;
            console.log(accessdb.session.get("select_test_case"));
            accessdb.code.updateTitle();
            return false;
        },
        source: function (request, response) {
            var term = request.term;
            if (term in cache) {
                response(cache[term]);
                return;
            }
            lastXhr = $.getJSON(accessdb.config.services.URL_SERVICE_GET_TECHNIQUES + "byterm/" + term, request, function (data, status, xhr) {
                cache[term] = data;
                if (xhr === lastXhr) {
                    response(data);
                }
            });
        }
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        return $("<li></li>").data("item.autocomplete", item).append("<a>" + item.nameId + ": " + item.title + "</a>").appendTo(ul);
    };
    $('#test-form-technique').on("click", function () {
        $('#test-form-technique').focus();
        $('#test-form-technique').select();
    });
    $("#test-form").ajaxForm({
        cache: false,
        timeout: 7000,
        beforeSend: function () {
            $(".progress").show();
            status.empty();
            var percentVal = '0%';
            bar.width(percentVal);
            percent.html(percentVal);
        },
        uploadProgress: function (event, position, total, percentComplete) {
            $("#test-form").hide();
            var percentVal = percentComplete + '%';
            bar.width(percentVal);
            percent.html(percentVal);
        },
        complete: function (xhr) {
            Utils.loadingStart("#testformValidation");
            accessdb.code.reseteditor();
            console.log("upload completed" + xhr.status);
            var msg = xhr.responseText;
            if (xhr.status == 201)
                msg = "Changes saved!";
            else if (xhr.status == 401)
                msg = "Either you have no permission or your Session has been expired. Please try to logout and login again";
            Utils.loadingEnd("#testformValidation");
            Utils.msg2user(msg);
        }
    });
    $("#test-form-code-library").on("change", function (event) {
        event.preventDefault();
        accessdb.code.addLibrary();
    });

    $('#test-form').on("keydown", function (e) {
        if (e.keyCode == 27) {
            $("#resourceFile").focus();
        }   // esc

    });
    $('#test-form-title').on("keyup", function (e) {
        accessdb.code.updateTitle();
    });
    $("#test-form-submit").on("click", function (event) {
        event.preventDefault();
        var done = accessdb.session.get("select_test_case").submitForm();
        if (done)
            accessdb.session.set("select_test_case", new TestUnit());
    });
}
TestUnit.viewTestUnitIdList = function(){
    var session = accessdb.session;
    $(".inqueuetest").html(session.get("testUnitIdList").length);
    var ul = $("#selected").find("ul")[0];
    $(ul).empty();
    var tests = session.get("testUnitIdList");
    for(var i=0;i<tests.length;i++){
        var test = tests[i];
        if(test){
            var li = _.template($('#test-selected-list-template').html(), {test:{testUnitId:  test, title:  accessdb.testTitles[test]}});
            $(ul).append(li);
        }
    }
};
TestUnit.loadTests = function (ids, callback){
    var tests = [];
    function createAddTest(callback, id) {
        console.log("task id" + id);
        accessdb.API.TEST.findById(id, function (error, data, status) {
            tests[id] = data;
            if(typeof callback === "function")
                callback(error, data);
        })
    }
    function successCallback(err, test){
        callback(err, tests);
    }
    async.each(ids, createAddTest.bind(this, successCallback), function(err){
        callback(err, null);
    });
}

TestUnit.loadTestsTree = function (){
    var filter = accessdb.filters[accessdb.config.PAGE_ID_PREFIX + "tests-run"];
    if(accessdb.appRouter.page !== accessdb.config.PAGE_ID_PREFIX + "tests-run"){
        return;
    }
    $("#thetestsTreeDiv").empty();
    Utils.loadingStart(".thetestsTreeDiv");
    TestUnit.getTestsTreeData(function(error, data, status){
        $("#thetestsTreeDiv").empty();
        // select what is in queue
        var countTests = 0;
        for ( var ind in data.children) {
            var techniqueNode = data.children[ind];
            data.children[ind].label = "Technique " + data.children[ind].label;
            data.children[ind].collapsed = false;
            for ( var i in techniqueNode.children) {
                var testNode = techniqueNode.children[i];
                if(!accessdb.testTitles)
                    accessdb.testTitles = [];
                accessdb.testTitles[testNode.value] =  data.children[ind].children[i].description;
                data.children[ind].children[i].label = "Test Case " + data.children[ind].children[i].label;
                data.children[ind].children[i].collapsed = false;
                if(accessdb.session.isTestInQueue(testNode.value)){
                    //set selected
                    data.children[ind].children[i].selected = true;
                }
                if(data.children[ind].children[i].type === "TestUnitDescription")
                    countTests++;
            }
        }
        $(".testsOnPage").html(countTests);
        TestUnit.viewTestUnitIdList();
        accessdb.API.TEST.countAll(function(error, data, status){
            if(data)
                $(".tests_count_all").html(data);
        });
        $.treevue(data.children,  filter.page+"-teststree").appendTo('#thetestsTreeDiv');
        Utils.loadingEnd(".webTechTreeDiv");
        accessdb.TreeHelper.updateTreeFromTestList();
    });
}