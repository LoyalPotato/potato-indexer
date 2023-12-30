export interface IndexerSettings {
  insertAfterFirstHeader: boolean;
  headerTitleToLookFor: string;
}

export const DEFAULT_SETTINGS: IndexerSettings = {
  headerTitleToLookFor: "## Content Index",
  insertAfterFirstHeader: true
};