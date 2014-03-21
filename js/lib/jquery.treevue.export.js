(function ($) {
    'use strict';
    
    var collapseCls   = 'treevue-collapsed',
        disableCls    = 'treevue-disabled';
    
    function treenodeToJson(node) {
        var children, checkbox, type,
            obj  = {};
        
        node     = $(node);
        checkbox = node.find(':checkbox:first()');
        children = node.find('ul:first() > li, ol:first() > li');
        type     = node.attr('data-treevue-type');
        
        if (type) {
            obj.type = type;
        }
        if (children.length > 0) {
            obj.children  = $.map(children, treenodeToJson);
            if (node.hasClass(collapseCls)) {
                obj.collapsed = true;
            }
        }
        
        // Check if it has a checkbox
        if (checkbox.closest('li').is(node)) {
            if (/treevue-node-/.test(checkbox.attr('id')) === false) {
                obj.id = checkbox.attr('id');
            }
            obj.selected = checkbox.prop('checked');
            
            $.each({ // set optional properties only if truthy
                disabled: node.hasClass(disableCls),
                value: checkbox.attr('value'),
                subselector: (checkbox.attr('data-type') === 'subselector'),
                label: $.trim(node.find('label:first()').text())
            }, function (key, value) {
                if (value) {
                    obj[key] = value;
                }
            });
            
        } else { // Label when there is no checkbox
            obj.label = $.trim(node.clone().
                    find('ul, ol, [aria-hidden]').remove().end().
                    text());
        }
        return obj;
    }
    
    $.fn.treevueJson = function () {
        if (!this.first().is('.treevue')) {
            throw new Error('This node is not a treevue');
        }
        return $.map(this.first().children(), treenodeToJson);
    };
    
}(jQuery));