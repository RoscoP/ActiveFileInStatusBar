var vscode = require('vscode');
var copypaste = require('copy-paste');
var path = require('path');

var sb = null;

function OnStatusBarUpdate( textEditor ) {
    textEditor = textEditor ? textEditor : vscode.window.activeTextEditor;
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
            if(config.showFolderAsProjectName) {
                filePath = path.normalize(filePath)
                filePath = path.dirname(filePath).split(config.showFolderAsProjectName)[0].split('/').slice(-1)[0]
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
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;