import { describe, it, expect } from "vitest";
import { computeCRC, CRCParams } from "../src/index";

const textBytes = (s: string) => new TextEncoder().encode(s);

const MODBUS: CRCParams = { width:16, poly:0x8005n, init:0xFFFFn, refin:true, refout:true, xorout:0x0000n };
const CRC32:  CRCParams = { width:32, poly:0x04C11DB7n, init:0xFFFFFFFFn, refin:true, refout:true, xorout:0xFFFFFFFFn };
const CRC32C: CRCParams = { width:32, poly:0x1EDC6F41n, init:0xFFFFFFFFn, refin:true, refout:true, xorout:0xFFFFFFFFn };

describe("computeCRC 123456789 checks", () => {
  it("CRC-16/MODBUS → 0x4B37", () => {
    expect(computeCRC(textBytes("123456789"), MODBUS).toString(16).toUpperCase()).toBe("4B37");
  });
  it("CRC-32/IEEE → 0xCBF43926", () => {
    expect(computeCRC(textBytes("123456789"), CRC32).toString(16).toUpperCase()).toBe("CBF43926");
  });
  it("CRC-32C → 0xE3069283", () => {
    expect(computeCRC(textBytes("123456789"), CRC32C).toString(16).toUpperCase()).toBe("E3069283");
  });
});
