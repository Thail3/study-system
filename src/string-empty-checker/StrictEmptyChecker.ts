import { AbstractEmptyChecker } from './AbstractEmptyChecker';

// Empty only when length is 0. "   " is NOT empty.
export class StrictEmptyChecker extends AbstractEmptyChecker {
  protected check(value: string): boolean {
    return value.length === 0;
  }
}
