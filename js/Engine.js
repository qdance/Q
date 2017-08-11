/*
 * @desc Library core file list
 * @var array
 */
let libRoot = [
		'lib/interfaces/LibInterfaces.js',					 
   		'lib/utils/UtilManager.js', 
   		'lib/layout/LayoutManager.js',
   		'lib/events/EventManager.js',
   		'lib/css/CssManager.js',
   		'lib/html/HtmlManager.js',
  		'Settings.js'
  		]
 
 /*
  * @desc Q library - Engine class
  * @author Sven Macolic | macolic.sven@gmail.com | 08/2017
  */
class engine { 
	
	/*
	 * @desc Class constructor
	 * @return void
	 */
	constructor() {
		this.interfaces = {}
		if(this.loadLib())
			window.onload = () => this.loadLib(true)
	}

	/*
	 * @desc Loading library
	 * @param (boolean) ext - To load custom user settings
	 * @return boolean
	 */
	loadLib(ext) {
		let head = document.querySelector('HEAD')
		let externals = []
		if(ext) {			
			Object.keys(this.settings.externalCSS).forEach(root => {
				let link = document.createElement('LINK')
				link.type = 'text/css'
				link.rel = 'stylesheet'
				link.href = 'js/external/'+root+'/css/'+this.settings.externalCSS[root];	
				head.insertBefore(link, document.querySelector('SCRIPT'))
			})
			Object.keys(this.settings.externalJS).forEach(root => externals.push('external/'+root+'/js/'+this.settings.externalJS[root]))
			externals.reverse()
			Object.keys(externals).forEach(ex => {
				let script = document.createElement('SCRIPT')
				script.type = 'text/javascript'
				script.src = 'js/' + externals[ex]
				head.insertBefore(script, document.querySelector('SCRIPT'))
			})
		}
		Object.keys(ext ? this.settings.libRoot : libRoot).forEach(i => {
			let script = document.createElement('SCRIPT')
			script.type = 'text/javascript'
			script.src = 'js/' + (!ext ? libRoot[i] : this.settings.libRoot[i])
			ext ? 
				head.insertAdjacentElement('beforeend', script) :
					head.insertBefore(script, document.querySelector('SCRIPT')[0+i])				
		})
		return true		
	}

	/*
	 * @desc Register library classes
	 * @param (object) obj - Class to register
	 * @return void
	 */
	set use(obj) {	
		let methods = []
		switch(obj.constructor) {
			case Function:
				this[obj.name] = new obj()
				methods.push(this.getAllMethods(this[obj.name]))
				if(this[obj.name].events) 
					this.events = this[obj.name].events
			break;
		  	case Object:
				obj.name == 'interfaces' ?
					Object.assign(this.interfaces, obj) :
						this[obj.name] = obj
				Object.keys(this[obj.name]).forEach(property => methods.push(property))					
			break;
		}

		Object.keys(methods).forEach(i => {
			if(obj.name == 'settings' || 
				obj.name == 'interfaces')
					return
			this.interfaceExists(obj.name, methods[i])  
		})
	}

	/*
	 * @desc Subscribe events
	 * @param (object) ev - Event collection
	 * @return void
	 */
	set events(ev) {
		let evtSort = {}
		evtSort.before = []
		evtSort.currnt = []
		evtSort.after = []
		Object.keys(ev).forEach(e => {
			if(this.evntMngr.evtList.indexOf(ev[e].evt) == -1)
				throw new TypeError('Event type does not exist in event list.')
			ev[e].evt.indexOf('before') != -1 &&
				evtSort.before.push(ev[e])
			ev[e].evt.indexOf('before') == -1 && 
				ev[e].evt.indexOf('after') == -1 && 
					evtSort.currnt.push(ev[e])
			ev[e].evt.indexOf('after') != -1 &&
				evtSort.after.push(ev[e])
		})
		this.evntMngr.applyEvent(evtSort) 
	}

	/*
	 * @desc Apply layout
	 * @return void
	 */
	setLayout() {
		this.lytMngr.applyLayout()
	}

	/*
	 * @desc Check defined interface list
	 * @params (string) cls - Class name
	 * @params (string) method - Class method name
	 * @return void
	 */
	interfaceExists(cls, method) {
		if(typeof this.interfaces[cls] == 'undefined')
			throw new ReferenceError('Class ['+cls+'] is not registered.')
		Object.keys(method).forEach(i => {
			if(this.interfaces[cls].methods.indexOf(method[i]) == -1)
				throw new ReferenceError('Method ['+method[i]+'] in class ['+cls+'] is not registered.')
		})
	}

	/*
	 * @desc Iterate registered classes methods
	 * @params (object) obj - Class to iterate
	 * @return array
	 */
	getAllMethods(obj) {
		let props = []
	    do {
	        const l = Object.getOwnPropertyNames(obj)
	            .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
	            .sort()
	            .filter((p, i, arr) =>
	                obj[p].constructor === Function && 
	                	p !== 'constructor' &&       
	                		(i == 0 || p !== arr[i - 1]) &&  
	                			props.indexOf(p) === -1     
	            )
	        props = props.concat(l)
	    } while((obj = Object.getPrototypeOf(obj)) && 
	        		Object.getPrototypeOf(obj))
	    return props
	}

}

let Q = new engine();
