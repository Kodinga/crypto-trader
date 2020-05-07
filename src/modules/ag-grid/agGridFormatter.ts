import { formatPrice } from 'modules/reference-data/utils';

export const priceFormatter = (params: {value: string}) => formatPrice(params.value);


