<template lang="pug">
	input(:id="getFieldID(schema)", type="checkbox", v-model="value", :autocomplete="safeSchemaValue('autocomplete')", :disabled="disabled", :name="safeSchemaValue('inputName')", :class="fieldClasses", :required="safeSchemaValue('required')", v-attributes="'input'")
</template>

<script>
import abstractField from "../abstractField";

export default {
	mixins: [abstractField]
};
</script>

<style lang="scss">
.vue-form-generator .field-checkbox input {
	margin-left: 12px;
}
</style>
