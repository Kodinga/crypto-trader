import React, { FC } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { DateTime } from 'luxon';
import { useThrottle } from 'core/hooks/useThrottle';
import { priceFormatter } from 'modules/ag-grid/agGridFormatter';
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
        valueFormatter: params => Math.abs(params.value).toString(),
        
    }, {
        headerName: 'Price',
        field: 'price',
        cellStyle: params => {
            return {
                color: params.value < 0 ? Palette.Ask : Palette.Bid
            }
        },
        valueFormatter: priceFormatter
    }, {
        headerName: 'Time',
        field: 'timestamp',
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
                onGridReady={event => event.api.sizeColumnsToFit()}
            >
            </AgGridReact>
        </Container>
    );
}

export default Trades;