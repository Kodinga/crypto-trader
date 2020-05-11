import { ICellRendererParams } from "ag-grid-community";
import Palette from "theme/style";

const amountRenderer = (value: string, styles: { [key: string]: any }) => {
  const formattedStyles = Object.keys(styles)
    .map((key) => [key, styles[key]].join(":"))
    .join(";");

  return `
        <div style="position: relative;">
            <div style="height: 30px; position: absolute; z-index: 0; ${formattedStyles}"></div>
            <div style="position: absolute; z-index: 1;">${value}</div>
        </div>`;
};

export const bidAmountRenderer = (params: ICellRendererParams) => {
  const { bidDepth: depth, maxDepth } = params.data;
  const width = ((depth || 0) / maxDepth) * 100;
  return amountRenderer(params.valueFormatted, {
    "background-color": Palette.BidTransparent,
    width: `${width}%`,
    left: "-12px",
  });
};

export const askAmountRenderer = (params: ICellRendererParams) => {
  const { askDepth: depth, maxDepth } = params.data;
  const width = ((depth || 0) / maxDepth) * 100;
  return amountRenderer(params.valueFormatted, {
    "background-color": Palette.AskTransparent,
    width: `${width}%`,
    right: "-12px",
  });
};
