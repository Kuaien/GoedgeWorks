Tea.context(function () {
	this.createRecord = function () {
		teaweb.popup(".createPopup?domainId=" + this.domain.id, {
			height: "35em",
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.updateRecord = function (recordId) {
		teaweb.popup(".updatePopup?recordId=" + recordId, {
			height: "35em",
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.deleteRecord = function (recordId) {
		let that = this
		teaweb.confirm("确定要删除此记录吗？", function () {
			that.$post(".delete")
				.params({
					recordId: recordId
				})
				.success(function () {
					teaweb.reload()
				})
		})
	}

	this.searchWithName = function (keyword) {
		this.keyword = "name:\"" + keyword + "\""
		this.$delay(function () {
			this.$refs.recordsSearchForm.submit()
		})
	}

	this.searchWithValue = function (keyword) {
		this.keyword = "value:\"" + keyword + "\""
		this.$delay(function () {
			this.$refs.recordsSearchForm.submit()
		})
	}

	this.showStat = function (recordId) {
		teaweb.popup(".statPopup?recordId=" + recordId, {

		})
	}

	this.updateRecordHealthCheck = function (recordId) {
		teaweb.popup(".healthCheckPopup?recordId=" + recordId, {
			height: "26em",
			callback: function () {
				teaweb.success("设置成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.upRecord = function (record) {
		record.isUp = true

		this.$post(".updateUp")
			.params({
				recordId: record.id
			})
			.success(function () {
				teaweb.success("操作成功", function () {
					teaweb.reload()
				})
			})
	}

	this.formatTTL = function (ttl) {
		if (ttl % 86400 == 0) {
			let days = ttl / 86400
			return days + "天"
		}
		if (ttl % 3600 == 0) {
			let hours = ttl / 3600
			return hours + "小时"
		}
		if (ttl % 60 == 0) {
			let minutes = ttl / 60
			return minutes + "分钟"
		}
		return ttl + "秒"
	}
})