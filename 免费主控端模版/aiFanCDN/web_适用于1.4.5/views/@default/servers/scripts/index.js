Tea.context(function () {
	this.createScript = function () {
		teaweb.popup(".createPopup", {
			title: "创建脚本",
			height: "28em",
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.deleteScript = function (scriptId) {
		let that = this
		teaweb.confirm("确定要删除此脚本吗？", function () {
			that.$post(".delete")
				.params({
					scriptId: scriptId
				})
				.refresh()
				.success()
		})
	}

	this.publishScripts = function () {
		let that = this
		teaweb.confirm("确定要发布脚本到边缘节点？", function () {
			that.$post(".publish")
				.refresh()
				.success()
		})
	}
})