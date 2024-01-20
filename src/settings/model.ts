export interface IndexerSettings {
    insertAfterFirstHeader: boolean;
    headerTitleToLookFor: string;
    minHeader: number;
    maxHeader: number;
}

export const DEFAULT_SETTINGS: IndexerSettings = {
    headerTitleToLookFor: "## Content Index",
    insertAfterFirstHeader: true,
    minHeader: 1,
	maxHeader: 6
};

