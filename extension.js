var vscode = require('vscode');
var path = require('path');
var copy = require('node-clipboard');

var sb = null;

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
    }
}

function CopyActiveFilePath() {
    var config = vscode.workspace.getConfiguration('ActiveFileInStatusBar');

    if (config.fullpath) {
        vscode.commands.executeCommand('workbench.action.files.copyPathOfActiveFile');
    } else {
        vscode.commands.executeCommand('extension.copyRelativePathOfActiveFile')
    }
}

function CreateStatusBar() {
    var config = vscode.workspace.getConfiguration('ActiveFileInStatusBar');
    var sb = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    sb.text = '';
    sb.command = 'extension.copyRelativePathOfActiveFile';
    if (config.revealFile) {
        sb.command = 'workbench.action.files.revealActiveFileInWindows';
    }
    return sb;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    var copyActiveFileCommand = vscode.commands.registerCommand('extension.copyRelativePathOfActiveFile', function () {
        filePath = vscode.window.activeTextEditor.document.fileName;
        relFilePath = path.relative(vscode.workspace.rootPath, filePath);
        relFilePath = relFilePath.replace('\\', '\\\\') // Because Windows...
        copy(relFilePath);
    });
    context.subscriptions.push(copyActiveFileCommand);

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