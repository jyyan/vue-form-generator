import { get, set, each, isObject, isArray, isFunction, cloneDeep } from "lodash";

// Create a new model by schema default values
const createDefaultObject = (schema, obj = {}) => {
	each(schema.fields, field => {
		if (get(obj, field.model) === undefined && field.default !== undefined) {
			if (isFunction(field.default)) {
				set(obj, field.model, field.default(field, schema, obj));
			} else if (isObject(field.default) || isArray(field.default)) {
				set(obj, field.model, cloneDeep(field.default));
			} else set(obj, field.model, field.default);
		}
	});
	return obj;
};

// Get a new model which contains only properties of multi-edit fields
const getMultipleFields = schema => {
	let res = [];
	each(schema.fields, field => {
		if (field.multi === true) res.push(field);
	});

	return res;
};

// Merge many models to one 'work model' by schema
const mergeMultiObjectFields = (schema, objs) => {
	let model = {};

	let fields = getMultipleFields(schema);

	each(fields, field => {
		let mergedValue;
		let notSet = true;
		let path = field.model;

		each(objs, obj => {
			let v = get(obj, path);
			if (notSet) {
				mergedValue = v;
				notSet = false;
			} else if (mergedValue !== v) {
				mergedValue = undefined;
			}
		});

		set(model, path, mergedValue);
	});

	return model;
};

/**
 * Simple hash function for non-ASCII strings
 * @param {string} str - The string to hash
 * @returns {string} - A hexadecimal hash string
 */
const simpleHash = (str) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash).toString(36); // Convert to base36 for shorter string
};

const slugifyFormID = (schema, prefix = "") => {
	// Try to get a reasonable default id from the schema,
	// then slugify it.
	if (typeof schema.id !== "undefined") {
		// If an ID's been explicitly set, use it unchanged
		return prefix + schema.id;
	} else {
		const originalStr = (schema.inputName || schema.label || schema.model || "").toString().trim();

		// Check if string contains non-ASCII characters
		// eslint-disable-next-line no-control-regex
		const hasNonAscii = /[^\u0000-\u007F]/.test(originalStr);

		let slugified = originalStr
			.toLowerCase()
			// Spaces & underscores to dashes
			.replace(/ |_/g, "-")
			// Multiple dashes to one
			.replace(/-{2,}/g, "-")
			// Remove leading & trailing dashes
			.replace(/^-+|-+$/g, "");

		if (hasNonAscii) {
			// Extract ASCII and non-ASCII parts
			const asciiPart = slugified.replace(/[^a-zA-Z0-9-]/g, "");
			// eslint-disable-next-line no-control-regex
			const nonAsciiPart = slugified.replace(/[\u0000-\u007F]/g, "");

			// Generate hash for non-ASCII characters
			const hash = simpleHash(nonAsciiPart);

			// Combine ASCII part with hash
			// If ASCII part exists, use it as prefix; otherwise just use hash
			if (asciiPart) {
				slugified = asciiPart + "-" + hash;
			} else {
				slugified = "field-" + hash;
			}
		} else {
			// For pure ASCII strings, remove non-alphanumeric characters except dashes
			slugified = slugified.replace(/([^a-zA-Z0-9-]+)/g, "");
		}

		// Clean up any remaining issues
		slugified = slugified
			.replace(/-{2,}/g, "-")
			.replace(/^-+|-+$/g, "");

		return prefix + slugified;
	}
};

const slugify = (name = "") => {
	// Return the slugified version of either:
	return (
		name
			// NB: This is a very simple, conservative, slugify function,
			// avoiding extra dependencies.
			.toString()
			.trim()
			// .toLowerCase()
			// Spaces to dashes
			.replace(/ /g, "-")
			// Multiple dashes to one
			.replace(/-{2,}/g, "-")
			// Remove leading & trailing dashes
			.replace(/^-+|-+$/g, "")
			// Remove anything that isn't a (English/ASCII) letter, number or dash.
			.replace(/([^a-zA-Z0-9-_/./:]+)/g, "")
	);
};

export { createDefaultObject, getMultipleFields, mergeMultiObjectFields, slugifyFormID, slugify };
