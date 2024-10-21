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

	this.updateScript = function () {
		teaweb.popup(".updatePopup", {
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
})