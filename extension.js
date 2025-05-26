'use strict';
const vscode = require("vscode");

function activate(context) {
    const provider = vscode.languages.registerCompletionItemProvider('creo', {
        provideCompletionItems(document, position, token, context) {
            const completionItems = [];

            const configOptions = [
                { label: 'CEIL(', description: 'CEIL(Zahl, Anzahl Dezimalstellen) -> Die kleinste ganze Zahl, die nicht kleiner als die reelle Zahl ist. CEIL( (10.255, 2) ergibt 10.26', snippet: '', defaultValue: '' },
                { label: 'FLOOR(', description: 'FLOOR(Zahl, Anzahl Dezimalstellen) -> Die größte ganze Zahl, die nicht größer als die reelle Zahl ist. floor(10.255, 1) ergibt 10.2', snippet: '', defaultValue: '' },
                { label: 'COS(', description: 'Cosinus', snippet: '', defaultValue: '' },
                { label: 'TAN(', description: 'Tangens', snippet: '', defaultValue: '' },
                { label: 'SIN(', description: 'Sinus', snippet: '', defaultValue: '' },
                { label: 'SQRT(', description: 'Quadratwurzel', snippet: '', defaultValue: '' },
                { label: 'ASIN(', description: 'Arcussinus oder auch sin^(-1)', snippet: '', defaultValue: '' },
                { label: 'ACOS(', description: 'Arcuscosinus oder auch cos^(-1)', snippet: '', defaultValue: '' },
                { label: 'ATAN(', description: 'Arcustangens oder auch tan^(-1)', snippet: '', defaultValue: '' },
                { label: 'SINH(', description: 'Sinus hyperbolicus', snippet: '', defaultValue: '' },
                { label: 'COSH(', description: 'Cosinus hyperbolicus', snippet: '', defaultValue: '' },
                { label: 'TANH(', description: 'Tangens hyperbolicus', snippet: '', defaultValue: '' },
                { label: 'LOG(', description: 'dekadischer Logarithmus (Logarithmus zur Basis 10)', snippet: '', defaultValue: '' },
                { label: 'LN(', description: 'natürlicher Logarithmus (Logarithmus zur Basis e)', snippet: '', defaultValue: '' },
                { label: 'REL_MODEL_NAME(', description: 'Gibt den Namen des aktuellen Modells zurück', snippet: '', defaultValue: '' },
                { label: 'REL_MODEL_TYPE(', description: 'Gibt den aktuellen Modelltyp zurück', snippet: '', defaultValue: '' },
                { label: 'EXISTS(', description: 'Stellt fest, ob ein Element (wie z. B. ein Parameter oder eine Bemaßung) vorhanden ist. z. B.: if exists(d5:20) if exists (‘‘par:fid_25:cid_12’’)', snippet: '', defaultValue: '' },
                { label: 'ITOS(', description: 'Konvertiert ganze Zahlen (Integers) in Zeichenketten. Hierbei kann LQW eine Zahl oder ein Ausdruck sein. Fließkommazahlen werden nach oben gerundet.', snippet: '', defaultValue: '' },
                { label: 'SEARCH(', description: 'Dient zum Suchen nach Unterzeichenketten (substrings). Der resultierende Wert ist die Position der Unterzeichenkette innerhalb der Zeichenkette (0, falls diese nicht gefunden wird).', snippet: '', defaultValue: '' },
                { label: 'EXTRACT(', description: 'EXTRACT(String, Position, Länge) -> Extrahiert Teilstücke von Zeichenketten', snippet: '', defaultValue: '' },
                { label: 'STRING_LENGTH(', description: 'Gibt die Anzahl der Zeichen in einem Parameter zurück', snippet: '', defaultValue: '' }
            ];

            configOptions.forEach(({ label, description, snippet, defaultValue }) => {
                const item = new vscode.CompletionItem(label);
                item.label = label;
                item.detail = defaultValue ? `${description}\n\nStandardwert : ${defaultValue}` : description;
                item.insertText = snippet ? new vscode.SnippetString(`${label} \${1|${snippet}|}`) : `${label} `;
                item.kind = vscode.CompletionItemKind.Method;
                completionItems.push(item);
            });

            return completionItems;
        }
    });

    context.subscriptions.push(provider);

    const indentCommand = vscode.commands.registerCommand('creo.autoIndent', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const lines = [];
        for (let i = 0; i < document.lineCount; i++) {
            lines.push(document.lineAt(i).text);
        }

        const preprocessedLines = lines.map(line => formatOperators(line));

        const indented = autoIndentCreoCode(preprocessedLines);
        const fullRange = new vscode.Range(0, 0, document.lineCount, 0);

        editor.edit(editBuilder => {
            editBuilder.replace(fullRange, indented.join('\n'));
        });
    });

    context.subscriptions.push(indentCommand);
    
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('creo-syntax');
    context.subscriptions.push(diagnosticCollection);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId !== 'creo') return;

        const diagnostics = [];

        for (let i = 0; i < event.document.lineCount; i++) {
            const lineText = event.document.lineAt(i).text;

            // Prüfe auf if-Bedingung mit einfachem '='
            const ifMatch = lineText.match(/^\s*IF\s+.*[^<>=!]=[^=].*$/i);
            if (ifMatch) {
                const index = lineText.indexOf('=');
                const range = new vscode.Range(i, index, i, index + 1);
                const diagnostic = new vscode.Diagnostic(
                    range,
                    "Möglicher Fehler: Zuweisung '=' statt Vergleich '==' in if-Bedingung?",
                    vscode.DiagnosticSeverity.Warning
                );
                diagnostics.push(diagnostic);
            }
        }

        diagnosticCollection.set(event.document.uri, diagnostics);
    });
}


/**
 * Formatiert Operatoren mit Leerzeichen davor und danach,
 * außer bei längeren Folgen von Minuszeichen (z.B. ---) oder Pluszeichen (z.B. +++).
 * Fügt auch Leerzeichen um '|'.
 * Das Kommentarzeichen '/*' wird nicht getrennt, sondern mit genau einem Leerzeichen danach formatiert.
 */
function formatOperators(line) {
    const COMMENT_PLACEHOLDER_PREFIX = '__COMMENT_PLACEHOLDER_';
    const STRING_PLACEHOLDER_PREFIX = '__STRING_LITERAL_';
    let stringLiterals = [];
    let commentPlaceholders = [];
    let placeholderIndex = 0;

    // Suche erstes Kommentarzeichen '/*'
    const commentStart = line.indexOf('/*');

    // Wenn Kommentar gefunden, trenne Kommentar-Teil ab
    let codePart = commentStart >= 0 ? line.slice(0, commentStart) : line;
    let commentPart = commentStart >= 0 ? line.slice(commentStart) : '';

    // --- Kommentar-Teil wird unberührt gelassen, nur Code-Teil wird bearbeitet ---

    // Schritt 1: Kommentar-Zeichen in codePart schützen (falls dort noch welche, eher selten)
    codePart = codePart.replace(/\/\*[\#\-]*/g, match => {
        const placeholder = `${COMMENT_PLACEHOLDER_PREFIX}${placeholderIndex++}__`;
        commentPlaceholders.push({ placeholder, original: match });
        return placeholder;
    });

    // Schritt 2: Alle String-Literale in codePart schützen (sowohl "..." als auch '...')
    codePart = codePart.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, match => {
        const placeholder = `${STRING_PLACEHOLDER_PREFIX}${placeholderIndex++}__`;
        stringLiterals.push({ placeholder, original: match });
        return placeholder;
    });

    // Schritt 3: Operatoren außerhalb der Strings formatieren

    codePart = codePart.replace(/ *== */g, ' == ');
    codePart = codePart.replace(/ *!= */g, ' != ');
    codePart = codePart.replace(/ *<> */g, ' <> ');
    codePart = codePart.replace(/ *<= */g, ' <= ');
    codePart = codePart.replace(/ *>= */g, ' >= ');

    codePart = codePart.replace(/(?<![<>=!])<(?![>=])/g, ' < ');
    codePart = codePart.replace(/(?<![<>=!])>(?![>=])/g, ' > ');
    codePart = codePart.replace(/(?<![<>=!])=(?![<>=!])/g, ' = ');

    codePart = codePart.replace(/(?<!-)-(?!-)/g, ' - ');
    codePart = codePart.replace(/(?<!\+)\+(?!\+)/g, ' + ');
    codePart = codePart.replace(/(?<!\*)\*(?!\*)/g, ' * ');
    codePart = codePart.replace(/(?<!\/)\/(?!\/)/g, ' / ');
    codePart = codePart.replace(/(?<!%)%(?!%)/g, ' % ');

    codePart = codePart.replace(/(?<!&)&(?!&)/g, ' & ');
    codePart = codePart.replace(/\|+/g, match => ' ' + match.split('').join(' ') + ' ');

    // Mehrfache Leerzeichen auf eins reduzieren
    codePart = codePart.replace(/\s+/g, ' ');

    // Schritt 4: Kommentarplatzhalter wieder zurücksetzen im codePart
    for (const { placeholder, original } of commentPlaceholders) {
        const placeholderIndexInCode = codePart.indexOf(placeholder);
        if (/^\/\*[^#\-]/.test(original)) {
            if (placeholderIndexInCode > 0 && codePart[placeholderIndexInCode - 1] !== ' ') {
                codePart = codePart.replace(placeholder, ' /* ');
            } else {
                codePart = codePart.replace(placeholder, '/* ');
            }
        } else {
            if (placeholderIndexInCode > 0 && codePart[placeholderIndexInCode - 1] !== ' ') {
                codePart = codePart.replace(placeholder, ' ' + original);
            } else {
                codePart = codePart.replace(placeholder, original);
            }
        }
    }

    // Schritt 5: Ursprüngliche Strings wieder einsetzen im codePart
    for (const { placeholder, original } of stringLiterals) {
        codePart = codePart.replace(placeholder, original);
    }

    // Schritt 6: Trimmen (nur codePart, Kommentar bleibt wie es ist)
    codePart = codePart.trim();

    // Wenn Kommentar-Teil existiert, sicherstellen, dass vor Kommentar ein Leerzeichen ist,
    // außer Kommentar steht direkt am Zeilenanfang (dann nichts hinzufügen)
    if (commentPart) {
        if (codePart.length > 0 && !codePart.endsWith(' ')) {
            codePart += ' ';
        }
        return codePart + commentPart;
    } else {
        return codePart;
    }
}





function autoIndentCreoCode(lines) {
    const INDENT = '    ';
    let indentLevel = 0;
    const indented = [];

    for (let rawLine of lines) {
        // IF/ELSE/ENDIF in Großbuchstaben am Zeilenanfang
        rawLine = rawLine.replace(/^\s*(if|else|endif)\b/i, match => match.toUpperCase());

        const line = rawLine.trim();

        // Rückrücken bei ENDIF oder ELSE
        if (/^ENDIF\b/.test(line) || /^ELSE\b/.test(line)) {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        // Zeile einrücken
        indented.push(INDENT.repeat(indentLevel) + line);

        // Erhöhe Einrückung bei IF oder ELSE
        if (/^IF\b/.test(line) || /^ELSE\b/.test(line)) {
            indentLevel++;
        }
    }

    return indented;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
