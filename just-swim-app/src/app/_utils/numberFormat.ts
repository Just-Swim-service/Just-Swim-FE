export function numberFormat(target: number) {
  return target < 10 ? '0' + target : '' + target;
}