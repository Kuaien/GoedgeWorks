Tea.context(function () {
	this.isRejecting = false
	this.rejectReason = ""

	this.reject = function () {
		this.isRejecting = true
		this.$delay(function () {
			this.$refs.rejectReasonBox.focus()
		})
	}

	this.cancelRejecting = function () {
		this.isRejecting = !this.isRejecting
	}

	this.rejectConfirm = function () {
		if (this.identity == null) {
			teaweb.warn("表单错误，请刷新后重试")
			return
		}
		if (this.rejectReason.length == 0) {
			let that = this
			teaweb.warn("请输入驳回理由", function () {
				that.$refs.rejectReasonBox.focus()
			})
			return
		}
		this.$post(".reject")
			.params({
				userId: this.user.id,
				identityId: this.identity.id,
				reason: this.rejectReason
			})
			.success(function () {
				teaweb.success("驳回成功", function () {
					teaweb.reload()
				})
			})
	}

	this.verify = function () {
		let that = this
		teaweb.confirm("确定要通过审核吗？", function () {
			this.$post(".verify")
				.params({
					userId: that.user.id,
					identityId: that.identity.id
				})
				.success(function () {
					teaweb.success("操作成功", function () {
						teaweb.reload()
					})
				})
		})
	}

	this.resetStatus = function () {
		let that = this
		teaweb.confirm("确定要重置当前实名状态吗？", function () {
			this.$post(".reset")
				.params({
					userId: that.user.id,
					identityId: that.identity.id
				})
				.success(function () {
					teaweb.success("操作成功", function () {
						teaweb.reload()
					})
				})
		})
	}
})