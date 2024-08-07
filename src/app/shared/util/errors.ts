/*
	From https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
	by Kent C. Dodds
*/

export enum GUIerrorType {
	FormError = "Form error",
	AuthenticationError = "Authentication error",
}

export type ErrorWithMessage = {
	message: string
}

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
	return (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		typeof (error as Record<string, unknown>)['message'] === 'string'
	);
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
	if (isErrorWithMessage(maybeError)) return maybeError;
	else try {
		return new Error(JSON.stringify(maybeError))
	} catch {
		// fallback in case there's an error stringifying the maybeError
		// like with circular references for example.
		return new Error(String(maybeError));
	}
}

export function getErrorMessage(error: unknown) {
	return toErrorWithMessage(error)['message'];
}

export abstract class CustomError extends Error {
	abstract statusCode: number;

	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class NotFoundError extends CustomError {
	statusCode = 404;
	constructor(message: string) {
		super(message);
		this.name = 'NotFoundError';
	}
}


