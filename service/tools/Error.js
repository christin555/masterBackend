class ErrorHandler {
    constructor({status, code, message}) {
        const error = new Error(message);
        error.status = status;
        error.errorCode = code;

        throw error;
    }
}


module.exports = ErrorHandler;
