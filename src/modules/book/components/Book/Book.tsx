import React, { FC } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { priceFormatter } from 'modules/ag-grid/agGridFormatter';
import { useThrottle } from 'core/hooks/useThrottle';
import { Container } from './Book.styled';
import { Order } from '../../types/Order';
import Palette from 'theme/style';

export interface Props {
    orders: {bid: Order, ask: Order}[];
}

const Book: FC<Props> = props => {
    const { orders } = props;
    const throttledOrders = useThrottle<{bid: Order, ask: Order}[]>(orders, 500);

    const columnDefs: ColDef[] = [{
        headerName: 'Bid Amount',
        field: 'bid.amount'
    }, {
        headerName: 'Bid Price',
        field: 'bid.price',
        cellStyle: () => ({
            color: Palette.Bid
        }),
        type: 'numericColumn',
        valueFormatter: priceFormatter
    }, {
        headerName: 'Ask Price',
        field: 'ask.price',
        cellStyle: () => ({
            color: Palette.Ask
        }),
        valueFormatter: priceFormatter
    }, {
        headerName: 'Ask Amount',
        field: 'ask.amount',
        valueFormatter: params => params.value ? Math.abs(params.value).toString() : ''
    }];

    return (
        <Container className='ag-theme-balham-dark'>
            <AgGridReact
                columnDefs={columnDefs}
                rowData={throttledOrders}
                deltaRowDataMode={true}
                getRowNodeId={data => [data.bid?.id, data.ask?.id].join('#')}
                onGridReady={event => event.api.sizeColumnsToFit()}
            >
            </AgGridReact>
        </Container>
    );
}

export default Book;