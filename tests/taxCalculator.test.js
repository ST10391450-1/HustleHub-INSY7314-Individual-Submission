
const {
    calculateEstimatedTax
} = require('../src/utils/taxCalculator');

describe('Tax Calculator', () => {

    test('should return zero tax for zero income', () => {
        const result = calculateEstimatedTax(0);

        expect(result.taxableIncome).toBe(0);
        expect(result.estimatedTax).toBe(0);
        expect(result.afterTaxIncome).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
    });

    test('should apply the primary rebate to income below the tax threshold', () => {
        const result = calculateEstimatedTax(99000);

        expect(result.taxBeforeRebate).toBe(17820);
        expect(result.estimatedTax).toBe(0);
        expect(result.afterTaxIncome).toBe(99000);
    });

    test('should calculate tax in the first bracket', () => {
        const result = calculateEstimatedTax(100000);

        expect(result.taxBeforeRebate).toBe(18000);
        expect(result.estimatedTax).toBe(180);
    });

    test('should calculate tax in the second bracket', () => {
        const result = calculateEstimatedTax(300000);

        expect(result.taxBeforeRebate).toBe(58392);
        expect(result.estimatedTax).toBe(40572);
    });

    test('should calculate tax in the third bracket', () => {
        const result = calculateEstimatedTax(400000);

        expect(result.taxBeforeRebate).toBe(85237);
        expect(result.estimatedTax).toBe(67417);
    });

    test('should calculate tax in the fourth bracket', () => {
        const result = calculateEstimatedTax(550000);

        expect(result.taxBeforeRebate).toBe(132727);
        expect(result.estimatedTax).toBe(114907);
    });

    test('should calculate tax in the fifth bracket', () => {
        const result = calculateEstimatedTax(700000);

        expect(result.taxBeforeRebate).toBe(186853);
        expect(result.estimatedTax).toBe(169033);
    });

    test('should calculate tax in the sixth bracket', () => {
        const result = calculateEstimatedTax(1000000);

        expect(result.taxBeforeRebate).toBe(306113);
        expect(result.estimatedTax).toBe(288293);
    });

test('should calculate tax in the highest bracket', () => {
    const result = calculateEstimatedTax(2000000);

    expect(result.taxBeforeRebate).toBe(720969);
    expect(result.estimatedTax).toBe(703149);
});

    test('should prevent negative income from producing negative tax', () => {
        const result = calculateEstimatedTax(-5000);

        expect(result.taxableIncome).toBe(0);
        expect(result.estimatedTax).toBe(0);
        expect(result.afterTaxIncome).toBe(0);
    });

    test('should treat invalid income as zero', () => {
        const result = calculateEstimatedTax('invalid');

        expect(result.taxableIncome).toBe(0);
        expect(result.estimatedTax).toBe(0);
    });

    test('should calculate the effective tax rate', () => {
        const result = calculateEstimatedTax(300000);

        expect(result.effectiveTaxRate).toBe(13.52);
    });

    test('should round income and tax calculations to two decimal places', () => {
        const result = calculateEstimatedTax(100000.456);

        expect(result.taxableIncome).toBe(100000.46);
        expect(result.estimatedTax).toBe(180.08);
        expect(result.afterTaxIncome).toBe(99820.38);
    });

    test('should return the correct tax year and primary rebate', () => {
        const result = calculateEstimatedTax(100000);

        expect(result.taxYear).toBe('2026/2027');
        expect(result.primaryRebate).toBe(17820);
    });

});