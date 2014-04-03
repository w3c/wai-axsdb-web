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
    $("#testform_tu_status").val(this.status);
    this.showTestUnitsDetails = function()
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
        $("#addtoqueue").attr("href",this.testUnitId);
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
};
TestUnit.prototype.setData = function(data) {
    for (var property in data)
    {
        this[property] = data[property];
    }
};

TestUnit.getTestsTreeData = function(callback){
    Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_GET_TESTUNITS_TREE, "POST", accessdb.testsFilter, function(error, data, status){
        callback(error, data, status);
    }); 
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
    Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_GET_TESTUNITS + "/" + id, "GET", null, function(error, data, status){
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
    $("#testCode").val(editorVal);
    this.testUnitId = $("#testUnitId").val();
    //this.language = $("#language").val();
    this.title = $("#title").val();
    this.description = $("#description").val();
    this.status = $("#testform_tu_status").val().toUpperCase();
    //this.creator = $("#creator").val();
    //this.version = $("#version").val();
    //this.date = $("#date").val();
    var datenow = new Date();
    this.date = datenow.toJSON();
    this.creator = $("#creator").val();
    // this.technique.nameId = $("#requirement").val();
    // this.technique.webTechnology = "HTML"; //FIXME
    this.testProcedure.yesNoQuestion = $("#yesNoQuestion").val();
    this.testProcedure.expectedResult = $("#expectedResult").val();
    var testProcedure = this.testProcedure;
    testProcedure.step=[];
    var stepIndex=0;
    $('.testform_step').each(function() {
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
    this.comment = $("#testform_comment").val();
    console.log(this);
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

  
TestUnit.prototype.buildForm = function()
{
    $("#testUnitId").val(this.testUnitId);
    $("#language").val(this.language);
    $("#title").val(this.title);
    $("#description").val(this.description);
    $("#status").val(""+this.status );
    $("#creator").val(this.creator);
    $("#version").val(this.version);
    $("#date").val(this.date);
    $("#requirement").val(this.technique.nameId);
    $("#reqRef").prop('disabled', true); 
    $("#reqRef").val(this.technique.title);
    $("#yesNoQuestion").val(this.testProcedure.yesNoQuestion);
    $("#expectedResult").val(""+this.testProcedure.expectedResult );
    $("#testform_comment").val(this.comment);
    $("#testform_tu_status").val(this.status).selectmenu('refresh', true);
    var testurl = this.getTestFileUrl();    
    //avoid caching my passing random param
    testurl = testurl + "?date="+new Date().toString();
    $.get(testurl, function(data) {
      accessdb.code.editorDoc.setValue(data);
    });
    var stepsData=TestUnit.loadStepsData(this.testProcedure);
    
    $("#steps ol li + li").remove();
    $("#steps ol li").EnableMultiField({
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
    $("#resourceFiles ol li + li").remove();
    $("#resourceFiles ol li").EnableMultiField({
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
                var aDel = $(
                '<a class="removeMe" data-inline="true" data-mini="true" data-accessdb-id="" data-role="button" data-icon="delete" data-iconpos="notext">Delete</a>')
                .attr("data-accessdb-id", file.id);
                $(aDel).on('click', function(event)
                {
                    var fileId = $(event.target).closest(".removeMe").attr("data-accessdb-id");
                    var testUnitId = accessdb.session.get("currentTestUnit").testUnitId;
                    var sessionId = accessdb.session.get("sessionId");
                    TestUnit.deleteResourceFile(sessionId,fileId,testUnitId, function(error, data, status){
                        console.log(data.status);
                        if(data.status===200)
                        {
                            accessdb.session.get("currentTestUnit").subject.resources = jQuery.grep(accessdb.session.get("currentTestUnit").subject.resources, function( a ) {
                                return (a.id+"") !== fileId;
                            });
                            accessdb.session.get("currentTestUnit").showResourceFilesList(true);
                        }
                        else if(data.status === 401)
                            alert("It seems you are not authorized to delete this resource. Please logout and login again.");
                        else
                            alert("There was a problem deleting the resource file. Please try again");
                        
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
TestUnit.deleteResourceFile = function(sessionId,fileId,testUnitId, callback){
    Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_DELETE_RESOURCE_FILE + sessionId + "/" + testUnitId+ "/" + fileId , "DELETE", null, callback, true);
};

TestUnit.prototype.initForm = function (sessionId)
{   
    $("#testunitform").find("input[type=text], textarea").val("");
    $("#testunitform").find("input:radio").attr("checked", false).checkboxradio("refresh");
    var myDate = new Date();
    var cdate = myDate.getFullYear()+ '-' + (myDate.getMonth()+1)  + "-" + (myDate.getDate()) ;
    $("#date").attr("value",cdate);
    $("#status").attr("value","UNCONFIRMED");
    $("#language").attr("value","en");
    $("#testUnitId").attr("value",getURLParameter("testUnitId"));   
    $( "#date" ).datepicker( "option", "dateFormat", accessdb.config.DATE_FORMAT );
    $("#sessionId").attr("value",sessionId);

    var stepsE = $("#steps ol li:first");
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
            //$("#testform").trigger('create');
       },
       removeEventCallback: null,
        maxItemsAllowedToAdd: null,
        maxItemReachedCallback: null,
        data: []
    });
       
    var fileE = $("#resourceFiles ol li:first");
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
        //console.log(json_text);
        $("#TestUnitDescription").val(json_text); 
        $("#testunitform").submit();    
        return true;
    }   
    else
        return false;
};