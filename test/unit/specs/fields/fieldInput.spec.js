import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import fieldInput from "src/fields/core/fieldInput.vue";

let wrapper;

function createField2(data, methods) {
	const _wrapper = mount(fieldInput, {
		props: data,
		methods: methods
	});

	wrapper = _wrapper;

	return _wrapper;
}

describe("fieldInput.vue", () => {
	describe("check template", () => {
		let schema = {
			type: "input",
			inputType: "text",
			label: "Name",
			model: "name",
			autocomplete: "off",
			disabled: false,
			placeholder: "",
			readonly: false,
			inputName: "",
			fieldClasses: ["applied-class", "another-class"]
		};
		let model = { name: "John Doe" };
		let input;

		before(async () => {
			createField2({ schema, model, disabled: false });
			input = wrapper.find("input");
		});

		it("should contain an input text element", async () => {
			expect(wrapper.exists()).to.be.true;
			expect(input.is("input")).to.be.true;
			expect(input.attributes().type).to.be.equal("text");
			expect(input.classes()).to.include("form-control");
		});

		it("should contain the value", async () => {
			expect(input.element.value).to.be.equal("John Doe");
		});

		let inputTypes = new Map([
			["text", ["autocomplete", "disabled", "placeholder", "readonly", "inputName"]],
			["password", ["autocomplete", "disabled", "placeholder", "readonly", "inputName"]],
			// ["checkbox", ["autocomplete", "disabled", "inputName"]],
			// ["radio", [] ],
			// ["button", [] ],
			// ["submit", [] ],
			// ["reset", [] ],
			// ["file", [] ],
			// ["hidden", [] ],
			// ["image", [] ],
			// ["datetime",  ],
			// ["datetime", ],
			// ["date", ],
			// ["month", ],
			// ["time", ],
			// ["week", ],
			["number", ["autocomplete", "disabled", "placeholder", "readonly", "inputName"]],
			// ["range", ["autocomplete"]],
			["email", ["autocomplete", "disabled", "placeholder", "readonly", "inputName"]],
			["url", ["autocomplete", "disabled", "placeholder", "readonly", "inputName"]],
			// ["search", ],
			["tel", ["autocomplete", "disabled", "placeholder", "readonly", "inputName"]]

			// TODO: re-implement this test
			// ["color", ["autocomplete", "inputName"]]
		]);
		for (let [inputType, attributes] of inputTypes) {
			describe("change type of input", () => {
				it("should become a " + inputType, async () => {
					schema.inputType = inputType;
					await nextTick();

					expect(input.attributes().type).to.be.equal(inputType);
				});

				describe("check optional attribute", () => {
					attributes.forEach(name => {
						it("should set " + name, () => {
							checkAttribute(name, wrapper, schema);
						});
					});
				});
			});
		}

		it("input value should be the model value after changed", async () => {
			model.name = "Jane Doe";
			await nextTick();

			expect(input.element.value).to.be.equal("Jane Doe");
		});

		it("model value should be the input value if changed", async () => {
			input.element.value = "John Smith";
			input.trigger("input");
			await nextTick();

			expect(model.name).to.be.equal("John Smith");
		});

		it("should have 2 classes", async () => {
			expect(input.classes()).to.include("applied-class");
			expect(input.classes()).to.include("another-class");
		});
	});

	describe("check dynamic html attributes", () => {
		describe("check input/wrapper attributes", () => {
			let schema = {
				type: "input",
				inputType: "text",
				label: "First Name",
				model: "user__model",
				inputName: "input_name",
				fieldClasses: ["applied-class", "another-class"],
				attributes: {
					wrapper: {
						"data-toggle": "collapse"
					},
					input: {
						"data-toggle": "tooltip"
					}
				}
			};
			let model = {};
			let input, wrap;

			before(async () => {
				createField2({ schema, model });
				input = wrapper.find("input");
				wrap = wrapper.find(".wrapper");
			});

			it("wrapper should have data-toggle attribute", async () => {
				expect(wrap.attributes()["data-toggle"]).to.be.equal("collapse");
			});

			it("input should have data-toggle attribute", async () => {
				expect(input.attributes()["data-toggle"]).to.be.equal("tooltip");
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
					"data-toggle": "tooltip"
				}
			};
			let model = {};
			let input;

			before(async () => {
				createField2({ schema, model });
				input = wrapper.find("input");
			});

			it("input should have data-toggle attribute", async () => {
				expect(input.attributes()["data-toggle"]).to.be.equal("tooltip");
			});
		});
	});
});
