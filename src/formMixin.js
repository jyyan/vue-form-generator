import { get as objGet, forEach, isNil, isArray, isString, isFunction } from "lodash";
import { toRaw } from "vue";

// Helper function to safely get raw value from potential Proxy
function getRawValue(value) {
	if (value != null && typeof value === "object") {
		return toRaw(value);
	}
	return value;
}

export default {
	methods: {
		// Get style classes of field
		getFieldRowClasses(field) {
			const rawField = getRawValue(field);
			const hasErrors = this.fieldErrors(rawField).length > 0;
			let baseClasses = {
				[objGet(this.options, "validationErrorClass", "error")]: hasErrors,
				[objGet(this.options, "validationSuccessClass", "valid")]: !hasErrors,
				disabled: this.fieldDisabled(rawField),
				readonly: this.fieldReadonly(rawField),
				featured: this.fieldFeatured(rawField),
				required: this.fieldRequired(rawField)
			};

			const styleClasses = getRawValue(rawField.styleClasses);
			if (isArray(styleClasses)) {
				forEach(styleClasses, c => {
					const rawC = getRawValue(c);
					baseClasses[rawC] = true;
				});
			} else if (isString(styleClasses)) {
				baseClasses[styleClasses] = true;
			}

			const fieldType = getRawValue(rawField.type);
			if (!isNil(fieldType)) {
				baseClasses["field-" + fieldType] = true;
			}

			return baseClasses;
		},
		getFieldWrapClasses(field) {
			const rawField = getRawValue(field);
			// const hasErrors = this.fieldErrors(rawField).length > 0;
			let baseClasses = {
			};

			const fieldWarpClasses = getRawValue(rawField.fieldWarpClasses);
			if (isArray(fieldWarpClasses)) {
				forEach(fieldWarpClasses, c => {
					const rawC = getRawValue(c);
					baseClasses[rawC] = true;
				});
			} else if (isString(fieldWarpClasses)) {
				baseClasses[fieldWarpClasses] = true;
			}

			const fieldType = getRawValue(rawField.type);
			if (!isNil(fieldType)) {
				baseClasses["field-" + fieldType] = true;
			}

			return baseClasses;
		},
		fieldErrors(field) {
			let res = this.errors.filter(e => e.field === field);
			return res.map(item => item.error);
		},
		// Get disabled attr of field
		fieldDisabled(field) {
			const rawField = getRawValue(field);
			const disabled = getRawValue(rawField.disabled);
			if (isFunction(disabled)) return disabled.call(this, this.model, rawField, this);

			if (isNil(disabled)) return false;

			return disabled;
		},
		// Get readonly prop of field
		fieldReadonly(field) {
			const rawField = getRawValue(field);
			const readonly = getRawValue(rawField.readonly);
			if (isFunction(readonly)) return readonly.call(this, this.model, rawField, this);

			if (isNil(readonly)) return false;

			return readonly;
		},
		// Get featured prop of field
		fieldFeatured(field) {
			const rawField = getRawValue(field);
			const featured = getRawValue(rawField.featured);
			if (isFunction(featured)) return featured.call(this, this.model, rawField, this);

			if (isNil(featured)) return false;

			return featured;
		},
		// Get required prop of field
		fieldRequired(field) {
			const rawField = getRawValue(field);
			const required = getRawValue(rawField.required);
			if (isFunction(required)) return required.call(this, this.model, rawField, this);

			if (isNil(required)) return false;

			return required;
		}
	}
};
