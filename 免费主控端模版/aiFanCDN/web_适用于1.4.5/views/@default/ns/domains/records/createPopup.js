Tea.context(function () {
	this.caaTag = ""
	this.name = ""
	this.type = "A"
	this.typeDescription = ""
	this.ttl = 600

	this.nameWarning = false

	this.changeName = function () {
		this.nameWarning = this.name.length > 0 && !this.name.match(/^[0-9a-z_@*-.]+$/)
	}

	this.changeType = function () {
		let that = this
		this.types.forEach(function (v) {
			if (v.type == that.type) {
				that.typeDescription = v.description
			}
		})
	}

	this.changeType()

	// 单个添加或者批量添加
	this.addingType = "one"

	this.$delay(function () {
		this.$refs.nameInput.focus()
	})

	this.setAddingType = function (addingType) {
		this.addingType = addingType
		this.$delay(function () {
			switch (addingType) {
				case "one":
					this.$refs.nameInput.focus()
					break
				case "batch":
					this.$refs.namesInput.focus()
					break
			}
		})
	}
})