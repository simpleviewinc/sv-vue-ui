import jsvalidator from "jsvalidator";
import Vue from 'vue';

const router = new Vue({
	methods : {
		back : function(args) {
			this.$emit("back");
		},
		dialogOpen : function(args) {
			this.$emit("dialog", args);
		},
		dialogClose : function() {
			this.$emit("dialog");
		},
		errorDialog : function(e) {
			this.$emit("errorDialog", e);
		},
		go : function(args) {
			this.$emit("go", args);
		}
	}
});

export default router;