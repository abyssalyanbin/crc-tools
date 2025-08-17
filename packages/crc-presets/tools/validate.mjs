import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { computeCRC } from '@crc/core'   // workspace 内部直接引用

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const src = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/index.json'), 'utf-8'))

const enc = new TextEncoder()
const data = enc.encode('123456789')

let ok = true
for (const p of src) {
  const params = {
    width: p.width,
    poly: BigInt(p.poly),
    init: BigInt(p.init),
    refin: p.refin,
    refout: p.refout,
    xorout: BigInt(p.xorout),
  }
  const got = computeCRC(data, params).toString(16).toUpperCase()
  const want = BigInt(p.check).toString(16).toUpperCase()
  if (got !== want) {
    ok = false
    console.error(`[x] ${p.name} check mismatch: got 0x${got} != 0x${want} (注意：poly 必须是正向多项式)`)
  }
}
if (!ok) process.exit(1)
console.log('presets validate ok')
