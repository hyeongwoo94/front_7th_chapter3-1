import React, { useState, useEffect } from 'react';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import {
  getBadgeVariantFromStatus,
  getBadgeLabelFromStatus,
  getBadgeVariantFromUserRole,
  getBadgeLabelFromUserRole,
} from '@/lib/badge-mappers';

interface Column {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
}

/**
 * Table 컴포넌트
 * 
 * shadcn/ui Table을 사용한 테이블 컴포넌트입니다.
 * 도메인 로직은 하위 호환성을 위해 유지되지만, 권장하지 않습니다.
 */
interface TableProps {
  columns?: Column[];
  data?: any[];
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  pageSize?: number;
  searchable?: boolean;
  sortable?: boolean;
  onRowClick?: (row: any) => void;

  // 하위 호환성을 위한 도메인 props (권장하지 않음)
  entityType?: 'user' | 'post';
  onEdit?: (item: any) => void;
  onDelete?: (id: number) => void;
  onPublish?: (id: number) => void;
  onArchive?: (id: number) => void;
  onRestore?: (id: number) => void;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data = [],
  striped = false,
  bordered = false,
  hover = false,
  pageSize = 10,
  searchable = false,
  sortable = false,
  onRowClick,
  entityType,
  onEdit,
  onDelete,
  onPublish,
  onArchive,
  onRestore,
}) => {
  const [tableData, setTableData] = useState<any[]>(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnKey);
    setSortDirection(newDirection);

    const sorted = [...tableData].sort((a, b) => {
      const aVal = a[columnKey];
      const bVal = b[columnKey];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return newDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return newDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    setTableData(sorted);
  };

  const filteredData = searchable && searchTerm
    ? tableData.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : tableData;

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const actualColumns = columns || (tableData[0] ? Object.keys(tableData[0]).map(key => ({ key, header: key, width: undefined })) : []);

  // 도메인별 셀 렌더링 (하위 호환성)
  const renderCell = (row: any, columnKey: string) => {
    const value = row[columnKey];

    if (entityType === 'user') {
      if (columnKey === 'role') {
        const variant = getBadgeVariantFromUserRole(value);
        const label = getBadgeLabelFromUserRole(value);
        return <Badge variant={variant}>{label}</Badge>;
      }
      if (columnKey === 'status') {
        // user status를 badge status로 매핑
        const badgeStatus =
          value === 'active' ? 'published' :
          value === 'inactive' ? 'draft' : 'rejected';
        const variant = getBadgeVariantFromStatus(badgeStatus);
        const label = getBadgeLabelFromStatus(badgeStatus);
        return <Badge variant={variant}>{label}</Badge>;
      }
      if (columnKey === 'lastLogin') {
        return value || '-';
      }
      if (columnKey === 'actions') {
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="primary" onClick={() => onEdit?.(row)}>
              수정
            </Button>
            <Button size="sm" variant="danger" onClick={() => onDelete?.(row.id)}>
              삭제
            </Button>
          </div>
        );
      }
    }

    if (entityType === 'post') {
      if (columnKey === 'category') {
        const variant =
          value === 'development' ? 'primary' :
          value === 'design' ? 'info' :
          value === 'accessibility' ? 'danger' :
          'secondary';
        return <Badge variant={variant} pill>{value}</Badge>;
      }
      if (columnKey === 'status') {
        const variant = getBadgeVariantFromStatus(value);
        const label = getBadgeLabelFromStatus(value);
        return <Badge variant={variant}>{label}</Badge>;
      }
      if (columnKey === 'views') {
        return value?.toLocaleString() || '0';
      }
      if (columnKey === 'actions') {
        return (
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="primary" onClick={() => onEdit?.(row)}>
              수정
            </Button>
            {row.status === 'draft' && (
              <Button
                size="sm"
                variant="success"
                onClick={() => onPublish?.(row.id)}
              >
                게시
              </Button>
            )}
            {row.status === 'published' && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onArchive?.(row.id)}
              >
                보관
              </Button>
            )}
            {row.status === 'archived' && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => onRestore?.(row.id)}
              >
                복원
              </Button>
            )}
            <Button size="sm" variant="danger" onClick={() => onDelete?.(row.id)}>
              삭제
            </Button>
          </div>
        );
      }
    }

    if (React.isValidElement(value)) {
      return value;
    }

    return value;
  };

  return (
    <div className="overflow-x-auto">
      {searchable && (
        <div className="mb-4">
          <Input
            type="text"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />
        </div>
      )}

      <UITable
        className={cn(
          'table',
          striped && '[&_tbody_tr:nth-child(even)]:bg-[var(--color-bg-tertiary)]',
          bordered && 'border border-[var(--color-border-tertiary)] [&_th]:border [&_td]:border [&_th]:border-[var(--color-border-tertiary)] [&_td]:border-[var(--color-border-tertiary)]'
        )}
      >
        <TableHeader>
          <TableRow>
            {actualColumns.map((column) => (
              <TableHead
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
                onClick={() => sortable && handleSort(column.key)}
                className={cn(
                  sortable && 'cursor-pointer',
                  sortColumn === column.key && 'bg-[var(--color-bg-secondary)]'
                )}
              >
                <div className="flex items-center gap-1">
                  {column.header}
                  {sortable && sortColumn === column.key && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={cn(
                hover && 'cursor-pointer',
                striped && rowIndex % 2 === 1 && 'bg-[var(--color-bg-tertiary)]'
              )}
            >
              {actualColumns.map((column) => (
                <TableCell key={column.key}>
                  {entityType ? renderCell(row, column.key) : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </UITable>

      {totalPages > 1 && (
        <div className="mt-4 flex gap-2 justify-center items-center">
          <Button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            size="sm"
            variant="secondary"
          >
            이전
          </Button>
          <span className="px-3 py-1.5">
            {currentPage} / {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            size="sm"
            variant="secondary"
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
};
