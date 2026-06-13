'use client';

import { Fragment, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.patientInfo.sectionTable;

export interface SectionTableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface SectionTableProps<T extends { id: string }> {
  columns: SectionTableColumn<T>[];
  rows: T[];
  renderDetail?: (row: T) => React.ReactNode;
  isReadOnly?: boolean;
  onAdd?: () => void;
  onDelete?: (id: string) => void;
}

export function SectionTable<T extends { id: string }>({
  columns,
  rows,
  renderDetail,
  isReadOnly = false,
  onAdd,
  onDelete,
}: SectionTableProps<T>) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleRowClick = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleRowKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRowClick(id);
    }
  };

  return (
    <div className="space-y-2">
      {!isReadOnly && onAdd && (
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background text-xs font-medium px-3 h-7 shadow-sm hover:bg-accent transition-colors"
            onClick={onAdd}
          >
            {t.addBtn}
          </button>
        </div>
      )}
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">{t.empty}</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b">
              {renderDetail && <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 w-6" />}
              {columns.map((col) => (
                <th key={String(col.key)} className="text-left text-xs font-medium text-muted-foreground px-3 py-2">
                  {col.label}
                </th>
              ))}
              {!isReadOnly && onDelete && (
                <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 w-16" />
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <Fragment key={row.id}>
                <tr
                  className="border-b hover:bg-muted/40 transition-colors"
                  tabIndex={renderDetail ? 0 : undefined}
                  aria-expanded={renderDetail ? expandedId === row.id : undefined}
                  onClick={renderDetail ? () => handleRowClick(row.id) : undefined}
                  onKeyDown={renderDetail ? (e) => handleRowKeyDown(e, row.id) : undefined}
                >
                  {renderDetail && (
                    <td className="px-3 py-2 text-sm w-6 text-muted-foreground">
                      {expandedId === row.id ? (
                        <ChevronDown className="w-4 h-4" aria-hidden />
                      ) : (
                        <ChevronRight className="w-4 h-4" aria-hidden />
                      )}
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-3 py-2 text-sm">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                    </td>
                  ))}
                  {!isReadOnly && onDelete && (
                    <td className="px-3 py-2 text-sm w-16">
                      <button
                        type="button"
                        className="text-xs text-destructive hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(row.id);
                        }}
                      >
                        {t.deleteBtn}
                      </button>
                    </td>
                  )}
                </tr>
                {renderDetail && expandedId === row.id && (
                  <tr className="bg-muted/20">
                    <td
                      colSpan={columns.length + 1 + (!isReadOnly && onDelete ? 1 : 0)}
                      className="px-4 py-3"
                    >
                      {renderDetail(row)}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
