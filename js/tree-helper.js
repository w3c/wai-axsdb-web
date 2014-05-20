accessdb.TreeHelper = {
    uncheckTestFromTree: function (liId) {
        var input = $("#" + divId + " input[value='" + liId + "'] ")[0];
        $(input).attr("checked", false);
        if ($(input).parent().parent().find("input:checked").length < 1)
            $(input).parent().parent().parent().find("input").attr("checked", false);
    },
    updateTreeFromTestList: function (holder) {
        var testsInput;
        if (holder)
            testsInput = $(holder).find("li[data-treevue-type='TestUnitDescription'] input")
        else
            testsInput = $("li[data-treevue-type='TestUnitDescription'] input");
        for (i = 0; i < testsInput.length; i++) {
            var input = testsInput.get(i);
            var id = $(input).attr("value");

            if (_.contains(accessdb.session.get("testUnitIdList"), id)) {
                $(input).attr("checked", true);
            }
            else {
                $(input).attr("checked", false);
            }
            var allSiblings = $(input).parent().parent().find("input").length;
            var checkedSiblings = $(input).parent().parent().find("input:checked").length;
            var siblings = $(input).parent().parent().find("input");
            var parentInput = $(input).parent().parent().parent().find("input").get(0);
            if (allSiblings === checkedSiblings)
                $(parentInput).attr("checked", true);
            else
                $(parentInput).attr("checked", false);
        }
    },
    treeNodeTolist: function (node, nodeType, list, parent) {
        list = list || [];
        parent = $.trim($(node).parent().parent().parent().children().closest("label").text()) || null;
        if (node.type == nodeType && node.selected)
            list.push(node.value);
        if (node.children && node.children.length > 0) {
            var children = node.children;
            for (var ind in children) {
                accessdb.TreeHelper.treeNodeTolist(children[ind], nodeType, list, parent);
            }
        }
        else
            return list;
    },
    listToTreeNode: function (list, collapsed) {
        collapsed = collapsed || false;
        list = list || [];
        list = list.sort();
        var root = {
            children: [],
            collapsed: collapsed,
            description: null,
            disabled: false,
            label: list.length + " selected test cases",
            noOfChildren: 242,
            selectable: false,
            selected: true,
            subselector: true,
            type: "ROOT",
            value: null
        };
        for (var int = 0; int < list.length; int++) {
            var el = list[int];
            var node = {
                children: null,
                collapsed: true,
                description: el,
                disabled: false,
                label: el,
                noOfChildren: 242,
                selectable: true,
                selected: true,
                subselector: false,
                type: "testunit",
                value: el
            };
            root.children.push(node);
        }
        return root;
    },
    importTests: function (holder) {
        var nodeList = $(holder).treevueJson();
        var list = [];
        for (var ind in nodeList) {
            var techniqueNode = nodeList[ind];
            for (var i in techniqueNode.children) {
                var testNode = techniqueNode.children[i];
                if (testNode.selected && testNode.type == "TestUnitDescription") {
                    list.push(testNode.value);
                    accessdb.session.addToQueue(testNode.value);
                }
                else
                    accessdb.session.removeFromQueue(testNode.value);

            }
        }
        return list;
    },
    importProducts: function (holder, type) {
        var nodeList = $(holder).treevueJson();
        nodeList = nodeList[0].children;
        var list = [];
        for (var ind in nodeList) {
            var nodeProduct = nodeList[ind];
            var nodeVersions = nodeProduct.children;
            for (var k in nodeVersions) {
                var versionNode = nodeVersions[k];
                if (versionNode.selected) {
                    list.push({
                        id: k,
                        type: type,
                        name: nodeProduct.label,
                        version: versionNode.label
                    });
                }
            }
        }
        return list;
    },
    importTechnologies: function (holder) {
        var nodeList = $(holder).treevueJson();
        var nodeListChildren = nodeList[0].children;
        var list = [];
        for (var ind in nodeListChildren) {
            var node = nodeListChildren[ind];
            if (node.selected) {
                list.push(node.label);
            }
        }
        return list;
    },
    importCriteria: function (holder) {
        var nodeList = $(holder).treevueJson();
        var nodeListChildren = nodeList[0].children;
        var list = [];
        for (var ind in nodeListChildren) {
            accessdb.TreeHelper.treeNodeTolist(nodeListChildren[ind], "SuccessCriterio", list);
        }
        return list;
    },
    populateFilter : function(filter) {
        filter.criteriosLevel = $('input[name=conformance]:checked', "#" + filter.page).val() || filter.criteriosLevel;
        filter.criterios = accessdb.TreeHelper.importCriteria("#" + filter.page + " .criteriaTreeDiv > ul");
        if (filter.page == "results") {
            filter.ats = accessdb.TreeHelper.importProducts("#" + filter.page + " .atTreeDiv > ul", "AssistiveTechnology");
            filter.uas = accessdb.TreeHelper.importProducts("#" + filter.page + " .uaTreeDiv > ul", "UAgent");
            filter.oss = accessdb.TreeHelper.importProducts("#" + filter.page + " .osTreeDiv > ul", "Platform");
        }
        if ($("#" + filter.page + " .webTechTreeDiv > ul").length > 0)
            filter.technologies = accessdb.TreeHelper.importTechnologies("#" + filter.page + " .webTechTreeDiv > ul");
        $(".scSelected").html(filter.criterios.length);
        console.log(filter);
        console.log(filter.criterios.length);
    },
    loadTree : function(filter, treeIds, callback){
        if(treeIds.indexOf("WCAG")>=0){
            $(".criteriaTreeDiv").empty();
            Utils.loadingStart(".criteriaTreeDiv");
            accessdb.API.WCAG2.getWCAG2TreeData(this.criteriosLevel, function(error, data, status){
                var treeData = data;
                treeData.label = "All Success Criteria";
                var processDatafn = function (data){
                    if(data.description && (data.type == "Guideline" || data.type == "SuccessCriterio")){
                        data.label =  data.label + ": " + data.description;
                    }
                    if(data.description && (data.type == "Principle")){
                        data.label =  data.description;
                    }
                    return data;
                };
                $.treevue([treeData], filter.page, processDatafn).appendTo('.criteriaTreeDiv');
                Utils.loadingEnd(".criteriaTreeDiv");
                accessdb.TreeHelper.populateFilter(filter);
                callback("WCAG");
            });
        }
        else if(treeIds.indexOf("AT")>=0){
            $(".atTreeDiv").empty();
            Utils.loadingStart(".atTreeDiv");
            accessdb.API.TESTRESULT.getATTree(this, function(error, data, status){
                var treeData = data;
                treeData.label = "All";
                treeData.collapsed = false;
                $.treevue([treeData],  filter.page+"-accessdb-ATTree").appendTo('.atTreeDiv');
                Utils.loadingEnd(".atTreeDiv");
                callback("AT");
            });
        }
        else if(treeIds.indexOf("UA")>=0){
            $(".uaTreeDiv").empty();
            Utils.loadingStart(".uaTreeDiv");
            accessdb.API.TESTRESULT.getUATree(this, function(error, data, status){
                $(".uaTreeDiv").empty();
                var treeData = data;
                treeData.label = "All";
                treeData.collapsed = false;
                $.treevue([treeData],  filter.page+"-accessdb-UATree").appendTo('.uaTreeDiv');
                Utils.loadingEnd(".uaTreeDiv");
                callback("UA");
            });
        }
        else if(treeIds.indexOf("OS")>=0){
            $(".osTreeDiv").empty();
            Utils.loadingStart(".osTreeDiv");
            accessdb.API.TESTRESULT.getOSTree(this, function(error, data, status){
                $(".osTreeDiv").empty();
                var treeData = null;
                if(filter.oss.length<1)
                    treeData = data;
                treeData.label = "All";
                treeData.collapsed = false;
                $.treevue([treeData],  filter.page+"-accessdb-OSTree").appendTo('.osTreeDiv');
                Utils.loadingEnd(".osTreeDiv");
                callback("OS");
            });
        }
        else if(treeIds.indexOf("WEBTECHS")>=0){
            $(".webTechTreeDiv").empty();
            Utils.loadingStart(".webTechTreeDiv");
            accessdb.API.WCAG2.getWebtechsTreeData(function(error, data, status){
                $(".webTechTreeDiv").empty();
                var treeData = data;
                treeData.label = "All";
                treeData.collapsed = false;
                $.treevue([treeData],  filter.page+"-accessdb-webtechs").appendTo('.webTechTreeDiv');
                Utils.loadingEnd(".webTechTreeDiv");
                callback("WEBTECHS");
            });
        }
        else if(treeIds.indexOf("TESTS")>=0){
            if(filter.page.indexOf("tests-run")<0){
                callback();
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

                console.log(data);
                console.log(accessdb.filters);
                accessdb.API.TEST.countAll(function(error, data, status){
                    if(data)
                        $(".tests_count_all").html(data);
                });
                $.treevue(data.children,  filter.page+"-teststree").appendTo('#thetestsTreeDiv');
                Utils.loadingEnd(".webTechTreeDiv");
                accessdb.TreeHelper.updateTreeFromTestList();
                callback("TESTS");
            });
        }
    },
    loadTrees : function(filter, treeIds, callback){
        var feedback = "<strong>Updated Widgets: </strong><br/>";
        treeIds = treeIds || ["AT","UA","OS","WCAG","WEBTECHS"];
        try{
            accessdb.TreeHelper.populateFilter(filter);
        }
        catch(e){
        }
        var next = function(msg){
            var nextId = treeIds.shift();
            if(msg)
                feedback = feedback + msg + ", " ;
            if(nextId){
                accessdb.TreeHelper.loadTree(filter, nextId,next);
            }
            else{
                $("#"+filter.page +" [role=alert]").html(feedback);
                if(callback)
                    callback();
            }
        };
        next();
    }
}
