import assert from 'node:assert/strict';
import { EmptyCheckerFactory } from './index';

const strict = EmptyCheckerFactory.create('strict');
const blank = EmptyCheckerFactory.create('blank');

assert.equal(strict.isEmpty(''), true);
assert.equal(strict.isEmpty(null), true);
assert.equal(strict.isEmpty(undefined), true);
assert.equal(strict.isEmpty('   '), false);
assert.equal(strict.isEmpty('a'), false);

assert.equal(blank.isEmpty('   '), true);
assert.equal(blank.isEmpty('\n\t'), true);
assert.equal(blank.isEmpty(' a '), false);

assert.throws(() => EmptyCheckerFactory.create('nope' as never));

console.log('ok');
