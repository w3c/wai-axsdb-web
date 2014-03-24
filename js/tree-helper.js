accessdb.TreeHelper = {
    uncheckTestFromTree: function (liId) {
        var input = $("#" + divId + " input[value='" + liId + "'] ")[0];
        $(input).attr("checked", false);
        if ($(input).parent().parent().find("input:checked").length < 1)
            $(input).parent().parent().parent().find("input").attr("checked", false);
    },
    updateTreeFromTestList: function () {
        var testsInput = $("li[data-treevue-type='TestUnitDescription'] input");
        for(i=0; i<testsInput.length;i++){
            var input = testsInput.get(i);
            var id = $(input).attr("value");
            if(_.contains(accessdb.session.get("testUnitIdList"), id)){
                $(input).attr("checked", true);
            }
            else
            {
                $(input).attr("checked", false);
                var siblings = $(input).parent().siblings();
                var hasmore = false;
                for(s=0; s<siblings.length;s++){
                   var inp = siblings.get(s);
                   if($(inp).prop("checked")===true) {
                       hasmore = true;
                   }
                   else
                       hasmore = false;
                }
                var parentInput = $(input).parent().parent().parent().find("input").get(0);
                if(hasmore)
                    $(parentInput).attr("checked", true);
                else
                    $(parentInput).attr("checked", false);
            }
        }
    }
}
