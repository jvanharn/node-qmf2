import { Buffer } from 'buffer';

export function isPlainObject(obj: any): boolean {
    return Object.prototype.toString.call(obj) === '[object Object]';
};

// @TODO: incorporate property defs into unwrapping
export function unwrap_data(value: any) {
    if (value instanceof Buffer) {
        return value.toString('utf8');
    }

    if (isPlainObject(value)) {
        var _keys = Object.keys(value), _len = _keys.length;
        for (var i = 0; i < _len; ++i) {
            value[_keys[i]] = unwrap_data(value[_keys[i]]);
        }
    }

    return value;
};

export function unwrap_timestamp(value: any): Date {
    if (value != null && Buffer.isBuffer(value) && value.byteLength > 0) {
        var timestamp = readInt64BEasFloat(value);
        return new Date(timestamp / 1000000);
    }
    return new Date('01-01-0001');
};

function readInt64BEasFloat(buffer: Buffer, offset: number = 0): number {
    var low = buffer.readInt32BE(offset + 4);
    var num = buffer.readInt32BE(offset) * 4294967296.0 + low;
    if (low < 0) {
        num += 4294967296;
    }
    return num;
}
