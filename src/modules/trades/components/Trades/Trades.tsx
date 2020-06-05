import React, { FC, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridApi } from "ag-grid-community";
import { useThrottle } from "core/hooks/useThrottle";
import {
  priceFormatter,
  amountFormatter,
  timeFormatter,
} from "modules/ag-grid/formatter";
import { useGridResize } from "core/hooks/useGridResize";
import Loading from "core/components/Loading";
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
  const [gridApi, setGridApi] = useState<GridApi | undefined>();

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

  useGridResize(gridApi);

  return (
    <Container className="ag-theme-balham-dark">
      {isStale && <Stale />}
      <AgGridReact
        columnDefs={columnDefs}
        rowData={throttledTrades}
        deltaRowDataMode={true}
        getRowNodeId={(data) => data.id}
        onGridReady={(event) => {
          setGridApi(event.api);
        }}
        noRowsOverlayComponent={"customLoadingOverlay"}
        frameworkComponents={{
          customLoadingOverlay: Loading,
        }}
      ></AgGridReact>
    </Container>
  );
};

export default Trades;
