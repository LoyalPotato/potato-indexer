import { assert } from "chai";
import { describe, it } from "mocha";
import { generateIndex } from "../indexSvc";
import { DEFAULT_SETTINGS, IndexerSettings } from "../settings/model";

describe("general", function () {
	it("should remain empty if no input", function () {
		const ret = generateIndex("", DEFAULT_SETTINGS);
		assert.equal(ret, "");
	});
});

// insert after header, default header
describe("default settings", function () {
	const ogNote = `
# Title one

## Title two

In the second one I am text`;

	it("should insert after the first header", function () {
		const genNote = generateIndex(ogNote, DEFAULT_SETTINGS);
		const expected = `
# Title one

## Content Index

- [Title one](#Title%20one)
	- [Title two](##Title%20two)

## Title two

In the second one I am text`;

		assert.equal(genNote, expected);
	});

	it("should update the existing TOC with ## Content Index", function () {
		const input = `
# Title one

## Content Index

- [Title one](#Title%20one)
	- [Title two](##Title%20two)

## Title two

In the second one I am text

# Post title
`;

		const genNote = generateIndex(input, DEFAULT_SETTINGS);
		const expected = `
# Title one

## Content Index

- [Title one](#Title%20one)
	- [Title two](##Title%20two)
- [Post title](#Post%20title)

## Title two

In the second one I am text

# Post title
`;

		assert.equal(genNote, expected);
	});
});

describe("insert after header false", function () {
	const settings: IndexerSettings = { ...DEFAULT_SETTINGS, insertAfterFirstHeader: false };

	const ogNote = `
# Title one

## Title two

In the second one I am text`;

	it("should insert at the start of the note", function () {
		const genNote = generateIndex(ogNote, settings);
		const expected = `## Content Index

- [Title one](#Title%20one)
	- [Title two](##Title%20two)

# Title one

## Title two

In the second one I am text`;

		assert.equal(genNote, expected);
	});

	it("should update the existing TOC with ## Content Index", function () {
		const input = `## Content Index

- [Title one](#Title%20one)
	- [Title two](##Title%20two)

# Title one

## Title two

In the second one I am text

# Post title
`;

		const genNote = generateIndex(input, settings);
		const expected = `## Content Index

- [Title one](#Title%20one)
	- [Title two](##Title%20two)
- [Post title](#Post%20title)

# Title one

## Title two

In the second one I am text

# Post title
`;

		assert.equal(genNote, expected);
	});
});

describe("custom header to look for", function () {
	const settings: IndexerSettings = { ...DEFAULT_SETTINGS, headerTitleToLookFor: "## Table of Contents" };

	const ogNote = `
# Title one

## Title two

In the second one I am text`;

	it("should insert after the first header", function () {
		const genNote = generateIndex(ogNote, settings);
		const expected = `
# Title one

## Table of Contents

- [Title one](#Title%20one)
	- [Title two](##Title%20two)

## Title two

In the second one I am text`;

		assert.equal(genNote, expected);
	});

	it("should update the existing TOC with ## Table of Contents", function () {
		const input = `
# Title one

## Table of Contents

- [Title one](#Title%20one)
	- [Title two](##Title%20two)

## Title two

In the second one I am text

# Post title
`;

		const genNote = generateIndex(input, settings);
		const expected = `
# Title one

## Table of Contents

- [Title one](#Title%20one)
	- [Title two](##Title%20two)
- [Post title](#Post%20title)

## Title two

In the second one I am text

# Post title
`;

		assert.equal(genNote, expected);
	});

});

describe("custom header to look for + insert after header false", function () {
	const settings: IndexerSettings = { insertAfterFirstHeader: false, headerTitleToLookFor: "## Table of Contents" };

	const ogNote = `
# Title one

## Title two

In the second one I am text`;

	it("should insert at the start of the note", function () {
		const genNote = generateIndex(ogNote, settings);
		const expected = `## Table of Contents

- [Title one](#Title%20one)
	- [Title two](##Title%20two)

# Title one

## Title two

In the second one I am text`;

		assert.equal(genNote, expected);
	});

	it("should update the existing TOC with ## Table of Contents", function () {
		const input = `## Table of Contents

- [Title one](#Title%20one)
	- [Title two](##Title%20two)

# Title one

## Title two

In the second one I am text

# Post title
`;

		const genNote = generateIndex(input, settings);
		const expected = `## Table of Contents

- [Title one](#Title%20one)
	- [Title two](##Title%20two)
- [Post title](#Post%20title)

# Title one

## Title two

In the second one I am text

# Post title
`;

		assert.equal(genNote, expected);
	});
});