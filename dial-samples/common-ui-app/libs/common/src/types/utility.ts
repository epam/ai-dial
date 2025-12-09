export type Maybe<T> = T | undefined;

export const isDefined = <T>(value: Maybe<T>): value is T => value != undefined;
