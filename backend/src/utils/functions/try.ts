type Success<T> = {
	success: true;
	failure: false;
	data: T;
};

type Failure = {
	success: false;
	failure: true;
	error: Error;
};

type Either<F extends Failure, S extends Success<any>> = F | S;

function createSuccess<T>(data: T): Success<T> {
	return { success: true, failure: false, data };
}

function createFailure(error: unknown): Failure {
	if (error instanceof Error) return { success: false, failure: true, error };
	return { success: false, failure: true, error: new Error(JSON.stringify(error)) };
}

export function Try<T>(fn: () => Promise<T>): Promise<Either<Failure, Success<T>>>;
export function Try<T>(fn: () => T): Either<Failure, Success<T>>;
export function Try<T>(
	fn: (() => T) | (() => Promise<T>),
): Either<Failure, Success<T>> | Promise<Either<Failure, Success<T>>> {
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
