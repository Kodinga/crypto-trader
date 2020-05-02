export type Base = string;
export type Counter = string;

export function parseCurrencyPair(currencyPair: string): [Base, Counter] {
    if (typeof currencyPair === 'undefined') {
        return ['', ''];
    }
    const base = currencyPair.slice(0, 3);
    const counter = currencyPair.slice(3);
    return [base, counter];
}

export function formatCurrencyPair(currencyPair: string): string {
    const [base, counter] = parseCurrencyPair(currencyPair);
    return [base, counter].join(' / ');
}