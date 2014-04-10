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
            if (allSiblings===checkedSiblings)
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
    }
}
