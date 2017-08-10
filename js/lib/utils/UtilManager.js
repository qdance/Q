
class utlMngr {

	constructor() {
		this.oXhr = new XMLHttpRequest()
		this.xhrmethod = 'POST'
		this.xhrHeadersList = [{
			key: 'Content-type',
			value: 'application/x-www-form-urlencoded'
		}]
		this.xhrurl = ''
		this.xhrparams = ''
		this.callbackFn = null
		this.xhrType = 'text' 
		this.oXhr.onreadystatechange = function() {
	  		if(this.readyState == 4 && 
	  			this.status == 200)
		    		Q.utlMngr.callbackFn(Q.utlMngr.xhrResponse(this))
		}
	}

	set xhrMethod(method) {
		this.xhrmethod = method 
	}

	get xhrMethod() {
		return this.xhrmethod
	}

	set xhrUrl(url) {
		this.xhrurl = url
	}
	get xhrUrl() {
		return this.xhrurl
	}

	set xhrCallback(fn) {
		this.callbackFn = fn
	}

	set xhrHeaders(headers) {
		this.xhrHeadersList.push(headers)
	}

	get xhrHeaders() {
		return this.xhrHeadersList
	}

	set xhrParams(args) {
		this.xhrparams = args
	}

	get xhrParams() {
		return this.xhrparams
	}

	xhrDo(args) {
		if(args) {
			if(!args.method)
				throw new ReferenceError('Error [key:method]: Request method is not defined.')
			if(!args.url)
				throw new ReferenceError('Error [key:url]: Request URI is not defined.')
			if(!args.params)
				throw new ReferenceError('Error [key:params]: Request parameters are not defined.')
			if(!args.fn)
				throw new ReferenceError('Error [key:fn]: Request callback function is not defined.')
			this.xhrMethod = args.method
			this.xhrUrl = args.url
			this.xhrParams = args.params
			this.xhrCallback = args.fn
		}
		this.oXhr.open(this.xhrMethod, this.xhrUrl, true)
		for(let header in this.xhrHeaders)
			this.oXhr.setRequestHeader(this.xhrHeaders[header].key, this.xhrHeaders[header].value)
		this.oXhr.send(this.xhrmethod.toLowerCase() == 'post' ? this.xhrParams : null)
	}

	xhrResponse(xhr) {
		switch(this.xhrType.toLowerCase()) {
			case 'text':
				return xhr.responseText
			break
			case 'json':
				return JSON.parse(xhr.responseText)
			break
			case 'xml':
				return xhr.responseXML
			break
			default:
				throw new TypeError('Request response type is not defined or missmatched.')
			break
		}
	}

}

Q.use = utlMngr;