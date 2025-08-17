type CRCParams = {
    width: number;
    poly: bigint;
    init: bigint;
    refin: boolean;
    refout: boolean;
    xorout: bigint;
};
declare const computeCRC: (bytes: Uint8Array, p: CRCParams) => bigint;

export { type CRCParams, computeCRC };
