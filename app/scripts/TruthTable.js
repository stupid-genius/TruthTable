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
					field: field
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
				forceFitColumns: true,
				enableColumnReorder: false,
				enableCellNavigation: true
			};
			truthtable = new Slick.Grid(this, data, cols, opts);
		};

		return this;
	};
})(jQuery);
