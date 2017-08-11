/*
 * @desc Q library - Utility class
 * @author Sven Macolic | macolic.sven@gmail.com | 08/2017
 */
class utlMngr {

	/*
	 * @desc Class constructor
	 * @return void
	 */
	constructor() {
		this.oXhr = new XMLHttpRequest()
		this.xhrmethod = 'POST'
		this.xhrHeadersList = [{
			key: 'Content-type',
			value: 'application/x-www-form-urlencoded'
		}]
		this.xhruri = ''
		this.xhrparams = ''
		this.callbackFn = null
		this.xhrType = 'text' 
		this.oXhr.onreadystatechange = function() {
	  		this.readyState == 4 && 
	  			this.status == 200 &&
		    		Q.utlMngr.callbackFn(Q.utlMngr.xhrResponse(this))
		}
	}

	/*
	 * @desc Request method setter
	 * @return void
	 */
	set xhrMethod(method) {
		this.xhrmethod = method 
	}

	/*
	 * @desc Request method getter
	 * @return string
	 */
	get xhrMethod() {
		return this.xhrmethod
	}

	/*
	 * @desc Request uri setter
	 * @param (string) url - Http request uri
	 * @return string
	 */
	set xhrUrl(uri) {
		this.xhrurl = uri
	}

	/*
	 * @desc Request uri getter
	 * @return string
	 */
	get xhrUri() {
		return this.xhruri
	}

	/*
	 * @desc Request callback action setter
	 * @param (function) fn - Callback function
	 * @return string
	 */
	set xhrCallback(fn) {
		this.callbackFn = fn
	}

	/*
	 * @desc Request headers setter
	 * @param (object) - Pair key value headers object
	 * @return string
	 */
	set xhrHeaders(headers) {
		this.xhrHeadersList.push(headers)
	}

	/*
	 * @desc Request headers getter
	 * @return string
	 */
	get xhrHeaders() {
		return this.xhrHeadersList
	}

	/*
	 * @desc HTTP request parameters setter
	 * @param (string) args - Pair key value parameters
	 * @return string
	 */
	set xhrParams(args) {
		this.xhrparams = args
	}

	/*
	 * @desc HTTP request parameters getter
	 * @return string
	 */
	get xhrParams() {
		return this.xhrparams
	}

	/*
	 * @desc Request execution
	 * @param (object) args - Request parameters object
	 * @return string
	 */
	xhrDo(args) {
		if(args) {
			if(!args.method)
				throw new ReferenceError('Error [key:method]: Request method is not defined.')
			if(!args.uri)
				throw new ReferenceError('Error [key:url]: Request URI is not defined.')
			if(!args.params)
				throw new ReferenceError('Error [key:params]: Request parameters are not defined.')
			if(!args.fn)
				throw new ReferenceError('Error [key:fn]: Request callback function is not defined.')
			this.xhrMethod = args.method
			this.xhrUrl = args.uri
			this.xhrParams = args.params
			this.xhrCallback = args.fn
		}
		this.oXhr.open(this.xhrMethod, this.xhrUri, true)
		Object.keys(this.xhrHeaders).forEach((header) => this.oXhr.setRequestHeader(this.xhrHeaders[header].key, this.xhrHeaders[header].value))
		this.oXhr.send(this.xhrmethod.toLowerCase() == 'post' ? this.xhrParams : null)
	}

	/*
	 * @desc Define HTTP request response type
	 * @param (object) xhr - Response object
	 * @return string
	 */
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