const component = require("./formGenerator.vue").default;
const schema = require("./utils/schema.js");
const validators = require("./utils/validators.js").default;
const fieldComponents = require("./utils/fieldsLoader").default;
const abstractField = require("./fields/abstractField").default;

const install = (app, options) => {
	app.component("VueFormGenerator", component);
	if (options && options.validators) {
		for (let key in options.validators) {
			if ({}.hasOwnProperty.call(options.validators, key)) {
				validators[key] = options.validators[key];
			}
		}
	}
};

const plugin = {
	component,
	schema,
	validators,
	abstractField,
	fieldComponents,
	install
};

// Export as default for Vue 3
export default plugin;

// Also export individual parts for named imports
export { component, schema, validators, abstractField, fieldComponents, install };
