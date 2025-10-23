import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import fieldNoUiSlider from "src/fields/optional/fieldNoUiSlider.vue";

let noUiSlider = require("nouislider");
window.noUiSlider = noUiSlider;


let wrapper;

function createField2(data, methods) {
	const _wrapper = mount(fieldNoUiSlider, {
		
		props: data,
		methods: methods
	});

	wrapper = _wrapper;

	return _wrapper;
}

describe("fieldNoUiSlider.vue", () => {
	describe("check template", () => {
		let schema = {
			type: "noUiSlider",
			label: "Rating",
			model: "rating",
			min: 1,
			max: 10
		};
		let model = { rating: 8 };
		let input;

		before(async () => {
			createField2({ schema, model, disabled: false });
			input = wrapper.find(".slider");
		});

		it("should contain a div element", async () => {
			expect(wrapper.exists()).to.be.true;
			expect(input.is("div")).to.be.true;
			expect(input.classes()).to.include("slider");
		});

		it("should contain an handle element", async () => {
			let handle = input.find(".noUi-handle");

			expect(handle.exists()).to.be.true;
			expect(input.classes()).to.include("noUi-target");
		});

		it("should contain the value", async () => {
			let origin = input.find(".noUi-origin");
			await nextTick();

			expect(origin.element.style.getPropertyValue("transform")).to.be.equal("translate(-22.22222222222223%, 0)");
		});

		it("handle value should be the model value after changed", async () => {
			model.rating = 10;
			await nextTick();
			let origin = input.find(".noUi-origin");

			expect(origin.element.style.getPropertyValue("transform")).to.be.equal("translate(0%, 0)");
		});

		it.skip("model value should be the handle value after changed", async () => {
			wrapper.vm.onChange(3);
			await nextTick();

			expect(model.rating).to.be.equal(3);
		});

		it("should set disabled", async () => {
			wrapper.vm.disabled = true;
			await nextTick();

			expect(wrapper.attributes().disabled).to.be.equal("disabled");
		});
	});
});
