// Implementation from https://stackoverflow.com/a/48293566/1945088
// I added type annotations.
export function zip<T1>(iter1: Iterable<T1>): Generator<[T1]>;
export function zip<T1, T2>(
  iter1: Iterable<T1>,
  iter2: Iterable<T2>
): Generator<[T1, T2]>;
export function zip<T1, T2, T3>(
  iter1: Iterable<T1>,
  iter2: Iterable<T2>,
  iter3: Iterable<T3>
): Generator<[T1, T2, T3]>;
export function zip<T1, T2, T3, T4>(
  iter1: Iterable<T1>,
  iter2: Iterable<T2>,
  iter3: Iterable<T3>,
  iter4: Iterable<T4>
): Generator<[T1, T2, T3, T4]>;
export function zip<T1, T2, T3, T4, T5>(
  iter1: Iterable<T1>,
  iter2: Iterable<T2>,
  iter3: Iterable<T3>,
  iter4: Iterable<T4>,
  iter5: Iterable<T5>
): Generator<[T1, T2, T3, T4, T5]>;
export function zip<T1, T2, T3, T4, T5, T6>(
  iter1: Iterable<T1>,
  iter2: Iterable<T2>,
  iter3: Iterable<T3>,
  iter4: Iterable<T4>,
  iter5: Iterable<T5>,
  iter6: Iterable<T6>
): Generator<[T1, T2, T3, T4, T5, T6]>;
export function zip<T1, T2, T3, T4, T5, T6, T7>(
  iter1: Iterable<T1>,
  iter2: Iterable<T2>,
  iter3: Iterable<T3>,
  iter4: Iterable<T4>,
  iter5: Iterable<T5>,
  iter6: Iterable<T6>,
  iter7: Iterable<T7>
): Generator<[T1, T2, T3, T4, T5, T6, T7]>;
export function zip<T1, T2, T3, T4, T5, T6, T7, T8>(
  iter1: Iterable<T1>,
  iter2: Iterable<T2>,
  iter3: Iterable<T3>,
  iter4: Iterable<T4>,
  iter5: Iterable<T5>,
  iter6: Iterable<T6>,
  iter7: Iterable<T7>,
  iter8: Iterable<T8>
): Generator<[T1, T2, T3, T4, T5, T6, T7, T8]>;
export function zip<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  iter1: Iterable<T1>,
  iter2: Iterable<T2>,
  iter3: Iterable<T3>,
  iter4: Iterable<T4>,
  iter5: Iterable<T5>,
  iter6: Iterable<T6>,
  iter7: Iterable<T7>,
  iter8: Iterable<T8>,
  iter9: Iterable<T9>
): Generator<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
export function zip<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  iter1: Iterable<T1>,
  iter2: Iterable<T2>,
  iter3: Iterable<T3>,
  iter4: Iterable<T4>,
  iter5: Iterable<T5>,
  iter6: Iterable<T6>,
  iter7: Iterable<T7>,
  iter8: Iterable<T8>,
  iter9: Iterable<T9>,
  iter10: Iterable<T10>
): Generator<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;
export function* zip(...iterables: Iterable<any>[]) {
  let iterators = iterables.map((i) => i[Symbol.iterator]());
  while (true) {
    let results = iterators.map((iter) => iter.next());
    if (results.some((res) => res.done)) return;
    else yield results.map((res) => res.value);
  }
}
