// jshint devel:true
'use strict';

/* TODO
- add title (Jumbotron?)
- grid styling
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
		$('#truthtable').width($(document).width());
		$('#truthtable').height($(document).height());
		$('#inputField').height($('#inputField').data('height')||$(window).height());
	});
	$(window).resize();
	var truthtable = $('#truthtable').truthtable();
	$('#inputField').keypress(function(e){
		switch(e.which){
		case 13:
			$('#inputLabel').fadeOut();
			$('#inputField').animate({
				height: 50
			});
			$('#inputField').data('height',50);
			truthtable.generateTable($('#expression').val());
			break;
		}
	});
});
