import { convertToShortestRoman } from '../romanConversion';

describe('Testing convertToShortestRoman function', () => {
    describe('GIVEN a Roman numeral string with repeating numerals', () => {
        describe('WHEN convertToShortestRoman is called', () => {
            it('THEN it returns the optimized Roman numeral string for "IIII"', () => {
                expect(convertToShortestRoman('IIII')).toBe('IV');
            });
            it('THEN it returns the optimized Roman numeral string for "VIIII"', () => {
                expect(convertToShortestRoman('VIIII')).toBe('IX');
            });
            it('THEN it returns the optimized Roman numeral string for "XXXXVIIII"', () => {
                expect(convertToShortestRoman('XXXXVIIII')).toBe('XLIX');
            });
            it('THEN it returns the optimized Roman numeral string for "LXXXX"', () => {
                expect(convertToShortestRoman('LXXXX')).toBe('XC');
            });
        });
    });

    describe('GIVEN a Roman numeral string already in optimized form', () => {
        describe('WHEN convertToShortestRoman is called', () => {
            it('THEN it returns the same Roman numeral string for "XIV"', () => {
                expect(convertToShortestRoman('XIV')).toBe('XIV');
            });
            it('THEN it returns the same Roman numeral string for "CCCLXIX"', () => {
                expect(convertToShortestRoman('CCCLXIX')).toBe('CCCLXIX');
            });
            it('THEN it returns the same Roman numeral string for "DCCCXC"', () => {
                expect(convertToShortestRoman('DCCCXC')).toBe('DCCCXC');
            });
        });
    });

    describe('GIVEN a complex Roman numeral string needing optimization', () => {
        describe('WHEN convertToShortestRoman is called', () => {
            it('THEN it returns a significantly shortened Roman numeral string for "LLXXVV"', () => {
                expect(convertToShortestRoman('LLXXVV')).toBe('CXXX');
            });
        });
    });

    describe('GIVEN an empty Roman numeral string', () => {
        describe('WHEN convertToShortestRoman is called', () => {
            it('THEN it returns an empty string', () => {
                expect(convertToShortestRoman('')).toBe('');
            });
        });
    });
});
