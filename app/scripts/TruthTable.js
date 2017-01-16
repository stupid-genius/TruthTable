'use strict';

(function($){
	$.fn.truthtable = function TruthTable(){
		var truthtable;
		this.generateTable = function(expression){
			var expTree = new ExpressionTree(expression);
			var ids = 0;
			var cols = expTree.getExpression().map(function(e){
				var field = ids++;
				return {
					id: field,
					name: e,
					field: field,
					minWidth: 50
				};
			});
			var data = [];
			var termCount = expTree.getNumTerms();
            for(var i=Math.pow(2,termCount)-1;i>=0;--i){
				var col = 0;
                data.push(expTree.evaluate(i).reduce(function(collector, elem){
					collector[col++] = elem?'True':'False';
					return collector;
				}, {}));
            }

			var opts = {
				autoHeight: true,
				enableColumnReorder: false,
			};
			truthtable = new Slick.Grid(this, data, cols, opts);

			var magicNumber = 41;
			var tableWidth = 0;
			$('span.slick-column-name').map(function(i){
				var headerWidth = $(this).width();
				tableWidth += cols[i].width = headerWidth+magicNumber;
				console.log(cols[i].width);
			});
			truthtable.setColumns(cols);
			console.log('table', tableWidth);
			$('#truthtable').width(tableWidth);
		};

		return this;
	};
})(jQuery);
