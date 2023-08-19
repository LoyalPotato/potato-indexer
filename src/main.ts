import { Editor, Plugin } from 'obsidian';
import { generateIndex } from './indexSvc';

export default class Indexer extends Plugin {
	async onload() {
		this.addCommand({
			id: 'generate-selection-index',
			name: 'Generate index for selected content',
			editorCallback(editor) {
				const newContent = generateIndex(editor.getSelection());
				editor.replaceSelection(newContent);
			},
		});

		this.addCommand({
			id: 'generate-note-index',
			name: 'Generate index for current note',
			editorCallback: (editor: Editor) => {
				const newContent = generateIndex(editor.getValue());
				editor.setValue(newContent);
			}
		});

	}
}