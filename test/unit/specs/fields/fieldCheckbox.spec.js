import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import FieldCheckbox from "src/fields/core/fieldCheckbox.vue";


let wrapper;

function createField(data, methods) {
	const _wrapper = mount(FieldCheckbox, {
		
		props: data,
		methods: methods
	});

	wrapper = _wrapper;

	return _wrapper;
}

describe("FieldCheckbox.vue", () => {
	describe("check template", () => {
		let schema = {
			type: "checkbox",
			label: "Status",
			model: "status",
			fieldClasses: ["applied-class", "another-class"],
			autocomplete: "off",
			disabled: false,
			inputName: ""
		};
		let model = { status: true };
		let input;

		before(async () => {
			createField({ schema, model });
			input = wrapper.find("input");
		});

		it("should contain a checkbox element", async () => {
			expect(wrapper.exists()).to.be.true;
			expect(input.is("input")).to.be.true;
			expect(input.attributes().type).to.be.equal("checkbox");
		});

		it("should contain the value", async () => {
			expect(input.element.checked).to.be.true;
		});

		it("input value should be the model value after changed", async () => {
			model.status = false;
			await nextTick();

			expect(input.element.checked).to.be.false;
		});

		it.skip("model value should be the input value if changed", async () => {
			model.status = true;
			wrapper.trigger("click");
			await nextTick();

			expect(model.status).to.be.false;
		});

		it("should have 2 classes", async () => {
			expect(wrapper.classes()).to.include("applied-class");
			expect(wrapper.classes()).to.include("another-class");
		});

		describe("check optional attribute", () => {
			let attributes = ["autocomplete", "disabled", "inputName"];

			attributes.forEach(name => {
				it("should set " + name, () => {
					checkAttribute(name, wrapper, schema);
				});
			});
		});
	});

	describe("check dynamic html attributes", () => {
		describe("check input/wrapper attributes", () => {
			let schema = {
				type: "checkbox",
				label: "First Name",
				model: "user__model",
				inputName: "input_name",
				fieldClasses: ["applied-class", "another-class"],
				attributes: {
					wrapper: {
						"data-wrapper": "collapse"
					},
					input: {
						"data-input": "tooltip"
					}
				}
			};
			let model = {};
			let input;

			before(async () => {
				createField({ schema, model });
				input = wrapper.find("input");
			});

			it("input should have data-* attribute", async () => {
				expect(input.attributes()["data-input"]).to.be.equal("tooltip");
			});
		});

		describe("check non-specific attributes", () => {
			let schema = {
				type: "checkbox",
				label: "First Name",
				model: "user__model",
				inputName: "input_name",
				fieldClasses: ["applied-class", "another-class"],
				attributes: {
					"data-input": "tooltip"
				}
			};
			let model = {};
			let input;

			before(async () => {
				createField({ schema, model });
				input = wrapper.find("input");
			});

			it("input should have data-* attribute", async () => {
				expect(input.attributes()["data-input"]).to.be.equal("tooltip");
			});
		});
	});
});
