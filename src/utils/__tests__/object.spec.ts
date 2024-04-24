import * as Utility from '../object';

describe('Utility', () => {
    describe('.isEmptyObject()', () => {
        it('returns true for empty objects or non-objects', () => {
            [{}, 1, undefined, null, false, true, ''].forEach(value => {
                expect(Utility.isEmptyObject(value)).toBe(true);
            });
        });

        it('returns false for not empty objects', () => {
            expect(Utility.isEmptyObject({ not_empty: true })).toBe(false);
        });
    });
});
