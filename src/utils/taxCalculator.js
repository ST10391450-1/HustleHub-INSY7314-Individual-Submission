const TAX_YEAR = '2026/2027';

const PRIMARY_REBATE = 17820;

const TAX_BRACKETS = [
    {
        threshold: 0,
        baseTax: 0,
        rate: 0.18
    },
    {
        threshold: 245100,
        baseTax: 44118,
        rate: 0.26
    },
    {
        threshold: 383100,
        baseTax: 79998,
        rate: 0.31
    },
    {
        threshold: 530200,
        baseTax: 125599,
        rate: 0.36
    },
    {
        threshold: 695800,
        baseTax: 185215,
        rate: 0.39
    },
    {
        threshold: 887000,
        baseTax: 259783,
        rate: 0.41
    },
    {
        threshold: 1878600,
        baseTax: 666339,
        rate: 0.45
    }
];

function calculateEstimatedTax(income) {
    const taxableIncome = Math.max(0, Number(income) || 0);

    const applicableBracket = [...TAX_BRACKETS]
        .reverse()
        .find(bracket => taxableIncome > bracket.threshold)
        || TAX_BRACKETS[0];

    const taxBeforeRebate =
        applicableBracket.baseTax +
        (taxableIncome - applicableBracket.threshold) *
        applicableBracket.rate;

    const estimatedTax = Math.max(
        0,
        taxBeforeRebate - PRIMARY_REBATE
    );

    const roundedIncome = Number(taxableIncome.toFixed(2));
    const roundedTax = Number(estimatedTax.toFixed(2));

    return {
        taxYear: TAX_YEAR,
        taxableIncome: roundedIncome,
        taxBeforeRebate: Number(taxBeforeRebate.toFixed(2)),
        primaryRebate: PRIMARY_REBATE,
        estimatedTax: roundedTax,
        afterTaxIncome: Number(
            (roundedIncome - roundedTax).toFixed(2)
        ),
        effectiveTaxRate: roundedIncome > 0
            ? Number(
                ((roundedTax / roundedIncome) * 100).toFixed(2)
            )
            : 0
    };
}

module.exports = {
    calculateEstimatedTax
};
