

const vscode = require('vscode');


function activate(context) {

    /*
        The main function of the plug-in
        Parametrs:
            context: passes the vs-code to the function
        Return value:
            -
    */

    let disposable = vscode.commands.registerCommand('code-block-generator.generateBlock', function () {
        const items = [
            { label: 'if', description: 'Generate if block' },
            { label: 'for', description: 'Generate for block' },
            { label: 'while', description: 'Generate while block' },
            { label: 'switch', description: 'Generate switch block' },
            { label: 'try-catch', description: 'Generate try-catch block' }
        ];

        vscode.window.showQuickPick(items, {
            placeHolder: 'Select block to generate:'
        }).then(selection => {
            if (selection) {
                generateCodeBlock(selection.label);
            }
        });
    });

    context.subscriptions.push(disposable);
}

function generateCodeBlock(blockType) {
    /*
        Generates a block of code, depending on which one the user needs.
        Parametrs:
            block_type (string): transmits the type of code block that the user needs.
        Return value:
            -
    */
    const editor = vscode.window.activeTextEditor;
    const selection = editor.selection;
    const position = selection.active;

    const language = editor.document.languageId;
    let code = '';

    switch (blockType) {
        case 'if':
            code = getIfBlock(language);
            break;
        case 'for':
            code = getForLoop(language);
            break;
        case 'while':
            code = getWhileLoop(language);
            break;
        case 'switch':
            code = getSwitchBlock(language);
            break;
        case 'try-catch':
            code = getTryCatchBlock(language);
            break;
        default:
            code = '';
    }

    editor.edit(editBuilder => {
        editBuilder.insert(position, code);
    }).then(success => {
        if (success) {
            moveCursorToPlaceholder(editor, position, code);
        }
    });
}

function getIfBlock(language) {
    
    /*
        The function returns the "if" code block
        Parametrs:
            language (string): the programming language in which the user writes
        Return value:
            block_code (string): returns the "if" code block
    */ 

    const templates = {
        'python': `if condition:\n\t`,
        'cpp': `if (condition) {\n\t\n\t}`
    };
    return templates[language] || templates['cpp'];
}

function getForLoop(language) {

    /*
        The function returns the "for" code block
        Parametrs:
            language (string): the programming language in which the user writes
        Return value:
            block_code (string): returns the "for" code block
    */ 

    const templates = {
        'python': `for i in range(length):\n\t`,
        'cpp': `for (int i = 0; i < length; i++) {\n\t\n\t}`
    };
    return templates[language] || templates['cpp'];
}

function getWhileLoop(language) {

    /*
        The function returns the "while" code block
        Parametrs:
            language (string): the programming language in which the user writes
        Return value:
            block_code (string): returns the "while" code block
    */ 

    const templates = {
        'python': `while condition:\n\t`,
        'cpp': `while (condition) {\n\t\n\t}`
    };
    return templates[language] || templates['cpp'];
}


function getSwitchBlock(language) {

    /*
        The function returns the "switch" code block
        Parametrs:
            language (string): the programming language in which the user writes
        Return value:
            block_code (string): returns the "switch" code block
    */ 

    const templates = {
        'cpp': `switch (variable) {\n\t\tcase value:\n\t\t\tbreak;\n\t\tdefault:\n\t\t\tbreak;\n\t}`
    };
    return templates[language] || templates['cpp'];
}

function getTryCatchBlock(language) {

    /*
        The function returns the "try-catch" code block
        Parametrs:
            language (string): the programming language in which the user writes
        Return value:
            block_code (string): returns the "try-catch" code block
    */ 

    const templates = {
        'cpp': `try {\n\t\tcode\n\t} catch (const std::exception& e) {\n\t\n\t}`,
        'python': `try:\n\tcode\nexcept Exception as e:\n\tpass`
    };
    return templates[language] || templates['cpp'];
}


function moveCursorToPlaceholder(editor, originalPosition, code) {

    /*
        A function that moves the cursor inside a block
        Parametrs:
            editor: active text editor
            originalPosition: cursor position 
            code (string): the block of code that the user needs
        Return value:
            -
    */

    const ifOrWhileIndex = code.indexOf("condition") + 9;
    const switchIndex = code.indexOf("variable") + 8;
    const forIndex = code.indexOf("length") + 6;
    const tryIndex = code.indexOf("code") + 4;
    const placeholderIndex = switchIndex * (switchIndex != 7) + ifOrWhileIndex * (ifOrWhileIndex != 8) + forIndex * (forIndex != 5) + tryIndex * (tryIndex != 3);

    if (placeholderIndex !== -1) {
        const lines = code.substr(0, placeholderIndex).split('\n');
        const lineDelta = lines.length - 1;
        const characterDelta = lines[lineDelta].length;
        
        const newPosition = new vscode.Position(
            originalPosition.line + lineDelta,
            lineDelta === 0 ? originalPosition.character + characterDelta : characterDelta
        );
        
        editor.selection = new vscode.Selection(newPosition, newPosition);
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};