import React, { FC } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { useThrottle } from "core/hooks/useThrottle";
import {
  priceFormatter,
  amountFormatter,
  timeFormatter,
} from "modules/ag-grid/formatter";
import { Trade } from "../../types/Trade";
import { Container } from "./Trades.styled";
import Palette from "theme/style";
import Stale from "core/components/Stale";

export interface Props {
  trades: Trade[];
  isStale: boolean;
}

const Trades: FC<Props> = (props) => {
  const { trades, isStale } = props;
  const throttledTrades = useThrottle<Trade[]>(trades, 500);

  const columnDefs: ColDef[] = [
    {
      headerName: "Id",
      field: "id",
      hide: true,
    },
    {
      headerName: "Amount",
      field: "amount",
      valueFormatter: (params) =>
        amountFormatter({ value: Math.abs(params.value) }),
    },
    {
      headerName: "Price",
      field: "price",
      cellStyle: (params) => {
        return {
          color: params.value < 0 ? Palette.Ask : Palette.Bid,
        };
      },
      valueFormatter: priceFormatter,
    },
    {
      headerName: "Time",
      field: "timestamp",
      valueFormatter: timeFormatter,
      cellStyle: () => ({
        color: Palette.LightGray,
      }),
    },
  ];

  return (
    <Container className="ag-theme-balham-dark">
      {isStale && <Stale />}
      <AgGridReact
        gridOptions={{ localeText: { noRowsToShow: "Loading..." } }}
        columnDefs={columnDefs}
        rowData={throttledTrades}
        deltaRowDataMode={true}
        getRowNodeId={(data) => data.id}
        onGridReady={(event) => event.api.sizeColumnsToFit()}
      ></AgGridReact>
    </Container>
  );
};

export default Trades;
