import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import FieldSwitch from "src/fields/optional/fieldSwitch.vue";


let wrapper;

function createField2(data, methods) {
	const _wrapper = mount(FieldSwitch, {
		
		props: data,
		methods: methods
	});

	wrapper = _wrapper;

	return _wrapper;
}

describe("FieldSwitch.vue", () => {
	describe("check template", () => {
		let schema = {
			type: "switch",
			label: "Status",
			model: "status",
			autocomplete: "off",
			disabled: false,
			inputName: ""
		};
		let model = { status: true };
		let input;

		before(async () => {
			createField2({ schema, model, disabled: false });
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

		describe("check optional attribute", () => {
			let attributes = ["autocomplete", "disabled", "inputName"];

			attributes.forEach(name => {
				it("should set " + name, () => {
					checkAttribute(name, wrapper, schema);
				});
			});
		});

		it("should contain the default On/Off texts", async () => {
			let span = wrapper.find("span.label");
			expect(span.attributes()["data-on"]).to.be.equal("On");
			expect(span.attributes()["data-off"]).to.be.equal("Off");
		});

		it("should set disabled", async () => {
			wrapper.vm.disabled = true;
			await nextTick();

			expect(input.attributes().disabled).to.be.equal("disabled");

			wrapper.vm.disabled = false;
			await nextTick();
		});

		it("input value should be the model value after changed", async () => {
			model.status = false;
			await nextTick();
			expect(input.element.checked).to.be.false;
		});

		it("model value should be the input value if changed", async () => {
			input.element.checked = true;
			input.trigger("change");

			expect(model.status).to.be.true;
		});
	});

	describe("check template with custom On/Off texts", () => {
		let schema = {
			type: "switch",
			label: "Status",
			model: "status",
			textOn: "Yes",
			textOff: "No"
		};
		let model = { status: true };

		before(async () => {
			createField2({ schema, model, disabled: false });
		});

		it("check attributes", async () => {
			let span = wrapper.find("span.label");
			expect(span.attributes()["data-on"]).to.be.equal("Yes");
			expect(span.attributes()["data-off"]).to.be.equal("No");
		});
	});

	describe("check template with custom On/Off values", () => {
		let schema = {
			type: "switch",
			model: "sex",
			textOn: "Female",
			textOff: "Male",
			valueOn: "female",
			valueOff: "male"
		};
		let model = { sex: "female" };
		let input;

		before(async () => {
			createField2({ schema, model, disabled: false });
			input = wrapper.find("input");
		});

		it("check input value", async () => {
			expect(input.element.checked).to.be.true;
		});

		it("input value should be the model value after changed", async () => {
			model.sex = "male";
			await nextTick();

			expect(input.element.checked).to.be.false;
		});

		it("model value should be the input value if changed", async () => {
			input.element.checked = true;
			input.trigger("change");

			expect(model.sex).to.be.equal("female");
		});
	});
});
