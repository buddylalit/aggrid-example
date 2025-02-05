// components/GridComponent.tsx
"use client";

import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useState } from "react";
import type { ColDef, RowSelectionOptions } from "ag-grid-community";
import {
  AllCommunityModule,
  ModuleRegistry,
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
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([AllCommunityModule]);

const GridComponent = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  // const [columnDefs, setColumnDefs] = useState<ColDef[]>([
  //   { field: "athlete" },
  //   { field: "sport" },
  //   { field: "age" },
  // ]);
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

  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  const rowSelection: RowSelectionOptions<any, any> = useMemo(() => {
    return {
      mode: "multiRow",
    };
  }, []);

  console.log(rowData);
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <AgGridReact
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
