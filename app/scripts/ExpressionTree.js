'use strict';

function ExpressionNode(){
	var data;
	var left;
	var right;

	this.getData = function(){
		return data;
	};
	this.getLeft = function(){
		return left;
	};
	this.getRight = function(){
		return right;
	};
	this.setData = function(newData){
		data = newData;
	};
	this.setLeft = function(node){
		left = node;
	};
	this.setRight = function(node){
		right = node;
	};
}
function ExpressionOperator(operator){
	var node = new ExpressionNode();
	node.setData(operator);

	function conjugate(left, op, right, lex){
		return lex[op].replace(/##left##/, left).replace(/##right##/, right);
	}

	node.evaluate = function(subExpressions){
		var lex = {
			'!': '!(##left##)',
			'&': '(##left##&&##right##)',
			'|': '(##left##||##right##)',
			'^': '!!(##left##^##right##)',
			'?': '(!##left##||##right##)'
		};
		var left = node.getLeft().evaluate(subExpressions).peek();
		var right = node.getRight()?node.getRight().evaluate(subExpressions).peek():undefined;
		var exp = conjugate(left, node.getData(), right, lex);
		var val = eval(exp);
		subExpressions.push(val);
		return subExpressions;
	};
	node.toString = function(subExpressions){
		var lex = {
			'!': '&not;##left##',
			'&': '(##left##&and;##right##)',
			'|': '(##left##&or;##right##)',
			'^': '(##left##&oplus;##right##)',
			'?': '(##left##&rarr;##right##)'
		};
		var left = node.getLeft().toString(subExpressions).peek();
		var right = node.getRight()?node.getRight().toString(subExpressions).peek():undefined;
		subExpressions.push(conjugate(left, node.getData(), right, lex));
		return subExpressions;
	};

	return node;
}
function ExpressionOperand(data){
	var node = new ExpressionNode();
	var powerSet = this;
	var index = powerSet.getIndex();
	node.setData(data);

	node.evaluate = function(subExpressions){
		subExpressions.push((powerSet.getActiveBits()&index)!==0);
		return subExpressions;
	};
	node.toString = function(subExpressions){
		subExpressions.push(node.getData());
		return subExpressions;
	};

	return node;
}
function BinaryPowerSet(){
	var n = 0;
	var activeBits = 0;
	this.getIndex = function(){
		return 1<<n++;
	};
	this.getBitCount = function(){
		return n;
	};
	this.getActiveBits = function(){
		return activeBits;
	};
	this.setActiveBits = function(bitField){
		activeBits = bitField;
	};
}
ExpressionOperand.prototype = new BinaryPowerSet();
function ExpressionTree(expression){
	//TODO need to handle malformed input (eg empty)
	var powerSet = ExpressionOperand.prototype = new BinaryPowerSet();
	var root = parsePostfix(toPostfix(expression));
	this.evaluate = function(activeBits){
		powerSet.setActiveBits(activeBits);
		return root.evaluate([]);
	};
	this.getExpression = function(){
		return root.toString([]);
	};
	this.getNumTerms = function(){
		return powerSet.getBitCount();
	};
}
