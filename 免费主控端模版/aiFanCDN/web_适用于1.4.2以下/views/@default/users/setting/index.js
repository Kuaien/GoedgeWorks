Tea.context(function () {
	this.success = NotifyReloadSuccess("保存成功")

	this.emailVerificationMoreOptions = false
	this.emailResetPasswordMoreOptions = false

	this.mobileVerificationMoreOptions = false
	this.mobileResetPasswordMoreOptions = false

	this.featureOp = "overwrite"
	this.featuresVisible = false

	this.showFeatures = function () {
		this.featuresVisible = !this.featuresVisible
	}

	this.selectedFeatureNames = function () {
		if (this.features == null) {
			return ""
		}

		let names = []
		this.features.forEach(function (v) {
			if (v.isChecked) {
				names.push(v.name)
			}
		})
		return names.join(" / ")
	}
})