import React, { FC } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { DateTime } from 'luxon';
import { useThrottle } from 'core/hooks/useThrottle';
import { Trade } from '../../types/Trade';
import { Container } from './Trades.styled';
import Palette from 'theme/style';

export interface Props {
    trades: Trade[];
}

const Trades: FC<Props> = props => {
    const { trades } = props;
    const throttledTrades = useThrottle<Trade[]>(trades, 500);

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
                color: params.value < 0 ? Palette.Ask : Palette.Bid
            }
        }
    }, {
        headerName: 'Price',
        field: 'price'
    }, {
        headerName: 'Time',
        field: 'timestamp',
        sort: 'desc',
        width: 90,
        valueFormatter: params => DateTime.fromMillis(params.value).toLocaleString(DateTime.TIME_24_WITH_SECONDS),
        cellStyle: () => ({
            color: Palette.LightGray
        })
    }];

    return (
        <Container className='ag-theme-balham-dark'>
            <AgGridReact
                columnDefs={columnDefs}
                rowData={throttledTrades}
                deltaRowDataMode={true}
                getRowNodeId={data => data.id}
            >
            </AgGridReact>
        </Container>
    );
}

export default Trades;