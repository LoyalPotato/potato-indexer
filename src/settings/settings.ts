import { App, PluginSettingTab, Setting } from "obsidian";
import Indexer from "../main";
import { DEFAULT_SETTINGS, IndexerSettings } from "./model";

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
            .setDesc(
                `What title the index will look for to perform updates on. The default value is: ${DEFAULT_SETTINGS.headerTitleToLookFor}`,
            )
            .addText((text) =>
                text
                    .setPlaceholder("## Example")
                    .setValue(this.plugin.settings.headerTitleToLookFor)
                    .onChange((val) =>
                        this.updateSetting(
                            "headerTitleToLookFor",
                            val || DEFAULT_SETTINGS.headerTitleToLookFor,
                        ),
                    ),
            );

        new Setting(containerEl)
            .setName("Insert after first header")
            .setDesc("Toggle to change insert to the top of the note")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.insertAfterFirstHeader)
                    .onChange((val) =>
                        this.updateSetting("insertAfterFirstHeader", val),
                    ),
            );

        let minHeaderEl: HTMLDivElement;
        const minHeaderSet = new Setting(containerEl);
        minHeaderSet
            .setName("Minimum header")
            .setDesc(
                "What's the minimum header size that you want to include.",
            );

		// NOTE: The extra btn needs to be added here
        minHeaderSet.addSlider((cp) =>
            cp
                .setDynamicTooltip()
                .setValue(this.plugin.settings.minHeader)
                .setLimits(1, 6, 1)
                .onChange((val) => {
                    minHeaderEl.innerText = ` ${val.toString()}`;
                    this.updateSetting("minHeader", val);
                }),
        );

        minHeaderSet.settingEl.createDiv("", (el) => {
            minHeaderEl = el;
            el.style.minWidth = "2.3em";
            el.style.textAlign = "right";
            el.innerText = ` ${this.plugin.settings.minHeader.toString()}`;
        });

        let maxHeaderEl: HTMLDivElement;
        new Setting(containerEl)
            .setName("Maximum header")
            .setDesc("Up to which header size to include in the index.")
            .addSlider((cp) =>
                cp
                    .setDynamicTooltip()
                    .setValue(this.plugin.settings.maxHeader)
                    .setLimits(1, 6, 1)
                    .onChange((val) => {
                        maxHeaderEl.innerText = ` ${val.toString()}`;
                        this.updateSetting("maxHeader", val);
                    }),
            )
            .settingEl.createDiv("", (el) => {
                maxHeaderEl = el;
                el.style.minWidth = "2.3em";
                el.style.textAlign = "right";
                el.innerText = ` ${this.plugin.settings.maxHeader.toString()}`;
            });
    }

    private async updateSetting<S extends keyof IndexerSettings>(
        setting: S,
        value: IndexerSettings[S],
    ) {
        this.plugin.settings[setting] = value;
        await this.plugin.saveSettings();
    }

}
