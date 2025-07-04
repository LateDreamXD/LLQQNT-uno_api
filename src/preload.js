const {ipcRenderer, contextBridge} = require('electron');

function invokeUNO(name, method, args) {
	return ipcRenderer.invoke('LiteLoader.unofficial.api', name, method, args);
}

contextBridge.exposeInMainWorld('LLQQNTuno', {
	api: {
		app: {
			restart(...args) {return invokeUNO('app','restart', args);},
			openURL(...args) {return invokeUNO('app', 'openURL', args);},
		},
		plugin: {
			rmdata(...args) {return invokeUNO('plugin', 'rmdata', args);},
			install(...args) {return invokeUNO('plugin', 'install', args);},
			hotload(...args) {return invokeUNO('plugin', 'hotload', args);}
		}
	}
});
