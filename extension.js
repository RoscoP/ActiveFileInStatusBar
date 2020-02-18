var vscode = require('vscode');
var copypaste = require('copy-paste');
var path = require('path');

var sb = null;

function OnStatusBarUpdate( textEditor ) {
    textEditor = (textEditor && textEditor.viewColumn) ? textEditor : vscode.window.activeTextEditor;
    if( textEditor ){
        var config = vscode.workspace.getConfiguration('ActiveFileInStatusBar');
        if( !textEditor.document || textEditor.document.isUntitled ){
            sb.text = '';
            sb.hide();
        }
        else {
            var filePath = textEditor.document.fileName;
            if (!config.fullpath){
                filePath = vscode.workspace.asRelativePath(textEditor.document.fileName)
                filePath = path.normalize(filePath)
            }
            sb.tooltip = 'Copy active file to clipboard';
            if (config.revealFile) {
                sb.tooltip = 'Reveal file';
            }
            sb.color = config.color;
            sb.text = filePath;
            sb.show();
        }
    }
}

function CreateStatusBar() {
    var config = vscode.workspace.getConfiguration('ActiveFileInStatusBar');
    var sb = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -1);
    sb.text = '';
    sb.command = 'extension.ActiveFileInStatusBarClicked';
    return sb;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    var config = vscode.workspace.getConfiguration('ActiveFileInStatusBar');
    if (config.enable) {
        sb = CreateStatusBar();
        vscode.window.onDidChangeActiveTextEditor( OnStatusBarUpdate );
        vscode.workspace.onDidChangeConfiguration( OnStatusBarUpdate );
        OnStatusBarUpdate( vscode.window.activeTextEditor );

        context.subscriptions.push(sb);
    }

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.ActiveFileInStatusBarClicked', function (args) {
        var config = vscode.workspace.getConfiguration('ActiveFileInStatusBar');
        if (config.revealFile){
            vscode.commands.executeCommand('workbench.action.files.revealActiveFileInWindows')
        }
        else {
            copypaste.copy(sb.text)
        }
    });
    context.subscriptions.push(disposable);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;