import React, { FC } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Container } from './Book.styled';
import { Order } from '../../types/Order';
import Palette from 'theme/style';

export interface Props {
    orders: {bid: Order, ask: Order}[];
}

const Book: FC<Props> = props => {
    const { orders } = props;
    const columnDefs: ColDef[] = [{
        headerName: 'Bid Amount',
        field: 'bid.amount',
        width: 100,
        cellStyle: () => ({
            color: Palette.Bid
        }),
    }, {
        headerName: 'Bid Price',
        field: 'bid.price',
        width: 100,
        cellStyle: () => ({
            color: Palette.Bid
        })
    }, {
        headerName: 'Ask Price',
        field: 'ask.price',
        width: 100,
        cellStyle: () => ({
            color: Palette.Ask
        })
    }, {
        headerName: 'Ask Amount',
        field: 'ask.amount',
        width: 100,
        cellStyle: () => ({
            color: Palette.Ask
        }),
        valueFormatter: params => params.value ? Math.abs(params.value).toString() : ''
    }];

    return (
        <Container className='ag-theme-balham-dark'>
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