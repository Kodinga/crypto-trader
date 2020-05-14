import React, { FC, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridApi } from "ag-grid-community";
import { debounce } from "lodash";
import { priceFormatter, amountFormatter } from "modules/ag-grid/formatter";
import { useThrottle } from "core/hooks/useThrottle";
import Stale from "core/components/Stale";
import { bidAmountRenderer, askAmountRenderer } from "./renderers";
import { Order } from "../../types/Order";
import { Container } from "./Book.styled";
import Palette from "theme/style";

const DEBOUNCE_RESIZE_IN_MS = 200;

export interface Props {
  orders: { bid: Order; ask: Order }[];
  isStale?: boolean;
}

const Book: FC<Props> = (props) => {
  const { orders, isStale } = props;
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const throttledOrders = useThrottle<{ bid: Order; ask: Order }[]>(
    orders,
    500
  );

  const columnDefs: ColDef[] = [
    {
      headerName: "Bid Amount",
      field: "bid.amount",
      valueFormatter: amountFormatter,
      cellRenderer: bidAmountRenderer,
    },
    {
      headerName: "Bid Price",
      field: "bid.price",
      cellStyle: () => ({
        color: Palette.Bid,
      }),
      type: "numericColumn",
      valueFormatter: priceFormatter,
    },
    {
      headerName: "Ask Price",
      field: "ask.price",
      cellStyle: () => ({
        color: Palette.Ask,
      }),
      valueFormatter: priceFormatter,
    },
    {
      headerName: "Ask Amount",
      field: "ask.amount",
      valueFormatter: (params) =>
        amountFormatter({ value: Math.abs(params.value) }),
      cellRenderer: askAmountRenderer,
    },
  ];

  useEffect(() => {
    if (gridApi) {
      gridApi.sizeColumnsToFit();
    }

    const handleResize = debounce(() => {
      if (gridApi) {
        gridApi.sizeColumnsToFit();
      }
    }, DEBOUNCE_RESIZE_IN_MS);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [gridApi]);

  return (
    <Container className="ag-theme-balham-dark">
      {isStale && <Stale />}
      <AgGridReact
        gridOptions={{ localeText: { noRowsToShow: "Loading..." } }}
        columnDefs={columnDefs}
        rowData={throttledOrders}
        deltaRowDataMode={true}
        getRowNodeId={(data) => [data.bid?.id, data.ask?.id].join("#")}
        onGridReady={(event) => {
          setGridApi(event.api);
        }}
      ></AgGridReact>
    </Container>
  );
};

export default Book;
