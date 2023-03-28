// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions
} from 'vscode-languageclient/node';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    const serverBinary = process.platform === "win32" ? "ic10lsp.exe" : "ic10lsp";

    // The server is implemented in the upstream language server
    const serverModule = context.asAbsolutePath(path.join('bin', serverBinary));

    // The debug options for the server
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

    // If the extension is launched in debug mode, then the debug server options are used
    // Otherwise, the run options are used
    const serverOptions: ServerOptions = {
        run: { command: serverModule },
        debug: { command: serverModule, args: ['--debug'], ...debugOptions },
    };

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        // Register the server for IC10 MIPS-like language documents
        documentSelector: [{ scheme: 'file', language: 'ic10' }],
        synchronize: {
            // Notify the server about file changes to '.clientrc' files contained in the workspace
            fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc'),
        }
    };


    // Create the language client and start the client.
    const lc = new LanguageClient(
        'ic10',
        'IC10 Language Server',
        serverOptions,
        clientOptions
    )

    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    //context.subscriptions.push(disposable);
    lc.start().then(() => {
        context.subscriptions.push(lc);
    });
}

// This method is called when your extension is deactivated
export function deactivate() { }
