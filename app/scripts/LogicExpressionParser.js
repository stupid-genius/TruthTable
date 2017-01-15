'use strict';

var sOps = '!&\\|\\^\\?\\(\\)';
function toPostfix(infixExp){
	var sPostfixExp = [];
	var opStack = [];
	var scanExp = new TokenScanner(infixExp);
	scanExp.addToken('op', '['+sOps+']');
	scanExp.addToken('term', '[^'+sOps+'\\s]+');

	while(scanExp.hasNext()){
		if(scanExp.hasNextPat('op')){
			var sToken = scanExp.nextPat('op');
			switch(sToken){
			case '(':
				opStack.push(sToken);
				break;
			case '!':
				opStack.push(sToken);
				break;
			case '&':
				while(!opStack.isEmpty() && opStack.peek() !== '('){
					sPostfixExp.push(opStack.pop());
				}
				opStack.push(sToken);
				break;
			case '|':
			case '^':
				while(!opStack.isEmpty() && opStack.peek() !== '(' && opStack.peek() !== '&'){
					sPostfixExp.push(opStack.pop());
				}
				opStack.push(sToken);
				break;
			case '?':
				while(!opStack.isEmpty() && opStack.peek() !== '('
					&& opStack.peek() !== '&' && opStack.peek() !== '|'
					&& opStack.peek() !== '^'){
						sPostfixExp.push(opStack.pop());
				}
				opStack.push(sToken);
				break;
			case ')':
				while(!opStack.isEmpty() && opStack.peek() !== '('){
					sPostfixExp.push(opStack.pop());
				}
				opStack.pop();
				if(!opStack.isEmpty() && opStack.peek() === '!'){
					sPostfixExp.push(opStack.pop());
				}
				break;
			}
		}
		else{
			sPostfixExp.push(scanExp.nextPat('term'));
		}
	}

	while(opStack.length){
		sPostfixExp.push(opStack.pop());
	}

	return sPostfixExp.join(' ');
}
function parsePostfix(postfixExp){
	var treeStack = [];
	var operands = [];
	var scanExp = new TokenScanner(postfixExp);
	scanExp.addToken('op', '['+sOps+']');
	scanExp.addToken('term', '[^'+sOps+'\\s]+');

	while(scanExp.hasNext()){
		if(scanExp.hasNextPat('op')){
			var opNode = new ExpressionOperator(scanExp.nextPat('op'));
			if(!treeStack.isEmpty()){
				if(opNode.getData()!=='!'){
					var right = treeStack.pop();
					opNode.setRight(right);
				}
			}
			else{
				throw 'Parse error: insufficient operands prior to operator';
			}
			if(!treeStack.isEmpty()){
				var tmp = treeStack.pop();
				opNode.setLeft(tmp);
			}
			else{
				throw 'Parse error: insufficient operands prior to operator';
			}
			treeStack.push(opNode);
		}
		else{
			var term = scanExp.nextPat('term');
			var termNode = null;
			var newNode;

			for(var i=0; i<operands.length; ++i){
				if(operands[i].getData()===term){
					termNode = operands[i];
					break;
				}
			}

			if(termNode === null){
				newNode = new ExpressionOperand(term);
				operands.push(newNode);
			}
			else{
				newNode = termNode;
			}

			treeStack.push(newNode);
		}
	}

	return treeStack.pop();
}
Array.prototype.isEmpty = function(){
	return this.length === 0;
};
Array.prototype.peek = function(){
	return this[this.length-1];
};
