import type { IEmptyChecker } from './IEmptyChecker';
import { StrictEmptyChecker } from './StrictEmptyChecker';
import { BlankEmptyChecker } from './BlankEmptyChecker';

export type EmptyCheckerMode = 'strict' | 'blank';

// New rule = new class + one entry here. Callers never change.
const registry: Record<EmptyCheckerMode, () => IEmptyChecker> = {
  strict: () => new StrictEmptyChecker(),
  blank: () => new BlankEmptyChecker(),
};

export class EmptyCheckerFactory {
  static create(mode: EmptyCheckerMode = 'strict'): IEmptyChecker {
    const make = registry[mode];
    if (!make) throw new Error(`Unknown EmptyCheckerMode: ${mode}`);
    return make();
  }
}
