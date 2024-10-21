Tea.context(function () {
	this.createUserInstance = function () {
		teaweb.popup(".createPopup", {
			title: "创建用户实例",
			height: "32em",
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.renewUserInstance = function (userInstanceId) {
		teaweb.popup(".renewPopup?userInstanceId=" + userInstanceId, {
			height: "26em",
			callback: function () {
				teaweb.successRefresh("续期成功")
			}
		})
	}

	this.updateObjectsPopup = function (userInstanceId) {
		teaweb.popup(".updateObjectsPopup?userInstanceId=" + userInstanceId, {
			width: "60em",
			height: "40em",
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.deleteUserInstance = function (userInstanceId) {
		let that = this
		teaweb.confirm("确定要删除此用户实例吗？", function () {
			that.$post(".delete")
				.params({
					userInstanceId: userInstanceId
				})
				.success(function () {
					teaweb.successRefresh("删除成功")
				})
		})
	}
})