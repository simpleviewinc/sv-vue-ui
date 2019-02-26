<template>
	<div class="strength-meter" v-if="show">
		<div class="wrap">
			<div class="item" :class="getStrengthClass(0)"></div>
			<div class="item" :class="getStrengthClass(1)"></div>
			<div class="item" :class="getStrengthClass(2)"></div>
		</div>
		<span class="text">{{message}}</span>
	</div>
</template>

<script>
	import { validate } from "jsvalidator";

	export default {
		props : ["field", "strengthMeter"],
		data : function() {
			return {
				show : false,
				score : "",
				classes: [
					'weak active',
					'medium active',
					'strong active'
				],
				message: ""
        	}
		},
		watch: {
			field : {
				immediate: true,
				handler	: async function(val){
					const result = await this.strengthMeter(val);
					const validResult = validate(result, {
						type : "object",
						schema : [
							{ name : "strength", type : "string", required : true },
							{ name : "message", type : "string" },
							{ name : "show", type : "boolean" },
						],
						required : true,
						allowExtraKeys : false
					});

					if (validResult.err) {
						throw validResult.err;
					}

					const map = {
						week : 0,
						medium : 1,
						strong : 2
					}

					this.show = validResult.data.show;
					this.message = validResult.data.message;
					this.score = map[validResult.data.strength] !== undefined ?  map[validResult.data.strength] : "";
				}
			}
		},
		methods : {
			getStrengthClass : function(strength) {
				return this.score >= strength ? this.classes[this.score] : '';
			}
		}
	}
</script>

<style lang="scss">
	@import "@simpleview/vue-ui/css/theme.scss";

	.strength-meter {
		position: relative;
		margin-top: 5px;
		display: flex;
    	align-items: center;
		padding: 0 10px;
	}

	.strength-meter .wrap {
		height: 5px;
		background: #dcdcdc;
		border-radius: 5px;
		flex: 1;
	}

	.strength-meter .item {
		height: 100%;
		width: 33.33%;
		float: left;
		visibility: hidden;
		transition: background-color .2s, visisility .1s;
	}

	.strength-meter .active {
		visibility: visible;
	}

	.strength-meter .item.weak {
		background-color: #FF4B47;
	}

	.strength-meter .item.medium {
		background-color: #F9AE35;
	}

	.strength-meter .item.strong {
		background-color: #2DAF7D;
	}

	.strength-meter .text {
		flex: 1;
		color: #aaa;
		margin-left: 10px;
		transition: .2s;
	}
</style>

