Tea.context(function () {
	this.deletePost = function (postId) {
		let that = this
		teaweb.confirm("确定删除此文章吗？", function () {
			that.$post(".delete")
				.params({
					postId: postId
				})
				.success(function () {
					teaweb.successRefresh("发布成功")
				})
		})
	}

	this.publishPost = function (postId) {
		let that = this
		teaweb.confirm("确定发布此文章吗？", function () {
			that.$post(".publish")
				.params({
					postId: postId
				})
				.success(function () {
					teaweb.successRefresh("发布成功")
				})
		})
	}
})