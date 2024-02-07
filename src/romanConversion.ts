function convertRomanToInteger(roman: string): number {
    const romanValues: { [key: string]: number } = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let integer = 0;
    for (let i = 0; i < roman.length; i++) {
        const current = romanValues[roman[i]];
        const next = romanValues[roman[i + 1]] || 0;
        if (current < next) {
            integer -= current;
        } else {
            integer += current;
        }
    }
    return integer;
}

function convertIntegerToRoman(num: number): string {
    const romanStructure: [string, number][] = [
        ["M", 1000], ["CM", 900], ["D", 500], ["CD", 400],
        ["C", 100], ["XC", 90], ["L", 50], ["XL", 40],
        ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]
    ];
    let roman = "";
    romanStructure.forEach(([symbol, value]) => {
        while (num >= value) {
            num -= value;
            roman += symbol;
        }
    });
    return roman;
}

export function convertToShortestRoman(roman: string): string {
    const number = convertRomanToInteger(roman);
    return convertIntegerToRoman(number);
}
