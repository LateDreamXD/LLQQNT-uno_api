const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

Object.defineProperty(globalThis, 'LLQQNTuno', {
	configurable: false,
	value: {
		api: {
			plugin: {
				rmdata(slug) {
					const dest_path = path.join(LiteLoader.path.data, slug);
					if(!fs.existsSync(dest_path)) return false;
					fs.rmSync(dest_path, {recursive: true, force: true});
				}
			}
		}
	}
});

ipcMain.handle('LiteLoader.unofficial.api', (event, name, method, args) => {
	try {
		if (name == method) return LLQQNTuno.api[method](...args);
		else return LLQQNTuno.api[name][method](...args);
	} catch {return null;}
});