"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * workaround for missing console object in IE9 when dev tools haven't been opened o_O
 * @packageDocumentation @module core
 */
/* tslint:disable:no-console */
var common_1 = require("./common");
var noopConsoleStub = { log: common_1.noop, error: common_1.noop, table: common_1.noop };
function ie9Console(console) {
    var bound = function (fn) { return Function.prototype.bind.call(fn, console); };
    return {
        log: bound(console.log),
        error: bound(console.log),
        table: bound(console.log),
    };
}
function fallbackConsole(console) {
    var log = console.log.bind(console);
    var error = console.error ? console.error.bind(console) : log;
    var table = console.table ? console.table.bind(console) : log;
    return { log: log, error: error, table: table };
}
function getSafeConsole() {
    // @ts-ignore
    var isIE9 = typeof document !== 'undefined' && document.documentMode && document.documentMode === 9;
    if (isIE9) {
        return window && window.console ? ie9Console(window.console) : noopConsoleStub;
    }
    else if (!console.table || !console.error) {
        return fallbackConsole(console);
    }
    else {
        return console;
    }
}
exports.safeConsole = getSafeConsole();
//# sourceMappingURL=safeConsole.js.map