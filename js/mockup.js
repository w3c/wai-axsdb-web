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
        $(btn).parent().find('.box-content').toggle('slow');
        var n = $(btn).parent().find('.box-content li').length;
        if ($(btn).text().indexOf('show') > 0) {
            $(".inqueueshowhide").text('hide');
        } else {
            $(".inqueueshowhide").text('show');
        }
    }


    $('.box-collapsed .box-content').hide();
    $('.box-collapsible .box-caption').attr('tabindex', 0).attr('role', 'button').on('click', function () {
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
