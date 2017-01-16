(function(){
    'use strict';

    var sOps = '!&\\|\\^\\?\\(\\)';
    var ops = {'&': true, '|': true, '^': true, '!': true, '?': true, '(': true, ')': true};
    var terms = {'alpha': true, 'bravo': true, 'charlie': true, 'delta': true, 'echo': true};
    var testExp = '!(alpha&bravo|charlie^delta)?echo';

    describe('TokenScanner', function(){
        var parsedExp;
        it('should be able to parse an expression', function(){
            var scanExp = new TokenScanner(testExp);
            scanExp.addToken('op', '['+sOps+']');
            scanExp.addToken('term', '[^'+sOps+'\\s]+');

            parsedExp = [];
            while(scanExp.hasNext()){
                if(scanExp.hasNextPat('op')){
                    parsedExp.push(scanExp.nextPat('op'));
                    // console.log('op', parsedExp.peek());
                }
                else if(scanExp.hasNextPat('term')){
                    parsedExp.push(scanExp.nextPat('term'));
                    // console.log('term', parsedExp.peek());
                }
            }
            assert.equal(parsedExp.length, 12);
            assert.equal(parsedExp.join(' '), '! ( alpha & bravo | charlie ^ delta ) ? echo');
        });
        it('should be able to detect operations and terms correctly', function(){
            var postfixExp = toPostfix(testExp);
            var scanExp = new TokenScanner(postfixExp);
            scanExp.addToken('op', '['+sOps+']');
            scanExp.addToken('term', '[^'+sOps+'\\s]+');

            while(scanExp.hasNext()){
                if(scanExp.hasNextPat('op')){
                    var op = scanExp.nextPat('op');
                    // console.log('op', op);
                    assert(ops[op]);
                }
                if(scanExp.hasNextPat('term')){
                    var term = scanExp.nextPat('term');
                    // console.log('term', term);
                    assert(terms[term]);
                }
            }
        });
    });
    describe('Parser', function(){
        var postfixExp;
        it('should be able to convert to postfix', function(){
            postfixExp = toPostfix(testExp);
            assert.equal(postfixExp, 'alpha bravo charlie | delta ^ & ! echo ?');
        });
        it('should be able to parse postfix', function(){
            var syntaxTree = parsePostfix(postfixExp);
            assert(syntaxTree instanceof ExpressionNode);
        });
    });
    describe('ExpressionTree', function(){
        var expTree;
        it('should be able to traverse its nodes', function(){
            // TODO make me better
            var syntaxTree = parsePostfix(toPostfix(testExp));
            var curNode = syntaxTree;
            var depth = 0;
            var fixme = true;
            while(fixme){
                if(curNode.getLeft()!==undefined){
                    curNode = curNode.getLeft();
                    ++depth;
                }
                else if(curNode.getRight()!==undefined){
                    curNode = curNode.getRight();
                    ++depth;
                }
                else{
                    break;
                }
            }
            assert.equal(depth, 3);
        });
        it('should be convertible to string', function(){
            expTree = new ExpressionTree(testExp);
            assert.equal(expTree.getExpression().peek(), '(&not;(alpha&and;((bravo&or;charlie)&oplus;delta))&rarr;echo)');
        });
        it('should be able to evaluate the tree', function(){
            var termCount = expTree.getNumTerms();
            for(var i=Math.pow(2, termCount)-1; i>=0; --i){
                console.log(expTree.evaluate(i));
            }
        });
    });
    describe('TruthTable', function(){
        it('should generate SlickGrid');
    });
})();
