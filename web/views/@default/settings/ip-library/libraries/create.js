Tea.context(function () {
	this.STEP_TEMPLATE = "template"
	this.STEP_UPLOAD = "upload"
	this.STEP_COUNTRY = "country"
	this.STEP_PROVINCE = "province"
	this.STEP_CITY = "city"
	this.STEP_TOWN = "town"
	this.STEP_PROVIDER = "provider"
	this.STEP_FINISH = "finish"

	this.step = this.STEP_TEMPLATE

	this.goStep = function (step) {
		this.step = step

		switch (step) {
			case this.STEP_UPLOAD:
				if (this.libraryFileId > 0) {
					this.goStep(this.STEP_COUNTRY)
				}
				break
			case this.STEP_COUNTRY:
				this.reloadCountries()
				break
			case this.STEP_PROVINCE:
				this.reloadProvinces()
				break
			case this.STEP_CITY:
				this.reloadCities()
				break
			case this.STEP_TOWN:
				this.reloadTowns()
				break
			case this.STEP_PROVIDER:
				this.reloadProviders()
				break
		}
	}

	this.$delay(function () {
		switch (this.step) {
			case this.STEP_TEMPLATE:
				this.$refs.libraryName.focus()
				break
			case this.STEP_COUNTRY:
				this.reloadCountries()
				break
			case this.STEP_PROVINCE:
				this.reloadProvinces()
				break
			case this.STEP_CITY:
				this.reloadCities()
				break
			case this.STEP_TOWN:
				this.reloadTowns()
				break
			case this.STEP_PROVIDER:
				this.reloadProviders()
				break
		}
	})

	/**
	 * 数据格式
	 */
	this.rowTemplate = ""
	this.formatTestText = ""
	this.formatTestResult = ""
	this.password = ""

	this.libraryName = ""
	this.emptyValues = []

	this.libraryFileId = 0

	if (this.updatingLibraryFile != null) {
		this.libraryFileId = this.updatingLibraryFile.id
		this.rowTemplate = this.updatingLibraryFile.template
		this.libraryName = this.updatingLibraryFile.name
		if (this.updatingLibraryFile.emptyValues != null) {
			this.emptyValues = this.updatingLibraryFile.emptyValues
		}
	}

	this.formatIP2Region = function () {
		this.rowTemplate = "${ipFrom}|${ipTo}|${country}|${any}|${province}|${city}|${provider}"
	}

	this.formatIP138 = function () {
		this.rowTemplate = "${any},${any},${ipFrom},${ipTo},${country},${province},${city},${town},${provider},${any},${any},${any}"
	}

	this.testFormat = function () {
		this.$post("/settings/ip-library/creating/testFormat")
			.params({
				template: this.rowTemplate,
				text: this.formatTestText
			})
			.success(function (resp) {
				let values = resp.data.values
				let pieces = []
				if (values["country"] != null && values["country"].length > 0) {
					pieces.push("国家/地区：" + values["country"])
				}
				if (values["province"] != null && values["province"].length > 0) {
					pieces.push("省份/州：" + values["province"])
				}
				if (values["city"] != null && values["city"].length > 0) {
					pieces.push("城市/市：" + values["city"])
				}
				if (values["town"] != null && values["town"].length > 0) {
					pieces.push("区县：" + values["town"])
				}
				if (values["provider"] != null && values["provider"].length > 0) {
					pieces.push("ISP运营商：" + values["provider"])
				}

				this.formatTestResult = pieces.join("；")
			})
	}

	this.changeFormatTestText = function () {
		this.formatTestResult = ""
	}

	this.templateGoNext = function () {
		if (this.libraryName.length == 0) {
			let that = this
			teaweb.warn("请输入IP库名字", function () {
				that.$refs.libraryName.focus()
			})
			return
		}
		if (this.rowTemplate.length == 0) {
			let that = this
			teaweb.warn("请先输入数据格式模板", function () {
				that.$refs.rowTemplate.focus()
			})
			return
		}
		this.goStep(this.STEP_UPLOAD)
	}

	/**
	 * 上传
	 */
	this.isUploading = false

	this.upload = function () {
		let dataFile = this.$refs.dataFile
		if (dataFile.files.length == 0) {
			teaweb.warn("请先上传文件")
			return
		}

		this.isUploading = true

		let emptyValues = this.$refs.emptyValues.allValues()

		this.$post("/settings/ip-library/creating/upload")
			.timeout(300)
			.params({
				name: this.libraryName,
				template: this.rowTemplate,
				file: dataFile.files[0],
				emptyValues: emptyValues,
				password: this.password
			})
			.success(function (resp) {
				this.libraryFileId = resp.data.libraryFileId
				let that = this
				teaweb.success("上传成功", function () {
					that.step = that.STEP_COUNTRY
					that.reloadCountries()
				})
			})
			.error(function () {
				teaweb.warn("操作超时，可能是网络太慢")
			})
			.done(function () {
				this.isUploading = false
			})
	}

	/**
	 * 国家
	 */
	this.missingCountries = []
	this.missingCountriesLoaded = false
	this.reloadCountries = function () {
		this.missingCountriesLoaded = false
		this.$post("/settings/ip-library/creating/countries")
			.params({
				"libraryFileId": this.libraryFileId
			})
			.success(function (resp) {
				this.missingCountries = resp.data.missingCountries
			})
			.done(function () {
				this.missingCountriesLoaded = true
			})
	}

	this.addCountryCustomCode = function (country, code) {
		let that = this
		teaweb.confirm("html:确定要将 \"<strong>" + teaweb.encodeHTML(code) + "</strong>\" 加入到 \"<strong>" + teaweb.encodeHTML(country.displayName) + "</strong>\" 别名中吗？<br/>请再三确认无误后，才进行确定操作！", function () {
			that.$post("/settings/ip-library/creating/addCountryCustomCode")
				.params({
					countryId: country.id,
					code: code
				})
				.success(function () {
					teaweb.success("操作成功", function () {
						that.reloadCountries()
					})
				})
		})
	}

	/**
	 * 省
	 */
	this.missingProvinces = []
	this.missingProvincesLoaded = false
	this.reloadProvinces = function () {
		this.missingProvincesLoaded = false
		this.$post("/settings/ip-library/creating/provinces")
			.params({
				"libraryFileId": this.libraryFileId
			})
			.success(function (resp) {
				this.missingProvinces = resp.data.missingProvinces
			})
			.done(function () {
				this.missingProvincesLoaded = true
			})
	}

	this.addProvinceCustomCode = function (province, code) {
		let that = this
		teaweb.confirm("html:确定要将 \"<strong>" + teaweb.encodeHTML(code) + "</strong>\" 加入到 \"<strong>" + teaweb.encodeHTML(province.displayName) + "</strong>\" 别名中吗？<br/>请再三确认无误后，才进行确定操作！", function () {
			that.$post("/settings/ip-library/creating/addProvinceCustomCode")
				.params({
					provinceId: province.id,
					code: code
				})
				.success(function () {
					teaweb.success("操作成功", function () {
						that.reloadProvinces()
					})
				})
		})
	}

	/**
	 * 市
	 */
	this.missingCities = []
	this.missingCitiesLoaded = false
	this.sizePerPage = 100
	this.reloadCities = function () {
		this.missingCitiesLoaded = false
		this.$post("/settings/ip-library/creating/cities")
			.params({
				libraryFileId: this.libraryFileId,
				size: this.sizePerPage
			})
			.success(function (resp) {
				this.missingCities = resp.data.missingCities
			})
			.done(function () {
				this.missingCitiesLoaded = true
			})
	}

	this.addCityCustomCode = function (city, code) {
		let that = this
		teaweb.confirm("html:确定要将 \"<strong>" + teaweb.encodeHTML(code) + "</strong>\" 加入到 \"<strong>" + teaweb.encodeHTML(city.displayName) + "</strong>\" 别名中吗？<br/>请再三确认无误后，才进行确定操作！", function () {
			that.$post("/settings/ip-library/creating/addCityCustomCode")
				.params({
					cityId: city.id,
					code: code
				})
				.success(function () {
					teaweb.success("操作成功", function () {
						that.reloadCities()
					})
				})
		})
	}

	/**
	 * 县
	 */
	this.missingTowns = []
	this.missingTownsLoaded = false
	this.reloadTowns = function () {
		this.missingTownsLoaded = false
		this.$post("/settings/ip-library/creating/towns")
			.params({
				"libraryFileId": this.libraryFileId
			})
			.success(function (resp) {
				this.missingTowns = resp.data.missingTowns
			})
			.done(function () {
				this.missingTownsLoaded = true
			})
	}

	this.addTownCustomCode = function (town, code) {
		let that = this
		teaweb.confirm("html:确定要将 \"<strong>" + teaweb.encodeHTML(code) + "</strong>\" 加入到 \"<strong>" + teaweb.encodeHTML(town.displayName) + "</strong>\" 别名中吗？<br/>请再三确认无误后，才进行确定操作！", function () {
			that.$post("/settings/ip-library/creating/addTownCustomCode")
				.params({
					townId: town.id,
					code: code
				})
				.success(function () {
					teaweb.success("操作成功", function () {
						that.reloadTowns()
					})
				})
		})
	}

	/**
	 * ISP
	 */
	this.missingProviders = []
	this.missingProvidersLoaded = false
	this.reloadProviders = function () {
		this.missingProvidersLoaded = false
		this.$post("/settings/ip-library/creating/providers")
			.params({
				"libraryFileId": this.libraryFileId
			})
			.success(function (resp) {
				this.missingProviders = resp.data.missingProviders
			})
			.done(function () {
				this.missingProvidersLoaded = true
			})
	}

	this.addProviderCustomCode = function (provider, code) {
		let that = this
		teaweb.confirm("html:确定要将 \"<strong>" + teaweb.encodeHTML(code) + "</strong>\" 加入到 \"<strong>" + teaweb.encodeHTML(provider.displayName) + "</strong>\" 别名中吗？<br/>请再三确认无误后，才进行确定操作！", function () {
			that.$post("/settings/ip-library/creating/addProviderCustomCode")
				.params({
					providerId: provider.id,
					code: code
				})
				.success(function () {
					teaweb.success("操作成功", function () {
						that.reloadProviders()
					})
				})
		})
	}

	/**
	 * 完成
	 */
	this.isFinishing = false

	this.finish = function () {
		let that = this
		teaweb.confirm("html:确定标记当前IP库已完成？<br/>后期仍然可以修改国家/地区、省份/州、城市/市、区/县、ISP运营商等信息。", function () {
			that.isFinishing = true
			that.$post("/settings/ip-library/creating/finish")
				.params({
					libraryFileId: this.libraryFileId
				})
				.timeout(300)
				.success(function () {
					teaweb.success("保存成功", function () {
						window.location = "/settings/ip-library"
					})
				})
				.done(function () {
					that.isFinishing = false
				})
		})
	}
})