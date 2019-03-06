<template>
  <div>
    	<div :style="text_style" v-if="data.length === 0"><span v-if="message.length > 0">{{message}}</span> <i class="spinner fas fa-spinner fa-spin" v-if="inProgress"></i></div>
  </div>
</template>

<script>
  	export default {
    	props: {
			"data" : {
				default : []
			},
			"loading_text" : {
				default : ""
			}, 
			"error_message" : {
				default : ""
			},
			"text_color" : {
				default : '#1A1A1A'
			},
			"font_size" : {
				default : "inherit"
			},
			"text_align" : {
				default : "left"
			}
		},
		data : function() {
			return {
				inProgress : false
			}
		},
		mounted: function(){
			console.log("spinner", this)
		},
		computed: {
			message : function() {
				return this.data.length === 0 && this.inProgress === false ? this.error_message : this.loading_text
			},
			font_size_parsed : function() {
				return typeof this.font_size === "string" && !isNaN(parseInt(this.font_size)) ? parseInt(this.font_size) +'px' : this.font_size;
			},
			text_style : function(){
				return `
          			color: ${this.text_color};
          			font-size: ${this.font_size_parsed};
          			text-align: ${this.text_align};
				`
			}
		}
	}
</script>