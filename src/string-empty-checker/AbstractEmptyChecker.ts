import type { IEmptyChecker } from './IEmptyChecker';

// Template method: null/undefined handled once here, subclasses only define what "empty" means for a real string.
export abstract class AbstractEmptyChecker implements IEmptyChecker {
  isEmpty(value: string | null | undefined): boolean {
    if (value === null || value === undefined) return true;
    return this.check(value);
  }

  protected abstract check(value: string): boolean;
}
