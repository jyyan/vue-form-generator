import { expect } from "chai";
import { slugifyFormID } from "../../../../src/utils/schema";

describe("schema.js - slugifyFormID with non-ASCII support", () => {
	describe("Pure ASCII strings", () => {
		it("should convert English text to lowercase with dashes", () => {
			expect(slugifyFormID({ label: "User Name" })).to.equal("user-name");
			expect(slugifyFormID({ label: "First Name" })).to.equal("first-name");
		});

		it("should handle underscores", () => {
			expect(slugifyFormID({ label: "test_field" })).to.equal("test-field");
		});

		it("should handle multiple spaces", () => {
			expect(slugifyFormID({ label: "Test  Multiple   Spaces" })).to.equal("test-multiple-spaces");
		});

		it("should preserve alphanumeric characters", () => {
			expect(slugifyFormID({ label: "test123" })).to.equal("test123");
		});

		it("should remove leading and trailing dashes", () => {
			expect(slugifyFormID({ label: "  Trim  " })).to.match(/^[^-].*[^-]$/);
		});
	});

	describe("Non-ASCII strings", () => {
		it("should generate hash-based IDs for pure Chinese text", () => {
			const result = slugifyFormID({ label: "中文" });
			expect(result).to.match(/^field-[a-z0-9]+$/);
		});

		it("should generate hash-based IDs for pure Japanese text", () => {
			const result = slugifyFormID({ label: "日本語" });
			expect(result).to.match(/^field-[a-z0-9]+$/);
		});

		it("should generate hash-based IDs for pure Korean text", () => {
			const result = slugifyFormID({ label: "한글" });
			expect(result).to.match(/^field-[a-z0-9]+$/);
		});

		it("should generate hash-based IDs for Cyrillic text", () => {
			const result = slugifyFormID({ label: "Привет" });
			expect(result).to.match(/^field-[a-z0-9]+$/);
		});

		it("should generate hash-based IDs for Arabic text", () => {
			const result = slugifyFormID({ label: "مرحبا" });
			expect(result).to.match(/^field-[a-z0-9]+$/);
		});
	});

	describe("Mixed ASCII and non-ASCII strings", () => {
		it("should preserve ASCII part and add hash for Chinese", () => {
			const result = slugifyFormID({ label: "User 中文" });
			expect(result).to.match(/^user-[a-z0-9]+$/);
		});

		it("should preserve ASCII part and add hash for mixed content", () => {
			const result = slugifyFormID({ label: "name 名称" });
			expect(result).to.match(/^name-[a-z0-9]+$/);
		});

		it("should handle spaces in mixed content", () => {
			const result = slugifyFormID({ label: "User Name 中文" });
			expect(result).to.match(/^user-name-[a-z0-9]+$/);
		});
	});

	describe("Deterministic behavior", () => {
		it("should generate same ID for same input", () => {
			const result1 = slugifyFormID({ label: "中文" });
			const result2 = slugifyFormID({ label: "中文" });
			expect(result1).to.equal(result2);
		});

		it("should generate different IDs for different inputs", () => {
			const result1 = slugifyFormID({ label: "中文" });
			const result2 = slugifyFormID({ label: "英文" });
			expect(result1).to.not.equal(result2);
		});

		it("should be case-sensitive for non-ASCII (in hash)", () => {
			// Note: The hash should be different even if the visual difference is subtle
			const result1 = slugifyFormID({ label: "中文" });
			const result2 = slugifyFormID({ label: "中文名称" });
			expect(result1).to.not.equal(result2);
		});
	});

	describe("Prefix support", () => {
		it("should support prefix for ASCII strings", () => {
			const result = slugifyFormID({ label: "test" }, "form-");
			expect(result).to.equal("form-test");
		});

		it("should support prefix for non-ASCII strings", () => {
			const result = slugifyFormID({ label: "中文" }, "form-");
			expect(result).to.match(/^form-field-[a-z0-9]+$/);
		});
	});

	describe("Explicit ID handling", () => {
		it("should use explicit ID unchanged for ASCII", () => {
			const result = slugifyFormID({ id: "custom-id", label: "中文" });
			expect(result).to.equal("custom-id");
		});

		it("should use explicit ID unchanged for non-ASCII", () => {
			const result = slugifyFormID({ id: "custom-id-中文", label: "test" });
			expect(result).to.equal("custom-id-中文");
		});

		it("should respect prefix with explicit ID", () => {
			const result = slugifyFormID({ id: "custom-id", label: "test" }, "form-");
			expect(result).to.equal("form-custom-id");
		});
	});

	describe("Field priority (inputName > label > model)", () => {
		it("should use inputName if available", () => {
			const result = slugifyFormID({
				inputName: "中文输入",
				label: "English Label",
				model: "englishModel"
			});
			expect(result).to.match(/^field-[a-z0-9]+$/);
		});

		it("should use label if inputName not available", () => {
			const result = slugifyFormID({
				label: "English Label",
				model: "chineseModel中文"
			});
			expect(result).to.equal("english-label");
		});

		it("should use model if inputName and label not available", () => {
			const result = slugifyFormID({
				model: "englishModel"
			});
			expect(result).to.equal("englishmodel");
		});
	});

	describe("Edge cases", () => {
		it("should handle empty string", () => {
			const result = slugifyFormID({ label: "" });
			expect(result).to.equal("");
		});

		it("should handle only spaces", () => {
			const result = slugifyFormID({ label: "   " });
			expect(result).to.equal("");
		});

		it("should handle only special characters", () => {
			const result = slugifyFormID({ label: "!@#$%^&*()" });
			expect(result).to.equal("");
		});

		it("should generate valid HTML IDs (no invalid characters)", () => {
			const testLabels = [
				"中文",
				"User 中文",
				"日本語テスト",
				"Test123中文",
				"مرحبا世界"
			];

			testLabels.forEach(label => {
				const result = slugifyFormID({ label });
				// Valid HTML ID: starts with letter or dash, contains only [a-zA-Z0-9-_]
				// Our implementation uses lowercase [a-z0-9-]
				expect(result).to.match(/^[a-z][a-z0-9-]*$/);
			});
		});
	});
});
