import React, { FC, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridApi } from "ag-grid-community";
import { priceFormatter, volumeFormatter } from "modules/ag-grid/formatter";
import { Ticker } from "modules/ticker/types/Ticker";
import { formatCurrencyPair } from "modules/reference-data/utils";
import { Container } from "./Market.styled";
import PriceChartRenderer from "./PriceChartRenderer";
import PriceRenderer from "./PriceRenderer";
import Palette from "theme/style";

export interface StateProps {
  tickers: (Ticker & { currencyPair: string; prices: number[] })[];
  selectedCurrencyPair?: string;
}

export interface DispatchProps {
  onClick: (currencyPair: string) => void;
}

export type Props = StateProps & DispatchProps;

const Market: FC<Props> = (props) => {
  const { tickers, selectedCurrencyPair, onClick } = props;
  const [gridApi, setGridApi] = useState<GridApi | undefined>();

  const columnDefs: ColDef[] = [
    {
      headerName: "Ccy",
      field: "currencyPair",
      valueFormatter: (params) => formatCurrencyPair(params.value),
    },
    {
      headerName: "Bid Price",
      field: "bid",
      cellStyle: () => ({
        color: Palette.Bid,
        display: "flex",
        "justify-content": "flex-end",
      }),
      type: "numericColumn",
      valueFormatter: priceFormatter,
      cellRenderer: "priceRenderer",
    },
    {
      headerName: "Ask Price",
      field: "ask",
      cellStyle: () => ({
        color: Palette.Ask,
      }),
      valueFormatter: priceFormatter,
      cellRenderer: "priceRenderer",
    },
    {
      headerName: "Volume",
      field: "volume",
      valueFormatter: volumeFormatter,
    },
    {
      headerName: "",
      field: "prices",
      cellRenderer: "priceChartRenderer",
      width: 100,
      cellStyle: () => ({
        "padding-left": 0,
        "padding-right": 0,
      }),
    },
  ];

  const rowClassRules = {
    "selected-row": (params: any) => params.node.isSelected(),
  };

  useEffect(() => {
    if (gridApi) {
      gridApi.forEachNode(function (node) {
        node.setSelected(node.data.currencyPair === selectedCurrencyPair);
      });
      gridApi.redrawRows();
    }
  }, [gridApi, selectedCurrencyPair]);

  return (
    <Container className="ag-theme-balham-dark">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={tickers}
        rowClassRules={rowClassRules}
        deltaRowDataMode={true}
        getRowNodeId={(data) => data.currencyPair}
        onGridReady={(event) => {
          setGridApi(event.api);
          event.api.sizeColumnsToFit();
        }}
        rowSelection={"single"}
        onRowClicked={(event) => {
          onClick(event.data.currencyPair);
        }}
        frameworkComponents={{
          priceChartRenderer: PriceChartRenderer,
          priceRenderer: PriceRenderer,
        }}
      ></AgGridReact>
    </Container>
  );
};

export default Market;
