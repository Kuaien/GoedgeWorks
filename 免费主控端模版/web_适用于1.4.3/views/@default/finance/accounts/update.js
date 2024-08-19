Tea.context(function () {
	this.eventType = this.eventTypes[0].code
	this.event = this.eventTypes[0]

	this.$delay(function () {
		this.$watch("eventType", function (eventType) {
			this.event = this.eventTypes.$find(function (k, v) {
				return v.code == eventType
			})
		})
	})

	this.success = NotifyReloadSuccess("操作成功")

	this.userAccount = null
	this.changeUser = function (userId) {
		if (userId > 0) {
			this.$post(".userAccount")
				.params({userId: userId})
				.success(function (resp) {
					this.userAccount = resp.data.account
				})
		} else {
			this.userAccount = null
		}
	}
})