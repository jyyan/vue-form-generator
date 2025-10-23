import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import fieldUpload from "src/fields/core/fieldUpload.vue";


let wrapper;

function createField2(data, methods) {
	const _wrapper = mount(fieldUpload, {
		
		props: data,
		methods: methods
	});

	wrapper = _wrapper;

	return _wrapper;
}

describe("fieldUpload.vue", () => {
	describe("check template", () => {
		let schema = {
			type: "upload",
			label: "Upload",
			inputName: "testupload",
			placeholder: "",
			readonly: false,
			required: false,
			disabled: false,
			multiple: true,
			accept: "image/*"
		};
		let model = {};
		let attributes = ["disabled", "placeholder", "readonly"];
		let input;

		before(async () => {
			createField2({ schema, model, disabled: false });
			input = wrapper.find("input");
			schema.inputType = "file";
			await nextTick();
		});

		it("should contain an input text element", async () => {
			expect(wrapper.exists()).to.be.true;
			expect(input.is("input")).to.be.true;
			expect(input.attributes().type).to.be.equal("file");
			expect(input.classes()).to.include("form-control");
		});

		describe("check optional attribute", () => {
			attributes.forEach(name => {
				it("should set " + name, () => {
					checkAttribute(name, wrapper, schema);
				});
			});

			it("should set name", async () => {
				expect(input.attributes().name).to.be.equal("testupload");
			});

			it("should set required", async () => {
				expect(input.attributes().required).to.be.undefined;
			});

			it("should set multiple", async () => {
				expect(input.attributes().multiple).to.be.equal("multiple");
			});

			it("should set accept", async () => {
				expect(input.attributes().accept).to.be.equal("image/*");
			});
		});
	});
});
