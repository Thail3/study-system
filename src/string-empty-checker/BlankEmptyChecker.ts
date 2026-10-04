import { AbstractEmptyChecker } from './AbstractEmptyChecker';

// Empty when length is 0 or only whitespace. "   " IS empty.
export class BlankEmptyChecker extends AbstractEmptyChecker {
  protected check(value: string): boolean {
    return value.trim().length === 0;
  }
}
