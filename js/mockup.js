$(document).ready(function(){

	$('#input_search').on('keyup', function() {
		var val = $(this).val(),
				tr  = $('tbody tr'),
				reg = new RegExp(val, "i");

		console.log(val);

		if(val==='') {
			$('tr').show();
		} else {
			tr.each(function(){
				ctr = $(this);
				if (!ctr.text().match(reg)) {
					ctr.hide();
				} else {
					ctr.show();
				}
			});
		}
	});

	$('.icon-navigation button').on('click', function(){
		$(this).toggleClass('on');
		$('.icon-navigation ul').toggle('slow', function() {
		});
	});

	function showhidefilters() {
		var windowwidth = $( window ).width();
		// console.log(windowwidth);
		if (windowwidth < 700) {
			$('.with-filter .column-first form').hide();
			if ($('.with-filter h3 > button').length === 0) {
				$('.with-filter .column-first h3').append(' <button>Show</button>').on('click', function(){
					$('.with-filter .column-first form').toggle('slow', function(){
						if ($(this).parent().find('h3>button').text()=="Show") {
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

	$(window).on('resize', function() {showhidefilters();});

  $('#selected button').on('click', function(e){
    e.preventDefault();
    $(this).parent().remove();
  });


  $('.box-collapsed .box-content').hide();
  $('.box-collapsible .box-caption').attr('tabindex',0).attr('role','button').prepend($('.box-collapsed .box-content li').length + ' ').append(' (show)').on('click', function () {
    $(this).parent().find('.box-content').toggle('slow');
    var n = $(this).parent().find('.box-content li').length;
    if ($(this).text().indexOf('show')>0) {
      $(this).text( n + ' Selected tests (hide)');
    } else {
      $(this).text( n + ' Selected tests (show)');
    }
  });

  $(document).ready(function(){

function ReplaceAll(Source,stringToFind,stringToReplace){
  var temp = Source;
  var index = temp.indexOf(stringToFind);
    while(index != -1){
      temp = temp.replace(stringToFind,stringToReplace);
      index = temp.indexOf(stringToFind);
    }
  return temp;
}

    select = $('<select><option value="top">Jump to…</option></select>');
    $('main > section > h3').each(function(){
      id = ReplaceAll($(this).text(), ' ', '_');
      select.append('<option value="' + id + '">' + $(this).text() + '</option>');
      $(this).attr('id', id);
    });
    select.appendTo($('main > h2')).on('change',function(e){
      document.getElementById(select.find(':selected').val()).scrollIntoView(true);
    });
  });


});
