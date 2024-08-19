Tea.context(function () {
	this.$delay(function () {
		this.changeUserId(this.userId)
	})

	this.deleteDomain = function (domainId) {
		let that = this
		teaweb.confirm("确定要删除此域名吗？", function () {
			that.$post("/ns/domains/delete")
				.params({
					domainId: domainId
				})
				.success(function () {
					teaweb.reload()
				})
		})
	}

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

	/**
	 * 批量操作
	 */
	this.selectedAll = false
	this.hasSelectedDomains = false
	this.hasVerifyingDomains = false

	this.$delay(function () {
		let that = this
		this.$watch("selectedAll", function (b) {
			let checkboxes = that.$refs.domainCheckbox
			if (checkboxes != null) {
				checkboxes.forEach(function (checkbox) {
					if (b) {
						checkbox.check()
						that.hasSelectedDomains = true
						let status = checkbox.$el.getAttribute("status")
						if (status == "none") {
							that.hasVerifyingDomains = true
						}
					} else {
						checkbox.uncheck()
						that.hasSelectedDomains = false
					}
				})
			}
		})
	})

	this.changeSelectedDomains = function () {
		if (this.$refs == null) {
			return
		}
		let checkboxes = this.$refs.domainCheckbox
		if (checkboxes != null) {
			let hasSelectedDomains = false
			let hasVerifyingDomains = false
			checkboxes.forEach(function (checkbox) {
				if (checkbox.isChecked()) {
					hasSelectedDomains = true
					let status = checkbox.$el.getAttribute("status")
					if (status == "none") {
						hasVerifyingDomains = true
					}
				}
			})
			this.hasSelectedDomains = hasSelectedDomains
			this.hasVerifyingDomains = hasVerifyingDomains
			return
		}
	}

	this.cancelDomains = function () {
		let checkboxes = this.$refs.domainCheckbox
		checkboxes.forEach(function (checkbox) {
			checkbox.uncheck()
		})
		this.selectedAll = false
		this.hasSelectedDomains = false
		this.hasVerifyingDomains = false
	}

	this.deleteDomains = function () {
		let checkboxes = this.$refs.domainCheckbox
		let domainIds = []
		checkboxes.forEach(function (checkbox) {
			if (checkbox.isChecked()) {
				let domainId = checkbox.vValue
				if (typeof domainId == "number") {
					domainIds.push(domainId)
				}
			}
		})
		let that = this
		teaweb.confirm("确定要删除选中的域名吗？", function () {
			that.$post(".deletePage")
				.params({
					domainIds: domainIds
				})
				.success(function () {
					teaweb.successRefresh("删除成功")
				})
		})
	}
})