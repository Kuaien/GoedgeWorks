Tea.context(function () {
	this.success = NotifyReloadSuccess("保存成功")

	// 时区
	this.timeZoneGroupCode = "asia"
	if (this.timeZoneLocation != null) {
		this.timeZoneGroupCode = this.timeZoneLocation.group
	}

	let oldTimeZoneGroupCode = this.timeZoneGroupCode
	let oldTimeZoneName = ""
	if (this.timeZoneLocation != null) {
		oldTimeZoneName = this.timeZoneLocation.name
	}

	this.$delay(function () {
		this.$watch("timeZoneGroupCode", function (groupCode) {
			if (groupCode == oldTimeZoneGroupCode && oldTimeZoneName.length > 0) {
				this.config.timeZone = oldTimeZoneName
				return
			}
			let firstLocation = null
			this.timeZoneLocations.forEach(function (v) {
				if (firstLocation != null) {
					return
				}
				if (v.group == groupCode) {
					firstLocation = v
				}
			})
			if (firstLocation != null) {
				this.config.timeZone = firstLocation.name
			}
		})
	})

	this.changeThemeBackgroundColor = function () {
		let color = this.config.theme.backgroundColor


		if (!color.startsWith("#")) {
			color = "#" + color
		}
		this.$refs.themeBackgroundPreviewBox.style.cssText = "background-color: " + color
	}

	this.selectThemeBackgroundColor = function (color) {
		this.config.theme.backgroundColor = color
		this.changeThemeBackgroundColor()
	}

	this.addDefaultClientIPHeaderNames = function (headerNames) {
		if (this.config.clientIPHeaderNames == null || this.config.clientIPHeaderNames.length == 0) {
			this.config.clientIPHeaderNames = headerNames
		} else {
			this.config.clientIPHeaderNames += " " + headerNames
		}
	}

	this.regenUniqueKey = function () {
		this.$post(".regenUniqueKey")
			.success(function (resp) {
				this.config.uniqueKey = resp.data.config.uniqueKey
			})
	}
})