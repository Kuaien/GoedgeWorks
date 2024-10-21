Tea.context(function () {
	this.isUpdatingDomains = false
	this.hasDeletedDomains = this.domains.$find(function (k, v) {
		return v.isDeleted
	}) != null

	this.$delay(function () {
		if (this.pageNo <= 1 && this.filter.length == 0) {
			this.syncDomains()
		}
	})

	this.syncDomains = function () {
		this.isUpdatingDomains = true
		this.$post(".syncDomains")
			.params({
				providerId: this.provider.id
			})
			.success(function (resp) {
				if (resp.data.hasChanges) {
					teaweb.reload()
				}
			})
			.done(function () {
				this.$delay(function () {
					this.isUpdatingDomains = false
				}, 1000)
			})
	}

	this.updateProvider = function (providerId) {
		teaweb.popup(Tea.url(".updatePopup?providerId=" + providerId), {
			height: "28em",
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.createDomain = function () {
		teaweb.popup("/dns/domains/createPopup?providerId=" + this.provider.id, {
			title: '添加管理域名',
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.updateDomain = function (domainId) {
		teaweb.popup("/dns/domains/updatePopup?domainId=" + domainId, {
			title: '修改管理域名',
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.deleteDomain = function (domain) {
		let that = this
		teaweb.confirm("确定要删除域名\"" + domain.name + "\"吗？", function () {
			that.$post("/dns/domains/delete")
				.params({
					domainId: domain.id
				})
				.post()
				.refresh()
		})
	}

	this.recoverDomain = function (domain) {
		let that = this
		teaweb.confirm("确定要恢复域名\"" + domain.name + "\"吗？", function () {
			that.$post("/dns/domains/recover")
				.params({
					domainId: domain.id
				})
				.post()
				.refresh()
		})
	}

	this.syncDomain = function (index, domain) {
		let that = this
		teaweb.confirm("确定要同步此域名下的所有解析记录吗？", function () {
			domain.isSyncing = true
			Vue.set(that.domains, index, domain)

			this.$post("/dns/domains/sync")
				.params({
					domainId: domain.id
				})
				.success(function () {
					teaweb.success("同步成功", function () {
						teaweb.reload()
					})
				})
				.fail(function (resp) {
					teaweb.warn(resp.message, function () {
						if (resp.data.shouldFix) {
							window.location = "/dns/issues"
						}
					})
				})
				.done(function () {
					Vue.set(that.domains, index, domain)
				})
		})
	}

	this.showRoutes = function (domainId) {
		teaweb.popup("/dns/domains/routesPopup?domainId=" + domainId, {
			title: '域名支持的线路',
		})
	}

	this.viewClusters = function (domainId) {
		teaweb.popup("/dns/domains/clustersPopup?domainId=" + domainId, {
			title: '使用域名的集群',
		})
	}

	this.viewNodes = function (domainId) {
		teaweb.popup("/dns/domains/nodesPopup?domainId=" + domainId, {
			title: '使用域名的节点',
			width: "50em",
			height: "30em"
		})
	}

	this.viewServers = function (domainId) {
		teaweb.popup("/dns/domains/serversPopup?domainId=" + domainId, {
			title: '使用域名的网站',
			width: "50em",
			height: "30em"
		})
	}

	this.alertDown = function () {
		teaweb.popupTip("当前域名已从服务商下线")
	}
})