
class evntMngr {
	
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
		this.observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => this.eventHub(mutation, this.eventSet[mutation.target.id]))
		})
 		this.observerConfig = { 
 			childList: true, 
 			attributes: true, 
 			attributeOldValue: true
 		}
 		this.eventSet = []
 		this.currentEventName = []
	}

	applyEvent(obj) {
		let evtObj = {}
		let el = {}
		let objMap = Object.keys(obj).map((o) => {
			for(let i in obj[o]) {
				let key = obj[o][i].obj.id
				if(typeof el[key] == 'undefined') {
					el[key] = {}
					el[key].owner = obj[o][i].obj;
				}
				el[key][obj[o][i].evt] = obj[o][i].fn
			}
			return el
		})

		for(let i in objMap)
			Object.assign(evtObj, objMap[i])

		for(let o in evtObj) {
			for(let e in evtObj[o]) {
				if(e.indexOf('before') == -1 && 
					e.indexOf('after') == -1 && 
						e.indexOf('owner') == -1) 
							this.setEvent(evtObj[o], e)
			}
		}
	}

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
					typeof obj['before'+e] != 'undefined' ?
						typeof obj['after'+e] != 'undefined' ?
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

	beforeEvent(beforeFn, currentFn, afterFn) {
		beforeFn()
		currentFn()
		if(afterFn) 
			afterFn()
	}

	currentEvent(currentFn, afterFn) {
		currentFn()
		if(afterFn) 
			afterFn()
	}

	eventHub(mutation, obj) {
	    let e = this.eventParse(mutation, mutation.target.isParent ? true : false)
		typeof obj['before'+e] != 'undefined' ?
			typeof obj['after'+e] != 'undefined' ?
				mutation.type == 'childList' ? 
					this.domEvent(mutation, this.beforeEvent(obj['before'+e], obj[e], obj['after'+e]), e) :
						this.attrEvent(mutation, this.beforeEvent(obj['before'+e], obj[e], obj['after'+e]), e) :
					mutation.type == 'childList' ? 
						this.domEvent(mutation, this.beforeEvent(obj['before'+e], obj[e]), e) :
							this.attrEvent(mutation, this.beforeEvent(obj['before'+e], obj[e]), e) :
						mutation.type == 'childList' ? 
							this.domEvent(mutation, this.currentEvent(obj[e], obj['after'+e]), e) :
								this.attrEvent(mutation, this.currentEvent(obj[e], obj['after'+e]), e)
	}

	domEvent(mutation, fn, e) {
		fn
	}

	attrEvent(mutation, fn, e) {
		if(mutation.attributeName == 'style' && 
			e == 'show' && 
			mutation.target.getAttribute('style').indexOf('block') != -1)
				fn
		if(mutation.attributeName == 'style' && 
			e == 'hide' && 
			mutation.target.getAttribute('style').indexOf('none') != -1)
				fn
	}

	eventParse(obj, prnt) {
		if(obj.type == 'childList') {
			if(obj.addedNodes.length > 0)
				return prnt ? 'added' : 'add'
			if(obj.removedNodes.length > 0)
				return prnt ? 'removed' : 'remove'
		}
		if(obj.type == 'attributes') {
			if(obj.attributeName == 'style') {
				return obj.target.style.display == 'none' ? 'hide' : 'show'
			}
		}
	}

}

Q.use = evntMngr; 