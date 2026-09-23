import { PRODUCT_PAGE_SIZES } from "@/lib/constants";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function Pagination({ page, pageSize, total, totalPages, isLoading, onPageChange, onPageSizeChange }: PaginationProps) {
  const range = getRange(page, pageSize, total);

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted">Showing {range.start}–{range.end} of {total}</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-sm text-muted" htmlFor="page-size">
          Rows
          <select className="border border-border bg-surface px-2.5 py-2 text-sm text-slate-950 outline-none focus:border-brand focus:ring-2 focus:ring-orange-100" id="page-size" value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))} disabled={isLoading}>
            {PRODUCT_PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <nav className="flex items-center gap-1" aria-label="Product pagination">
          <PaginationButton disabled={isLoading || page === 1} onClick={() => onPageChange(page - 1)}>Previous</PaginationButton>
          {[...Array(totalPages).keys()].map((index) => index + 1).map((pageNumber) => <PaginationButton key={pageNumber} active={pageNumber === page} disabled={isLoading} onClick={() => onPageChange(pageNumber)}>{pageNumber}</PaginationButton>)}
          <PaginationButton disabled={isLoading || page === totalPages} onClick={() => onPageChange(page + 1)}>Next</PaginationButton>
        </nav>
      </div>
    </div>
  );
}

function PaginationButton({ children, active = false, disabled, onClick }: Readonly<{ children: React.ReactNode; active?: boolean; disabled: boolean; onClick: () => void }>) {
  return <button className={`min-h-9 border px-3 text-sm transition ${active ? "border-slate-950 bg-slate-950 font-semibold text-white" : "border-border bg-surface text-slate-600 hover:border-slate-400 hover:text-slate-950"} disabled:cursor-not-allowed disabled:opacity-50`} type="button" aria-current={active ? "page" : undefined} disabled={disabled} onClick={onClick}>{children}</button>;
}

function getRange(page: number, pageSize: number, total: number) {
  if (total === 0) return { start: 0, end: 0 };
  return { start: (page - 1) * pageSize + 1, end: Math.min(page * pageSize, total) };
}
