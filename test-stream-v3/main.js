
const sleep = ms => new Promise(r => setTimeout(r, ms))
function binToBase64(src, byteOffset = 0, byteLength) {
	let ab = src
	if ( src.buffer ) {
		ab = src.buffer
		byteOffset += src.byteOffset
	}

	const u8 = new Uint8Array(ab)
	if ( byteLength === undefined )
		byteLength = u8.byteLength
	
	let binStr = ""
	for(let i = 0; i < byteLength; i++)
		binStr += String.fromCharCode(u8[i])
	
	return btoa(binStr)
}
function base64ToAB(src) {
	const binStr = atob(src)
	const u8 = new Uint8Array(binStr.length)
	for(let i = 0; i < binStr.length; i++)
		u8[i] = binStr[i].charCodeAt()
	
	return u8.buffer
}
function toUint8Array(src, byteOffset = 0, byteLength) {
	let ab = src
	if ( src.buffer ) {
		ab = src.buffer
		byteOffset += src.byteOffset
	}
	
	if ( byteLength === undefined )
		byteLength = ab.byteLength
	
	return new Uint8Array(ab, byteOffset, byteLength)
}

function PreInjectCode() {
	var Module = {};
	Module.locateFile = (path) => {
		return `${ {BASE_URL} }/${ path }`
	};
}
function PostInjectCode() {
	;(() => {
		
	Module.onRuntimeInitialized = () => {
		postMessage({ action: "onRuntimeInitialized" })
	}

	let srcFile, srcFileName, dstFileName;
	onmessage = ({data: {action, data}}) => {
		switch(action) {
			case "file":
				const ext = data.name.match(/\.[^.]+$/) || ".mp4"
				const srcFile = data
				srcFileName = `in${ ext }`
			    dstFileName = `out${ ext }`

				FS.mkdir("/working")
				FS.mount(WORKERFS, {
					blobs: [{
						name: srcFileName, 
						data
					}], 
					files: [] 
				}, "/working")
				break
			
			case "run":
				Module.ccall("work", "number", ["string", "string"], [`/working/${ srcFileName }`, dstFileName])
				break
		}	
	}
	
	const outFile = {
		position: 0,
	}
	const FS_write = FS.write
	FS.write = (stream, buffer, offset, length, position, canOwn) => {
		
		if ( stream.path === `/${ dstFileName }` ) {
			if ( position === undefined )
				position = outFile.position
			
			if ( position !== outFile.position ) {
				throw new Error(`Write not stream`)
			}

			console.log(`FS Write '${ stream.path }': pos: ${ position }, len: ${ length }`)
			outFile.position += length
			
			postMessage({ action: "FS.write", data: {
				path: stream.path,
				chunk: buffer.slice(offset, offset + length) 
			} })
			
			return outFile.position
		}
		
		return FS_write(stream, buffer, offset, length, position, canOwn)
	}
	
	const FS_close = FS.close
	FS.close = (stream) => {
		
		if ( stream.path === `/${ dstFileName }` ) {
			console.log(`FS Close '${ stream.path }'`)
			
			postMessage({ action: "FS.close", data: {
				path: stream.path,
			} })
		}
		
		return FS_close(stream)
	}

	})();
}
const getCode = (fn, obj = {}, code = fn
	.toString()
	.replace(/[^{]*{/, "")
	.replace(/}[^}]*$/, "") 
) => (
	Object.entries(obj).map(([k, v]) => code = code.replace(
		new RegExp( ["{", ...k, "}"].map(c => `\\x`+c.charCodeAt().toString(16).padStart(2, "0")).join("") ),
		JSON.stringify(v)
	) ),
	code
)
	

const BASE_URL = location.protocol + "//" + location.host + location.pathname.replace(/\/[^/]*$/, "") + `/wasm-data`

async function processFile(file) {
	if ( !processFile.objURL ) {
		let jsCode = await (await fetch(`${ BASE_URL }/remuxing.js`)).text()
		jsCode = `
		${ getCode(PreInjectCode, {
			BASE_URL
		}) }
		
		${ jsCode }
		
		${ getCode(PostInjectCode) }
		`

		processFile.objURL = URL.createObjectURL( new Blob([ jsCode ], {type: "text/javascript"}) )
	}

	const outputName = file.name + `-out.mp4`
	let fileStream, writer, chunks = []
	const pipeProcess = async () => {
		while(chunks.length) {
			const chunk = chunks.shift()
			if ( chunk === "close" ) {
				writer.close()
				return
			}
			await writer.write( toUint8Array(chunk) )
		}
		
		setTimeout(pipeProcess, 10)
	}
	const writeFile = ({path, chunk}) => {
		chunks.push(chunk)
			
		if ( !fileStream ) {
			console.log("Save " + outputName)
			fileStream = streamSaver.createWriteStream(outputName, {
				writableStrategy: undefined,
				readableStrategy: undefined
			})
			writer = fileStream.getWriter()
			
			pipeProcess()
		}
	}
	const closeFile = () => {
		chunks.push("close")
		worker.terminate()
	}
			
	
	const worker = new Worker( processFile.objURL )
	worker.onmessage = (({data: {action, data}}) => {
		switch(action) {
			case "onRuntimeInitialized":
				worker.postMessage({ action: "file", data: file })
				worker.postMessage({ action: "run" })
				break;
					
			case "FS.write":
				writeFile(data)
				break
					
			case "FS.close":
				closeFile(data)
				break
		}
	})
}

async function main() {
	document.querySelector("#input-file").addEventListener("change", e => {
		const [file] = e.target.files
		if ( !file )
			return
		
		processFile(file)
	})
}
main()