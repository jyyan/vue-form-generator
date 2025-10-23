import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import FieldLabel from "src/fields/core/fieldLabel.vue";


let wrapper;

function createField2(data, methods) {
	const _wrapper = mount(FieldLabel, {
		
		props: data,
		methods: methods
	});

	wrapper = _wrapper;

	return _wrapper;
}

describe("fieldLabel.vue", () => {
	describe("check template", () => {
		let schema = {
			type: "label",
			label: "Timestamp",
			model: "timestamp",
			fieldClasses: ["applied-class", "another-class"]
		};
		let model = { timestamp: "2 days ago" };
		let span;

		before(async () => {
			createField2({ schema, model, disabled: false });
			span = wrapper.find("span");
		});

		it("should contain a span element", async () => {
			expect(wrapper.exists()).to.be.true;
			expect(span.is("span")).to.be.true;
		});

		it("should contain the value", async () => {
			expect(span.text()).to.be.equal("2 days ago");
		});

		it("input value should be the model value after changed", async () => {
			model.timestamp = "Foo bar";
			await nextTick();

			expect(span.text()).to.be.equal("Foo bar");
		});

		it("should have 2 classes", async () => {
			expect(span.classes()).to.include("applied-class");
			expect(span.classes()).to.include("another-class");
		});
	});

	describe("check dynamic html attributes", () => {
		describe("check label attributes", () => {
			let schema = {
				type: "label",
				model: "user__model",
				fieldClasses: ["applied-class", "another-class"],
				attributes: {
					label: {
						"data-label": "help-block"
					},
					wrapper: {
						"data-toggle": "collapse"
					},
					input: {
						"data-toggle": "tooltip"
					}
				}
			};
			let model = {};
			let label;

			before(async () => {
				createField2({ schema, model });
				label = wrapper.find("span");
			});

			it("label should have data-* attribute", async () => {
				expect(label.attributes()["data-label"]).to.be.equal("help-block");
			});
		});

		describe("check non-specific attributes", () => {
			let schema = {
				type: "input",
				inputType: "text",
				label: "First Name",
				model: "user__model",
				inputName: "input_name",
				fieldClasses: ["applied-class", "another-class"],
				attributes: {
					"data-label": "help-block",
					"data-wrapper": "collapse",
					"data-input": "tooltip"
				}
			};
			let model = {};
			let label;

			before(async () => {
				createField2({ schema, model });
				label = wrapper.find("span");
			});

			it("label should have data-* attribute", async () => {
				expect(label.attributes()["data-label"]).to.be.equal("help-block");
			});
		});
	});
});
