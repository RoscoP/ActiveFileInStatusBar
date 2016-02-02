// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ActiveFileInStatusBar" is now active!'); 

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	// var disposable = vscode.commands.registerCommand('extension.sayHello', function () {
		// The code you place here will be executed every time your command is executed

        var sb = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10000);
        sb.text = '';
        sb.command = 'workbench.action.files.copyPathOfActiveFile'
        sb.tooltip = 'Copy active file to clipboard'
        
        // vscode.workspace.onDidOpenTextDocument( function textEditorChange(e){
        //     console.log("DocOpen  : " + e.fileName);
        //     sb.text = e.fileName;
        // });
        // vscode.workspace.onDidChangeTextDocument( function textEditorChange(e){
        //     console.log("DocChange: " + e.document.fileName);
        //     sb.text = e.document.fileName;
        // });
        // vscode.workspace.onDidCloseTextDocument( function textEditorChange(e){
        //     console.log("DocClosed: " + e.fileName);
        //     sb.text = e.fileName;
        // });
        vscode.window.onDidChangeActiveTextEditor( function textEditorChange(e){
            console.log("TextEdit : " + e.document.fileName);
            if( e.document.isUntitled ){
                sb.text = '';
                sb.hide();    
            }
            else {
                sb.text = e.document.fileName
                sb.show();    
            }
        });

	context.subscriptions.push(sb);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;