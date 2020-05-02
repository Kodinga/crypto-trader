import React, { FC } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { DateTime } from 'luxon';
import { Trade } from '../types/Trade';
import { Container, Header } from './Trades.styled';
import theme from 'theme/style';
import { formatCurrencyPair } from 'modules/reference-data/utils';

export interface Props {
    currencyPair: string;
    trades: Trade[];
}

const Trades: FC<Props> = props => {
    const { trades, currencyPair } = props;
    const columnDefs: ColDef[] = [{
        headerName: 'Id',
        field: 'id',
        hide: true
    }, {
        headerName: 'Amount',
        field: 'amount',
        width: 120,
        valueFormatter: params => Math.abs(params.value).toString(),
        cellStyle: params => {
            return {
                color: params.value < 0 ? theme.Sell : theme.Buy
            }
        }
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
        <Container className='ag-theme-balham-dark'>
            <Header><span>Trades - </span>{formatCurrencyPair(currencyPair)}</Header>
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