Tea.context(function () {
	this.createProvider = function () {
		teaweb.popup(Tea.url(".createPopup"), {
			title: "创建DNS服务商账号",
			height: "28em",
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.deleteProvider = function (providerId) {
		let that = this
		teaweb.confirm("确定要删除这个DNS服务商账号吗？", function () {
			that.$post(".delete")
				.params({
					providerId: providerId
				})
				.refresh()
		})
	}
})