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


	var root = {
  "label":"ROOT",
  "children":[
    {
      "label":"H2: Combining adjacent image and text links for the same resource",
      "children":[
        {
          "label":"H2_0000002: Combine an img element and text in an anchor",
          "children":[

          ],
          "value":"H2_0000002",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Combine an img element and text in an anchor",
          "noOfChildren":0
        }
      ],
      "value":"H2",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Combining adjacent image and text links for the same resource",
      "noOfChildren":1
    },
    {
      "label":"H4: Creating a logical tab order through links, form controls, and objects",
      "children":[
        {
          "label":"H4_0000005: Tabindex adjusts the order in which links and buttons receive focus",
          "children":[

          ],
          "value":"H4_0000005",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Tabindex adjusts the order in which links and buttons receive focus",
          "noOfChildren":0
        }
      ],
      "value":"H4",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Creating a logical tab order through links, form controls, and objects",
      "noOfChildren":1
    },
    {
      "label":"H24: Providing text alternatives for the area elements of image maps",
      "children":[
        {
          "label":"H24_0000007: Screen readers read the alt on area elements",
          "children":[

          ],
          "value":"H24_0000007",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers read the alt on area elements",
          "noOfChildren":0
        }
      ],
      "value":"H24",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Providing text alternatives for the area elements of image maps",
      "noOfChildren":1
    },
    {
      "label":"H25: Providing a title using the title element",
      "children":[
        {
          "label":"H25_0000010: Titles are available for unframed pages",
          "children":[

          ],
          "value":"H25_0000010",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Titles are available for unframed pages",
          "noOfChildren":0
        }
      ],
      "value":"H25",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Providing a title using the title element",
      "noOfChildren":1
    },
    {
      "label":"H30: Providing link text that describes the purpose of a link for anchor elements",
      "children":[
        {
          "label":"H30_0000011: Anchors containing text and images are understood by screen readers",
          "children":[

          ],
          "value":"H30_0000011",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Anchors containing text and images are understood by screen readers",
          "noOfChildren":0
        }
      ],
      "value":"H30",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Providing link text that describes the purpose of a link for anchor elements",
      "noOfChildren":1
    },
    {
      "label":"H32: Providing submit buttons",
      "children":[
        {
          "label":"H32_0000013: Button and input elements of type submit/image are implemented according to spec",
          "children":[

          ],
          "value":"H32_0000013",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Button and input elements of type submit/image are implemented according to spec",
          "noOfChildren":0
        }
      ],
      "value":"H32",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Providing submit buttons",
      "noOfChildren":1
    },
    {
      "label":"H33: Supplementing link text with the title attribute",
      "children":[
        {
          "label":"H33_0000014: Screen readers can read link titles",
          "children":[

          ],
          "value":"H33_0000014",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers can read link titles",
          "noOfChildren":0
        }
      ],
      "value":"H33",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Supplementing link text with the title attribute",
      "noOfChildren":1
    },
    {
      "label":"H36: Using alt attributes on images used as submit buttons",
      "children":[
        {
          "label":"H36_0000016: Screen readers understand alt attributes of input type=image",
          "children":[

          ],
          "value":"H36_0000016",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers understand alt attributes of input type=image",
          "noOfChildren":0
        }
      ],
      "value":"H36",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using alt attributes on images used as submit buttons",
      "noOfChildren":1
    },
    {
      "label":"H37: Using alt attributes on img elements",
      "children":[
        {
          "label":"H37_0000004: Screen readers read the alt on img elements",
          "children":[

          ],
          "value":"H37_0000004",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers read the alt on img elements",
          "noOfChildren":0
        }
      ],
      "value":"H37",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using alt attributes on img elements",
      "noOfChildren":1
    },
    {
      "label":"H39: Using caption elements to associate data table captions with data tables",
      "children":[
        {
          "label":"H39_0000020: Caption element provides a name for a table to screen readers",
          "children":[

          ],
          "value":"H39_0000020",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Caption element provides a name for a table to screen readers",
          "noOfChildren":0
        }
      ],
      "value":"H39",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using caption elements to associate data table captions with data tables",
      "noOfChildren":1
    },
    {
      "label":"H40: Using definition lists",
      "children":[
        {
          "label":"H40_0000022: Screen readers can follow links to a definition list",
          "children":[

          ],
          "value":"H40_0000022",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers can follow links to a definition list",
          "noOfChildren":0
        }
      ],
      "value":"H40",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using definition lists",
      "noOfChildren":1
    },
    {
      "label":"H42: Using h1-h6 to identify headings",
      "children":[
        {
          "label":"H42_0000025: Screen readers can identify h1 to h6 elements as headers",
          "children":[

          ],
          "value":"H42_0000025",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers can identify h1 to h6 elements as headers",
          "noOfChildren":0
        }
      ],
      "value":"H42",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using h1-h6 to identify headings",
      "noOfChildren":1
    },
    {
      "label":"H43: Using id and headers attributes to associate data cells with header cells in           data tables",
      "children":[
        {
          "label":"H43_0000029: Screen readers can identify table headings using the headers attribute",
          "children":[

          ],
          "value":"H43_0000029",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers can identify table headings using the headers attribute",
          "noOfChildren":0
        }
      ],
      "value":"H43",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using id and headers attributes to associate data cells with header cells in           data tables",
      "noOfChildren":1
    },
    {
      "label":"H44: Using label elements to associate text labels with form controls",
      "children":[
        {
          "label":"H44_0000034: Screen readers use the for attribute of labels to associate them with HTML elements that can receive user input.",
          "children":[

          ],
          "value":"H44_0000034",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers use the for attribute of labels to associate them with HTML elements that can receive user input.",
          "noOfChildren":0
        }
      ],
      "value":"H44",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using label elements to associate text labels with form controls",
      "noOfChildren":1
    },
    {
      "label":"H45: Using longdesc",
      "children":[
        {
          "label":"H45_0000035: Screen readers can follow the longdesc of an img to an external source",
          "children":[

          ],
          "value":"H45_0000035",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers can follow the longdesc of an img to an external source",
          "noOfChildren":0
        }
      ],
      "value":"H45",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using longdesc",
      "noOfChildren":1
    },
    {
      "label":"H48: Using ol, ul and dl for lists or groups of links",
      "children":[
        {
          "label":"H48_0000037: Screen readers can identify HTML lists and list items",
          "children":[

          ],
          "value":"H48_0000037",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers can identify HTML lists and list items",
          "noOfChildren":0
        }
      ],
      "value":"H48",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using ol, ul and dl for lists or groups of links",
      "noOfChildren":1
    },
    {
      "label":"H49: Using semantic markup to mark emphasized or special text",
      "children":[
        {
          "label":"H49_0000073: Em and strong elements can be used to stress parts of a text",
          "children":[

          ],
          "value":"H49_0000073",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Em and strong elements can be used to stress parts of a text",
          "noOfChildren":0
        },
        {
          "label":"H49_0000074: sub elements indicate subscript in HTML",
          "children":[

          ],
          "value":"H49_0000074",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"sub elements indicate subscript in HTML",
          "noOfChildren":0
        },
        {
          "label":"H49_0000075: sup elements indicate superscript in HTML",
          "children":[

          ],
          "value":"H49_0000075",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"sup elements indicate superscript in HTML",
          "noOfChildren":0
        },
        {
          "label":"H49_0000076: abbr and acronym can identify special text in html",
          "children":[

          ],
          "value":"H49_0000076",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"abbr and acronym can identify special text in html",
          "noOfChildren":0
        },
        {
          "label":"H49_0000077: b, i and u can identify special text in HTML",
          "children":[

          ],
          "value":"H49_0000077",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"b, i and u can identify special text in HTML",
          "noOfChildren":0
        },
        {
          "label":"H49_0000078: small identifies special text in HTML",
          "children":[

          ],
          "value":"H49_0000078",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"small identifies special text in HTML",
          "noOfChildren":0
        }
      ],
      "value":"H49",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using semantic markup to mark emphasized or special text",
      "noOfChildren":6
    },
    {
      "label":"H51: Using table markup to present tabular information",
      "children":[
        {
          "label":"H51_0000040: Screen readers can identify table headings using th elements",
          "children":[

          ],
          "value":"H51_0000040",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers can identify table headings using th elements",
          "noOfChildren":0
        }
      ],
      "value":"H51",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using table markup to present tabular information",
      "noOfChildren":1
    },
    {
      "label":"H57: Using language attributes on the html element",
      "children":[
        {
          "label":"H57_0000069: Multilingual screen readers identify language of a page in a new window using the lang attribute of the html element",
          "children":[

          ],
          "value":"H57_0000069",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Multilingual screen readers identify language of a page in a new window using the lang attribute of the html element",
          "noOfChildren":0
        }
      ],
      "value":"H57",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using language attributes on the html element",
      "noOfChildren":1
    },
    {
      "label":"H58: Using language attributes to identify changes in the human language",
      "children":[
        {
          "label":"H58_0000068: Multilingual screen readers identify language changes in content based on lang attributes",
          "children":[

          ],
          "value":"H58_0000068",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Multilingual screen readers identify language changes in content based on lang attributes",
          "noOfChildren":0
        }
      ],
      "value":"H58",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using language attributes to identify changes in the human language",
      "noOfChildren":1
    },
    {
      "label":"H63: Using the scope attribute to associate header cells and data cells in data           tables",
      "children":[
        {
          "label":"H63_0000043: Screen readers can identify table headings using scope attributes",
          "children":[

          ],
          "value":"H63_0000043",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers can identify table headings using scope attributes",
          "noOfChildren":0
        }
      ],
      "value":"H63",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using the scope attribute to associate header cells and data cells in data           tables",
      "noOfChildren":1
    },
    {
      "label":"H64: Using the title attribute of the frame and iframe elements",
      "children":[
        {
          "label":"H64_0000044: Screen readers can access the title of an iframe element",
          "children":[

          ],
          "value":"H64_0000044",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers can access the title of an iframe element",
          "noOfChildren":0
        }
      ],
      "value":"H64",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using the title attribute of the frame and iframe elements",
      "noOfChildren":1
    },
    {
      "label":"H65: Using the title attribute to identify form controls when the label element           cannot be used",
      "children":[
        {
          "label":"H65_0000046:  Screen readers can use titles to describe the purpose of form controls",
          "children":[

          ],
          "value":"H65_0000046",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":" Screen readers can use titles to describe the purpose of form controls",
          "noOfChildren":0
        }
      ],
      "value":"H65",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using the title attribute to identify form controls when the label element           cannot be used",
      "noOfChildren":1
    },
    {
      "label":"H67: Using null alt text and no title attribute on img elements for images that AT           should ignore",
      "children":[
        {
          "label":"H67_0000049: Screen readers ignore img elements with an empty alt and not title",
          "children":[

          ],
          "value":"H67_0000049",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers ignore img elements with an empty alt and not title",
          "noOfChildren":0
        }
      ],
      "value":"H67",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using null alt text and no title attribute on img elements for images that AT           should ignore",
      "noOfChildren":1
    },
    {
      "label":"H69: Providing heading elements at the beginning of each section of content",
      "children":[
        {
          "label":"H69_0000066: Keyboard navigation can be used to navigate between to the next header",
          "children":[

          ],
          "value":"H69_0000066",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Keyboard navigation can be used to navigate between to the next header",
          "noOfChildren":0
        }
      ],
      "value":"H69",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Providing heading elements at the beginning of each section of content",
      "noOfChildren":1
    },
    {
      "label":"H71: Providing a description for groups of form controls using fieldset and legend           elements",
      "children":[
        {
          "label":"H71_0000053: Screen readers use legend as the name of form controls within a fieldset",
          "children":[

          ],
          "value":"H71_0000053",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers use legend as the name of form controls within a fieldset",
          "noOfChildren":0
        }
      ],
      "value":"H71",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Providing a description for groups of form controls using fieldset and legend           elements",
      "noOfChildren":1
    },
    {
      "label":"H73: Using the summary attribute of the table element to give an overview of data           tables",
      "children":[
        {
          "label":"H73_0000056: Screen readers can read the summary attribute of table elements",
          "children":[

          ],
          "value":"H73_0000056",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers can read the summary attribute of table elements",
          "noOfChildren":0
        }
      ],
      "value":"H73",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using the summary attribute of the table element to give an overview of data           tables",
      "noOfChildren":1
    },
    {
      "label":"H76: Using meta refresh to create an instant client-side redirect",
      "children":[
        {
          "label":"H76_0000057: Meta-refresh can redirect without delay",
          "children":[

          ],
          "value":"H76_0000057",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Meta-refresh can redirect without delay",
          "noOfChildren":0
        }
      ],
      "value":"H76",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using meta refresh to create an instant client-side redirect",
      "noOfChildren":1
    },
    {
      "label":"H77: Identifying the purpose of a link using link text combined with its enclosing           list item",
      "children":[
        {
          "label":"H77_0000063: Screen readers have a function to read the parent list item of a focused link",
          "children":[

          ],
          "value":"H77_0000063",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers have a function to read the parent list item of a focused link",
          "noOfChildren":0
        }
      ],
      "value":"H77",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Identifying the purpose of a link using link text combined with its enclosing           list item",
      "noOfChildren":1
    },
    {
      "label":"H78: Identifying the purpose of a link using link text combined with its enclosing           paragraph",
      "children":[
        {
          "label":"H78_0000062: Screen readers have a function to read the parent paragraph of a focused link",
          "children":[

          ],
          "value":"H78_0000062",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers have a function to read the parent paragraph of a focused link",
          "noOfChildren":0
        }
      ],
      "value":"H78",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Identifying the purpose of a link using link text combined with its enclosing           paragraph",
      "noOfChildren":1
    },
    {
      "label":"H79: Identifying the purpose of a link using link text combined with its enclosing           table cell and associated table headings",
      "children":[
        {
          "label":"H79_0000064: Screen readers have a function to read the parent td and it's headers of a focused link",
          "children":[

          ],
          "value":"H79_0000064",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers have a function to read the parent td and it's headers of a focused link",
          "noOfChildren":0
        }
      ],
      "value":"H79",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Identifying the purpose of a link using link text combined with its enclosing           table cell and associated table headings",
      "noOfChildren":1
    },
    {
      "label":"H80: Identifying the purpose of a link using link text combined with the preceding           heading element",
      "children":[
        {
          "label":"H80_0000081: Screen readers can find the previous heading of a link",
          "children":[

          ],
          "value":"H80_0000081",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers can find the previous heading of a link",
          "noOfChildren":0
        }
      ],
      "value":"H80",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Identifying the purpose of a link using link text combined with the preceding           heading element",
      "noOfChildren":1
    },
    {
      "label":"H81: Identifying the purpose of a link in a nested list using link text combined with           the parent list item under which the list is nested",
      "children":[
        {
          "label":"H81_0000080: Screen readers use parent list items to identify link context",
          "children":[

          ],
          "value":"H81_0000080",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers use parent list items to identify link context",
          "noOfChildren":0
        }
      ],
      "value":"H81",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Identifying the purpose of a link in a nested list using link text combined with           the parent list item under which the list is nested",
      "noOfChildren":1
    },
    {
      "label":"H85: Using OPTGROUP to group OPTION elements inside a SELECT",
      "children":[
        {
          "label":"H85_0000058: User agents present the label of an optgroup as the name of select options",
          "children":[

          ],
          "value":"H85_0000058",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"User agents present the label of an optgroup as the name of select options",
          "noOfChildren":0
        }
      ],
      "value":"H85",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using OPTGROUP to group OPTION elements inside a SELECT",
      "noOfChildren":1
    },
    {
      "label":"H89: Using the title attribute to provide context-sensitive help",
      "children":[
        {
          "label":"H89_0000059: Screen readers can use title combined with label to describe the purpose of form controls ",
          "children":[

          ],
          "value":"H89_0000059",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers can use title combined with label to describe the purpose of form controls ",
          "noOfChildren":0
        }
      ],
      "value":"H89",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using the title attribute to provide context-sensitive help",
      "noOfChildren":1
    },
    {
      "label":"H91: Using HTML form controls and links",
      "children":[
        {
          "label":"H91_0000061: HTML Form controls and links can receive focus",
          "children":[

          ],
          "value":"H91_0000061",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"HTML Form controls and links can receive focus",
          "noOfChildren":0
        }
      ],
      "value":"H91",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using HTML form controls and links",
      "noOfChildren":1
    },
    {
      "label":"C7: Using CSS to hide a portion of the link text",
      "children":[
        {
          "label":"C7_0000060: Screen readers can read text positioned off screen with absolute position",
          "children":[

          ],
          "value":"C7_0000060",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers can read text positioned off screen with absolute position",
          "noOfChildren":0
        }
      ],
      "value":"C7",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using CSS to hide a portion of the link text",
      "noOfChildren":1
    },
    {
      "label":"C8: Using CSS letter-spacing to control spacing within a word",
      "children":[
        {
          "label":"C8_0000071: User agents can adjust letter spacing using CSS letter-spacing",
          "children":[

          ],
          "value":"C8_0000071",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"User agents can adjust letter spacing using CSS letter-spacing",
          "noOfChildren":0
        }
      ],
      "value":"C8",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using CSS letter-spacing to control spacing within a word",
      "noOfChildren":1
    },
    {
      "label":"C9: Using CSS to include decorative images",
      "children":[
        {
          "label":"C9_0000065: Screen readers ignore CSS images",
          "children":[

          ],
          "value":"C9_0000065",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers ignore CSS images",
          "noOfChildren":0
        }
      ],
      "value":"C9",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using CSS to include decorative images",
      "noOfChildren":1
    },
    {
      "label":"C15: Using CSS to change the presentation of a user interface component when it receives focus",
      "children":[
        {
          "label":"C15_0000070: User agents can change presentation when :focus is used in CSS",
          "children":[

          ],
          "value":"C15_0000070",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"User agents can change presentation when :focus is used in CSS",
          "noOfChildren":0
        }
      ],
      "value":"C15",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using CSS to change the presentation of a user interface component when it receives focus",
      "noOfChildren":1
    },
    {
      "label":"C21: Specifying line spacing in CSS",
      "children":[
        {
          "label":"C21_0000072: User agents can adjust spacing between lines using CSS line-height",
          "children":[

          ],
          "value":"C21_0000072",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"User agents can adjust spacing between lines using CSS line-height",
          "noOfChildren":0
        }
      ],
      "value":"C21",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Specifying line spacing in CSS",
      "noOfChildren":1
    },
    {
      "label":"ARIA1: Using the aria-describedby property to provide a descriptive label for user interface controls",
      "children":[
        {
          "label":"ARIA1_0000082: Screen readers use the aria-describedby to associate a label elements that can receive user input.",
          "children":[

          ],
          "value":"ARIA1_0000082",
          "selected":false,
          "disabled":false,
          "subselector":false,
          "selectable":true,
          "collapsed":true,
          "type":"TestUnitDescription",
          "description":"Screen readers use the aria-describedby to associate a label elements that can receive user input.",
          "noOfChildren":0
        }
      ],
      "value":"ARIA1",
      "selected":false,
      "disabled":false,
      "subselector":true,
      "selectable":true,
      "collapsed":true,
      "type":"Technique",
      "description":"Using the aria-describedby property to provide a descriptive label for user interface controls",
      "noOfChildren":1
    }
  ],
  "value":null,
  "selected":false,
  "disabled":false,
  "subselector":true,
  "selectable":true,
  "collapsed":true,
  "type":"",
  "description":null,
  "noOfChildren":99
};

	// $('#thetestsTreeDiv').treevue(root.children);
	$.treevue(root.children, "df").appendTo('#thetestsTreeDiv').parent().find('.progress').remove();

});
