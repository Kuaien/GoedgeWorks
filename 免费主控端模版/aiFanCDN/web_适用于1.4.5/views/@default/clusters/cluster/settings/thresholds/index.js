Tea.context(function () {
	this.createThreshold = function () {
		teaweb.popup(Tea.url(".createPopup", {
			title: "创建阈值",
			clusterId: this.clusterId
		}), {
			height: "30em",
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.updateThreshold = function (thresholdId) {
		teaweb.popup(Tea.url(".updatePopup", {
			thresholdId: thresholdId
		}), {
			height: "30em",
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.deleteThreshold = function (thresholdId) {
		let that = this
		teaweb.confirm("确定要删除这个阈值吗？", function () {
			that.$post(".delete")
				.params({
					thresholdId: thresholdId
				})
				.success(function () {
					teaweb.success("删除成功", function () {
						teaweb.reload()
					})
				})
		})
	}
})