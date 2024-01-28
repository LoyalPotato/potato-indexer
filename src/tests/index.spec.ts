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

    it("should ignore headers outside range", function () {
        const input = `
# Title one

######### Big title
`;
        const genNote = generateIndex(input, DEFAULT_SETTINGS);
        const expected = `
# Title one

## Content Index

- [Title one](#Title%20one)

######### Big title
`;
        assert.equal(genNote, expected);
    });

    it("should remain the same when running multiple times without changing", function () {
        const input = `
# Title one
I have content

## Content Index

- [Title one](#Title%20one)
	- [Title two](##Title%20two)

## Title two

In the second one I am text
`;

        const expected = `
# Title one
I have content

## Content Index

- [Title one](#Title%20one)
	- [Title two](##Title%20two)

## Title two

In the second one I am text
`;

        let genNote = generateIndex(input, DEFAULT_SETTINGS);

        assert.equal(genNote, expected);

        genNote = generateIndex(genNote, DEFAULT_SETTINGS);

        assert.equal(genNote, expected);
    });
});

describe("insert after header false", function () {
    const settings: IndexerSettings = {
        ...DEFAULT_SETTINGS,
        insertAfterFirstHeader: false,
    };

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
    const settings: IndexerSettings = {
        ...DEFAULT_SETTINGS,
        headerTitleToLookFor: "## Table of Contents",
    };

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
    const settings: IndexerSettings = {
        ...DEFAULT_SETTINGS,
        insertAfterFirstHeader: false,
        headerTitleToLookFor: "## Table of Contents",
    };

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

describe("custom min & max headers", function () {
    const settings: IndexerSettings = {
        ...DEFAULT_SETTINGS,
        minHeader: 2,
        maxHeader: 4,
    };

    it("should ignore headers outside custom range", function () {
        const input = `
# Title one

## Include me

### And include me

#### Aniki

######### Big title
`;
        const genNote = generateIndex(input, settings);
        const expected = `
# Title one

## Content Index

- [Include me](##Include%20me)
		- [And include me](###And%20include%20me)
			- [Aniki](####Aniki)

## Include me

### And include me

#### Aniki

######### Big title
`;
        assert.equal(genNote, expected);
    });
});

