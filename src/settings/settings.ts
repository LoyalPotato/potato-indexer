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

        const headerTitleSetting = new Setting(containerEl);

        headerTitleSetting
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

        this.addResetSettingBtn(headerTitleSetting, "headerTitleToLookFor");

        const insertAfterFirstHeaderSetting = new Setting(containerEl);

        insertAfterFirstHeaderSetting
            .setName("Insert after first header")
            .setDesc("Toggle to change insert to the top of the note")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.insertAfterFirstHeader)
                    .onChange((val) =>
                        this.updateSetting("insertAfterFirstHeader", val),
                    ),
            );

        this.addResetSettingBtn(
            insertAfterFirstHeaderSetting,
            "insertAfterFirstHeader",
        );

        const minHeaderSetting = new Setting(containerEl);
        minHeaderSetting
            .setName("Minimum header")
            .setDesc(
                "What's the minimum header size that you want to include.",
            );

        minHeaderSetting.addSlider((cp) =>
            cp
                .setDynamicTooltip()
                .setValue(this.plugin.settings.minHeader)
                .setLimits(1, 6, 1)
                .onChange((val) => {
                    this.updateSetting("minHeader", val);
                }),
        );

        this.addResetSettingBtn(minHeaderSetting, "minHeader");

        const maxHeaderSetting = new Setting(containerEl);
        maxHeaderSetting
            .setName("Maximum header")
            .setDesc("Up to which header size to include in the index.")
            .addSlider((cp) =>
                cp
                    .setDynamicTooltip()
                    .setValue(this.plugin.settings.maxHeader)
                    .setLimits(1, 6, 1)
                    .onChange((val) => {
                        this.updateSetting("maxHeader", val);
                    }),
            );

        this.addResetSettingBtn(maxHeaderSetting, "maxHeader");
    }

    private async updateSetting<S extends keyof IndexerSettings>(
        setting: S,
        value: IndexerSettings[S],
    ) {
        this.plugin.settings[setting] = value;
        await this.plugin.saveSettings();
    }

    private addResetSettingBtn<S extends keyof IndexerSettings>(
        setting: Setting,
        settingKey: S,
    ) {
        setting.addExtraButton((btn) => {
            btn.setIcon("reset");
            btn.setTooltip("Restore setting to default.");
            btn.onClick(() => {
                this.updateSetting(settingKey, DEFAULT_SETTINGS[settingKey]);
                this.display();
            });
        });
    }
}
