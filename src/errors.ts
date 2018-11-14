export class BaseError extends Error {
    public name: string;

    public constructor(msg, prev?: Error) {
        super(msg);
        this.name = 'QMFError';
    }
}

export class AgentExceptionError extends BaseError {
    public errorCode: number;
    public errorText: string;

    public constructor(values: any) {
        var errorText;
        super(errorText = (values.error_text instanceof Buffer)
            ? values.error_text.toString()
            : values.error_text);

        this.name = 'QMFAgentExceptionError';
        this.errorCode = values.error_code;
        this.errorText = errorText;
    }
};

export class InvalidResponseError extends BaseError {
    public constructor(public opcode: any) {
        super(opcode);
        this.name = 'QMFInvalidResponseError';
    }
};

export class TimeoutError extends BaseError {
    public constructor() {
        super('request timed out');
        this.name = 'QMFTimeoutError';
    }
};
