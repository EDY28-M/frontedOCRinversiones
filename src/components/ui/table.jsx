import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Table = forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
));
Table.displayName = 'Table';

const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('sticky top-0 z-10 bg-zinc-50 dark:bg-zinc-900', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
));
TableBody.displayName = 'TableBody';

const TableRow = forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn('h-11 border-b border-zinc-100 transition-colors duration-150 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/80', className)}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn('h-9 px-3 text-left align-middle text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400', className)}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('px-3 align-middle text-sm text-zinc-700 dark:text-zinc-300', className)} {...props} />
));
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell };
