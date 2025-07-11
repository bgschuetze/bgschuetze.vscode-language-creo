# PTC Creo PRO/Program Language README

Dies ist das README für "PTC Creo PRO/Program Language". Mit diesem Plugin wird der PRO/Program-Code von PTC Creo Parametric unterstützt.
Falls die Erweiterung gefällt, würde ich mich über eine Bewertung auf dem Marketplace oder im CAD.de-Forum freuen.

This is the README for "vscode-creo-pro-program". With this Plugin there is support for the PRO/Program-Language of PTC Creo Parametric.
If you like the extension, I would appreciate a review on the Marketplace or in the CAD.de forum.

## Funktionen / Functions
Diese Erweiterung beherrscht folgende Funktionen / This extension has the following functions:
- Code-Verschönerung (creo.autoIndent) -> formatiert den Code, damit er besser lesbar ist / Code beautification (creo.autoIndent) -> formats the code so that it is easier to read
- TODO, FIXME, FEHLER, HINWEIS werden in Kommentaren farbig markiert und im neuen Aktivitätentab aufgelistet / TODO, FIXME, ERROR, NOTE are highlighted in color in comments and listed in the new activity tab
- Code-Einfärbungen / Code-Highlighting:
  - Operatoren (Vergleichende + Arithmetrische) / Operators (Comparison + Arithmetric)
  - Funktionen / Functions
  - Variablen, die folgende Prefixe besitzen / Variables with following Prefixes:
    - K_
    - M_
    - MG_
    - MGG_
    - MGD_
    - MGJ_
    - KAT_
    - CREO_
    - KP_
    - F_
    - ZG_
    - ZGPROG_
- Auto-Vervollständigung mit Creo-Funktionen und Paramaternamen aus dem aktuellen Dokument / Auto-completion with Creo functions and parameter names from the current document
- Diagnose von IF-Blöcken auf richtige Vergleich-Operanden / Diagnosis of IF blocks on correct comparison operands

Um die Auto-Indent-Funktion zu benutzen muss in der Befehlsleiste (Strg+Umschalt+p) "Creo: Auto Indent File" benutzt werden. 
To use the auto-indent function, ‘Creo: Auto Indent File’ must be used in the command bar (Ctrl+Shift+p).

Um die Erstellung eines Dateisatzes anzustoßen, genügt ein Rechtsklick auf einen Ordner im Explorer, im Kontextmneü ist dann der Eintrag "Erstelle .creo-Dateisatz" verfügbar. To initiate the creation of a file set, simply right-click on a folder in the Explorer and the “Create .creo file set” entry will be available in the context menu.

## Bekannte Probleme / Known Problems
Keine derzeit bekannten Probleme. / None known at this time.

## Konfiguration der Erweiterung / Configuration of the extension
in der settings.json können folgende EInstellungen gesetzt werden / The following settings can be set in settings.json:
~~~
{
  "creo.todoForeground": "#FF0000",
  "creo.todoBackground": "#FFFF00"
}
~~~

## Testen der Erweiterung / Testing the Plugin
Es ist eine Datei enthalten, in der die Fähigkeiten der Erweiterung getestet/betrachtet werden können.
There's a file included, which shows it's abilities.

## Geplante Funktionen / Planned Functionality
- Einstellungen in der Aktivitätenleiste/den Einstellungen statt per Datei "settings.json" / Settings in the activity baror in settings instead of via the “settings.json” file
- Vorstellungsvideo / Introduction video
- Internationalisierung (kein Schwerpunkt) / Internationalization (no focus)

## Lizenz / Licensing
AGPL-3.0-or-later -> siehe auch die Lizenzdatei license.txt / have a look at license.txt

## Release Notes

Hier kommen die Release Notes / Here are the Release Notes:

### 1.2.0
Neue Funktionen / New Functions:
- Markieren von TODO;FIXME;FEHLER;HINWEIS in Kommentaren / Marking TODO;FIXME;ERROR;NOTE in comments
- Neue Ansicht in der Aktivitätenleiste "Creo Todo", hier werden alle Markierungen mit TODO;FIXME;FEHLER angezeigt / New view in the activity bar “Creo Todo”, all markings with TODO;FIXME;ERROR are displayed here
- Neue Rechtsklick-Funktion "Creo-Dateisatz erstellen" fügt einen Unterordner mit den typischen Dateien hinzu / New right-click-function “Create Creo file set” adds a subfolder with the typical files

### 1.1.1
Fehlerkorrektur, creo.autoindent wurde nicht richtig geladen. / Error correction, creo.autoindent was not loaded correctly.

### 1.1.0
Funktion creo.autoIndent eingefügt / Function creo.autoindent added

### 1.0.1
kleine Verbesserungen und Vorbereitungen für das Veröffentlichen im Marketplace.
Little Improvements und preparations for publishing in the marketplace.

### 1.0.0
Erstes öffentliches Release / First public Release:
  - Basisfunktionen funktionieren / Basic-Functions working
  - 2 Probleme behoben / 2 Issues solved

### 0.1.0

Erstes Release /  First Release:
  - Highlighting funktioniert / Highlighting works
  - STRG+Leertaste liefert Code-Vorschläge / Ctrl+Spacebar shows Code-proposals



##### Folgender Inhalt kommt aus der Vorlage und bleibt der Einfachheit halber da / Following Content is from template and stays for simplicity....
-----------------------------------------------------------------------------------------------------------

## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
