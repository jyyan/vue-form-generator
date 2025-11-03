import { get as objGet, forEach, isNil, isArray, isString, isFunction } from "lodash";

export default {
	methods: {
		// Get style classes of field
		getFieldRowClasses(field) {
			console.log("[formMixin.getFieldRowClasses] Processing field:", field);
			const hasErrors = this.fieldErrors(field).length > 0;

			// Ensure class names are primitive strings, not Proxy objects
			// Convert to String first to unwrap any Proxy objects, THEN apply fallback
			const errorClassRaw = objGet(this.options, "validationErrorClass", "error");
			const successClassRaw = objGet(this.options, "validationSuccessClass", "");
			const errorClass = String(errorClassRaw) || "error";
			const successClass = String(successClassRaw);

			let baseClasses = {
				disabled: this.fieldDisabled(field),
				readonly: this.fieldReadonly(field),
				featured: this.fieldFeatured(field),
				required: this.fieldRequired(field)
			};

			// Only add validation classes if they are non-empty strings
			if (errorClass) {
				baseClasses[errorClass] = hasErrors;
			}
			if (successClass) {
				baseClasses[successClass] = !hasErrors;
			}

			if (isArray(field.styleClasses)) {
				console.log("[formMixin.getFieldRowClasses] styleClasses is array:", field.styleClasses);
				forEach(field.styleClasses, c => {
					// Ensure c is a primitive string
					const className = (typeof c === "object") ? String(c) : c;
					console.log("[formMixin.getFieldRowClasses] Adding class:", className);
					baseClasses[className] = true;
				});
			} else if (isString(field.styleClasses)) {
				console.log("[formMixin.getFieldRowClasses] styleClasses is string:", field.styleClasses);
				baseClasses[field.styleClasses] = true;
			}

			if (!isNil(field.type)) {
				const fieldType = (typeof field.type === "object") ? String(field.type) : field.type;
				console.log("[formMixin.getFieldRowClasses] Adding field-type class:", "field-" + fieldType);
				baseClasses["field-" + fieldType] = true;
			}

			console.log("[formMixin.getFieldRowClasses] Returning baseClasses:", baseClasses);
			return baseClasses;
		},
		getFieldWrapClasses(field) {
			let baseClasses = {
			};

			if (isArray(field.fieldWarpClasses)) {
				forEach(field.fieldWarpClasses, c => {
					baseClasses[c] = true;
				});
			} else if (isString(field.fieldWarpClasses)) {
				baseClasses[field.fieldWarpClasses] = true;
			}

			if (!isNil(field.type)) {
				baseClasses["field-" + field.type] = true;
			}

			return baseClasses;
		},
		fieldErrors(field) {
			let res = this.errors.filter(e => e.field === field);
			return res.map(item => item.error);
		},
		// Get disabled attr of field
		fieldDisabled(field) {
			if (isFunction(field.disabled)) return field.disabled.call(this, this.model, field, this);

			if (isNil(field.disabled)) return false;

			return field.disabled;
		},
		// Get readonly prop of field
		fieldReadonly(field) {
			if (isFunction(field.readonly)) return field.readonly.call(this, this.model, field, this);

			if (isNil(field.readonly)) return false;

			return field.readonly;
		},
		// Get featured prop of field
		fieldFeatured(field) {
			if (isFunction(field.featured)) return field.featured.call(this, this.model, field, this);

			if (isNil(field.featured)) return false;

			return field.featured;
		},
		// Get required prop of field
		fieldRequired(field) {
			if (isFunction(field.required)) return field.required.call(this, this.model, field, this);

			if (isNil(field.required)) return false;

			return field.required;
		}
	}
};
