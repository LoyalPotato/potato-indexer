import { App, PluginSettingTab, Setting } from "obsidian";
import Indexer from "../main";
import { DEFAULT_SETTINGS } from "./model";


export class IndexerSettingsTab extends PluginSettingTab {
  plugin: Indexer;

  constructor(app: App, plugin: Indexer) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Header title")
      .setDesc(`What title the index will look for to perform updates on. The default value is: ${DEFAULT_SETTINGS.headerTitleToLookFor}`)
      .addText((text) =>
        text
          .setPlaceholder("## Example")
          .setValue(this.plugin.settings.headerTitleToLookFor)
          .onChange(async (value) => {
            this.plugin.settings.headerTitleToLookFor = value || DEFAULT_SETTINGS.headerTitleToLookFor;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Insert after first header")
      .setDesc("Toggle to change insert to the top of the note")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.insertAfterFirstHeader)
          .onChange(async (value) => {
            this.plugin.settings.insertAfterFirstHeader = value;
            await this.plugin.saveSettings();
          })
      );
  }
}