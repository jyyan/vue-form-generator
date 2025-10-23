import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import FieldTextArea from "src/fields/core/fieldTextArea.vue";


let wrapper;

function createField2(data, methods) {
	const _wrapper = mount(FieldTextArea, {
		
		props: data,
		methods: methods
	});

	wrapper = _wrapper;

	return _wrapper;
}

describe("fieldTextArea.vue", () => {
	describe("check template", () => {
		let schema = {
			type: "textarea",
			label: "Description",
			model: "desc",
			max: 500,
			disabled: false,
			placeholder: "",
			readonly: false,
			inputName: "",
			fieldClasses: ["applied-class", "another-class"]
		};
		let model = { desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." };
		let input;

		before(async () => {
			createField2({ schema, model, disabled: false });
			input = wrapper.find("textarea");
		});

		it("should contain a textarea element", async () => {
			expect(wrapper.exists()).to.be.true;
			expect(input.is("textarea")).to.be.true;
			expect(input.classes()).to.include("form-control");
			expect(input.attributes().rows).to.be.equal("2"); // default value is 2
			expect(input.attributes().maxlength).to.be.equal("500");
		});

		it("should change rows to 4", async () => {
			schema.rows = 4;
			await nextTick();

			expect(input.attributes().rows).to.be.equal("4");
		});

		it("should contain the value", async () => {
			expect(input.element.value).to.be.equal(model.desc);
		});

		describe("check optional attribute", () => {
			let attributes = ["disabled", "placeholder", "readonly", "inputName"];

			attributes.forEach(name => {
				it("should set " + name, () => {
					checkAttribute(name, wrapper, schema, "textarea");
				});
			});
		});

		it("input value should be the model value after changed", async () => {
			model.desc = "Jane Doe";
			await nextTick();

			expect(input.element.value).to.be.equal("Jane Doe");
		});

		it("model value should be the input value if changed", async () => {
			input.element.value = "John Smith";
			input.trigger("input");

			expect(model.desc).to.be.equal("John Smith");
		});

		it("should have 2 classes", async () => {
			expect(input.classes()).to.include("applied-class");
			expect(input.classes()).to.include("another-class");
		});
	});
});
