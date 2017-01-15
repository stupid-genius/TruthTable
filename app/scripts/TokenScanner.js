'use strict';
/***************************************
*	Token Scanner
*	author: Allen Ng
*
*	A string scanner that maintains a
*	list of token patterns to scan for
***************************************/
function TokenScanner(string){
	var sString = string;
	var tokens = {};
	var iCurIndex = 0;
	// do these need to be properties?
	// this.curToken;
	// this.curTokenType;

	this.addToken = function(patternName, pattern){
		if(tokens[patternName]===undefined){
			tokens[patternName] = pattern;
		}
		else{
			throw 'Token already added.';
		}
	};

	this.hasNext = function(){
		this.curTokenType = null;
		var bFound = false;
		var keys = Object.keys(tokens);
		// & -> ε
		// I'm not sure why I decided to handle epsilon differently
		for(var t in keys){
			if(/^&/.test(keys[t])){
				continue;
			}
			if(this.hasNextExp(tokens[keys[t]])){
				this.curTokenType = keys[t];
				bFound = true;
				break;
			}
		}
		if(!bFound){
			for(var t in keys){
				if(!/^&/.test(keys[t])){
					continue;
				}
				if(this.hasNextExp(tokens[keys[t]])){
					this.curTokenType = keys[t];
					bFound = true;
					break;
				}
			}
		}
		return bFound;
	};
	this.hasNextPat = function(patternName){
		return this.hasNextExp(tokens[patternName]);
	};
	this.hasNextExp = function(pattern){
		var bFound = false;
		var regexPattern = new RegExp('^'+pattern);
		if(iCurIndex < sString.length){
			var match = sString.substring(iCurIndex).match(regexPattern);
			if(match){
				this.curToken = match[0];
				bFound = true;
			}
		}
		return bFound;
	};
/*
*	precondition: hasNext() returns true
*	postcondition: next advances curToken and returns it
*/
	this.next = function(){
		return this.nextExp(tokens[this.curTokenType]);
	};
	this.nextPat = function(patternName){
		return this.nextExp(tokens[patternName]);
	};
	this.nextExp = function(pattern){
		var regexPattern = new RegExp('^'+pattern);
		var sMatch = sString.substring(iCurIndex).match(regexPattern)[0];
		iCurIndex += sMatch.length;
		if(/^\s+/.test(sString.substring(iCurIndex))){
			iCurIndex += sString.substring(iCurIndex).match(/^\s+/)[0].length;
		}
		return sMatch;
	};
}
