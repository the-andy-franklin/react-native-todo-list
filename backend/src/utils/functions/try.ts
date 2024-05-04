type Success<T> = {
	success: true;
	value: T;
};

type Failure = {
	success: false;
	error: Error;
};

type Either<T> = Success<T> | Failure;

function createSuccess<T>(value: T): Success<T> {
	return { success: true, value };
}

function createFailure(error: unknown): Failure {
	if (error instanceof Error) return { success: false, error };
	return { success: false, error: new Error(JSON.stringify(error)) };
}

export function Try<T>(fn: () => Promise<T>): Promise<Either<T>>;
export function Try<T>(fn: () => T): Either<T>;
export function Try<T>(fn: (() => T) | (() => Promise<T>)): Either<T> | Promise<Either<T>> {
	try {
		const result = fn();
		if (result instanceof Promise) {
			return result
				.then(createSuccess)
				.catch(createFailure);
		}

		return createSuccess(result);
	} catch (error: unknown) {
		return createFailure(error);
	}
}
