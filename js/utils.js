String.prototype.getNums = function () {
    var rx = /[+-]?((\.\d+)|(\d+(\.\d+)?)([eE][+-]?\d+)?)/g,
        mapN = this.match(rx) || [];
    return mapN.map(Number);
};
Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


function Utils() {
};
Utils.urlParam=function (s){
    if(s==="null")
        s=null;
    return s;
};
Utils.UIRoleAdapt = function () {
    var userRoles = accessdb.session.get("userRoles") || [];
    $(".accessdbUserMessage").remove();
    if (accessdb.session.isUserCollaborator()) {
        $(".roleExpertsOnly").show();
    }
    else {
        $(".roleExpertsOnly").hide();
        // var msg = $('<p role="alert"></p>').addClass("accessdbUserMessage").append("You need Collaborator Role for this action!");
        // $(".roleExpertsOnly").parent().append(msg);
    }
    if (accessdb.session.isUserAdmin()) {
        $(".roleAdminOnly").show();
    }
    else {
        $(".roleAdminOnly").hide();
        // var msg = $('<p role="alert"></p>').addClass("accessdbUserMessage").append("You need Admin Role for this action!");
        // $(".roleAdminOnly").parent().append(msg);
    }
    if(accessdb.session.isLoggedIn()){
        $(".axsdb-only-user").show();
        $(".axsdb-only-anon").hide();
    }
    else{
        $(".axsdb-only-user").hide();
        $(".axsdb-only-anon").show();
    }
};
Utils.loadingStart=function(holder){
    var div = $('<div class="progress"><div>Loading…</div></div>');
    $(holder).empty();
    $(holder).append(div);
};
Utils.loadingEnd=function(holder){
    $(holder).find(".progress").remove();
};

Utils.eraseCookie = function (name) {
    Utils.createCookie(name, "", -1);
}
Utils.readCookie = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};
Utils.createCookie = function (name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
};

Utils.resetForm = function (id) {
    $(id).find("input[type=text], textarea").val("");
    $(id).find("select").prop('selectedIndex', 0);
    $(id).find("input:radio").attr("checked", false);
};
Utils.getUniqCol = function (matrix, col) {
    var column = [];
    for (var i = 0; i < matrix.length; i++) {
        if ($.inArray(matrix[i][col], column))
            column.push(matrix[i][col]);
    }
    return column;
};

Utils.msg2user = function (msg, page) {
    //window.alert(msg);
    $("#msg2user").html(msg);
    $("#msg2user" ).dialog();
    if(page)
        accessdb.appRouter.loadPage(page);
};
Utils.getFileNameWithNoExt = function (x) {
    return x.substr(0, x.lastIndexOf('.'));
};
Utils.removeItemFromArray = function (thearray, itemtoRemove) {
    thearray = _.filter(thearray, function (item) {
        return item !== itemtoRemove;
    });
    return thearray;
};
Utils.supports_html5_storage = function () {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
};
Utils.ajaxSync = function (url, method, data) {
    var out = null;
    $.ajax({
        url: url,
        dataType: "json",
        contentType: "application/json",
        type: method,
        data: JSON.stringify(data),
        async: false,
        cache: false,
        timeout: 30000,
        processData: false,
        error: function (data) {
            console.log("ajax error: " + arguments.callee.caller.toString());
        },
        success: function (data) {
            out = data;
        }
    });
    return out;
};
Utils.removeDuplicates = function (inputArray) {
    var i;
    var len = inputArray.length;
    var outputArray = [];
    var temp = {};

    for (i = 0; i < len; i++) {
        temp[inputArray[i]] = 0;
    }
    for (i in temp) {
        outputArray.push(i);
    }
    return outputArray;
};
Utils.arrayToSqlVal = function (arr) {
    arr = Utils.removeDuplicates(arr);
    var val = JSON.stringify(arr);
    val = val.substring(1, val.length - 1);
    val = val.replace(/\"/g, '\'');
    return val;
};

Utils.sortResultsTable = function (table, targetTable) {
    var cols1st = $(table).find("thead th");
    var cols = [];
    var first = null;
    var count = 0;
    $.each(cols1st, function (key, value) {
        if (first != null) {
            count++;

            var col = {
                key: $(value).text(),
                cell: value,
                cells: $(table).find("tbody tr:nth-child(" + count + ")").siblings().andSelf().find("td:nth-child(" + (key+1)+ ")").clone( true )
            };
            //    console.log(col );
            cols.push(col);
        }
        else {
            first = value;
        }
    });
    cols = _.sortBy(cols, "key");
    cols.unshift({
            key: " ",
            cell: first,
            cells:$(table).find("tbody tr:nth-child(1)").siblings().andSelf().find("th:nth-child(1)").clone( true )
        }
    );
    $(targetTable).empty();
    var noRows = 0;
    var currentRow = 0;
    var noCols = cols.length;
    var thead = $("<thead/>");
    var trh = $("<tr/>");
    for (i = 0; i < noCols; i++) {
        var col = cols[i];
        $(trh).append($(col.cell).clone( true ));
        noRows = col.cells.length ;
    }
    $(thead).append(trh);
    $(targetTable).append(thead);
    var tbody = $("<tbody/>");
    for (k = 0; k < noRows; k++) {
        var tr = $("<tr/>");
        for (i = 0; i < noCols; i++) {
            var col = cols[i];
            cells = $(col.cells).clone(true);
            var cell =  $(col.cells[k]).clone(true);
            if($(cell).text().trim().length<1) {
                $(cell).text("-");
            }
            $(tr).append($(cell).clone( true ));
        }
        $(tbody).append(tr);
    }
    $(targetTable).append(tbody);

};

Utils.stripTestID = function (id){
    try {
        if(id){
            var newID = id.split('_');
            var first = newID[0];
            return first + "_" + newID[1].replace(/(^|,)0+/g, '$1');
        }
        else
            return "";
    }
    catch(e){

    }
}
Utils.stripTechniqueFromTestID = function (id){
    try {
        if (id) {
            var newID = id.split('_');
            return newID[0];
        }
        else
            return "";
    }
    catch(e){

    }
}