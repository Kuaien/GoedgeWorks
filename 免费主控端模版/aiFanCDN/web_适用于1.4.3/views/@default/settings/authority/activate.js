Tea.context(function () {
	this.success = NotifySuccess("激活成功", "/settings/authority")

	this.isRequesting = false
	this.before = function () {
		this.isRequesting = true
	}

	this.done = function () {
		this.isRequesting = false
	}
})