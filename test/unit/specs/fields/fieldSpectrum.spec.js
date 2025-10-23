import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import FieldSpectrum from "src/fields/optional/fieldSpectrum.vue";


let wrapper;
let input;

function createField2(data, methods) {
	const _wrapper = mount(FieldSpectrum, {
		
		props: data,
		methods: methods
	});

	wrapper = _wrapper;
	input = wrapper.find("input");

	return _wrapper;
}

describe("fieldSpectrum.vue", () => {
	describe("check template", () => {
		let schema = {
			type: "color",
			label: "Color",
			model: "color",
			autocomplete: "off",
			disabled: false,
			placeholder: "",
			readonly: false,
			inputName: ""
		};
		let model = { color: "#ff8822" };

		before(async () => {
			createField2({ schema, model, disabled: false });
		});

		it("should contain an input color element", async () => {
			expect(wrapper.exists()).to.be.true;
			expect(input.is("input")).to.be.true;
			expect(input.attributes().type).to.be.equal("text");
		});

		it.skip("should contain the value", async () => {
			expect(wrapper.vm.picker.spectrum("get").toHexString()).to.be.equal("#ff8822");
		});

		describe("check optional attribute", () => {
			let attributes = ["autocomplete", "disabled", "placeholder", "readonly", "inputName"];

			attributes.forEach(name => {
				it("should set " + name, () => {
					checkAttribute(name, wrapper, schema);
				});
			});
		});

		it.skip("input value should be the model value after changed", async () => {
			model.color = "#ffff00";
			await nextTick();

			expect(wrapper.vm.picker.spectrum("get").toHexString()).to.be.equal("#ffff00");
		});

		it.skip("model value should be the input value if changed", async () => {
			wrapper.vm.picker.spectrum("set", "#123456");
			wrapper.find(".sp-input").trigger("change");

			expect(model.color).to.be.equal("#123456");
		});
	});
});
