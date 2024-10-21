Tea.context(function () {
	this.success = NotifySuccess("保存成功", "/settings/user-ui/posts")

	this.type = "normal"

	// not used
	this.productCode = "";
	this.categoryId = "0";

	// reference: https://quilljs.com/docs/modules/toolbar/
	this.body = ""
	let that = this
	setTimeout(function () {
		let quill = new Quill('#editor', {
			theme: 'snow',
			modules: {
				toolbar: [
					['bold', 'italic', 'underline', 'strike'],
					// [{'header': 1}, {'header': 2}],
					// [{'list': 'ordered'}, {'list': 'bullet'}],
					// [{'indent': '-1'}, {'indent': '+1'}],
					// [{'direction': 'rtl'}],
					// [{'size': ['small', false, 'large', 'huge']}],
					// [{'header': [1, 2, 3, 4, 5, 6, false]}],
					// [{'color': []}, {'background': []}],
					// [{'font': []}],
					// [{'align': []}],
					// ['link', 'image'],
					// ['clean']
				]
			}
		})
		quill.on("text-change", function () {
			that.body = quill.root.innerHTML
		})
	}, 100)
})