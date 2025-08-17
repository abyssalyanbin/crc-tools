export type CRCParams = {
  width: number;               // 位宽
  poly: bigint;                // 正向多项式（最高位隐含 x^width）
  init: bigint;
  refin: boolean;
  refout: boolean;
  xorout: bigint;
};

const reflectBits = (x: bigint, width: number) => {
  let r = 0n;
  for (let i = 0; i < width; i++) if ((x >> BigInt(i)) & 1n) r |= 1n << BigInt(width - 1 - i);
  return r;
};

export const makeTable = (width: number, poly: bigint, refin: boolean) => {
  const W = BigInt(width);
  const mask = (1n << W) - 1n;
  const tbl = new Array<bigint>(256);
  for (let i = 0; i < 256; i++) {
    let c = BigInt(i);
    if (refin) {
      for (let k = 0; k < 8; k++) c = (c & 1n) ? (c >> 1n) ^ poly : (c >> 1n);
    } else {
      c <<= (W - 8n);
      for (let k = 0; k < 8; k++) c = (c & (1n << (W - 1n))) ? ((c << 1n) & mask) ^ poly : ((c << 1n) & mask);
    }
    tbl[i] = c & mask;
  }
  return { tbl, mask };
};

const _tableCache = new Map<string, { tbl: bigint[]; mask: bigint }>();
const keyOf = (p: CRCParams) => `${p.width}|${p.poly}|${p.refin ? 1 : 0}`;



export const computeCRC = (bytes: Uint8Array, p: CRCParams): bigint => {
  const k = keyOf(p);
  const cached = _tableCache.get(k);
  const { tbl, mask } = cached ?? (() => {
    const t = makeTable(p.width, p.poly, p.refin);
    _tableCache.set(k, t);
    return t;
  })();
  let crc = p.init & mask;
  if (p.refin) {
    for (const b of bytes) crc = (crc >> 8n) ^ tbl[Number((crc ^ BigInt(b)) & 0xffn)];
  } else {
    const top = BigInt(p.width - 8);
    for (const b of bytes) crc = ((crc << 8n) & mask) ^ tbl[Number(((crc >> top) ^ BigInt(b)) & 0xffn)];
  }
  if (p.refin !== p.refout) crc = reflectBits(crc, p.width);
  return (crc ^ p.xorout) & mask;
};
export type { CRCParams as Params };