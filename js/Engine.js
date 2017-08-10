
let libRoot = [
		'lib/interfaces/LibInterfaces.js',					 
   		'lib/utils/UtilManager.js', 
   		'lib/layout/LayoutManager.js',
   		'lib/events/EventManager.js',
   		'lib/css/CssManager.js',
   		'lib/html/HtmlManager.js',
  		'Settings.js'
  		]

class engine { 
	
	constructor() {
		this.interfaces = {}
		if(this.loadLib())
			window.onload = () => this.loadLib(true)
	}

	loadLib(ext) {
		let head = document.querySelector('HEAD')
		let externals = []
		if(ext) {			
			for(let root in this.settings.externalCSS) {
				let link = document.createElement('LINK')
				link.type = 'text/css'
				link.rel = 'stylesheet'
				link.href = 'js/external/'+root+'/css/'+this.settings.externalCSS[root];	
				head.insertBefore(link, document.querySelector('SCRIPT'))
			}
			for(let root in this.settings.externalJS)
				externals.push('external/'+root+'/js/'+this.settings.externalJS[root])
			externals.reverse()
			for(let ex in externals) {
				let script = document.createElement('SCRIPT')
				script.type = 'text/javascript'
				script.src = 'js/' + externals[ex]
				head.insertBefore(script, document.querySelector('SCRIPT'))
			}
		}
		for(let i in ext ? this.settings.libRoot : libRoot) {
			let script = document.createElement('SCRIPT')
			script.type = 'text/javascript'
			script.src = 'js/' + (!ext ? libRoot[i] : this.settings.libRoot[i])
			ext ? 
				head.insertAdjacentElement('beforeend', script) :
					head.insertBefore(script, document.querySelector('SCRIPT')[0+i])				
		}
		return true		
	}

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
				for(let property in this[obj.name])
					methods.push(property)
			break;
		}
		for(let i in methods) {
			if(obj.name == 'settings' || 
				obj.name == 'interfaces')
				continue
			this.interfaceExists(obj.name, methods[i])  
		}
	}

	set events(ev) {
		let evtSort = {}
		evtSort.before = []
		evtSort.currnt = []
		evtSort.after = []
		for(let e in ev) {
			if(this.evntMngr.evtList.indexOf(ev[e].evt) == -1)
				throw new TypeError('Event type does not exist in event list.')
			if(ev[e].evt.indexOf('before') != -1)
				evtSort.before.push(ev[e])
			if(ev[e].evt.indexOf('before') == -1 && 
				ev[e].evt.indexOf('after') == -1)
					evtSort.currnt.push(ev[e])
			if(ev[e].evt.indexOf('after') != -1)
				evtSort.after.push(ev[e])
		}
		this.evntMngr.applyEvent(evtSort) 
	}

	setLayout() {
		this.lytMngr.applyLayout()
	}

	interfaceExists(cls, method) {
		if(typeof this.interfaces[cls] == 'undefined')
			throw new ReferenceError('Class ['+cls+'] is not registered.')
		for(let i in method)
				if(this.interfaces[cls].methods.indexOf(method[i]) == -1)
					throw new ReferenceError('Method ['+method[i]+'] in class ['+cls+'] is not registered.')
	}

	getAllMethods(obj) {
		let props = []
	    do {
	        const l = Object.getOwnPropertyNames(obj)
	            .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
	            .sort()
	            .filter((p, i, arr) =>
	                typeof obj[p] === 'function' && 
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
