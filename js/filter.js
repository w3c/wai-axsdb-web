function Filter(page){
    this.page =  page || "";
	this.userName=null;
	this.lastModified;
	this.criteriosLevel="AAA";
	this.criterios=[];
	this.technologies=[];
	this.ats=[];
	this.uas=[];
	this.oss=[];
	
	this.populate=function(){
		this.criteriosLevel =  $('input[name=conformance]:checked', "#"+this.page).val() || this.criteriosLevel;
		this.criterios = Filter.importCriteria("#"+this.page + " .criteriaTreeDiv > ul");
		if(this.page=="results"){
		    this.ats = Filter.importProducts("#"+this.page + " .atTreeDiv > ul", "AssistiveTechnology");
	        this.uas = Filter.importProducts("#"+this.page + " .uaTreeDiv > ul", "UAgent");
	        this.oss = Filter.importProducts("#"+this.page + " .osTreeDiv > ul", "Platform");
		}
		if($("#"+this.page + " .webTechTreeDiv > ul").length>0)
		this.technologies = Filter.importTechnologies("#"+this.page + " .webTechTreeDiv > ul");
		$(".scSelected").html(this.criterios.length);
        debug(this);
        debug(this.criterios.length);
	};
 	
}

Filter.prototype.loadTree=function(treeIds, callback){
    var that = this;
    if(treeIds.indexOf("WCAG")>=0){
        $(".criteriaTreeDiv").empty();
        Utils.loadingStart(".criteriaTreeDiv");
        Filter.getWCAG2TreeData(function(error, data){
            var treeData = null;
            if(that.criterios.length<1)
                treeData = Filter.treeSelectAll(data);
            else
                treeData = data;
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
            $.treevue([treeData], that.page, processDatafn).appendTo('.criteriaTreeDiv');
            Utils.loadingEnd(".criteriaTreeDiv");
            that.populate();
            callback("WCAG");
        }, this.criteriosLevel);  
    }
    else if(treeIds.indexOf("AT")>=0){
        $(".atTreeDiv").empty();
        Utils.loadingStart(".atTreeDiv");
        this.getATTree(function(error, data){
            var treeData = null;
            if(that.technologies.length<1)
                treeData = Filter.treeSelectAll(data);
            else
            {
                treeData = data;
            }
            treeData.label = "All";
            treeData.collapsed = false;
            $.treevue([treeData],  that.page+"-accessdb-ATTree").appendTo('.atTreeDiv');   
            Utils.loadingEnd(".atTreeDiv");
            callback("AT");
        });
    }
    else if(treeIds.indexOf("UA")>=0){
        $(".uaTreeDiv").empty();
        Utils.loadingStart(".uaTreeDiv");
        this.getUATree(function(error, data){
            $(".uaTreeDiv").empty();
            var treeData = null;
            if(that.uas.length<1)
                treeData = Filter.treeSelectAll(data);
            else
                treeData = data;
            treeData.label = "All";
            treeData.collapsed = false;
            $.treevue([treeData],  that.page+"-accessdb-UATree").appendTo('.uaTreeDiv');   
            Utils.loadingEnd(".uaTreeDiv");
            callback("UA");
        });
    }
    else if(treeIds.indexOf("OS")>=0){
        $(".osTreeDiv").empty();
        Utils.loadingStart(".osTreeDiv");
        this.getOSTree(function(error, data){
            $(".osTreeDiv").empty();
            var treeData = null;
            if(that.oss.length<1)
                treeData = Filter.treeSelectAll(data);
            else
                treeData = data;
            treeData.label = "All";
            treeData.collapsed = false;
            $.treevue([treeData],  that.page+"-accessdb-OSTree").appendTo('.osTreeDiv');   
            Utils.loadingEnd(".osTreeDiv");
            callback("OS");
        });
    }
    
    else if(treeIds.indexOf("WEBTECHS")>=0){ 
        $(".webTechTreeDiv").empty();
        Utils.loadingStart(".webTechTreeDiv");
        Filter.getWebtechsTreeData(function(error, data){
            $(".webTechTreeDiv").empty();
            var treeData = Filter.treeSelectAll(data);
            treeData.label = "All";
            treeData.collapsed = false;
            $.treevue([treeData],  that.page+"-accessdb-webtechs").appendTo('.webTechTreeDiv');    
            Utils.loadingEnd(".webTechTreeDiv");
            callback("WEBTECHS");
        });
    }
    else if(treeIds.indexOf("TESTS")>=0){ 
        $("#thetestsTreeDiv").empty();
        Utils.loadingStart(".thetestsTreeDiv");
        TestUnit.getTestsTreeData(function(error, data){
            $("#thetestsTreeDiv").empty();
            // select what is in queue
            var countTests = 0;
            for ( var ind in data.children) {
                var techniqueNode = data.children[ind];
                data.children[ind].label = "Technique " + data.children[ind].label;
                data.children[ind].collapsed = false;
                for ( var i in techniqueNode.children) {
                    var testNode = techniqueNode.children[i];
                    data.children[ind].children[i].label = "Test Case " + data.children[ind].children[i].label;
                    data.children[ind].children[i].collapsed = false;
                    if(accessdb.session.isTestInQueue(testNode.value)){
                        //set selected 
                        data.children[ind].children[i].selected = true;
                    }
                    countTests++;
                }
            }
            $(".testsOnPage").html(countTests);
            debug(data);
            debug(accessdb.testsFilter);
            $.treevue(data.children,  that.page+"-teststree").appendTo('#thetestsTreeDiv');
            Utils.loadingEnd(".webTechTreeDiv");
            callback("TESTS");
        });
    }  
};

