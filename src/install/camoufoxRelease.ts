const foxVersion = '135.0.1'
const betaVer = '24'

const platforms = [
	'lin.arm64',
	'lin.i686',
	'lin.x86_64',
	'mac.arm64',
	'mac.x86_64',
	'win.i686',
	'win.x86_64',
]

const assets = Object.fromEntries(
	platforms.map(platform => [
		platform,
		`camoufox-${foxVersion}-beta.${betaVer}-${platform}.zip`,
	])
)

const release = {
	path: `https://github.com/daijro/camoufox/releases/download/v${foxVersion}-beta.${betaVer}`,
	assets,
}

export default release
