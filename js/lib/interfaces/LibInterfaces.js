
let libInterfaces = {
			name: 'interfaces',
			utlMngr: {
				type: 'class',
				methods: [
					'xhrHeaders',					
					'xhrUrl',
					'xhrMethod',
					'xhrDo',
					'xhrResponse',
					'xhrCallback'
					]
			},
			evntMngr: {
				type: 'class',
				methods: [
					'applyEvent', 
					'setEvent', 
					'eventHub',
					'beforeEvent', 
					'currentEvent', 
					'afterEvent', 
					'domEvent', 
					'attrEvent',					
					'eventParse'
					]
			},
			lytMngr: {
				type: 'class',
				methods: [
					'shell',
					'appendElements',
					'applyLayout',
					'getEl',
					'add',
					'remove'
					]
			},
			cssMngr: {
				type: 'class',
				methods: [
					'hide',
					'show'
				]
			},
			htmlMngr: {
				type: 'class',
				methods: [
					'create'
				]
			}
}

Q.use = libInterfaces;  