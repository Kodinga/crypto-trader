import React, { FC } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Container, Header } from './Book.styled';
import { formatCurrencyPair } from 'modules/reference-data/utils';
import { Order } from '../types/Order';
import Palette from 'theme/style';

export interface Props {
    currencyPair?: string;
    orders: {bid: Order, ask: Order}[];
}

const Book: FC<Props> = props => {
    const { orders, currencyPair } = props;
    const columnDefs: ColDef[] = [{
        headerName: 'Bid Amount',
        field: 'bid.amount',
        
        cellStyle: () => ({
            color: Palette.Buy
        }),
    }, {
        headerName: 'Bid Price',
        field: 'bid.price',
        cellStyle: () => ({
            color: Palette.Buy
        })
    }, {
        headerName: 'Ask Price',
        field: 'ask.price',
        cellStyle: () => ({
            color: Palette.Sell
        })
    }, {
        headerName: 'Ask Amount',
        field: 'ask.amount',
        cellStyle: () => ({
            color: Palette.Sell
        }),
        valueFormatter: params => params.value ? Math.abs(params.value).toString() : ''
    }];

    return (
        <Container className='ag-theme-balham-dark'>
            <Header><span>Book - </span>{currencyPair && formatCurrencyPair(currencyPair)}</Header>
            <AgGridReact
                columnDefs={columnDefs}
                rowData={orders}
                deltaRowDataMode={true}
                getRowNodeId={data => [data.bid?.id, data.ask?.id].join('#')}
            >
            </AgGridReact>
        </Container>
    );
}

export default Book;