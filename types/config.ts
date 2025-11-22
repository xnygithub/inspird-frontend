type ColumnBreakpoint = { minWidth: number; columns: number }

export const MASONRY_BREAKPOINTS_CONFIG: ColumnBreakpoint[] = [
    { minWidth: 0, columns: 2 },
    { minWidth: 600, columns: 3 },
    { minWidth: 1000, columns: 4 },
    { minWidth: 1400, columns: 6 },
    { minWidth: 1800, columns: 8 },
]