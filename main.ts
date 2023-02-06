import {Editor, MarkdownView, Plugin} from 'obsidian';

export default class MaterialSymbolsPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: 'add-symbol',
			name: 'Add symbol',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				let position = editor.getCursor('from')
				// add icon
				editor.replaceSelection('<span class="mso"></span>');
				// move cursor into the tag
				editor.setCursor({
					line: position.line,
					ch: position.ch + 18 // opening tag has 18 characters
				});
			}
		});

		this.addCommand({
			id: 'add-symbol-single-quotes',
			name: 'Add symbol (class single-quoted)',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				let preInsertPosition = editor.getCursor('from')
				// add icon
				editor.replaceSelection("<span class='mso'></span>");
				// move cursor into the tag
				editor.setCursor({
					line: preInsertPosition.line,
					ch: preInsertPosition.ch + 18 // opening tag has 18 characters
				});
			}
		});
	}

	onunload() {
		// do nothing
	}
}
