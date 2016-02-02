var vscode = require('vscode');
var path = require('path');

var i = 0;
var sb = null;

function OnCommand( textEditor ) {
    
    var config = vscode.workspace.getConfiguration('ActiveFileInStatusBar');
    var cmd = vscode.commands.getCommands();
    cmd.then(function(a,b,c){
        console.log(a);
    });
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
            sb.text = filePath;
            sb.show();
        }
        console.log("TextEdit : " + sb.text);
    }
}

function CreateStatusBar() {
    vscode.commands.registerTextEditorCommand("extension.ActiveFileInStatusBar.OnCommand", OnCommand);
    var sb = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    sb.text = '';
    sb.command = "extension.ActiveFileInStatusBar.OnCommand"; // 'workbench.action.files.copyPathOfActiveFile'
    sb.tooltip = 'Copy active file to clipboard';
    return sb;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    
    sb = CreateStatusBar();
    vscode.window.onDidChangeActiveTextEditor( OnStatusBarUpdate );
    OnStatusBarUpdate( vscode.window.activeTextEditor );

	context.subscriptions.push(sb);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;