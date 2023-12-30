import { Editor, Plugin } from 'obsidian';
import { generateIndex } from './indexSvc';
import { DEFAULT_SETTINGS, IndexerSettings, } from './settings/model';
import { IndexerSettingsTab } from "./settings/settings";

export default class Indexer extends Plugin {
	settings: IndexerSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'generate-selection-index',
			name: 'Generate index for selected content',
			editorCallback: (editor) => {
				const newContent = generateIndex(editor.getSelection(), this.settings);
				editor.replaceSelection(newContent);
			},
		});

		this.addCommand({
			id: 'generate-note-index',
			name: 'Generate index for current note',
			editorCallback: (editor: Editor) => {
				const note = editor.getValue();
				const newContent = generateIndex(note, this.settings);
				editor.setValue(newContent);
			}
		});

		this.addSettingTab(new IndexerSettingsTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}