Tea.context(function () {
	this.addingType = "one"

	this.$delay(function () {
		this.$refs.nameInput.focus()
		this.changeUserId(0)
	})

	this.success = NotifySuccess("保存成功", "/ns/domains")

	this.setAddingType = function (addingType) {
		this.addingType = addingType
		switch (addingType) {
			case "one":
				this.$delay(function () {
					this.$refs.nameInput.focus()
				})
				break
			case "batch":
				this.$delay(function () {
					this.$refs.namesInput.focus()
				})
				break
		}
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
})