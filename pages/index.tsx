"use client";

import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ColDef, RowSelectionOptions } from "ag-grid-community";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  CsvExportModule,
} from "ag-grid-community";
import {
  AdvancedFilterModule,
  ColumnMenuModule,
  ExcelExportModule,
  MasterDetailModule,
  PivotModule,
  RowGroupingModule,
  TreeDataModule,
  SparklinesModule,
} from "ag-grid-enterprise";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.addVirtualFileSystem(pdfFonts);
pdfMake.setFonts({
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-MediumItalic.ttf",
  },
});

const GridComponent = () => {
  console.log("pdfMake", pdfMake.setFont);
  console.log("pdfFonts", pdfFonts);
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs] = useState<ColDef[]>([
    {
      field: "athlete",
      filter: "agTextColumnFilter",
      floatingFilter: true,
      enableRowGroup: true,
      // checkboxSelection: true,
      // headerCheckboxSelection: true,
      editable: true,
    },
    {
      field: "country",
      rowGroup: true,
      hide: true,
      enableRowGroup: true,
      pinned: false,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["equals", "notEqual"],
      },
    },
    {
      field: "sport",
      rowGroup: true,
      hide: true,
      enableRowGroup: true,
      pinned: false,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["equals", "notEqual"],
      },
    },
    {
      field: "year",
      filter: "agNumberColumnFilter",
      filterParams: {
        newRowsAction: "keep",
        buttons: ["apply", "reset"],
        closeOnApply: true,
      },
      floatingFilter: true,
      enableRowGroup: true,
      pinned: false,
    },
    {
      field: "gold",
      aggFunc: "sum",
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      enableRowGroup: true,
      pinned: false,
    },
    {
      field: "silver",
      aggFunc: "sum",
      type: ["currency", "rightAligned"],
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      enableRowGroup: true,
      pinned: false,
    },
    {
      field: "bronze",
      aggFunc: "sum",
      type: ["rightAligned"],
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      enableRowGroup: true,
      pinned: false,
    },
    {
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: {
        newRowsAction: "keep",
        buttons: ["apply", "reset"],
        closeOnApply: true,
      },
      floatingFilter: true,
      enableRowGroup: true,
      pinned: false,
    },
    { field: "age" },
    { field: "total" },
  ]);

  const exportToPDF = () => {
    // Get either selected rows or all displayed rows
    const rows = gridRef.current?.api.getSelectedRows().length
      ? gridRef.current?.api.getSelectedRows()
      : [];

    if (!rows.length) {
      const displayedRows: any[] = [];
      gridRef.current?.api.forEachNode((node) => {
        if (node.data) {
          displayedRows.push(node.data);
        }
      });
      rows.push(...displayedRows);
    }

    // Get column headers
    const columnHeaders = columnDefs
      .filter((col) => !col.hide)
      .map((col) => col.field || "");

    // Create table body including headers and data
    const tableBody = [
      columnHeaders,
      ...rows.map((row) =>
        columnHeaders.map((header) => row[header]?.toString() || "")
      ),
    ];

    const pdfDocDefinition = {
      content: [
        { text: "AG Grid Data Export", style: "header" },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            widths: Array(columnHeaders.length).fill("auto"),
            body: tableBody,
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        tableExample: { margin: [0, 5, 0, 15] },
      },
      defaultStyle: {
        font: "Roboto",
      },
    };

    pdfMake.createPdf(pdfDocDefinition).open();
  };

  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  function getValue(inputSelector: string) {
    const text = (document.querySelector(inputSelector) as any)?.value;
    switch (text) {
      case "none":
        return;
      case "tab":
        return "\t";
      default:
        return text;
    }
  }

  const getParams = useCallback(() => {
    return {
      columnSeparator: getValue("#columnSeparator"),
    };
  }, []);

  const handleCsvExport = useCallback(() => {
    const params = getParams();
    if (params.columnSeparator) {
      alert(
        "NOTE: you are downloading a file with non-standard separators - it may not render correctly in Excel."
      );
    }
    gridRef.current!.api.exportDataAsCsv(params);
  }, [getParams]);

  const rowSelection: RowSelectionOptions<any, any> = useMemo(() => {
    return {
      mode: "multiRow",
    };
  }, []);

  const handleExcelExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel();
  }, []);

  return (
    <div className="w-full h-[100vh]">
      <div className="flex justify-end p-2 space-x-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleCsvExport}
        >
          Export CSV
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleExcelExport}
        >
          Export Excel
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          type="submit"
          onClick={() => {
            exportToPDF();
          }}
        >
          Export PDF
        </button>
      </div>
      <AgGridReact
        ref={gridRef}
        pagination={true}
        enableAdvancedFilter={true}
        rowData={rowData}
        columnDefs={columnDefs}
        // pivotMode={true}
        modules={[
          ClientSideRowModelModule,
          CsvExportModule,
          ExcelExportModule,
          MasterDetailModule,
          RowGroupingModule,
          PivotModule,
          TreeDataModule,
          AdvancedFilterModule,
          ColumnMenuModule,
          AllCommunityModule,
          CsvExportModule,
          ExcelExportModule,
          SparklinesModule.with(AgChartsEnterpriseModule),
        ]}
        columnTypes={{
          currency: {
            width: 300,
            valueFormatter: (params: any) => {
              return "$" + params.value;
            },
          },
        }}
        rowSelection={rowSelection}
        defaultColDef={{
          editable: true,
          sortable: true,
          resizable: true,
          filter: true,
          floatingFilter: true,
          menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
          enableRowGroup: true,
          enableValue: true,
          enablePivot: true,
        }}
      />
    </div>
  );
};

export default GridComponent;
