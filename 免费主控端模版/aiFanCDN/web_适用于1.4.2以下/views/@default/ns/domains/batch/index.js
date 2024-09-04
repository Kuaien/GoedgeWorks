Tea.context(function () {
	this.$delay(function () {
		this.$refs.namesInput.focus()
		this.changeUserId(0)
	})

	this.success = NotifyReloadSuccess("保存成功")

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