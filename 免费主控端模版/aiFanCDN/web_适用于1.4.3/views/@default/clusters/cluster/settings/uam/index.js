Tea.context(function () {
	this.success = NotifyReloadSuccess("保存成功")

	this.setTemplateBody = function () {
		this.uamPolicy.uiBody = `<div class="ui-uam-box">
	<h1>Checking your browser before accessing  \${host}</h1>
	<p>Please allow up to <span class="ui-counter">5</span> seconds ...</p>
	<p>&nbsp;</p>
	<p>DDoS protection by \${product.name}</p>
</div>`
	}
})