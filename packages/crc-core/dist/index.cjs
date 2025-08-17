"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  computeCRC: () => computeCRC
});
module.exports = __toCommonJS(index_exports);
var reflectBits = (x, width) => {
  let r = 0n;
  for (let i = 0; i < width; i++) {
    if (x >> BigInt(i) & 1n) r |= 1n << BigInt(width - 1 - i);
  }
  return r;
};
var makeTable = (width, poly, refin) => {
  const W = BigInt(width);
  const mask = (1n << W) - 1n;
  const P = refin ? reflectBits(poly, width) : poly;
  const tbl = new Array(256);
  for (let i = 0; i < 256; i++) {
    let c = BigInt(i);
    if (refin) {
      for (let k = 0; k < 8; k++) {
        c = c & 1n ? c >> 1n ^ P : c >> 1n;
      }
    } else {
      c <<= W - 8n;
      for (let k = 0; k < 8; k++) {
        c = c & 1n << W - 1n ? c << 1n & mask ^ P : c << 1n & mask;
      }
    }
    tbl[i] = c & mask;
  }
  return { tbl, mask };
};
var _tableCache = /* @__PURE__ */ new Map();
var keyOf = (p) => `${p.width}|${p.poly}|${p.refin ? 1 : 0}`;
var computeCRC = (bytes, p) => {
  const k = keyOf(p);
  const cached = _tableCache.get(k);
  const { tbl, mask } = cached ?? (() => {
    const t = makeTable(p.width, p.poly, p.refin);
    _tableCache.set(k, t);
    return t;
  })();
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  computeCRC
});
