"use strict";
const esprima = require('esprima');
const AppendState_1 = require("../../enums/AppendState");
const JSFuck_1 = require("../../enums/JSFuck");
const NoCustomNodesPreset_1 = require("../../preset-options/NoCustomNodesPreset");
const JavaScriptObfuscator_1 = require("../../JavaScriptObfuscator");
const Node_1 = require('../Node');
const NodeUtils_1 = require("../../NodeUtils");
const Utils_1 = require("../../Utils");
class UnicodeArrayRotateFunctionNode extends Node_1.Node {
    constructor(unicodeArrayName, unicodeArray, unicodeArrayRotateValue, options = {}) {
        super(options);
        this.appendState = AppendState_1.AppendState.AfterObfuscation;
        this.unicodeArrayName = unicodeArrayName;
        this.unicodeArray = unicodeArray;
        this.unicodeArrayRotateValue = unicodeArrayRotateValue;
        this.node = this.getNodeStructure();
    }
    appendNode(blockScopeNode) {
        NodeUtils_1.NodeUtils.insertNodeAtIndex(blockScopeNode.body, this.getNode(), 1);
    }
    getNode() {
        if (!this.unicodeArray.length) {
            return;
        }
        return super.getNode();
    }
    getNodeStructure() {
        let arrayName = Utils_1.Utils.getRandomVariableName(), code = '', timesName = Utils_1.Utils.getRandomVariableName(), tempArrayName = Utils_1.Utils.getRandomVariableName(), node;
        if (this.options['selfDefending']) {
            code = JavaScriptObfuscator_1.JavaScriptObfuscator.obfuscate(`
                (function () {
                    var func = function () {
                        return 'window';
                    };
                                        
                    if (
                        !Function(${Utils_1.Utils.stringToUnicode(`return/(\\\\[x|u](\\w){2,4})+/`)})().test(func.toString())
                    ) {
                        []['filter']['constructor'](${Utils_1.Utils.stringToJSFuck('while')} + '(${JSFuck_1.JSFuck.True}){}')();
                    }
                })();
            `, NoCustomNodesPreset_1.NO_CUSTOM_NODES_PRESET);
        }
        node = esprima.parse(`
            (function (${arrayName}, ${timesName}) {
                if (${timesName} < 0x${Utils_1.Utils.decToHex(0)}) {
                    return;
                }

                var ${tempArrayName};

                while (${timesName}--) {
                    ${code}
                    ${tempArrayName} = ${arrayName}[${Utils_1.Utils.stringToUnicode('shift')}]();
                    ${arrayName}[${Utils_1.Utils.stringToUnicode('push')}](${tempArrayName});
                }
            })(${this.unicodeArrayName}, 0x${Utils_1.Utils.decToHex(this.unicodeArrayRotateValue)});
        `);
        NodeUtils_1.NodeUtils.addXVerbatimPropertyToLiterals(node);
        return NodeUtils_1.NodeUtils.getBlockScopeNodeByIndex(node);
    }
}
exports.UnicodeArrayRotateFunctionNode = UnicodeArrayRotateFunctionNode;