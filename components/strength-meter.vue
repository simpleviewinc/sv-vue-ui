<template>
	<div class="strength-meter" v-if="visible">
		<div class="wrap">
			<div class="item" :class="getStrengthClass(0)"></div>
			<div class="item" :class="getStrengthClass(1)"></div>
			<div class="item" :class="getStrengthClass(2)"></div>
		</div>
		<span class="text">{{message}}</span>
	</div>
</template>

<script>
	export default {
		props : ["field"],
		data : function() {
			return {
				visible : false,
				score: undefined,
				classes: [
					'weak active',
					'medium active',
					'strong active'
				],
				messages:  [
					'Password is weak',
					'Could be stronger',
					'Strong password'
				]
        	}
		},
		computed : {
			message : function() {
				return this.score !== undefined ? this.messages[this.score] : "Password is too short";
			}
		},
		watch: {
			field : {
				immediate: true,
				handler	: function(val) {
					if(val !== undefined){
						this.visible = true;
						if(val.length >= 8){
							// Special characters = strong strength password
							for(let letter in val){
								const i = val.charCodeAt(letter);
								
								if((i >= 33 && i <= 47) || (i >= 58 && i <= 64) || (i >= 91 && i <= 96) || (i >= 123 && i <= 126) && i >= 128 ) {
									return this.score = 2;
								}
							}

							return /[A-Z]/.test(val) || /\d/.test(val) ? this.score = 1 : this.score = 0;
						} else {
							return this.score = undefined;
						}
					} else {
						this.visible = false;
					}
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

