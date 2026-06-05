
export class classError extends Error{
    constructor(message, cause){
        super(message);
        this.cause = cause ? cause : 500;
        this.isOperational = true;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    };
};