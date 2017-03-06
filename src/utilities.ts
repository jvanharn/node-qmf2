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
    if (value == null) {
        return new Date('01-01-0001');
    }
    var raw = (typeof value === 'number') ? value : value.toNumber(true);
    return new Date(raw / 1000000);
};
