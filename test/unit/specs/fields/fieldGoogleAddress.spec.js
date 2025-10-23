import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import FieldGoogleAddress from "src/fields/optional/fieldGoogleAddress.vue";


let wrapper;

function createField2(data, methods) {
	const _wrapper = mount(FieldGoogleAddress, {
		
		props: data,
		methods: methods
	});

	wrapper = _wrapper;

	return _wrapper;
}

describe("fieldGoogleAddress.vue", () => {
	describe("check template", () => {
		let schema = {
			type: "text",
			label: "Address",
			model: "address",
			autocomplete: "off",
			disabled: false,
			placeholder: "",
			readonly: false,
			inputName: ""
		};
		let model = { address: "Paris, France" };
		let input;

		before(async () => {
			createField2({ schema, model, disabled: false });
			input = wrapper.find("input");
		});

		it("should contain an input text element", async () => {
			expect(wrapper.exists()).to.be.true;
			expect(input.exists()).to.be.true;
			expect(input.attributes().type).to.be.equal("text");
			expect(input.classes()).to.include("form-control");
		});

		it("should contain the value", async () => {
			expect(input.element.value).to.be.equal("Paris, France");
		});

		describe("check optional attribute", () => {
			let attributes = ["autocomplete", "disabled", "placeholder", "readonly", "inputName"];

			attributes.forEach(name => {
				it("should set " + name, () => {
					checkAttribute(name, wrapper, schema);
				});
			});
		});

		it("input value should be the model value after changed", async () => {
			model.address = "Rome, Italy";
			await nextTick();

			expect(input.element.value).to.be.equal("Rome, Italy");
		});

		it("model value should be the input value if changed", async () => {
			input.element.value = "Budapest, Hungary";
			input.trigger("input");
			await nextTick();

			expect(model.address).to.be.equal("Budapest, Hungary");
		});

		/*
			TODO:
				1. check HTML list if typing
				2. check geolocate called if input got focus
				3. check onPlaceChanged called
		 */
	});
});
