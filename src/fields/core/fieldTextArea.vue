<template lang="pug">
	textarea.form-control(
		v-model="value",
		:id="getFieldID(schema)",
		:class="fieldClasses",
		:disabled="disabled",
		:maxlength="safeSchemaValue('max')",
		:minlength="safeSchemaValue('min')",
		:placeholder="safeSchemaValue('placeholder')",
		:readonly="safeSchemaValue('readonly')",
		:required="safeSchemaValue('required')",
		:rows="safeSchemaValue('rows', 2)",
		:name="safeSchemaValue('inputName')",
		v-attributes="'input'")
</template>

<script>
import abstractField from "../abstractField";

export default {
	mixins: [abstractField]
};
</script>


<style lang="scss">

</style>
