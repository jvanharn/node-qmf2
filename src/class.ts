import { Agent } from './agent';
import { unwrap_data, unwrap_timestamp } from './utilities';
import { error as logError } from './log';

// Precompiled validation regexes.
const validateRegexpNumber  = /int|uint|float|double|absTime|deltaTime|uuid|hilo|count|mma/;
const validateRegexpString  = /objId|sstr|lstr/;
const validateRegexpBoolean = /bool/;
const validateRegexpObject  = /map/;

/**
 * QMF Business object base class.
 */
export abstract class QMFObject {
    //#region Class Dependencies
        protected _agent: Agent;
    //#endregion

    //#region Class definition
        public className:   string = 'Unknown';
        public properties:  QMFPropertyDefinition[] = [];
        public methods:     QMFMethodDefinition[] = [];
    //#endregion

    //#region RPC Object info
        protected _object_id: any;
        protected _create_ts: Date;
        protected _delete_ts: Date;
        protected _update_ts: Date;
    //#endregion

    public constructor(agent: Agent, data: any) {
        // prevent circular structure errors when stringifying to JSON
        Object.defineProperty(this, '_agent', { value: agent });

        // metadata
        this._object_id = unwrap_data(data._object_id);
        this._create_ts = unwrap_timestamp(data._create_ts);
        this._delete_ts = unwrap_timestamp(data._delete_ts);
        this._update_ts = unwrap_timestamp(data._update_ts);

        // values
        if (!data._values) {
            logError('QMFObject: data object should have an _values attribute.');
            return;
        }
        let _keys = Object.keys(data._values),
            _len = _keys.length;
        for (let i = 0; i < _len; ++i) {
            this[_keys[i]] = unwrap_data(data._values[_keys[i]]);
        }
    }

    /**
     * Validate a javascript object against the QMF type.
     */
    protected _validateType(o: any, type: string) {
        if (type.match(validateRegexpNumber)) {
            return (typeof o === 'number');
        } else if (type.match(validateRegexpString)) {
            return (typeof o === 'string');
        } else if (type.match(validateRegexpBoolean)) {
            return (typeof o === 'boolean');
        } else if (type.match(validateRegexpObject)) {
            return (typeof o === 'object');
        }

        return false;
    }

    /**
     * Invoke the given method definition on the QMF queue.
     */
    protected _classMethodInvoke(methodDefinition: QMFMethodDefinition, options?: any): Promise<any> {
        // build arguments
        var args: any = {};
        if (!!methodDefinition.arguments) {
            (methodDefinition.arguments || [])
                .filter(x => !!x.dir && x.dir.toUpperCase().indexOf('I') >= 0)
                .forEach(argDef => {
                    if (options.hasOwnProperty(argDef.name)) {
                        if (!this._validateType(options[argDef.name], argDef.type)) {
                            throw new Error('invalid type for argument: ' + argDef.name);
                        }
                        args[argDef.name] = options[argDef.name];
                    } else if (!!argDef.default) {
                        args[argDef.name] = argDef.default;
                    } else {
                        // @TODO: maybe we can get away with null?
                        throw new Error('missing argument: ' + argDef.name);
                    }
                });
        }

        return this._agent._request(
            '_method_request',
            this._agent.name,
            {
                '_object_id':   this._object_id,
                '_method_name': methodDefinition.name,
                '_arguments':   args
            });
    }
}

export interface QMFPropertyDefinition {
    name: string;
    type: string;
    access?: string;
    references?: string;
    index?: string;//'y' | 'n';
    optional?: string;//'y' | 'n';
}

export interface QMFMethodArgumentDefinition {
    name: string;
    dir: 'I' | 'IO' | 'O';
    type: string;
    default?: string;
}

export interface QMFMethodDefinition {
    name: string;
    arguments?: QMFMethodArgumentDefinition[];
}

