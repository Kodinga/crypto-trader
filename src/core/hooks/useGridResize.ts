import { useEffect } from "react";
import { GridApi } from "ag-grid-community";
import { debounce } from "lodash";

const DEBOUNCE_RESIZE_IN_MS = 200;

export const useGridResize = (gridApi?: GridApi) => {
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
};
