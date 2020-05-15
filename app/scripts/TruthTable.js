'use strict';

(function($){
	$.fn.truthtable = function TruthTable(){
		var truthtable;
		var parsedExp;
		this.generateTable = function(expression){
			var expTree = new ExpressionTree(expression);
			var ids = 0;
			var seen = {};
			var show = [];
			var cols = expTree.getExpression().filter(function(e){
				var first = seen[e]===undefined;
				if(first){
					seen[e] = true;
				}
				show.push(first);
				return first;
			}).map(function(e){
				var field = ids++;
				return {
					id: field,
					name: e,
					field: field,
					minWidth: 50
				};
			});
			parsedExp = cols[cols.length-1].name;
			var data = [];
			var termCount = expTree.getNumTerms();
            for(var i=Math.pow(2, termCount)-1; i>=0; --i){
				var col = 0;
				var showThis = 0;
                data.push(expTree.evaluate(i).filter(function(e){
					return show[showThis++];
				}).reduce(function(collector, elem){
					collector[col++] = elem?'True':'False';
					return collector;
				}, {}));
            }

			var opts = {
				autoHeight: true,
				enableColumnReorder: false
			};
			truthtable = new Slick.Grid(this, data, cols, opts);

			var magicNumber = 41;
			var tableWidth = 0;
			$('span.slick-column-name').map(function(h){
				var headerWidth = $(this).width();
				tableWidth += cols[h].width = headerWidth+magicNumber;
			});
			truthtable.setColumns(cols);
			$('#truthtable').width(tableWidth);
		};
		this.getExpression = function(){
			return parsedExp;
		};

		return this;
	};
})(jQuery);
