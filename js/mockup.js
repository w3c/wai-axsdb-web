function makeSticky($dom) {
    $dom.each(function() {
        var $dom = $(this);

        //make a record of the original offset of the element
        var origOffset = $dom.offset();
        var origOuterHeight = $dom.outerHeight();
        var origPos = $dom.position();

        var origHeight = $dom.height();
        var origWidth = $dom.width();

        var $parent = $dom.parent();

        //the dom sticks to the sides of the screen during scrolling if the viewport is scrolled beyond the visibility of the dom
        //its maximum scroll amount is contained in its parent or another provided dom element so that it sticks to its parent element
        //we use a empty object decoy to replace the original dom element and then layer the original on top so other inline elements are not affected by the change of dom layout
        //so this can be called very simply on a dom element
        var $decoy = $('<div class="sticky_decoy invisible"></div>');
        $decoy.css({
            width: $dom.outerWidth(true),
            height: $dom.outerHeight(true),
            top: $dom.position().top,
            left: $dom.position().left,
            display: $dom.css("display"),
            position: $dom.css("position"),
            float: $dom.css("float"),
            clear: $dom.css("clear")
        });

        $dom.before($decoy);

        $(window).on("scroll resize", handleScroll);
        handleScroll();

        function handleScroll() {
            var scrollPos = {top: $(window).scrollTop(), left: $(window).scrollLeft() };

            var slideDown = scrollPos.top > origOffset.top, stayDown = scrollPos.top + origOuterHeight > $parent.offset().top + $parent.height();

            if (slideDown && !stayDown) {
                if (!$dom.hasClass("sticky")) {
                    $decoy.removeClass("invisible");
                    $dom.addClass("sticky");

                    window.setTimeout(function() {
                        console.log({width: $decoy.outerWidth(true), height: $decoy.outerHeight(true), left: $decoy.offset().left});
                        $dom.css({width: origWidth, left: $decoy.offset().left});
                    }, 0);
                }
            } else {
                $dom.attr("style" ,"").removeClass("sticky");
                $decoy.addClass("invisible");
            }

            //stick the element to the bottom of the parent if the elements position is overthe original
            if (stayDown) {
                $decoy.removeClass("invisible");
                $dom.removeClass("sticky").attr("style" ,"").css({left: origPos.left}).addClass("sticky_bottom");
            } else {
                if (!$dom.hasClass('sticky')) {
                    $dom.attr("style", "").removeClass("sticky_bottom");
                }
            }
        }
    });
}

$(document).ready(function () {
    $('.input-search').on('keyup', function () {
        var val = $(this).val(),
            tr = $('tbody tr'),
            reg = new RegExp(val, "i");
        console.log(val);
        if (val === '') {
            $('tr').show();
        } else {
            tr.each(function () {
                ctr = $(this);
                if (!ctr.text().match(reg)) {
                    ctr.hide();
                } else {
                    ctr.show();
                }
            });
        }
    });
    $('.icon-navigation button').on('click', function () {
        $(this).toggleClass('on');
        $('.icon-navigation ul').toggle('slow', function () {
        });
    });
    function showhidefilters() {
        var windowwidth = $(window).width();
        // console.log(windowwidth);
        if (windowwidth < 700) {
            $('.with-filter .column-first form').hide();
            if ($('.with-filter h3 > button').length === 0) {
                $('.with-filter .column-first h3').append(' <button>Show</button>').on('click', function () {
                    $('.with-filter .column-first form').toggle('slow', function () {
                        if ($(this).parent().find('h3>button').text() == "Show") {
                            $(this).parent().find('h3>button').html('Hide');
                        } else {
                            $(this).parent().find('h3>button').html('Show');
                        }
                    });
                });
            }
        } else {
            $('.with-filter .column-first form').show();
        }
    }
    showhidefilters();
    $(window).on('resize', function () {
        showhidefilters();
    });
    $('#selected button').on('click', function (e) {
        e.preventDefault();
        $(this).parent().remove();
    });

    var toggleBox = function (btn) {
        $(btn).parent().find('.box-content').toggle();
        var n = $(btn).parent().find('.box-content li').length;
        if ($(btn).text().indexOf('show') > 0) {
            $(".inqueueshowhide").text('hide');
            $(btn).parent().find(".icon-triangle-right").removeClass('icon-triangle-right').addClass('icon-triangle-down');
        } else {
            $(".inqueueshowhide").text('show');
            $(btn).parent().find(".icon-triangle-down").removeClass('icon-triangle-down').addClass('icon-triangle-right');
        }
    }


    $('.box-collapsed .box-content').hide();
    $('.box-collapsible .box-caption').css("cursor", "pointer").attr('tabindex', 0).attr('role', 'button').on('click', function () {
        toggleBox(this);
    }).on("keyup", function(event) {
        if ( event.which == 13 ) {
            toggleBox(this);
        }
    });

    $(document).ready(function () {
        function ReplaceAll(Source, stringToFind, stringToReplace) {
            var temp = Source;
            var index = temp.indexOf(stringToFind);
            while (index != -1) {
                temp = temp.replace(stringToFind, stringToReplace);
                index = temp.indexOf(stringToFind);
            }
            return temp;
        }
        select = $('<select><option value="top">Jump to…</option></select>');
        $('main > section > h3').each(function () {
            id = ReplaceAll($(this).text(), ' ', '_');
            select.append('<option value="' + id + '">' + $(this).text() + '</option>');
            $(this).attr('id', id);
        });
        select.appendTo($('main > h2')).on('change', function (e) {
            document.getElementById(select.find(':selected').val()).scrollIntoView(true);
        });
    });
});

$(document).ready(function(){
    $('.results .chart, .result-details .chart').peity("pie", {
      fill: ["green", "#f98"]
    });
    $('.results button').on('click', function(){
      el = $(this);
      icon = el.find('.icon');
      iconlabel = icon.find('.visuallyhidden');
      el.parents('tbody').toggleClass('collapsed');
      icon.toggleClass('icon-collapse icon-expand');
      if (icon.is('.icon-expand')) {
        iconlabel.text('Expand');
      } else {
        iconlabel.text('Collapse');
      }
    });
});
