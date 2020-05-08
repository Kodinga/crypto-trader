import { DateTime } from 'luxon';
import numeral from 'numeral';
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

export const formatPrice = (price: number | string | undefined) => numeral(price).format('0,0.00');

export const formatAmount = (amount: number | string | undefined) => amount ? amount.toString() : '';

export const formatVolume = (volume: number) => numeral(volume).format('0.00 a');

export const formatTime = (time: number) => DateTime.fromMillis(time).toLocaleString(DateTime.TIME_24_WITH_SECONDS);