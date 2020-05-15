// jshint devel:true
'use strict';

/* TODO
- allow sorting?
- improve tests
- maybe read exp from URL query
- Karnaugh map UI
- expression history in localStorage
- maybe add caching to tree
- quantifiers A E
*/

$(document).ready(function(){
	$(window).resize(function(){
		$('#inputField').height($('#inputField').data('height')||$(window).height());
	});
	$(window).resize();
	var table = $('#truthtable');
	var truthtable = table.truthtable();
	$('#inputField').keypress(function(e){
		switch(e.which){
		case 13:
			$('#inputLabel').fadeOut();
			$('#inputField').animate({
				height: 50
			});
			$('#inputField').data('height', 50);
			truthtable.generateTable($('#expression').val());
			table.css({
				border: '1px solid'
			});
			$('#title').html('Truth table for '+truthtable.getExpression());
			break;
		}
	});
});
