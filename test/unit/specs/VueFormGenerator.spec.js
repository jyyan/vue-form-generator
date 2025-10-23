import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import VueFormGenerator from "src/index";

let wrapper;
const defaultTemplate = `<vue-form-generator :schema="schema" :model="model" :options="options" :multiple="multiple" ref="form"></vue-form-generator>`;

function createFormGenerator(data, methods, template) {
	const Component = {
		template: template || defaultTemplate,
		data() {
			return data;
		},
		methods: methods
	};

	const _wrapper = mount(Component, {
		global: {
			plugins: [VueFormGenerator]
		}
	});
	wrapper = _wrapper;
	return _wrapper;
}

describe("VueFormGenerator.vue", () => {
	describe("with empty schema", () => {
		let schema = {
			fields: []
		};

		before(async () => {
			createFormGenerator({ schema });
		});

		it("should be create fieldset", async () => {
			const fieldset = wrapper.find("fieldset");
			expect(fieldset.exists()).to.be.true;
			expect(fieldset.is("fieldset")).to.be.true;
		});
	});

	describe("with empty schema and custom tag", () => {
		let schema = {
			fields: []
		};

		before(async () => {
			createFormGenerator(
				{ schema },
				undefined,
				`<vue-form-generator :schema="schema" ref="form" tag="section"></vue-form-generator>`
			);
		});

		it("should be create custom tag", async () => {
			const section = wrapper.find("section");
			expect(section.exists()).to.be.true;
			expect(section.is("section")).to.be.true;
		});
	});

	describe("check form-group classes", () => {
		let group;
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					readonly: false,
					featured: false,
					required: false,
					disabled: false
				}
			]
		};

		beforeEach(async () => {
			// Reset schema value
			schema = {
				fields: [
					{
						type: "input",
						inputType: "text",
						label: "Name",
						model: "name",
						readonly: false,
						featured: false,
						required: false,
						disabled: false
					}
				]
			};
			createFormGenerator({ schema });
			group = wrapper.find(".form-group");
		});

		it("should be minimal classes", async () => {
			expect(group.classes().length).to.be.equal(2);
			expect(group.classes()).to.include("form-group");
			expect(group.classes()).to.include("field-input");
		});

		it("should be featured class", async () => {
			wrapper.vm.schema.fields[0].featured = true;
			await nextTick();
			expect(group.classes()).to.include("featured");
		});

		it("should be readonly class", async () => {
			wrapper.vm.schema.fields[0].readonly = true;
			await nextTick();
			expect(group.classes()).to.include("readonly");
		});

		it("should be disabled class", async () => {
			wrapper.vm.schema.fields[0].disabled = true;
			await nextTick();
			expect(group.classes()).to.include("disabled");
		});

		it("should be required class", async () => {
			wrapper.vm.schema.fields[0].required = true;
			await nextTick();
			expect(group.classes()).to.include("required");
		});

		it("should be error class", async () => {
			wrapper.vm.$refs.form.errors.push({ field: wrapper.vm.schema.fields[0], error: "Validation error!" });
			await nextTick();
			expect(group.classes()).to.include("error");
		});

		describe("custom validation classes", () => {
			beforeEach(async () => {
				let options = {
					validationErrorClass: "has-error",
					validationSuccessClass: "has-success"
				};
				createFormGenerator({ schema, options: options });
				group = wrapper.find(".form-group");
			});

			it("error class", async () => {
				wrapper.vm.$refs.form.errors.push({ field: wrapper.vm.schema.fields[0], error: "Validation error!" });
				await nextTick();
				expect(group.classes()).to.include("has-error");
			});

			it("success class", async () => {
				wrapper.vm.$refs.form.errors = [];
				await nextTick();
				expect(group.classes()).to.include("has-success");
			});
		});

		it("should be add a custom classes", async () => {
			wrapper.vm.schema.fields[0].styleClasses = "classA";
			await nextTick();
			expect(group.classes()).to.include("classA");
		});

		it("should be add more custom classes", async () => {
			wrapper.vm.schema.fields[0].styleClasses = ["classB", "classC"];
			await nextTick();
			expect(group.classes()).to.include("classB");
			expect(group.classes()).to.include("classC");
		});
	});

	describe("check label classes", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					labelClasses: ["applied-class", "another-class"]
				}
			]
		};
		let label;

		before(async () => {
			createFormGenerator({ schema });
			label = wrapper.find("label");
		});

		it("should be 2 classes", async () => {
			expect(label.classes()).to.include("applied-class");
			expect(label.classes()).to.include("another-class");
		});
	});

	describe("check form row caption cell", () => {
		let group, label;
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					help: null
				}
			]
		};

		before(async () => {
			createFormGenerator({ schema });
			group = wrapper.find(".form-group");
			label = group.find("label");
		});

		it("should be text of cell is the name of field", async () => {
			expect(label.exists()).to.be.true;
			expect(label.text()).to.be.equal("Name");
		});

		it("should be a question icon if has helpText", async () => {
			wrapper.vm.schema.fields[0].help = "Sample help";
			await nextTick();
			let span = group.find(".help");
			expect(span.exists()).to.be.true;
			expect(span.find("i").exists()).to.be.true;
			expect(span.find(".helpText").exists()).to.be.true;
			expect(span.find(".helpText").text()).to.be.equal("Sample help");
		});
	});

	describe("check form row field cell", () => {
		let group; //, label;
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					hint: "Hint text",
					errors: [],
					placeholder: "User's name"
				}
			]
		};

		before(async () => {
			createFormGenerator({ schema });
			group = wrapper.find(".form-group");
		});

		it("should be a .field-wrap div", async () => {
			expect(group.find(".field-wrap").exists()).to.be.true;
		});

		it("should be a hint div if hint is not null", async () => {
			let hint = group.find(".hint");
			expect(hint.exists()).to.be.true;
			expect(hint.text()).to.be.equal("Hint text");
		});

		it("should be .errors div if there are errors in fields", async () => {
			wrapper.vm.$refs.form.errors.push({ field: wrapper.vm.schema.fields[0], error: "Some error!" });
			wrapper.vm.$refs.form.errors.push({ field: wrapper.vm.schema.fields[0], error: "Another error!" });
			await nextTick();
			let div = group.find(".errors");
			expect(div.exists()).to.be.true;
			let errors = div.findAll("span");
			expect(errors.at(0).text()).to.be.equal("Some error!");
			expect(errors.at(1).text()).to.be.equal("Another error!");
		});
	});

	describe("check computed fields if multiple is true", () => {
		let schema = {
			fields: [
				{ type: "input", inputType: "text", label: "name", model: "name", multi: false },
				{ type: "input", inputType: "text", label: "phone", model: "phone", multi: true },
				{ type: "input", inputType: "text", label: "email", model: "email" } // multi is undefined
			]
		};
		let form;

		before(async () => {
			createFormGenerator({ schema, multiple: true });
			form = wrapper.vm.$refs.form;
		});

		it("should render only phone field", async () => {
			expect(form.fields.length).to.be.equal(1);
			expect(wrapper.find(".form-group label").text()).to.be.equal("phone");
		});
	});

	describe("check fieldDisabled with function", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					disabled(model) {
						return !model.status;
					}
				}
			]
		};

		let model = {
			name: "John Doe",
			status: true
		};

		let input;

		before(async () => {
			createFormGenerator({ schema, model });
			input = wrapper.find("input");
		});

		it("should be enabled the name field", async () => {
			expect(input.attributes().disabled).to.be.undefined;
		});

		it("should be disabled the name field", async () => {
			wrapper.vm.model.status = false;
			await nextTick();
			expect(input.attributes().disabled).to.be.equal("disabled");
		});
	});

	describe("check fieldDisabled function parameters", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					disabled: sinon.spy()
				}
			]
		};

		let model = {
			name: "John Doe",
			status: true
		};

		before(async () => {
			createFormGenerator({ schema, model });
		});

		it("should be called with correct params", async () => {
			let spy = wrapper.vm.schema.fields[0].disabled;
			expect(spy.called).to.be.true;
			expect(spy.calledWith(model, wrapper.vm.schema.fields[0], wrapper.vm.$children[0].$children[0])).to.be.true;
		});
	});

	describe("check fieldDisabled with const", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					disabled: false
				}
			]
		};

		let model = { name: "John Doe" };

		let input;

		before(async () => {
			createFormGenerator({ schema, model });
			input = wrapper.find("input");
		});

		it("should be enabled the name field", async () => {
			expect(input.attributes().disabled).to.be.undefined;
		});

		it("should be disabled the name field", async () => {
			wrapper.vm.schema.fields[0].disabled = true;
			await nextTick();
			expect(input.attributes().disabled).to.be.equal("disabled");
		});
	});

	describe("check fieldReadonly with function", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					readonly(model) {
						return model.status;
					}
				}
			]
		};

		let model = {
			name: "John Doe",
			status: true
		};

		let group;

		before(async () => {
			createFormGenerator({ schema, model });
			group = wrapper.find(".form-group");
		});

		it("should be readonly", async () => {
			expect(group.classes()).to.include("readonly");
		});

		it("should be writable", async () => {
			wrapper.vm.model.status = false;
			await nextTick();
			expect(group.classes()).to.not.include("readonly");
		});
	});

	describe("check fieldHint with function", () => {
		let schema = {
			fields: [
				{
					type: "textArea",
					label: "Note",
					model: "note",
					max: 500,
					rows: 4,
					hint(model) {
						if (model && model.note) {
							return model.note.length + " of max 500 characters used!";
						}
					}
				}
			]
		};

		let model = {
			note: "John Doe"
		};

		before(async () => {
			createFormGenerator({ schema, model });
		});

		it("should be applay", async () => {
			expect(wrapper.find(".form-group .hint").text()).to.be.equal("8 of max 500 characters used!");
		});

		it("should be changed", async () => {
			model.note = "Dr. John Doe";
			await nextTick();
			expect(wrapper.find(".form-group .hint").text()).to.be.equal("12 of max 500 characters used!");
		});
	});

	describe("check fieldFeatured with function", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					featured(model) {
						return model.status;
					}
				}
			]
		};

		let model = {
			name: "John Doe",
			status: true
		};

		let group;

		before(async () => {
			createFormGenerator({ schema, model });
			group = wrapper.find(".form-group");
		});

		it("should be featured", async () => {
			expect(group.classes()).to.include("featured");
		});

		it("should not be featured", async () => {
			wrapper.vm.model.status = false;
			await nextTick();
			expect(group.classes()).to.not.include("featured");
		});
	});

	describe("check fieldRequired with function", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					required(model) {
						return model.status;
					}
				}
			]
		};

		let model = {
			name: "John Doe",
			status: true
		};

		let group;

		before(async () => {
			createFormGenerator({ schema, model });
			group = wrapper.find(".form-group");
		});

		it("should be required", async () => {
			expect(group.classes()).to.include("required");
		});

		it("should be optional", async () => {
			wrapper.vm.model.status = false;
			await nextTick();
			expect(group.classes()).to.not.include("required");
		});
	});

	describe("check fieldVisible with function", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					visible(model) {
						return model.status;
					}
				}
			]
		};

		let model = {
			name: "John Doe",
			status: true
		};

		before(async () => {
			createFormGenerator({ schema, model });
		});

		it("should be visible the name field", async () => {
			let input = wrapper.find("input[type=text]");
			expect(input.exists()).to.be.true;
		});

		it("should be hidden the name field", async () => {
			wrapper.vm.model.status = false;
			await nextTick();
			let input = wrapper.find("input[type=text]");
			expect(input.exists()).to.be.false;
		});
	});

	describe("check fieldVisible with const", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					visible: true
				}
			]
		};

		let model = { name: "John Doe" };

		before(async () => {
			createFormGenerator({ schema, model });
		});

		it("should be enabled the name field", async () => {
			let input = wrapper.find("input[type=text]");
			expect(input.exists()).to.be.true;
		});

		it("should be disabled the name field", async () => {
			wrapper.vm.schema.fields[0].visible = false;
			await nextTick();
			let input = wrapper.find("input[type=text]");
			expect(input.exists()).to.be.false;
		});
	});

	describe("check validate", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					min: 3,
					validator: VueFormGenerator.validators.string
				}
			]
		};

		let model = { name: "John Doe" };
		let form;

		before(async () => {
			createFormGenerator({ schema, model });
			form = wrapper.vm.$refs.form;
		});

		it("should empty the errors", async () => {
			expect(form.validate()).to.be.true;
			expect(form.errors).to.be.length(0);
		});

		it("should give a validation error", async () => {
			wrapper.vm.model.name = "Ab";
			expect(form.validate()).to.be.false;
			expect(form.errors).to.be.length(1);
		});

		it("should no validation error", async () => {
			wrapper.vm.model.name = "Abc";
			expect(form.validate()).to.be.true;
			expect(form.errors).to.be.length(0);
		});
	});

	describe("check validate with validator as string instead of object", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					min: 3,
					validator: "string"
				}
			]
		};

		let model = { name: "John Doe" };
		let form;

		before(async () => {
			createFormGenerator({ schema, model });
			form = wrapper.vm.$refs.form;
		});

		it("should empty the errors", async () => {
			expect(form.validate()).to.be.true;
			expect(form.errors).to.be.length(0);
		});

		it("should give a validation error", async () => {
			wrapper.vm.model.name = "Ab";
			expect(form.validate()).to.be.false;
			expect(form.errors).to.be.length(1);
		});

		it("should no validation error", async () => {
			wrapper.vm.model.name = "Abc";
			expect(form.validate()).to.be.true;
			expect(form.errors).to.be.length(0);
		});
	});

	describe("check if option null", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name"
				}
			]
		};

		let model = { name: "Me" };
		let form;

		before(async () => {
			createFormGenerator({ schema, model });
			form = wrapper.vm.$refs.form;
		});

		it("should be validation error at ready()", async () => {
			expect(form).to.not.be.undefined;
			expect(form.options).to.not.be.undefined;
		});
	});

	describe("check validateAfterLoad option", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					min: 3,
					validator: VueFormGenerator.validators.string
				}
			]
		};

		let model = { name: "Me" };
		let form;

		before(async () => {
			createFormGenerator({ schema, model, options: { validateAfterLoad: true } });
			await nextTick();
		});

		it("should be validation error at mounted()", async () => {
			form = wrapper.vm.$refs.form;
			expect(form.errors).to.be.length(1);
		});

		it("should be validation error if model is changed", async () => {
			form.model = { name: "Al" };
			await nextTick();
			expect(form.errors).to.be.length(1);
		});

		it("should be no errors if model is correct", done => {
			form.model = { name: "Bob" };
			setTimeout(() => {
				expect(form.errors).to.be.length(0);
				done();
			}, 10);
		});

		it("should be no errors if validateAfterLoad is false", done => {
			form.options.validateAfterLoad = false;
			form.model = { name: "Ed" };
			setTimeout(() => {
				expect(form.errors).to.be.length(0);
				done();
			}, 10);
		});
	});

	describe("check onValidated event", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					min: 3,
					validator: ["string"]
				}
			]
		};

		let model = { name: "Bob" };
		let form;
		let onValidated = sinon.spy();

		beforeEach(async () => {
			createFormGenerator(
				{ schema, model },
				{ onValidated: onValidated },
				`<vue-form-generator :schema="schema" :model="model" :options="options" :multiple="false" ref="form" @validated="onValidated"></vue-form-generator>`
			);
			form = wrapper.vm.$refs.form;
		});

		it("should no errors after mounted()", async () => {
			expect(form.errors).to.be.length(0);
		});

		it.skip("should be validation error if model value is not valid", async () => {
			wrapper.vm.model.name = "A";
			onValidated.resetHistory();
			form.validate();

			expect(form.errors).to.be.length(1);
			expect(onValidated.callCount).to.be.equal(1);
			expect(
				onValidated.calledWith(false, [
					{
						field: schema.fields[0],
						error: "The length of text is too small! Current: 1, Minimum: 3"
					}
				])
			).to.be.true;
		});

		it("should no validation error if model valie is valid", async () => {
			wrapper.vm.model.name = "Alan";
			onValidated.resetHistory();
			form.validate();

			expect(form.errors).to.be.length(0);
			expect(onValidated.callCount).to.be.equal(1);
			expect(onValidated.calledWith(true, [])).to.be.true;
		});
	});

	describe("check schema.onChanged when the model changed", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					onChanged: sinon.spy()
				}
			]
		};

		let model = { name: "Me" };
		let form;

		before(async () => {
			createFormGenerator({ schema, model });
			form = wrapper.vm.$refs.form;
		});

		it("should NOT called the schema.onChanged", async () => {
			schema.fields[0].onChanged.resetHistory();
			form.model = { name: "Bob" };
			expect(schema.fields[0].onChanged.called).to.be.false;
		});
	});

	describe("check onFieldValidated method if child validate", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					min: 3,
					validator: ["string"]
				},
				{
					type: "input",
					inputType: "text",
					label: "City",
					model: "city",
					validator() {
						return "Validation error!";
					}
				}
			]
		};

		let model = { name: "Bob" };
		let form;
		let field;
		let onValidated = sinon.spy();

		before(async () => {
			createFormGenerator(
				{ schema, model },
				{ onValidated: onValidated },
				`<vue-form-generator :schema="schema" :model="model" :options="options" :multiple="false" ref="form" @validated="onValidated"></vue-form-generator>`
			);
			form = wrapper.vm.$refs.form;
			field = form.$children[0];
		});

		it("should no errors after mounted()", done => {
			wrapper.vm.$nextTick(() => {
				expect(form.errors).to.be.length(0);
				done();
			});
		});

		it.skip("should be validation error if model value is not valid", async () => {
			onValidated.resetHistory();
			wrapper.vm.model.name = "A";
			field.validate();

			expect(form.errors).to.be.length(1);
			expect(onValidated.callCount).to.be.equal(1);
			expect(
				onValidated.calledWith(false, [
					{
						field: schema.fields[0],
						error: "The length of text is too small! Current: 1, Minimum: 3"
					}
				])
			).to.be.true;
		});

		it.skip("should be 2 validation error", async () => {
			form.$children[1].validate();
			expect(form.errors).to.be.length(2);
			expect(form.errors[0].error).to.be.equal("The length of text is too small! Current: 1, Minimum: 3");
			expect(form.errors[1].error).to.be.equal("Validation error!");
		});

		it.skip("should only other field validation error", async () => {
			wrapper.vm.model.name = "Alan";
			onValidated.resetHistory();
			field.validate();

			expect(form.errors).to.be.length(1);
			expect(onValidated.callCount).to.be.equal(1);
			expect(onValidated.calledWith(false, [{ field: schema.fields[1], error: "Validation error!" }])).to.be.true;
		});
	});

	describe("check async validator", () => {
		let schema = {
			fields: [
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					validator(value) {
						return new Promise(resolve => {
							setTimeout(() => {
								if (value.length >= 3) {
									resolve();
								} else {
									resolve(["Invalid name"]);
								}
							}, 10);
						});
					}
				}
			]
		};

		let model = { name: "Bob" };
		let form;
		let field;
		let onValidated = sinon.spy();

		before(async () => {
			createFormGenerator(
				{ schema, model },
				{ onValidated: onValidated },
				`<vue-form-generator :schema="schema" :model="model" :options="options" :multiple="false" ref="form" @validated="onValidated"></vue-form-generator>`
			);
			form = wrapper.vm.$refs.form;
			field = form.$children[0].$children[0];
		});

		it("should no errors after mounted()", done => {
			wrapper.vm.$nextTick(() => {
				expect(form.errors).to.be.length(0);
				done();
			});
		});

		it("should be validation error if model value is not valid", done => {
			onValidated.resetHistory();
			wrapper.vm.model.name = "A";
			field.validate();

			setTimeout(() => {
				expect(form.errors).to.be.length(1);
				expect(onValidated.calledWith(false, [{ field: schema.fields[0], error: "Invalid name" }])).to.be.true;

				done();
			}, 15);
		});
	});
});
