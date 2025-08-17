// src/index.ts
var reflectBits = (x, width) => {
  let r = 0n;
  for (let i = 0; i < width; i++) if (x >> BigInt(i) & 1n) r |= 1n << BigInt(width - 1 - i);
  return r;
};
var makeTable = (width, poly, refin) => {
  const W = BigInt(width);
  const mask = (1n << W) - 1n;
  const tbl = new Array(256);
  for (let i = 0; i < 256; i++) {
    let c = BigInt(i);
    if (refin) {
      for (let k = 0; k < 8; k++) c = c & 1n ? c >> 1n ^ poly : c >> 1n;
    } else {
      c <<= W - 8n;
      for (let k = 0; k < 8; k++) c = c & 1n << W - 1n ? c << 1n & mask ^ poly : c << 1n & mask;
    }
    tbl[i] = c & mask;
  }
  return { tbl, mask };
};
var computeCRC = (bytes, p) => {
  const { tbl, mask } = makeTable(p.width, p.poly, p.refin);
  let crc = p.init & mask;
  if (p.refin) {
    for (const b of bytes) crc = crc >> 8n ^ tbl[Number((crc ^ BigInt(b)) & 0xffn)];
  } else {
    const top = BigInt(p.width - 8);
    for (const b of bytes) crc = crc << 8n & mask ^ tbl[Number((crc >> top ^ BigInt(b)) & 0xffn)];
  }
  if (p.refin !== p.refout) crc = reflectBits(crc, p.width);
  return (crc ^ p.xorout) & mask;
};
export {
  computeCRC
};
