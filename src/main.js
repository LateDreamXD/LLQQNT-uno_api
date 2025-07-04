const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const admZip = (() => {
	require(join(process.resourcesPath, 'app', 'major.node')).load('internal_admzip', module);
	return exports.admZip.default;
})();
const wins = {};

Object.defineProperty(globalThis, 'LLQQNTuno', {
	configurable: false,
	value: {
		api: {
			app: {
				restart(title = '') {
					dialog.showMessageBoxSync(null, {
						type: 'info',
						title: title || 'LLQQNT-unofficial-API: 重启',
						message: '真的要重启吗？',
						buttons: ['点错了', '重启吧'],
						cancelId: 0
					}) && (app.relaunch(), app.quit());
				},
				openURL(url, options = {width: 800, height: 600}) {
					const newWin = new BrowserWindow(options);
					try {newWin.loadURL(new URL(url).href);}
					catch(e) {
						dialog.showMessageBox(null, {
							type: 'error',
							title: 'LLQQNT-unofficial-API: 打开窗口',
							message: e.message
						});
						newWin.destroy();
						return null;
					}
					return newWin;
				}
			},
			plugin: {
				rmdata(slug) {
					const dest_path = path.join(LiteLoader.path.data, slug);
					if(!fs.existsSync(dest_path)) return false;
					fs.rmSync(dest_path, {recursive: true, force: true});
				},
				install(target) {
					switch(path.extname(target).toLowerCase()) {
						case '.zip':
							let manifest_zip;
							const zip = new admZip(target);
							const zip_entries = zip.getEntries();
							zip_entries.includes('manifest.json') &&
								(manifest_zip = JSON.parse(zip.readAsText('manifest.json')));
							const install_path_zip = path.join(LiteLoader.path.plugins, manifest_zip.slug);
							fs.mkdirSync(install_path_zip, {recursive: true});
							zip.extractAllTo(install_path_zip, true);
							this.hotload(manifest_zip.slug, manifest_zip.injects);
							break;
						case '.json':
							const manifest_json = JSON.parse(fs.readFileSync(target, 'utf-8'));
							const install_path_json = path.join(LiteLoader.path.plugins, manifest_json.slug);
							fs.mkdirSync(install_path_json, {recursive: true});
							fs.cpSync(target.replace('manifest.json', ''), install_path_json);
							this.hotload(manifest_json.slug, manifest_json.injects);
							break;
						default:
							dialog.showMessageBox(null, {
			  					type: 'warning',
								title: 'LLQQNT-unofficial-API: 安装插件',
								message: `不支持的文件类型: ${path.extname(target)}`
							});
							break;
					}
				},
				hotload(slug, injects = {}) {
					console.warn('[LLQQNTuno_api] hotload is an experimental feature and may not work as expected.');
					const plugin_path = path.join(LiteLoader.path.plugins, slug);
					injects.main && require(path.join(plugin_path, injects.main));
					injects.preload && runPreloadScript(path.join(plugin_path, injects.preload));
					injects.renderer && Array.from(Object.values(wins), win => {
						win.webContents.executeJavaScript(`import('${path.join(plugin_path, injects.renderer)}');`)
					});
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

exports.onBrowserWindowCreated = (win) => {
	wins.hasOwnProperty(win.id) || (wins[win.id] = win);
}