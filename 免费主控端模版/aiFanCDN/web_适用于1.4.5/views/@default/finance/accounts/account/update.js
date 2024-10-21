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
})