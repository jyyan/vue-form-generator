import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import FieldImage from "src/fields/optional/fieldImage.vue";


let wrapper;

function createField2(data, methods) {
	const _wrapper = mount(FieldImage, {
		
		props: data,
		methods: methods
	});

	wrapper = _wrapper;

	return _wrapper;
}

describe("fieldImage.vue", () => {
	describe("check template without preview", () => {
		let schema = {
			type: "image",
			label: "Avatar",
			model: "avatar",
			autocomplete: "off",
			disabled: false,
			placeholder: "",
			readonly: false,
			inputName: ""
		};
		let model = { avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg" };
		let input, fileInput;

		before(async () => {
			createField2({ schema, model, disabled: false });
			input = wrapper.find("input[type=text]");
		});

		it("should contain an input text element", async () => {
			expect(wrapper.exists()).to.be.true;
			expect(input.exists()).to.be.true;
			expect(input.attributes().type).to.be.equal("text");
			expect(input.classes()).to.include("form-control");
			expect(input.classes()).to.include("link");
		});

		it("should contain a file input element", async () => {
			fileInput = wrapper.find("input[type=file]");

			expect(fileInput.exists()).to.be.true;
			expect(fileInput.classes()).to.include("form-control");
			expect(fileInput.classes()).to.include("file");
		});

		it("should not visible the preview div", async () => {
			let preview = wrapper.find(".preview");

			expect(preview.element.style.display).to.be.equal("block");
		});

		it("should contain the value", async () => {
			expect(input.element.value).to.be.equal(model.avatar);
		});

		describe("check optional attribute on text input", () => {
			let attributes = ["autocomplete", "disabled", "placeholder", "readonly", "inputName"];

			attributes.forEach(name => {
				it("should set " + name, () => {
					checkAttribute(name, input, schema);
				});
			});
		});

		describe("check optional attribute on file input", () => {
			let attributes = ["disabled", "inputName"];

			attributes.forEach(name => {
				it("should set " + name, () => {
					checkAttribute(name, fileInput, schema);
				});
			});
		});

		it("input value should be the model value after changed", async () => {
			model.avatar = "https://s3.amazonaws.com/uifaces/faces/twitter/felipebsb/128.jpg";
			await nextTick();

			expect(input.element.value).to.be.equal("https://s3.amazonaws.com/uifaces/faces/twitter/felipebsb/128.jpg");
		});

		it("model value should be the input value if changed", async () => {
			input.element.value = "https://s3.amazonaws.com/uifaces/faces/twitter/peterme/128.jpg";
			input.trigger("input");
			await nextTick();

			expect(model.avatar).to.be.equal("https://s3.amazonaws.com/uifaces/faces/twitter/peterme/128.jpg");
		});

		it("should not contain a file input element if browse is false", async () => {
			wrapper.vm.schema.browse = false;
			await nextTick();

			let fileInput = wrapper.find("input[type=file]");

			expect(fileInput.exists()).to.be.false;
		});

		it("should not visible the preview div", async () => {
			wrapper.vm.schema.preview = false;
			await nextTick();

			let preview = wrapper.find(".preview");

			expect(preview.element.style.display).to.be.equal("none");
		});

		it("should not show the link input element if hideInput is true", async () => {
			wrapper.vm.schema.hideInput = true;
			await nextTick();
			let fileInput = wrapper.find("input[type=text]");

			expect(fileInput.element.style.display).to.be.equal("none");

			wrapper.vm.schema.hideInput = false;
			await nextTick();
		});

		it("should not show base64 data in input field", async () => {
			model.avatar = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ";
			await nextTick();

			expect(input.element.value).to.be.equal("<inline base64 image>");
		});

		it("should clear input if press remove icon", async () => {
			wrapper.vm.schema.preview = true;
			await nextTick();
			let remove = wrapper.find(".remove");

			expect(input.element.value).to.be.not.equal("");

			remove.trigger("click");
			await nextTick();

			expect(input.element.value).to.be.equal("");
		});

		it.skip("should convert image to base64 if file input changed", async () => {
			console.log(new FileReader());

			// Stub the browser FileReader
			let FR = window.FileReader;
			global.FileReader = window.FileReader;
			window.FileReader = sinon.stub().returns({
				readAsDataURL() {
					this.onload({
						target: {
							result: "base64 image data"
						}
					});
				}
			});
			wrapper.vm.fileChanged({
				target: {
					files: [
						{
							name: "test.jpg",
							length: 55431
						}
					]
				}
			});
			// await nextTick();
			expect(input.element.value).to.be.equal("base64 image data");
			expect(model.avatar).to.be.equal("base64 image data");

			window.FileReader = FR;
		});
	});
});