Filter.prototype.loadTrees=function(populate, treeIds){
    var that = this;
    var feedback = "<strong>Updated Widgets: </strong><br/>";
    treeIds = treeIds || ["AT","UA","OS","WCAG","WEBTECHS"];    
    if(populate)
        this.populate();
    var next = function(msg){
        var nextId = treeIds.shift();
        if(msg)
            feedback = feedback + msg + ", " ;
        if(nextId){
            that.loadTree(nextId,next); 
        }
        else
            $("#"+that.page +" [role=alert]").html(feedback); 
    };
    next();   

};
Filter.prototype.getATTree = function(callback){
    Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_TREE_AT, "POST", this, function(error, data){
        callback(error, data);
    });     
};
Filter.prototype.getUATree = function(callback){
    Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_TREE_UA, "POST", this, function(error, data){
        callback(error, data);
    });     
};
Filter.prototype.getOSTree = function(callback){
    Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TESTRESULT_TREE_OS, "POST", this, function(error, data){
        callback(error, data);
    });     
};
Filter.getWCAG2TreeData = function(callback,level){
    level = level || "AA";
    Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TECHNIQUES_WCAG2  + level, "GET", null, function(error, data){
        callback(error, data);
    }); 
};
Filter.getWebtechsTreeData = function(callback){
    Utils.ajaxAsyncWithCallBack(accessdb.config.services.URL_SERVICE_TECHNIQUES_TECHS , "GET", null, function(error, data){
        callback(error, data);
    }); 
};

Filter.importProducts = function(holder,type){
	var nodeList = $(holder).treevueJson();
	nodeList = nodeList[0].children;
	var list = [];
	for ( var ind in nodeList) {
		var nodeProduct = nodeList[ind];
		var nodeVersions = nodeProduct.children;
		for ( var k in nodeVersions) {
			var versionNode = nodeVersions[k];
			if(versionNode.selected){
				list.push({
					id:k,
					type:type,
					name: nodeProduct.label,
					version: versionNode.label
				});
			}
		}
	}
	return list;
};
Filter.importTests = function(holder){
    var nodeList = $(holder).treevueJson();
    var list = [];
    for ( var ind in nodeList) {
        var techniqueNode = nodeList[ind];
        for ( var i in techniqueNode.children) {
            var testNode = techniqueNode.children[i];
            if(testNode.selected && testNode.type=="TestUnitDescription"){
                list.push(testNode.value);
                accessdb.session.addToQueue(testNode.value);
            }
            else
                accessdb.session.removeFromQueue(testNode.value);

        }
    }
    return list;
};

Filter.importTechnologies = function(holder){
	var nodeList = $(holder).treevueJson();
    var nodeListChildren = nodeList[0].children;
	var list = [];
	for ( var ind in nodeListChildren) {
		var node = nodeListChildren[ind];
		if(node.selected){
			list.push(node.label);
		}
	}
	return list;
};
Filter.importCriteria = function(holder){
	var nodeList = $(holder).treevueJson();
	var nodeListChildren = nodeList[0].children;
	var list = [];
	for ( var ind in nodeListChildren) {
		Utils.treeNodeTolist(nodeListChildren[ind], "SuccessCriterio", list);
	}
	return list;	
};
Filter.treeSelectAll = function (root){
    /*    var treeData = [];
     for ( var i1 in root.children) {
     var nodeL1 = root.children[i1];
     nodeL1.selected = true;
     for ( var i2 in nodeL1.children) {
     var nodeL2 = nodeL1.children[i2];
     nodeL2.selected = true;
     for ( var i3 in nodeL2.children) {
     nodeL3 = nodeL2.children[i3];
     if(!nodeL3.disabled)
     {
     nodeL3.selected = true;
     nodeL2[i3] = nodeL3;
     }
     }
     nodeL1[i2] = nodeL2;
     }
     treeData[i1] = nodeL1;
     }
     var node = {
     label: root.label,
     collapsed: false,
     selectable : true,
     disabled : false,
     subselector : true,
     children : treeData
     };*/
    return root;
};