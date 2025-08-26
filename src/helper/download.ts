// import { MissingRelease } from './exceptions'
// import AdmZip from 'adm-zip';

// export class GitHubDownloader {
// 	githubRepo: string
// 	apiUrl: string

// 	constructor(githubRepo: string) {
// 		this.githubRepo = githubRepo
// 		this.apiUrl = `https://api.github.com/repos/${githubRepo}/releases`
// 	}

// 	checkAsset(asset: any): any {
// 		return asset.browser_download_url
// 	}

// 	missingAssetError(): void {
// 		throw new MissingRelease(
// 			`Could not find a release asset in ${this.githubRepo}.`
// 		)
// 	}

// 	async getAsset(
// 		{ retries }: { retries: number } = { retries: 5 }
// 	): Promise<any> {
// 		let attempts = 0
// 		let response: Response | undefined

// 		while (attempts < retries) {
// 			try {
// 				response = await fetch(this.apiUrl)
// 				if (response.ok) break
// 			} catch (e) {
// 				console.error(e, `retrying (${attempts + 1}/${retries})...`)
// 				setTimeout(() => {
// 					console.log('Hello after 1 second')
// 				}, 5e3)
// 			}
// 			attempts++
// 		}
// 		if (!response || !response.ok) {
// 			throw new Error(
// 				`Failed to fetch releases from ${this.apiUrl} after ${retries} attempts`
// 			)
// 		}

// 		const releases = await response.json()

// 		for (const release of releases) {
// 			for (const asset of release.assets) {
// 				const data = this.checkAsset(asset)
// 				if (data) {
// 					return data
// 				}
// 			}
// 		}

// 		this.missingAssetError()
// 	}
// }


// class Version {
//     release: string;
//     version?: string;
//     sorted_rel: number[];

//     constructor(release: string, version?: string) {
//         this.release = release;
//         this.version = version;
//         this.sorted_rel = this.buildSortedRel();
//     }

//     private buildSortedRel(): number[] {
//         const parts = this.release.split('.').map(x => (isNaN(Number(x)) ? x.charCodeAt(0) - 1024 : Number(x)));
//         while (parts.length < 5) {
//             parts.push(0);
//         }
//         return parts;
//     }

//     get fullString(): string {
//         return `${this.version}-${this.release}`;
//     }

//     equals(other: Version): boolean {
//         return this.sorted_rel.join('.') === other.sorted_rel.join('.');
//     }

//     lessThan(other: Version): boolean {
//         for (let i = 0; i < this.sorted_rel.length; i++) {
//             if (this.sorted_rel[i] < other.sorted_rel[i]) return true;
//             if (this.sorted_rel[i] > other.sorted_rel[i]) return false;
//         }
//         return false;
//     }

//     isSupported(): boolean {
//         return VERSION_MIN.lessThan(this) && this.lessThan(VERSION_MAX);
//     }

//     static fromPath(filePath: PathLike = INSTALL_DIR): Version {
//         const versionPath = path.join(filePath.toString(), 'version.json');
//         if (!fs.existsSync(versionPath)) {
//             throw new FileNotFoundError(`Version information not found at ${versionPath}. Please run \`camoufox fetch\` to install.`);
//         }
//         const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf-8'));
//         return new Version(versionData.release, versionData.version);
//     }

//     static isSupportedPath(path: PathLike): boolean {
//         return Version.fromPath(path).isSupported();
//     }

//     static buildMinMax(): [Version, Version] {
//         return [new Version(CONSTRAINTS.MIN_VERSION), new Version(CONSTRAINTS.MAX_VERSION)];
//     }
// }


// export class CamoufoxFetcher extends GitHubDownloader {
//     arch: string;
//     _version_obj?: Version;
//     pattern: RegExp;
//     _url?: string;

