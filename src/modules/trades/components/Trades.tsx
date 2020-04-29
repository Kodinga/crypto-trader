import React, { FC } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { DateTime } from 'luxon';
import { Trade } from '../types/Trade';
import { Container } from './Trades.styled';

export interface Props {
    trades: Trade[];
}

const Trades: FC<Props> = props => {
    const { trades } = props;
    const columnDefs: ColDef[] = [{
        headerName: 'Id',
        field: 'id',
        hide: true
    }, {
        headerName: 'Amount',
        field: 'amount',
        width: 120
    }, {
        headerName: 'Time',
        field: 'timestamp',
        sort: 'desc',
        width: 90,
        valueFormatter: params => DateTime.fromMillis(params.value).toLocaleString(DateTime.TIME_24_WITH_SECONDS)
    }, {
        headerName: 'Price',
        field: 'price'
    }];

    return (
        <Container className='ag-theme-balham'>
            <AgGridReact
                columnDefs={columnDefs}
                rowData={trades}
                deltaRowDataMode={true}
                getRowNodeId={data => data.id}
            >
            </AgGridReact>
        </Container>
    );
}

export default Trades;