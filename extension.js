var vscode = require('vscode');
var path = require('path');

var i = 0;
var sb = null;

function OnCommand( textEditor ) {
}

function OnStatusBarUpdate( textEditor ) {
    if( textEditor ){
        var config = vscode.workspace.getConfiguration('ActiveFileInStatusBar');
        if( textEditor.document.isUntitled ){
            sb.text = '';
            sb.hide();
        }
        else {
            var filePath = textEditor.document.fileName;
            if (!config.fullpath && vscode.workspace.rootPath){
                filePath = path.relative(vscode.workspace.rootPath, textEditor.document.fileName);
            }
            var icon = '$(clippy)';
            sb.tooltip = 'Copy active file to clipboard';
            if (config.revealFile) {
                icon = '$(file-submodule)';
                sb.tooltip = 'Reveal file';
            }
            sb.text = icon + ' ' + filePath;
            sb.show();
        }
        console.log("TextEdit : " + sb.text);
    }
}

function CreateStatusBar() {
    var config = vscode.workspace.getConfiguration('ActiveFileInStatusBar');
    // vscode.commands.registerTextEditorCommand("extension.ActiveFileInStatusBar.OnCommand", OnCommand);
    var sb = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    sb.text = '';
    sb.command = 'workbench.action.files.copyPathOfActiveFile';
    if (config.revealFile) {
        sb.command = 'workbench.action.files.revealActiveFileInWindows';
    }
    return sb;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    var config = vscode.workspace.getConfiguration('ActiveFileInStatusBar');
    if (config.enable) {
        sb = CreateStatusBar();
        vscode.window.onDidChangeActiveTextEditor( OnStatusBarUpdate );
        OnStatusBarUpdate( vscode.window.activeTextEditor );

        context.subscriptions.push(sb);
    }

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;