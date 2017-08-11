/*
 * @desc Q library - Event manager class
 * @author Sven Macolic | macolic.sven@gmail.com | 08/2017
 */
class evntMngr {

	/*
	 * @desc Class constructor
	 * @return void
	 */
	constructor() {
		this.evtList = [
			'beforeclick', 'click', 'afterclick',
			'beforechange', 'change', 'afterchange',
			'beforeselect', 'select', 'afterselect',
			'beforemouseover', 'mouseover', 'aftermouseover',
			'beforemouseout', 'mouseout', 'aftermouseout', 
			'beforemousedown', 'mousedown', 'aftermousedown',
			'beforemouseup', 'mouseup', 'aftermouseup',
			'beforekeyup', 'keyup', 'afterkeyup',
			'beforekeydown', 'keydown', 'afterkeydown',
			'beforeadd', 'add', 'afteradd', 
			'beforeadded', 'added', 'afteradded', 
			'beforeremove', 'remove', 'afterremove',
			'beforeremoved', 'removed', 'afterremoved',
			'beforeshow', 'show', 'aftershow',
			'beforehide', 'hide', 'afterhide'
		]	

		this.observer = new MutationObserver((mutations) => 
			mutations.forEach((mutation) => 
				this.eventHub(mutation, this.eventSet[mutation.target.id])))

 		this.observerConfig = { 
 			childList: true, 
 			attributes: true, 
 			attributeOldValue: true
 		}

 		this.eventSet = []
 		this.currentEventName = []
	}

	/*
	 * @desc Mapping event collection
	 * @param (object) obj - event collection
	 * @return object
	 */
	applyEvent(obj) {
		let evtObj = {}
		let el = {}

		let objMap = Object.keys(obj).map((k) => {
			Object.keys(obj[k]).forEach((i) => {
				let key = obj[k][i].obj.id
				if(el[key] == undefined)
					el[key] = {}
				el[key].owner = obj[k][i].obj;
				el[key][obj[k][i].evt] = obj[k][i].fn
			})
			return el
		})

		Object.keys(objMap).forEach((k) => Object.assign(evtObj, objMap[k]))

		Object.keys(evtObj).forEach((o) => {
			Object.keys(evtObj[o]).forEach((e) => {
				e.indexOf('before') == -1 && 
					e.indexOf('after') == -1 && 
						e.indexOf('owner') == -1 &&
							this.setEvent(evtObj[o], e)
			})
		})
	}

	/*
	 * @desc Subscribe events
	 * @param (object) obj - event collection
	 * @param (string) e - event name
	 * @return void
	 */
	setEvent(obj, e) {
		this.currentEventName[obj.owner.id] = []
		switch(e) {
			case 'click':
			case 'mouseover':
			case 'mouseout':
			case 'mousedown':
			case 'mouseup':
			case 'keyup':
			case 'keydown':
			case 'change':
			case 'select':
				obj.owner.addEventListener(e, () => {
					obj['before'+e] != undefined ?
						obj['after'+e] != undefined ?
							this.beforeEvent(obj['before'+e], obj[e], obj['after'+e]) :
								this.beforeEvent(obj['before'+e], obj[e]) :
							this.currentEvent(obj[e], obj['after'+e])
				})
			break
			case 'add':
			case 'remove':
			case 'show':
			case 'hide':
				this.eventSet[obj.owner.id] = obj	
				this.observer.observe(obj.owner, this.observerConfig)	
			break
			case 'added':
			case 'removed':
				obj.owner.parentNode.isParent = true
				this.eventSet[obj.owner.parentNode.id] = obj	
				this.observer.observe(obj.owner.parentNode, this.observerConfig)
			break
		}
	}

	/*
	 * @desc Mutation events placeholder
	 * @param (object) mutation - mutation object
	 * @param (object) obj - event collection
	 * @return void
	 */
	eventHub(mutation, obj) {
	    let e = this.eventParse(mutation, mutation.target.isParent ? true : false)
		obj['before'+e] != undefined ?
			obj['after'+e] != undefined ?
				this[mutation.type == 'childList' ? 'domEvent' : 'attrEvent'](mutation, this.beforeEvent(obj['before'+e], obj[e], obj['after'+e]), e) :
					this[mutation.type == 'childList' ? 'domEvent' : 'attrEvent'](mutation, this.beforeEvent(obj['before'+e], obj[e]), e) :
				this[mutation.type == 'childList' ? 'domEvent' : 'attrEvent'](mutation, this.currentEvent(obj[e], obj['after'+e]), e)
	}

	/*
	 * @desc Detect mutation event name
	 * @param (obj) obj - mutation object
	 * @param (boolean) prnt - check if event is triggered by parent dom node
	 * @return string
	 */
	eventParse(obj, prnt) {
		if(obj.type == 'childList') {
			if(obj.addedNodes.length > 0)
				return prnt ? 'added' : 'add'
			if(obj.removedNodes.length > 0)
				return prnt ? 'removed' : 'remove'
		}
		if(obj.type == 'attributes')
			if(obj.attributeName == 'style')
				return obj.target.style.display == 'none' ? 'hide' : 'show'
	}

	/*
	 * @desc Event placeholder on before event subscription
	 * @param (function) beforeFn - action to trigger before an event
	 * @param (function) currentFn - action to trigger on event
	 * @param (function) afterFn - action to trigger after an event
	 * @return void
	 */
	beforeEvent(beforeFn, currentFn, afterFn) {
		beforeFn()
		this.currentEvent(currentFn, afterFn)
	}

	/*
	 * @desc Event placeholder on event subscription
	 * @param (function) currentFn - action to trigger on event
	 * @param (function) afterFn - action to trigger after an event
	 * @return void
	 */
	currentEvent(currentFn, afterFn) {
		currentFn()
		afterFn && 
			afterFn()
	}

	/*
	 * @desc Event placeholder for dom event subscription
	 * @param (object) mutation - mutation object
	 * @param (function) fn - action to trigger
	 * @param (string) e - event name
	 * @return void
	 */
	domEvent(mutation, fn, e) {
		if(!fn) return
		(e == 'add' || e == 'added') &&
			mutation.addedNodes.length > 0 && fn
		(e == 'remove' || e == 'removed') &&
			mutation.removedNodes.length > 0 && fn
	}

	/*
	 * @desc Event placeholder for attriobute event subscription
	 * @param (object) mutation - mutation object
	 * @param (function) fn - action to trigger
	 * @param (string) e - event name
	 * @return void
	 */
	attrEvent(mutation, fn, e) {
		mutation.attributeName == 'style' && e == 'show' && 
			mutation.target.getAttribute('style').indexOf('block') != -1 && fn
		mutation.attributeName == 'style' && e == 'hide' && 
			mutation.target.getAttribute('style').indexOf('none') != -1 && fn
	}

}

Q.use = evntMngr; 