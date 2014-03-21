/*jslint white: true */
/**
 * Treevue is a jQuery plugin for accessible tree views. It uses wai-aria
 * for full feature support with modern screenreaders.
 * 
 * 
 */
(function($) {
    'use strict';
    
    var treeFallback, branchFallback,
        // ARIA-properties
        ariaExp       = 'aria-expanded',
        ariaSel       = 'aria-selected',
        ariaHide      = 'aria-hidden',
        ariaDisable   = 'aria-disabled',
        role          = 'role',
        // className values
        focusClass    = 'treevue-focus',
        expandedCls   = 'treevue-expanded',
        collapseCls   = 'treevue-collapsed',
        selectedCls   = 'treevue-selected',
        disableCls    = 'treevue-disabled',
        // Text for l10n
        textExpanded  = 'Collapse node',
        textCollapsed = 'Expand node',
        textTree      = 'Tree view',
        // Setup properties of the fallback
        fallbackCss = {
            'position': 'absolute',
            'width': '0',
            'overflow': 'hidden'
        },
        fallbackAria = {};
    
    fallbackAria[role] = 'document';
    fallbackAria[ariaHide] = true;
    
    // Set up nodes that work as fallbacks for AT that don't
    // support ARIA
    treeFallback = $('<span class="treevue_fallback">' + 
                      textTree + ', </span>').
            css(fallbackCss).
            attr(fallbackAria);
    
    branchFallback = $('<span class="treevue_fallback_branch">' + 
                       '<button tabindex="-1">' + textExpanded +
                       '</button></span>').
            css(fallbackCss).
            attr(fallbackAria);
    
    /**
     * Return the value of the checkbox. If none is given the label is returned
     */
    function getCheckboxValue(i, node) {
        var label, 
            box    = $(node),
            val    = box.attr('value'),
            type   = box.closest('.treevue li').attr("data-treevue-type");
        
        if (!val) {
            label = $('label[for=' + box.context.id + ']');
            if (label.length === 0) {
                label = box.closest('label');
            }
            if (label) {
                val = $.trim(label.text());
            }
        }
        
        return {
            type: type,
            value: val,
            id: box.prop('id')
        };
    }
    
    
    /**
     * Add ARIA roles
     */
    function addAriaTreeRoles(trees) {
        trees.find('li').attr(role, 'treeitem'); // define tree nodes
                // define branches
        trees.find('ul, ol').attr(role, 'group').before(branchFallback).
                closest('li').attr(ariaExp, true).addClass(expandedCls);
        
        // Collapse nodes nested within a list with aria-hidden
        trees.find('ul[aria-hidden=true], ' +
                   'ol[aria-hidden=true]').
                closest('li').find('.' + expandedCls).andSelf().
                attr(ariaExp, 'false').
                removeClass(expandedCls).addClass(collapseCls).
                find('ul, ol').attr(ariaHide, true).hide();
        
        trees.attr(role, 'tree').
                find(':disabled').closest('li').addClass(disableCls).
                attr(ariaDisable, true);
    }
    
    
    /**
     * Where checkboxes are included allow selection
     */
    function addAriaSelectStates(trees) {
        trees.find(':checkbox').each(function () {
            var boxes,
                $this = $(this).attr('tabindex', -1);
            if ($this.prop('checked')) {
                $this.addClass(selectedCls).
                        closest('li').attr(ariaSel, true);
            } else {
                $this.removeClass(selectedCls).
                        closest('li').attr(ariaSel, false);
            }
            
            if ($this.is('[data-type="subselector"]')) {
                boxes = $this.closest('li').find(':checkbox:not(:first())');
                if (boxes.length !== 0) {
                    $this.prop('checked', 
                            boxes.length === boxes.filter(':checked').length);
                }
            }
        }).closest('.treevue').attr('aria-multiselectable', true);

    }
    
    /**
     * TreeVue jQuery plugin; accessible treeview
     */
    $.fn.treevue = function() {
        this.addClass('treevue').find('li').attr('tabindex', -1);
        
        // Add WAI-ARIA role and state
        addAriaTreeRoles(this);
        addAriaSelectStates(this);
        
        this.find('> :first-child').
                attr('tabindex', 0).addClass(focusClass).
                prepend(treeFallback);
        return this;
    };
    
    // When the document is loaded, attach event handlers for all vuetrees 
    $(function () {
        /**
         * Toggle the visibility of the branch
         */
        function toggleBranch(branch) {
            var eventProps = {target: branch.context},
                subtree = $();
            
            branch.each(function () {
                subtree = subtree.add($('ul, ol', this).first());
            });
            
            if (branch.hasClass(expandedCls)) {
                branch.addClass(collapseCls).removeClass(expandedCls).
                        attr(ariaExp, false).
                        find('.treevue_fallback_branch button').first().
                        text(textCollapsed);
                
                subtree.hide(200).attr(ariaHide, true);
                branch.trigger($.Event('treevue:collapse', eventProps));
                
            } else {
                branch.addClass(expandedCls).removeClass(collapseCls).
                        attr(ariaExp, true).
                        find('.treevue_fallback_branch button').first().
                        text(textExpanded);
                
                subtree.show(200).attr(ariaHide, false);
                branch.trigger($.Event('treevue:expand', eventProps));
            }
        }
        
        /**
         * Move the focus to an item in the tree.
         */
        function focusItem(elm) {
            var tree = elm.closest('.treevue');
            if (tree.length === 1) {
                tree.find('.' + focusClass).removeClass(focusClass).attr(
                        'tabindex', -1);
                
                elm.focus().attr('tabindex', 0).
                    addClass(focusClass);
                
                // Move the tree fallback
                tree.find('.treevue_fallback').detach().prependTo(elm);
            }
        }
    
        /**
         * When a checkbox is changed, update the aria-selected state.
         */
        function checkboxChange(box) {
            var item = box.closest('[aria-selected]'),
                checked = box.prop('checked'),
                tree = box.closest('.treevue'),
                node = box.closest('li');
            
            // update the selected state
            item.attr(ariaSel, checked);
            
            // select / unselect all children when the node is a subselector
            if (box.attr('data-type') === 'subselector') {
                node.find('ul :checkbox, ol :checkbox').
                        not(':disabled').prop('checked', checked);
            }
            
            // Locate any parent nodes
            node.parentsUntil(tree, 'li').each(function () {
                var boxes,
                    $this = $(this),
                    checkbox = $(':checkbox', this).first();
                
                // check if the parents have a subselector
                if (checkbox.closest('li').is($this) &&
                        checkbox.attr('data-type') === 'subselector') {
                    
                    // All boxes are checked to check the subselector
                    boxes = $this.find('ul :checkbox, ol :checkbox').
                                    not(':disabled');
                    if (boxes.length === boxes.filter(':checked').length) {
                        checkbox.prop('checked', true);
                        
                    // Subselector is unchecked
                    } else if (checked === false) {
                        checkbox.prop('checked', false);
                    }
                }
            });
            
            // Fire a new event
            tree.trigger($.Event('treevue:change', {
                target: tree.context,
                // Get all the values of selected items
                values: tree.find(':checked').map(getCheckboxValue).get()
            }));
        }
    
        /**
         * pointer input
         */
        $('body').on('click', '.treevue li.' + expandedCls +
                              ', .treevue li.' + collapseCls, function (event) {
            if (event.target === this) {
                var $this = $(this);
                event.preventDefault();
                toggleBranch($this);
                focusItem($this);
            }
        
        /**
         * Keep aria-selected state in sync with the checkbox
         */
        }).on('change', '.treevue :checkbox', function () {
            var $this = $(this);
            checkboxChange($this);
            focusItem($this.closest('li'));
        
        /**
         * keyboard input
         */
        }).on('keydown', '.treevue li', function (event) {
            var expanded, checkbox,
                keyCode = event.keyCode,
                $this = $(this);
            
            if (event.target !== this) {
                return;
            }
            expanded = $this.hasClass(expandedCls);
            
            // Press RETURN
            if (keyCode === 13 && $this.attr(ariaSel) !== undefined) {
                //locate the checkbox and invert it and the select value
                checkbox = $this.find(':checkbox').first();
                if (checkbox.is(':not(:disabled)')) {
                    checkbox.prop('checked', !checkbox.prop('checked'));
                    checkboxChange(checkbox);
                }
                
            } else if (keyCode === 40) { // press DOWN
                if (expanded) { // enter a branch
                    focusItem($this.find('ul li, ol li').first());
                } else if ($this.next().length === 0) { // exit a branch
                    focusItem($this.parentsUntil('.treevue', 'li').
                                    next().first());
                } else { // next sibling
                    focusItem($this.next());
                }
            } else if (keyCode === 38) { // press UP
                if ($this.prev().hasClass(expandedCls)) { // enter a branch
                    focusItem($this.prev().find('ul li, ol li').last());
                } else if ($this.prev().length === 0) { // exit a branch
                    focusItem($this.parent().closest('li'));
                } else { // prev sibling
                    focusItem($this.prev());
                }
            } else if (keyCode === 37) { // press LEFT
                if (expanded) {
                    toggleBranch($this);
                } else { // exit the current branch
                    focusItem($this.parent().closest('li'));
                }
            } else if (keyCode === 39) { // press RIGHT
                if ($this.hasClass(collapseCls)) {
                    toggleBranch($this);
                } else if (expanded) { // enter a branch
                    focusItem($this.find('ul li, ol li').first());
                }
            } else if (keyCode === 36) { // press HOME
                focusItem($this.closest('.treevue').find('li:visible').first());
                
            } else if (keyCode === 35) { // press END
                focusItem($this.closest('.treevue').find('li:visible').last());
                
            } else if (keyCode === 106) { // press keypad asterisk
                toggleBranch($this.closest('.treevue').
                             find('li.' + collapseCls));
            
            } else { // no known keys activated, so nothing has to be prevented
                return;
            }
            
            event.preventDefault();
            event.stopPropagation();
            return false;
            
        // Toggle the branch when clicking the fallback button
        }).on('click', '.treevue_fallback_branch button', function () {
            toggleBranch($(this).closest('li'));
        });
    });
    
}(jQuery));