//     constructor() {
//         super("daijro/camoufox");
//         this.arch = CamoufoxFetcher.getPlatformArch();
//         this.pattern = new RegExp(`camoufox-(.+)-(.+)-${OS_NAME}\\.${this.arch}\\.zip`);
//     }

//     async init() {
//         await this.fetchLatest();
//     }

//     checkAsset(asset: any): [Version, string] | null {
//         const match = asset.name.match(this.pattern);
//         if (!match) return null;

//         const version = new Version(match[2], match[1]);
//         if (!version.isSupported()) return null;

//         return [version, asset.browser_download_url];
//     }

//     missingAssetError(): void {
//         throw new MissingRelease(`No matching release found for ${OS_NAME} ${this.arch} in the supported range: (${CONSTRAINTS.asRange()}). Please update the library.`);
//     }

//     static getPlatformArch(): string {
//         const platArch = os.arch().toLowerCase();
//         if (!(platArch in ARCH_MAP)) {
//             throw new UnsupportedArchitecture(`Architecture ${platArch} is not supported`);
//         }

//         const arch = ARCH_MAP[platArch];
//         if (!OS_ARCH_MATRIX[OS_NAME].includes(arch)) {
//             throw new UnsupportedArchitecture(`Architecture ${arch} is not supported for ${OS_NAME}`);
//         }

//         return arch;
//     }

//     async fetchLatest(): Promise<void> {
//         if (this._version_obj) return;
//         const releaseData = await this.getAsset();
//         this._version_obj = releaseData[0];
//         this._url = releaseData[1];
//     }

//     static async downloadFile(url: string): Promise<Buffer> {
//         const response = await fetch(url);

//         return Buffer.from(await response.arrayBuffer());
//     }

//     async extractZip(zipFile: string | Buffer): Promise<void> {
//         const zip = new AdmZip(zipFile);
//         zip.extractAllTo(INSTALL_DIR.toString(), true);
//     }

//     static cleanup(): boolean {
//         if (fs.existsSync(INSTALL_DIR)) {
//             fs.rmSync(INSTALL_DIR, { recursive: true });
//             return true;
//         }
//         return false;
//     }

//     setVersion(): void {
//         fs.writeFileSync(path.join(INSTALL_DIR.toString(), 'version.json'), JSON.stringify({ version: this.version, release: this.release }));
//     }

//     async install(): Promise<void> {
//         await this.init();
//         await CamoufoxFetcher.cleanup();
//         try {
//             fs.mkdirSync(INSTALL_DIR, { recursive: true });

//             const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'camoufox-'));
//             const tempFilePath = path.join(tempDir, 'camoufox.zip');
//             const tempFileStream = fs.createWriteStream(tempFilePath);

//             await webdl(this.url, 'Downloading Camoufox...', true, tempFileStream);
//             await new Promise(r => tempFileStream.close(r));

//             await this.extractZip(tempFilePath);
//             this.setVersion();

//             if (OS_NAME !== 'win') {
//                 execSync(`chmod -R 755 ${INSTALL_DIR}`);
//             }

//             console.log('Camoufox successfully installed.');
//         } catch (e) {
//             console.error(`Error installing Camoufox: ${e}`);
//             await CamoufoxFetcher.cleanup();
//             throw e;
//         }
//     }

//     get url(): string {
//         if (!this._url) {
//             throw new Error("Url is not available. Make sure to run fetchLatest first.");
//         }
//         return this._url;
//     }

//     get version(): string {
//         if (!this._version_obj || !this._version_obj.version) {
//             throw new Error("Version is not available. Make sure to run fetchLatest first.");
//         }
//         return this._version_obj.version;
//     }

//     get release(): string {
//         if (!this._version_obj) {
//             throw new Error("Release information is not available. Make sure to run the installation first.");
//         }
//         return this._version_obj.release;
//     }

//     get verstr(): string {
//         if (!this._version_obj) {
//             throw new Error("Version is not available. Make sure to run the installation first.");
//         }
//         return this._version_obj.fullString;
//     }
// }






