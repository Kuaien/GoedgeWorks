Tea.context(function () {
	this.pass = function (scriptId) {
		let that = this
		teaweb.confirm("确定要通过此脚本吗？", function () {
			that.$post(".pass")
				.params({ scriptId: scriptId})
				.success(function () {
					teaweb.reload()
				})
		})
	}

	this.reject = function (scriptId) {
		teaweb.popupSuccess(".rejectPopup?scriptId=" + scriptId, null, null, {
			title: '拒绝脚本',
		})
	}
})