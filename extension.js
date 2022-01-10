'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function activate(context) {
    let provider = vscode.languages.registerCompletionItemProvider('creo', {
        provideCompletionItems(document, position, token, context) {
            let completionItems = [];
            let configOptions = [
                ['CEIL(', 'CEIL(Zahl, Anzahl Dezimalstellen) -> Die kleinste ganze Zahl, die nicht kleiner als die reelle Zahl ist. CEIL( (10.255, 2) ergibt 10.26 ', '', ''],
                ['FLOOR(', 'FLOOR(Zahl, Anzahl Dezimalstellen) -> Die größte ganze Zahl, die nicht größer als die reelle Zahl ist. floor(10.255, 1) ergibt 10.2 ', '', ''],
                ['COS(', 'Cosinus', '', ''],
                ['TAN(', 'Tangens', '', ''],
                ['SIN(', 'Sinus', '', ''],
                ['SQRT(', 'Quadratwurzel', '', ''],
                ['ASIN(', 'Arcussinus oder auch sin^(-1)', '', ''],
                ['ACOS(', 'Arcuscosinus oder auch cos^(-1)', '', ''],
                ['ATAN(', 'Arcustangens oder auch tan^(-1)', '', ''],
                ['SINH(', 'Sinus hyperbolicus', '', ''],
                ['COSH(', 'Cosinus hyperbolicus', '', ''],
                ['TANH(', 'Tangens hyperbolicus', '', ''],
                ['LOG(', 'dekadischer Logarithmus (Logarithmus zur Basis 10)', '', ''],
                ['LN(', 'natürlicher Logarithmus (Logarithmus zur Basis e)', '', ''],
                ['REL_MODEL_NAME(', 'Gibt den Namen des aktuellen Modells zurück', '', ''],
                ['REL_MODEL_TYPE(', 'Gibt den aktuellen Modelltyp zurück', '', ''],
                ['EXISTS(', 'Stellt fest, ob ein Element (wie z. B. ein Parameter oder eine Bemaßung) vorhanden ist. z. B.: if exists(d5:20) if exists (‘‘par:fid_25:cid_12’’)', '', ''],
                ['ITOS(', 'Konvertiert ganze Zahlen (Integers) in Zeichenketten. Hierbei kann LQW eine Zahl oder ein Ausdruck sein. Fließkommazahlen werden nach oben gerundet. ', '', ''],
                ['SEARCH(', 'Dient zum Suchen nach Unterzeichenketten (substrings). Der resultierende Wert ist die Position der Unterzeichenkette innerhalb der Zeichenkette (0, falls diese nicht gefunden wird). ', '', ''],
                ['EXTRACT(', 'EXTRACT(String, Position, Länge) -> Extrahiert Teilstücke von Zeichenketten ', '', ''],
                ['STRING_LENGTH(', 'Gibt die Anzahl der Zeichen in einem Parameter zurück ', '', '']
            ];
            configOptions.forEach(function (item) {
                let completionItem = new vscode.CompletionItem(item[0]);
                completionItem.label = item[0];
                if (item[3] != '') {
                    completionItem.detail = item[1] + '\n\nStandardwert : ' + item[3];
                }
                else {
                    completionItem.detail = item[1];
                }
                if (item[2] != '') {
                    completionItem.insertText = new vscode.SnippetString(item[0] + ' ${1|' + item[2] + '|}');
                }
                else {
                    completionItem.insertText = item[0] + ' ';
                }
                completionItem.kind = vscode.CompletionItemKind.Method;
                completionItems.push(completionItem);
            });
            return completionItems;
        }
    });
    context.subscriptions.push(provider);
}
exports.activate = activate;
