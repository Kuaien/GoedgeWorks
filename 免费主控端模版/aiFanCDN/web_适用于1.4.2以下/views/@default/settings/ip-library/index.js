Tea.context(function () {
	this.teaweb = teaweb

	this.deleteArtifact = function (artifactId) {
		let that = this
		teaweb.confirm("确定要删除此IP库吗？", function () {
			that.$post("/settings/ip-library/delete")
				.params({
					artifactId: artifactId
				})
				.success(function () {
					teaweb.successRefresh("删除成功")
				})
		})
	}

	this.updateArtifactPublic = function (artifactId, isPublic) {
		let that = this
		let message = "确定要使用当前IP库吗？"
		if (!isPublic) {
			message = "确定要取消使用当前IP库吗？"
		}
		teaweb.confirm(message, function () {
			that.$post("/settings/ip-library/updatePublic")
				.params({
					artifactId: artifactId,
					isPublic: isPublic ? 1 : 0
				})
				.success(function () {
					if (isPublic) {
						teaweb.successRefresh("使用成功，将在10分钟内生效")
					} else {
						teaweb.successRefresh("取消成功，将在10分钟内生效")
					}
				})
		})
	}
})