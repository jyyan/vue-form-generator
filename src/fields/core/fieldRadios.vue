<template lang="pug">
	.radio-list(:disabled="disabled", v-attributes="'wrapper'")
		label(v-for="item in items", :class="getItemCssClasses(item)", v-attributes="'label'")
			input(:id="getFieldID(schema, true)", type="radio", :disabled="isItemDisabled(item)", :name="id", @click="onSelection(item)", :value="getItemValue(item)", :checked="isItemChecked(item)", :class="fieldClasses", :required="schema.required", v-attributes="'input'")
			| {{ getItemName(item) }}

</template>

<script>
import { isObject, isFunction, get as objGet } from "lodash";
import abstractField from "../abstractField";

export default {
	mixins: [abstractField],

	computed: {
		items() {
			let values = this.schema.values;
			if (typeof values == "function") {
				return values.apply(this, [this.model, this.schema]);
			} else {
				// Debug logging
				if (values && values.length > 0) {
					console.log("[fieldRadios.items] schema.values:", values, "first item:", values[0], "constructor:", values[0]?.constructor.name);
				}
				return values;
			}
		},
		id() {
			return this.schema.model;
		}
	},

	methods: {
		getItemValue(item) {
			let result;
			if (isObject(item)) {
				if (typeof this.schema["radiosOptions"] !== "undefined" && typeof this.schema["radiosOptions"]["value"] !== "undefined") {
					result = item[this.schema.radiosOptions.value];
				} else {
					if (typeof item["value"] !== "undefined") {
						result = item.value;
					} else {
						throw "`value` is not defined. If you want to use another key name, add a `value` property under `radiosOptions` in the schema. https://icebob.gitbooks.io/vueformgenerator/content/fields/radios.html#radios-field-with-object-values";
					}
				}
			} else {
				result = item;
			}
			// Debug logging
			if (result != null && typeof result === "object") {
				console.log("[fieldRadios.getItemValue] Detected object result:", result, "constructor:", result.constructor.name);
			}
			// Ensure result is a primitive value for DOM attributes
			return (result != null && typeof result === "object") ? String(result) : result;
		},
		getItemName(item) {
			let result;
			if (isObject(item)) {
				if (typeof this.schema["radiosOptions"] !== "undefined" && typeof this.schema["radiosOptions"]["name"] !== "undefined") {
					result = item[this.schema.radiosOptions.name];
				} else {
					if (typeof item["name"] !== "undefined") {
						result = item.name;
					} else {
						throw "`name` is not defined. If you want to use another key name, add a `name` property under `radiosOptions` in the schema. https://icebob.gitbooks.io/vueformgenerator/content/fields/radios.html#radios-field-with-object-values";
					}
				}
			} else {
				result = item;
			}
			// Debug logging
			if (result != null && typeof result === "object") {
				console.log("[fieldRadios.getItemName] Detected object result:", result, "constructor:", result.constructor.name);
			}
			// Ensure result is a primitive value for display
			return (result != null && typeof result === "object") ? String(result) : result;
		},
		getItemCssClasses(item) {
			return {
				"is-checked": this.isItemChecked(item),
				"is-disabled": this.isItemDisabled(item)
			};
		},
		onSelection(item) {
			this.value = this.getItemValue(item);
		},
		isItemChecked(item) {
			let currentValue = this.getItemValue(item);
			return currentValue === this.value;
		},
		isItemDisabled(item) {
			if (this.disabled) {
				return true;
			}
			let disabled = objGet(item, "disabled", false);
			if (isFunction(disabled)) {
				return disabled(this.model);
			}
			return disabled;
		}
	}
};
</script>

<style lang="scss">
.vue-form-generator .field-radios {
	.radio-list {
		label {
			display: block;
			input[type="radio"] {
				margin-right: 5px;
			}
		}
	}
}
</style>
