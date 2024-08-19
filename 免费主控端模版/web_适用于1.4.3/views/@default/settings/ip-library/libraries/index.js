Tea.context(function () {
	this.isGenerating = false

	this.generateLibrary = function (libraryFileId) {
		let that = this
		teaweb.confirm("确定要重新生成库文件吗？", function () {
			that.isGenerating = true
			that.$post("/settings/ip-library/creating/generate")
				.params({
					libraryFileId: libraryFileId
				})
				.timeout(300)
				.success(function () {
					teaweb.successRefresh("生成成功")
				})
				.done(function () {
					that.isGenerating = false
				})
		})
	}

	this.deleteLibrary = function (libraryFileId) {
		let that = this
		teaweb.confirm("html:确定要删除此库文件吗？", function () {
			that.$post("/settings/ip-library/delete")
				.params({
					libraryFileId: libraryFileId
				})
				.success(function () {
					teaweb.successRefresh("删除成功")
				})
		})
	}
})