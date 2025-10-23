import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import FieldSelectEx from "src/fields/optional/fieldSelectEx.vue";


let wrapper;
let input;

function createField2(data, methods) {
	const _wrapper = mount(FieldSelectEx, {
		
		props: data,
		methods: methods
	});

	wrapper = _wrapper;
	input = wrapper.find("select");

	return _wrapper;
}

describe("fieldSelectEx.vue", () => {
	describe("check template", () => {
		let schema = {
			type: "selectEx",
			label: "Cities",
			model: "city",
			disabled: false,
			multiSelect: false,
			required: false,
			inputName: "",
			values: ["London", "Paris", "Rome", "Berlin"]
		};
		let model = { city: "Paris" };

		before(async () => {
			createField2({ schema, model, disabled: false });
		});

		it("should contain a select element", async () => {
			expect(wrapper.exists()).to.be.true;
			expect(input.exists()).to.be.true;
		});

		it("should contain option elements", async () => {
			let options = input.findAll("option");

			expect(options.length).to.be.equal(4 + 1); // +1 for <non selected>
			expect(options.at(2).element.value).to.be.equal("Paris");
			expect(options.at(2).text()).to.be.equal("Paris");
			expect(options.at(2).element.selected).to.be.true;
		});

		it("should contain a <non selected> element", async () => {
			let options = input.findAll("option");

			expect(options.at(0).attributes().disabled).to.be.undefined;
			// expect(options.at(0).text()).to.be.equal("<Not selected>");
		});

		it("should contain the value", async () => {
			expect(input.element.value).to.be.equal("Paris");
		});

		describe("check optional attribute", () => {
			let attributes = ["disabled", "multiSelect", "inputName"];

			attributes.forEach(name => {
				it("should set " + name, () => {
					checkAttribute(name, wrapper, schema, "select");
				});
			});
		});

		it("input value should be the model value after changed", async () => {
			model.city = "Rome";
			await nextTick();

			expect(input.element.value).to.be.equal("Rome");
		});

		it("model value should be the input value if changed", async () => {
			input.element.value = "London";
			input.trigger("change");

			expect(model.city).to.be.equal("London");
		});

		it.skip("should not be multiple", async () => {
			model.city = []; // For multiselect need empty array
			schema.multiSelect = true;
			await nextTick();

			expect(input.attributes().multiple).to.equal("multiple");
			let options = input.findAll("option");
			console.log(options.at(0).html());
			console.log(options.at(1).html());
			console.log(options.at(2).html());
			console.log(options.at(3).html());
			console.log(options.at(4).html());

			expect(options.length).to.be.equal(4); // no <non selected>
		});
	});

	describe("check static values with { id, name } objects", () => {
		let schema = {
			type: "select",
			label: "Cities",
			model: "city",
			values: [
				{ id: 1, name: "London" },
				{ id: 2, name: "Paris" },
				{ id: 3, name: "Rome" },
				{ id: 4, name: "Berlin" }
			]
		};
		let model = { city: [2] };

		before(async () => {
			createField2({ schema, model, disabled: false });
		});

		it.skip("should contain option elements", async () => {
			let options = input.findAll("option");

			expect(options.length).to.be.equal(4 + 1); // +1 for <non selected>
			expect(options.at(2).element.value).to.be.equal("2");
			expect(options.at(2).text()).to.be.equal("Paris");
			expect(options.at(2).element.selected).to.be.true;
			expect(options.at(1).element.selected).to.be.false;
		});

		it.skip("should contain the value", async () => {
			expect(input.element.value).to.be.equal("2");
		});

		it("input value should be the model value after changed", async () => {
			model.city = 3;
			await nextTick();

			expect(input.element.value).to.be.equal("3");
		});

		it("model value should be the input value if changed", async () => {
			input.element.value = "4";
			input.trigger("change");

			expect(model.city).to.be.equal(4);
		});
	});

	describe("check function values", () => {
		let schema = {
			type: "select",
			label: "Cities",
			model: "city",
			values() {
				return [
					{ id: 1, name: "London" },
					{ id: 2, name: "Paris" },
					{ id: 3, name: "Rome" },
					{ id: 4, name: "Berlin" }
				];
			}
		};
		let model = { city: [2] };

		before(async () => {
			createField2({ schema, model, disabled: false });
			await nextTick();
		});

		it.skip("should contain the value", async () => {
			expect(input.element.value).to.be.equal("2");
		});

		it("input value should be the model value after changed", async () => {
			model.city = 3;
			await nextTick();
			expect(input.element.value).to.be.equal("3");
		});

		it("model value should be the input value if changed", async () => {
			input.element.value = "4";
			input.trigger("change");
			expect(model.city).to.be.equal(4);
		});
	});
});
