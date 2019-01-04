<template>
	<div class="admin-dialog">
		<div class="mask"></div>
		<div class="content">
			<h2>{{title}}</h2>
			<p>{{text}}</p>
			<div class="buttons">
				<slot name="buttons"></slot>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props : ["title", "text"]
	}
</script>

<style scoped>
	.admin-dialog {
		position: fixed;
		top: 0px;
		bottom: 0px;
		left: 0px;
		right: 0px;
	}
	
	.admin-dialog .mask {
		height: 100%;
		width: 100%;
		position: absolute;
		background: black;
		opacity: .6;
	}
	
	.admin-dialog .content {
		position: relative;
		background: white;
		max-width: 400px;
		width: 100%;
		padding: 20px;
		border-radius: 5px;
		margin: 0 auto;
		top: -50%;
		margin-top: 50%;
	}
	
	.admin-dialog .buttons {
		display: flex;
		justify-content: flex-end;
	}
	
	.admin-dialog .content h2 {
		margin-top: 0px;
	}
</style>