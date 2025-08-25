import { platform, arch } from './__systemInfo__'
export const version = '135.0.1'
export const betaVer = '24'

const supportPlatform = [
	'lin.arm64',
	'lin.i686',
	'lin.x86_64',
	'mac.arm64',
	'mac.x86_64',
	'win.i686',
	'win.x86_64',
]

let fileDownload = ''

if (platform === 'linux') {
	fileDownload = arch.includes('arm')
		? 'lin.arm64'
		: arch.includes('64')
		? 'lin.x86_64'
		: 'lin.i686'
} else if (platform === 'darwin') {
	fileDownload = arch.includes('arm') ? 'mac.arm64' : 'mac.x86_64'
} else if (platform === 'win32') {
	fileDownload = arch.includes('64') ? 'win.x86_64' : 'win.i686'
}

export const downloadLink = `https://github.com/daijro/camoufox/releases/download/v${version}-beta.${betaVer}/camoufox-${version}-beta.${betaVer}-${fileDownload}.zip`
