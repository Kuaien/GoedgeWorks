Tea.context(function () {
	this.$delay(function() {
		this.changeUserId(this.domain.userId)
	})

	this.success = NotifySuccess("保存成功", "/ns/domains/domain?domainId=" + this.domain.id)

	this.hasGroups = false
	this.changeUserId = function (userId) {
		this.$post("/ns/domains/groups/options")
			.params({
				userId: userId
			})
			.success(function (resp) {
				this.hasGroups = resp.data.groups.length > 0
				if (this.hasGroups) {
					this.$delay(function () {
						this.$refs.groupSelector.reload(userId)
					})
				}
			})
	}
})