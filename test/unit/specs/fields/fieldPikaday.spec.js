import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import fecha from "fecha";

import FieldPikaday from "src/fields/optional/fieldPikaday.vue";

let Pikaday = require("pikaday");
window.Pikaday = Pikaday;


let wrapper;

function createField2(data, methods) {
	const _wrapper = mount(FieldPikaday, {
		
		props: data,
		methods: methods
	});

	wrapper = _wrapper;

	return _wrapper;
}

describe("fieldPikaday.vue", () => {
	describe("check template", () => {
		let schema = {
			type: "dateTime",
			label: "Event",
			model: "event",
			autocomplete: "off",
			disabled: false,
			placeholder: "",
			readonly: false,
			inputName: ""
		};
		let model = { event: 1462799081231 };
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
			expect(input.element.value).to.be.equal(fecha.format(new Date(1462799081231), "YYYY-MM-DD"));
		});

		describe("check optional attribute", () => {
			let attributes = ["autocomplete", "disabled", "placeholder", "readonly", "inputName"];

			attributes.forEach(name => {
				it("should set " + name, () => {
					checkAttribute(name, input, schema);
				});
			});
		});

		it("input value should be the model value after changed", async () => {
			model.event = 1234567890123;
			await nextTick();
			expect(input.element.value).to.be.equal(fecha.format(new Date(1234567890123), "YYYY-MM-DD"));
		});

		it.skip("model value should be the input value if changed", async () => {
			let day = fecha.format(new Date(1420070400000), "YYYY-MM-DD");
			wrapper.vm.picker.setDate(day);
			// await nextTick();
			// expect(input.element.value).to.be.equal(day);
			// expect(fecha.format(new Date(model.event), "YYYY-MM-DD")).to.be.equal(day);
		});
	});
});
