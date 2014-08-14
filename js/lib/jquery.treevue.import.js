(function ($) {
    'use strict';

    var namespace,
        processData,
        nodeNum = 0; // A number used to give each checkbox a unique ID

    /**
     * Create a new li node for in a treevue
     *
     * @param   data    The descriptive data for the node
     * @return  Node    A jquery object containing the new li node
     */
    function createTreeNode(data) {
        var box, boxId, ulNode,
            liNode = $('<li></li>');
        if(typeof processData === "function"){
            data =  processData(data);
        }

        if (data.type) {
            liNode.attr('data-treevue-type', data.type);
        }

        // Add a checkbox and label:
        if (data.selectable === true || (data.selectable !== false &&
            (data.selected || data.disabled || data.subselector))) {
            // Give each node a unique ID
            boxId = namespace + (data.id || "treevue-node-" + (nodeNum += 1));

            box = $('<input type="checkbox" />').appendTo(liNode).
                prop('checked', data.selected).
                prop('disabled', data.disabled).
                attr('value', data.value).
                attr('id', boxId);

            if (data.subselector) {
                box.attr('data-type', 'subselector');
            }

            $('<label />').text(data.label + ' ').attr('for', boxId).appendTo(liNode);
            //FIXME : remove from here
            if(data.type == "TestUnitDescription")
            {
                $('<a />').html('<span class="icon-info"></span><span class="visuallyhidden">Test Details</span>').attr('href', "#/test.html/"+data.value).attr("class", "btn-small").attr("title", "Test Details").appendTo(liNode);
            }

        } else { // No checkbox, just add text
            liNode.text(data.label);
        }

        if ($.isArray(data.children) && data.children.length > 0) {
            // Create a ul element with it's children
            ulNode = $('<ul/>').appendTo(liNode).
                append($.map(data.children, createTreeNode));

            if (data.collapsed) {
                ulNode.attr('aria-hidden', true);
            }
        }
        return liNode;
    }

    /**
     * Create a treevue based on a json object
     *
     * The json contains an array with objects, where each object represetns
     * a node in the tree. The following properties are allowed for each node
     *   label: string          The text label for the tree
     *   value: mixed           The value set for the checkbox
     *   id: string             The id for the item (the checkbox)
     *   selected: bool         Is the item selected
     *   disabled: bool         Is the item disabled
     *   subselector: bool      Is the item a subselector
     *   collapsed: bool        Is the item collapsed by default
     *   children: array        An array containing child nodes
     *
     * @param   Array   An array containing node objects for treevue
     * @return  Node    A treevue ul element
     */
    $.treevue = function (json, ns, processDatafn) {
        namespace = (ns ? ns + '-' : '');
        processData = processDatafn;
        return $('<ul />').
            append($.map(json, createTreeNode)).
            treevue({useAria: false});
    };

}(jQuery));
