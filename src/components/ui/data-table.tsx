"use client";
import { downloadCSV } from "@/lib/format";
import {
  flexRender,
  type ColumnVisibilityState,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useLegacyTable,
  type LegacyColumnDef,
} from "@tanstack/react-table/legacy";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  SlidersHorizontal,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button, EmptyState, Menu, SearchInput } from "./primitives";
export type Column<T extends RowData> = LegacyColumnDef<T>;
export function DataTable<T extends RowData>({
  data,
  columns,
  placeholder,
  toolbar,
  name = "salonly-export",
}: {
  data: T[];
  columns: Column<T>[];
  placeholder?: string;
  toolbar?: ReactNode;
  name?: string;
}) {
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [visibility, setVisibility] = useState<ColumnVisibilityState>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [selection, setSelection] = useState({});
  const table = useLegacyTable({
    data,
    columns,
    state: {
      globalFilter: search,
      sorting,
      columnVisibility: visibility,
      pagination,
      rowSelection: selection,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _id, value) =>
      JSON.stringify(row.original)
        .toLowerCase()
        .includes(String(value).toLowerCase()),
  });
  function exportRows(selected = false) {
    downloadCSV(
      name,
      (selected
        ? table.getSelectedRowModel()
        : table.getFilteredRowModel()
      ).rows.map((r) => r.original as Record<string, unknown>),
    );
  }
  return (
    <div className="table-root">
      <div className="table-toolbar">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            table.setPageIndex(0);
          }}
          placeholder={placeholder}
        />
        <div className="actions">
          {toolbar}
          {Object.keys(selection).length > 0 && (
            <Button onClick={() => exportRows(true)}>
              Export {Object.keys(selection).length} selected
            </Button>
          )}
          <Button onClick={() => exportRows()}>
            <Download size={14} />
            <span className="hide-mobile">Export</span>
          </Button>
          <Menu
            label="Visible columns"
            items={table.getAllLeafColumns().map((c) => ({
              label: `${c.getIsVisible() ? "✓ " : ""}${typeof c.columnDef.header === "string" ? c.columnDef.header : c.id}`,
              onClick: () => c.toggleVisibility(),
            }))}
          >
            <SlidersHorizontal size={15} />
          </Menu>
        </div>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            {table.getHeaderGroups().map((g) => (
              <tr key={g.id}>
                <th className="check-cell">
                  <input
                    type="checkbox"
                    aria-label="Select page"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                  />
                </th>
                {g.headers.map((h) => (
                  <th
                    key={h.id}
                    aria-sort={
                      h.column.getIsSorted() === "asc"
                        ? "ascending"
                        : h.column.getIsSorted() === "desc"
                          ? "descending"
                          : "none"
                    }
                  >
                    <button
                      onClick={h.column.getToggleSortingHandler()}
                      disabled={!h.column.getCanSort()}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted()
                        ? h.column.getIsSorted() === "asc"
                          ? " ↑"
                          : " ↓"
                        : ""}
                    </button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} data-selected={row.getIsSelected()}>
                <td className="check-cell">
                  <input
                    type="checkbox"
                    aria-label={`Select row ${row.index + 1}`}
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                  />
                </td>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!table.getRowModel().rows.length && <EmptyState />}
      </div>
      <div className="table-footer">
        <span>
          {table.getFilteredRowModel().rows.length} records{" "}
          <span className="muted">
            · {Object.keys(selection).length} selected
          </span>
        </span>
        <div className="actions">
          <select
            aria-label="Rows per page"
            value={pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
          <Button
            aria-label="Previous page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft size={14} />
          </Button>
          <span>
            {pagination.pageIndex + 1} / {Math.max(1, table.getPageCount())}
          </span>
          <Button
            aria-label="Next page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
