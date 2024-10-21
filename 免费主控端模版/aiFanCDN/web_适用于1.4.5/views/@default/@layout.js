Tea.context(function () {
	this.templateMode = localStorage.getItem("teaDarkMode")
	this.moreOptionsVisible = false
	this.globalMessageBadge = 0

	if(localStorage.isDebug){
		this.isDebug = true;
		window.IS_DEBUG = true;
	}else{
		this.isDebug = false;
		window.IS_DEBUG = false;
		console.error('debug mode is off');
	}


	if (typeof this.leftMenuItemIsDisabled == "undefined") {
		this.leftMenuItemIsDisabled = false
	}

	this.$delay(function () {
		if (this.$refs.focus != null) {
			this.$refs.focus.focus()
		}

		if (!window.IS_POPUP) {
			// 检查消息
			this.checkMessages()

			// 检查集群节点同步
			this.loadNodeTasks();

			// 检查DNS同步
			this.loadDNSTasks()
		}
	})

	/**
	 * 切换模板
	 */
	this.themePanelVisible = false;
	this.themePanelPosition = {
		top: 0,
		left: 0,
	};
	this.showThemePanel = (ev)=>{
		this.themePanelVisible=true;
		ev.stopPropagation();

		const rect = ev.target.getBoundingClientRect();
		this.themePanelPosition = {
			top: rect.top + rect.height + 5 + 15,
			left: rect.left - 95,
		};
	};

	document.addEventListener('click', (e)=>{
		this.themePanelVisible=false;
	});
	document.addEventListener('scroll', (e)=>{
		this.themePanelVisible=false;
	});
	window.addEventListener('resize', (e)=>{
		this.themePanelVisible=false;
	});

	this.changeTheme = function (theme) {
		this.$post("/ui/theme")
			.params({theme})
			.success(function (resp) {
				teaweb.successToast("界面风格已切换")
				this.teaTheme = resp.data.theme
			})
	}
	
	let notes = localStorage.getItem('notes');
	if(notes){
		this.notesText = notes;
	}else{
		this.notesText = "便签中的内容会存储在本地，这样即便你关掉了浏览器，在下次打开时依然会读取到上一次的记录。是个非常小巧实用的本地备忘录";
	}
	this.notesShow = false;
	this.openNotes = function(status){
		this.notesShow = status;
	}
	this.handleNotes = function(){
		localStorage.setItem('notes', this.notesText);
	}
	Vue.directive('draggable', {
		bind: function (el, binding, vnode) {
			var isDragging = false;
			var offsetX = 0;
			var offsetY = 0;
			el.addEventListener('mousedown', function (event) {
				if (event.target.tagName.toLowerCase() === 'textarea') {
					return;
				}
				isDragging = true;
				offsetX = event.clientX - el.offsetLeft;
				offsetY = event.clientY - el.offsetTop;
			});
			document.addEventListener('mousemove', function (event) {
				if (isDragging) {
					var left = event.clientX - offsetX;
					var top = event.clientY - offsetY;
	
					el.style.left = left + 'px';
					el.style.top = top + 'px';
	
					vnode.context.left = left;
					vnode.context.top = top;
				}
			});
			document.addEventListener('mouseup', function (event) {
				isDragging = false;
			});
		}
	})

	/**
	 * 左侧子菜单
	 */
	this.showSubMenu = function (menu) {
		if (menu.alwaysActive) {
			return
		}
		if (this.teaSubMenus.menus != null && this.teaSubMenus.menus.length > 0) {
			this.teaSubMenus.menus.$each(function (k, v) {
				if (menu.id == v.id) {
					return
				}
				v.isActive = false
			})
		}
		menu.isActive = !menu.isActive
	};

	/**
	 * 检查消息
	 */
	this.checkMessages = function () {
		this.$post("/messages/badge")
			.params({})
			.success(function (resp) {
				this.globalMessageBadge = resp.data.count

				// add dot to title
				let dots = "••• "
				if (typeof document.title == "string") {
					if (resp.data.count > 0) {
						if (!document.title.startsWith(dots)) {
							document.title = dots + document.title
						}
					} else if (document.title.startsWith(dots)) {
						document.title = document.title.substring(dots.length)
					}
				}
			})
			.done(function () {
				let delay = 6000
				if (this.globalMessageBadge > 0) {
					delay = 30000
				}
				this.$delay(function () {
					this.checkMessages()
				}, delay)
			})
	}

	this.checkMessagesOnce = function () {
		this.$post("/messages/badge")
			.params({})
			.success(function (resp) {
				this.globalMessageBadge = resp.data.count
			})
	}

	this.showMessages = function () {
		console.log(teaweb.popup);
		teaweb.popup("/messages", {
			title: "消息",
			height: "28em",
			width: "50em"
		})
	}

	/**
	 * 底部伸展框
	 */
	this.showQQGroupQrcode = function () {
		teaweb.popup("/about/qq", {
			title: 'QQ群',
			width: "21em",
			height: "30em"
		})
	}

	/**
	 * 弹窗中默认成功回调
	 */
	if (window.IS_POPUP === true) {
		this.success = window.NotifyPopup
	}

	/**
	 * 节点同步任务
	 */
	this.doingNodeTasks = {
		isDoing: false,
		hasError: false,
		isUpdated: false
	}

	this.loadNodeTasks = function () {
		if (!Tea.Vue.teaCheckNodeTasks) {
			return
		}
		let isStream = false
		this.$post("/clusters/tasks/check")
			.params({
				isDoing: this.doingNodeTasks.isDoing ? 1 : 0,
				hasError: this.doingNodeTasks.hasError ? 1 : 0,
				isUpdated: this.doingNodeTasks.isUpdated ? 1 : 0
			})
			.timeout(60)
			.success(function (resp) {
				this.doingNodeTasks.isDoing = resp.data.isDoing
				this.doingNodeTasks.hasError = resp.data.hasError
				this.doingNodeTasks.isUpdated = true
				isStream = resp.data.shouldWait
			})
			.done(function () {
				this.$delay(function () {
					this.loadNodeTasks()
				}, isStream ? 5000 : 30000)
			})
	}

	this.showNodeTasks = function () {
		teaweb.popup("/clusters/tasks/listPopup", {
			title: '正在同步的节点任务',
			height: "28em",
			width: "54em"
		})
	}

	/**
	 * DNS同步任务
	 */
	this.doingDNSTasks = {
		isDoing: false,
		hasError: false,
		isUpdated: false
	}

	this.loadDNSTasks = function () {
		if (!Tea.Vue.teaCheckDNSTasks) {
			return
		}
		let isStream = false
		this.$post("/dns/tasks/check")
			.params({
				isDoing: this.doingDNSTasks.isDoing ? 1 : 0,
				hasError: this.doingDNSTasks.hasError ? 1 : 0,
				isUpdated: this.doingDNSTasks.isUpdated ? 1 : 0
			})
			.timeout(60)
			.success(function (resp) {
				this.doingDNSTasks.isDoing = resp.data.isDoing
				this.doingDNSTasks.hasError = resp.data.hasError
				this.doingDNSTasks.isUpdated = true
				isStream = resp.data.isStream
			})
			.done(function () {
				this.$delay(function () {
					this.loadDNSTasks()
				}, isStream ? 5000 : 30000)
			})
	}

	this.showDNSTasks = function () {
		teaweb.popup("/dns/tasks/listPopup", {
			title: '正在同步的DNS任务',
			height: "28em",
			width: "54em"
		})
	}

	this.LANG = function (code) {
		if (window.LANG_MESSAGES != null) {
			let message = window.LANG_MESSAGES[code]
			if (typeof message == "string") {
				return message
			}
		}
		if (window.LANG_MESSAGES_BASE != null) {
			let message = window.LANG_MESSAGES_BASE[code]
			if (typeof message == "string") {
				return message
			}
		}
		return "{{ LANG('" + code + "') }}"
	}

	this.switchLang = function () {
		this.$post("/settings/lang/switch")
			.success(function () {
				window.location.reload()
			})
	}

	// set class on html "dark/light"
	document.documentElement.classList.remove("light");
	document.documentElement.classList.remove("dark");

	let darkMode = localStorage.getItem("teaDarkMode");
	if (darkMode === "dark") {
		document.documentElement.classList.add("dark");
	}else{
		document.documentElement.classList.add("light");
	}

	this.switchDarkMode = function () {
		// set localStorage
		let darkMode = localStorage.getItem("teaDarkMode");
		document.documentElement.classList.remove("light");
		document.documentElement.classList.remove("dark");
	
		if (darkMode === "dark") {
			localStorage.setItem("teaDarkMode", "light");
			document.documentElement.classList.add("light");
		} else {
			localStorage.setItem("teaDarkMode", "dark");
			document.documentElement.classList.add("dark");
		}
		this.templateMode = darkMode;
		window.location.reload();
	}

	// main menu
	this.menuVisible = false;
	this.triggerMobileMenu = function () {
		this.menuVisible = !this.menuVisible;
	}

	// 
	this.expandedMenu = window.TEA.ACTION.data.teaMenu;
	this.toggleMenu = function (menu) {
		if(this.expandedMenu===menu){
			this.expandedMenu = null;
		}else{
			this.expandedMenu = menu;
		}
	};
	this.isMenuExpanded = function (menu) {
		return this.expandedMenu===menu;
	};
	this.isSubMenuActive = function (menu) {
		return window.location.pathname.split('?')[0] == menu?.split('?')[0];
	}

	this.iconMap = {
		'dashboard': 'pi-gauge',
		'clone outsize': 'pi-clone',
		'cloud': 'pi-cloud',
		'globe': 'pi-globe',
		'cubes': 'pi-map',
		'users': 'pi-users',
		'yen sign': 'pi-dollar',
		'ticket': 'pi-ticket',
		'user secret': 'pi-users',
		'history': 'pi-history',
		'setting': 'pi-cog',
		'puzzle piece': 'pi-th-large',
	};

	this.iconMap2 = {
		'dashboard': 'pi-chart-bar',
		'chart area': 'pi-chart-line',
		'history': 'pi-history',
		'setting': 'pi-cog',
		'trash': 'pi-trash',
	};

	this.filterPageContent = (pageHtml)=>{
		if(!pageHtml){
			return pageHtml;
		}

		try{
			const div = document.createElement('div');
			div.innerHTML = pageHtml;

			let arr = Array.from(div.children[0].children);

			// first, prev,
			// ...arr,
			// next, last,
			// select,
			const first = arr.shift();
			const prev = arr.shift();
			const select = arr.pop();
			const last = arr.pop();
			const next = arr.pop();

			const hasPrev = Boolean(prev.href);
			if(!hasPrev){
				prev.classList.add('disabled');
				first.classList.add('disabled');
			}

			const hasNext = Boolean(next.href);
			if(!hasNext){
				next.classList.add('disabled');
				last.classList.add('disabled');
			}

			const dotIndex = arr.findIndex((item)=>item.innerHTML==='...');
			arr.splice(dotIndex, 1);

			const currentIndex = arr.findIndex((item)=>item.classList.contains('active'));

			let s,e;
			if(currentIndex==0 || currentIndex==1 || currentIndex==2){
				s=0;
				e=5;
			}else if(currentIndex==arr.length-1 || currentIndex==arr.length-2 || currentIndex==arr.length-3){
				s=arr.length-5;
				e=arr.length;
			}else{
				s=currentIndex-2;
				e=currentIndex+3;
			}

			s=Math.max(s, 0);
			e=Math.min(e, arr.length);

			arr = arr.slice(s, e);

			// 
			first.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon p-paginator-first-icon" aria-hidden="true" data-pc-section="firsticon"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.71602 11.164C5.80782 11.2021 5.9063 11.2215 6.00569 11.221C6.20216 11.2301 6.39427 11.1612 6.54025 11.0294C6.68191 10.8875 6.76148 10.6953 6.76148 10.4948C6.76148 10.2943 6.68191 10.1021 6.54025 9.96024L3.51441 6.9344L6.54025 3.90855C6.624 3.76126 6.65587 3.59011 6.63076 3.42254C6.60564 3.25498 6.525 3.10069 6.40175 2.98442C6.2785 2.86815 6.11978 2.79662 5.95104 2.7813C5.78229 2.76598 5.61329 2.80776 5.47112 2.89994L1.97123 6.39983C1.82957 6.54167 1.75 6.73393 1.75 6.9344C1.75 7.13486 1.82957 7.32712 1.97123 7.46896L5.47112 10.9991C5.54096 11.0698 5.62422 11.1259 5.71602 11.164ZM11.0488 10.9689C11.1775 11.1156 11.3585 11.2061 11.5531 11.221C11.7477 11.2061 11.9288 11.1156 12.0574 10.9689C12.1815 10.8302 12.25 10.6506 12.25 10.4645C12.25 10.2785 12.1815 10.0989 12.0574 9.96024L9.03158 6.93439L12.0574 3.90855C12.1248 3.76739 12.1468 3.60881 12.1204 3.45463C12.0939 3.30045 12.0203 3.15826 11.9097 3.04765C11.7991 2.93703 11.6569 2.86343 11.5027 2.83698C11.3486 2.81053 11.19 2.83252 11.0488 2.89994L7.51865 6.36957C7.37699 6.51141 7.29742 6.70367 7.29742 6.90414C7.29742 7.1046 7.37699 7.29686 7.51865 7.4387L11.0488 10.9689Z" fill="currentColor"></path></svg>`;
			prev.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon p-paginator-prev-icon" aria-hidden="true" data-pc-section="previcon"><path d="M8.75 11.185C8.65146 11.1854 8.55381 11.1662 8.4628 11.1284C8.37179 11.0906 8.28924 11.0351 8.22 10.965L4.72 7.46496C4.57955 7.32433 4.50066 7.13371 4.50066 6.93496C4.50066 6.73621 4.57955 6.54558 4.72 6.40496L8.22 2.93496C8.36095 2.84357 8.52851 2.80215 8.69582 2.81733C8.86312 2.83252 9.02048 2.90344 9.14268 3.01872C9.26487 3.134 9.34483 3.28696 9.36973 3.4531C9.39463 3.61924 9.36303 3.78892 9.28 3.93496L6.28 6.93496L9.28 9.93496C9.42045 10.0756 9.49934 10.2662 9.49934 10.465C9.49934 10.6637 9.42045 10.8543 9.28 10.995C9.13526 11.1257 8.9448 11.1939 8.75 11.185Z" fill="currentColor"></path></svg>`;

			next.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon p-paginator-next-icon" aria-hidden="true" data-pc-section="nexticon"><path d="M5.25 11.1728C5.14929 11.1694 5.05033 11.1455 4.9592 11.1025C4.86806 11.0595 4.78666 10.9984 4.72 10.9228C4.57955 10.7822 4.50066 10.5916 4.50066 10.3928C4.50066 10.1941 4.57955 10.0035 4.72 9.86283L7.72 6.86283L4.72 3.86283C4.66067 3.71882 4.64765 3.55991 4.68275 3.40816C4.71785 3.25642 4.79932 3.11936 4.91585 3.01602C5.03238 2.91268 5.17819 2.84819 5.33305 2.83149C5.4879 2.81479 5.64411 2.84671 5.78 2.92283L9.28 6.42283C9.42045 6.56346 9.49934 6.75408 9.49934 6.95283C9.49934 7.15158 9.42045 7.34221 9.28 7.48283L5.78 10.9228C5.71333 10.9984 5.63193 11.0595 5.5408 11.1025C5.44966 11.1455 5.35071 11.1694 5.25 11.1728Z" fill="currentColor"></path></svg>`;
			last.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon p-paginator-last-icon" aria-hidden="true" data-pc-section="lasticon"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.68757 11.1451C7.7791 11.1831 7.8773 11.2024 7.9764 11.2019C8.07769 11.1985 8.17721 11.1745 8.26886 11.1312C8.36052 11.088 8.44238 11.0265 8.50943 10.9505L12.0294 7.49085C12.1707 7.34942 12.25 7.15771 12.25 6.95782C12.25 6.75794 12.1707 6.56622 12.0294 6.42479L8.50943 2.90479C8.37014 2.82159 8.20774 2.78551 8.04633 2.80192C7.88491 2.81833 7.73309 2.88635 7.6134 2.99588C7.4937 3.10541 7.41252 3.25061 7.38189 3.40994C7.35126 3.56927 7.37282 3.73423 7.44337 3.88033L10.4605 6.89748L7.44337 9.91463C7.30212 10.0561 7.22278 10.2478 7.22278 10.4477C7.22278 10.6475 7.30212 10.8393 7.44337 10.9807C7.51301 11.0512 7.59603 11.1071 7.68757 11.1451ZM1.94207 10.9505C2.07037 11.0968 2.25089 11.1871 2.44493 11.2019C2.63898 11.1871 2.81949 11.0968 2.94779 10.9505L6.46779 7.49085C6.60905 7.34942 6.68839 7.15771 6.68839 6.95782C6.68839 6.75793 6.60905 6.56622 6.46779 6.42479L2.94779 2.90479C2.80704 2.83757 2.6489 2.81563 2.49517 2.84201C2.34143 2.86839 2.19965 2.94178 2.08936 3.05207C1.97906 3.16237 1.90567 3.30415 1.8793 3.45788C1.85292 3.61162 1.87485 3.76975 1.94207 3.9105L4.95922 6.92765L1.94207 9.9448C1.81838 10.0831 1.75 10.2621 1.75 10.4477C1.75 10.6332 1.81838 10.8122 1.94207 10.9505Z" fill="currentColor"></path></svg>`;

			const html = [
				first, prev,
				...arr,
				next, last,
				select,
			].map((item)=>item.outerHTML).join('\n');
			console.log(html);

			return html;
		}catch(e){
			console.error('failed to process page content');
			console.error(pageHtml);
			return pageHtml;
		}
	};

	this.breadcrumbs = {
		'/clusters': '集群列表',
		'/servers': '网站列表',
	};
});

window.NotifySuccess = function (message, url, params) {
	if (typeof (url) == "string" && url.length > 0) {
		if (url[0] != "/") {
			url = Tea.url(url, params);
		}
	}
	return function () {
		teaweb.success(message, function () {
			window.location = url;
		});
	};
};

window.NotifyReloadSuccess = function (message) {
	return function () {
		teaweb.success(message, function () {
			window.location.reload()
		})
	}
}

window.NotifyDelete = function (message, url, params) {
	teaweb.confirm(message, function () {
		Tea.Vue.$post(url)
			.params(params)
			.refresh();
	});
};

window.NotifyPopup = function (resp) {
	window.parent.teaweb.popupFinish(resp);
};

window.ChangePageSize = function (size) {
	let url = window.location.toString();
	url = url.replace(/page=\d+/g, "page=1")
	if (url.indexOf("pageSize") > 0) {
		url = url.replace(/pageSize=\d+/g, "pageSize=" + size)
	} else {
		if (url.indexOf("?") > 0) {
			let anchorIndex = url.indexOf("#")
			if (anchorIndex < 0) {
				url += "&pageSize=" + size;
			} else {
				url = url.substring(0, anchorIndex) + "&pageSize=" + size + url.substr(anchorIndex);
			}
		} else {
			url += "?pageSize=" + size;
		}
	}
	window.location = url;
};

// utils
window.getCssVariable = (variableName, selector)=>{
	if (selector) {
		return getComputedStyle(document.querySelector(selector)).getPropertyValue(variableName).trim();
	}else{
		return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
	}
}

Vue.component("file-upload", {
	props: ['name', 'accept', 'multiple'],
	template: `
	<div class="b-file-upload-container">
		<input type="file" :name="name" :accept="accept" :multiple="multiple" />
		<button class="b-file-upload">
			<span class="p-button-icon p-button-icon-left pi pi-plus" data-pc-section="icon"></span>
			<span>选择文件</span>
		</button>
	</div>
	`,
});

Vue.component("b-empty", {
	props: {
		large: {
			type: Boolean,
			default: false,
		},
	},
	template: `
		<div>
			<div class="b-empty" v-if="!large">
				<slot></slot>
			</div>
			<div class="b-empty-large" v-else>
				<i class="pi pi-exclamation-triangle b-empty-large-icon"></i>
				<div class="b-empty-large-message">
					<slot></slot>
				</div>
			</div>
		</div>
	`,
});

Vue.component("b-collapse", {
	props: ['title', 'links'],
	template: `
		<div class="b-collapse-container">
			<div class="title">{{title}}：</div>
			<div class="links">
				<a v-for="link in links" :href="link.href" class="link">{{link.text}}</a>
			</div>
		</div>
	`,
});

Vue.component('b-settings-header', {
	props: {
		actionText: String,
		subTitle: String,
		href: String,
	},
	template: `
		<h3 class="b-settings-header">
			<span class="title"><slot></slot></span>
			<div class="sub-title" v-if="subTitle">{{subTitle}}</div>
			<a class="action" v-if="actionText && href" :href="href">
				{{actionText}}
			</a>
			<a class="action" v-if="actionText && !href" @click.prevent="$emit('action')">
				{{actionText}}
			</a>
		</h3>
	`,
});

Vue.component('b-breadcrumb', {
	props: ['url', 'current'],
	template: `
		<div class="b-breadcrumb">
			<span class="back-container">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path data-v-a6e9e3fd="" stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path></svg>
				<a :href="url">
					<slot></slot>
				</a>
			</span>
			<i class="pi pi-angle-right arrow-right" style="opacity: .6"></i>
			<span class="current-name" style="opacity: .6">
				{{current}}
			</span>
		</div>
	`,
});

Vue.component('b-page-header', {
	props: ['backUrl', 'subTitle'],
	template: `
		<div class="b-page-head">
			<div class="title-container">
				<a :href="backUrl" class="back-btn">
					<i class="pi pi-arrow-left"></i>
				</a>

				<span class="name">
					<slot></slot>

					<span v-if="subTitle">({{subTitle}})</span>
				</span>
			</div>
		</div>
	`,
});

Vue.component('b-add-button', {
	template: `
		<button class="b-add-button" type="button" @click.prevent="$emit('click')">
			<i class="pi pi-plus"></i>
		</button>
	`,
});

// id, onchange, options
Vue.component('b-select', {
	// props: ['name', 'options', 'value'],
	props: {
		id: String,
		name: String,
		value: String,
		options: Array, // {label, value}[]
		style: String,
		autoWidth: {
			type: Boolean,
			default: false,
		},
	},
	data(){
		return {
			currentHoverIndex: -1,
			opened: false,
		};
	},
	methods: {
		handleItemClick(option){
			this.$emit('input', option.value);
			this.$emit('change', option.value);
			this.opened = false;
		},
		handleOpen(){
			this.opened = !this.opened;
		},
		documentClickHandle(e){
			if(this.opened){
				const target = e.target;
				if(target.closest('.b-select-container') && target.closest('.b-select-container').querySelector('.b-select-dropdown')){
					return;
				}
				this.opened = false;
			}
		},
	},
	mounted(){
		document.addEventListener('click', this.documentClickHandle);
	},
	unmounted(){
		document.removeEventListener('click', this.documentClickHandle);
	},
	template: `
		<div class="b-select-container" :class="{
			'auto-width': autoWidth
		}" :style="style">
			<input type="hidden" :id="id" :name="name" :value="value" />
			<div class="b-select" @click.prevent.stop="handleOpen">
				<span>{{options.find(option=>option.value==value)?.label}}</span>
				<svg width="14" height="14" viewBox="0 0 14 14" stroke="none" xmlns="http://www.w3.org/2000/svg" class="p-icon p-select-dropdown-icon" aria-hidden="true" data-pc-section="dropdownicon"><path d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z" fill="currentColor"></path></svg>
			</div>
			<div class="b-select-dropdown" v-if="opened">
				<template v-for="option, index in options">
					<div v-if="option.type==='header'" class="b-select-dropdown-header">
						{{option.label}}
					</div>
					<div v-else
						class="b-select-dropdown-item"
						:class="{
							current: option.value == value,
							hover: currentHoverIndex == index
						}"
						@click="handleItemClick(option)"
						@mouseenter="currentHoverIndex=index"
						@mouseleave="currentHoverIndex=-1"
					>
						{{option.label}}
					</div>
				</template>
			</div>
		</div>
	`,
});

Vue.component('b-button', {
	props: {
		type: {
			type: String,
			default: 'button',
		},
	},
	template: `
		<button :type="type" class="b-button" @click="$emit('click')">
			<slot></slot>
		</button>
	`,
});

Vue.component('b-notice', {
	template: `
		<div class="b-notice">
			<slot></slot>
		</div>
	`,
});

Vue.component('b-steps', {
	props: {
		steps: Array, // {label, key}[]
		current: String,
	},
	template: `
		<div class="b-steps">
			<template v-for="step, index in steps">
				<div class="step" :class="{
					current: step.key == current,
				}">
					<div class="number">
						{{index+1}}
					</div>
					<div class="label">
						{{step.label}}
					</div>
				</div>
				<div class="line" v-if="index < steps.length - 1"></div>
			</template>
		</div>
	`,
});

// status card
Vue.component('b-status-card', {
	props: {
		title: String,
	},
	template: `
		<div class="b-status-card">
			<div class="card-title" v-if="title">{{title}}</div>
			<div class="card-container">
				<slot></slot>
			</div>
		</div>
	`,
});
Vue.component('b-status-card-item', {
	props: {
		label: String,
		subLabel: String,
		span: String,
		comment: {
			type: Array,
			default: ()=>[],
		}
	},
	template: `
		<div class="b-status-card-item" :class="{
			'item-span-2': span == '2',
			'item-span-3': span == '3',
			'item-full': span == 'full',
		}">
			<div class="label" v-if="label">
				{{label}}
				<span class="sub-label" v-if="subLabel">{{subLabel}}</span>
			</div>
			<div class="value">
				<slot></slot>
			</div>
			<div class="comment" v-for="line in comment">
				<span v-html="line"></span>
			</div>
		</div>
	`,
});

// message
Vue.component('b-message', {
	props: {
		type: {
			type: String,
			default: 'info', // info warning error
		},
		closeable: {
			type: Boolean,
			default: false,
		},
		action: {
			type: Object, // {text, href}
		},
		code: String,
	},
	data(){
		return {
			visible: true,
		};
	},
	methods: {
		close(){
			this.visible = false;
			// $emit('close');
		},
	},
	template: `
		<div class="b-message" :code="code" :class="[type]" v-if="visible">
			<i v-if="type==='warning' || type==='error'" class="p-message-icon pi pi-exclamation-triangle"></i>
			<i v-else class="p-message-icon pi pi-info-circle"></i>
			<div class="b-message-content">
				<slot></slot>
			</div>
			<a v-if="closeable" href="javascript:;" class="p-message-close pi pi-times" @click="close">
		</div>
	`,
});

// label
Vue.component('b-label-group', {
	template: `
		<div v-if="$slots.default" class="b-label-group">
			<slot></slot>
		</div>
	`,
});
Vue.component('b-label', {
	props: {
		color: {
			type: String, // grey red olive
			default: 'default',
		},
		size: {
			type: String, // small tiny
			default: 'default',
		},
		href: String,
		title: String,
		text: String,
	},
	template: `
		<a
			v-if="href"
			:href="href"
			class="b-label"
			:title="title"
			:class="['color-'+color, 'size-'+size]"
		>
			<span><slot>{{text}}</slot></span>
		</a>
		<div
			v-else
			class="b-label"
			:class="['color-'+color, 'size-'+size]"
			:title="title"
		>
			<span><slot>{{text}}</slot></span>
		</div>
	`,
});