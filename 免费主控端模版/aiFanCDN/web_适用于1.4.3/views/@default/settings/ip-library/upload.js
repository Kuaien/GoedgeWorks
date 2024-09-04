Tea.context(function () {
	this.success = NotifySuccess("上传成功", "/settings/ip-library")

	this.isUploading = false

	this.before = function () {
		this.isUploading = true
	}

	this.done = function () {
		this.isUploading = false
	}
})