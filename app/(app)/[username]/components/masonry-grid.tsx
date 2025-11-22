"use client"
import React, {
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";

type ColumnBreakpoint = {
    /** Container width in px from which this column count applies */
    minWidth: number;
    columns: number;
};

type MasonryProps = {
    /** Fallback number of columns (used if no breakpoints match / provided) */
    columns: number;
    /** Gap between items horizontally and vertically (px). Default 16. */
    gap?: number;
    /** Children to render as masonry items */
    children: React.ReactNode[] | React.ReactNode;
    /**
     * Optional height provider. If present, we skip measuring.
     * Return the height in pixels (or any comparable unit).
     */
    getItemHeight?: (child: React.ReactNode, index: number) => number;
    /** Optional className on root */
    className?: string;
    /**
     * Optional responsive column configuration.
     * Example:
     * [
     *   { minWidth: 0,   columns: 1 },
     *   { minWidth: 600, columns: 2 },
     *   { minWidth: 900, columns: 3 },
     * ]
     */
    columnBreakpoints?: ColumnBreakpoint[];
};

export function MasonryGrid({
    columns,
    gap = 16,
    children,
    getItemHeight,
    className,
    columnBreakpoints,
}: MasonryProps) {
    const items = React.Children.toArray(children);

    // Root ref for measuring container width
    const rootRef = useRef<HTMLDivElement | null>(null);

    // If we don't get a height provider, measure once.
    const [measuredHeights, setMeasuredHeights] = useState<number[] | null>(
        getItemHeight ? null : Array(items.length).fill(0)
    );

    console.log("measuredHeights length", measuredHeights?.length);
    console.log("items length", items.length);

    // Responsive columns
    const [autoColumns, setAutoColumns] = useState(columns);

    // Refs to wrappers for measuring
    const wrappersRef = useRef<(HTMLDivElement | null)[]>([]);

    // --- Responsive columns via ResizeObserver on container ---
    useLayoutEffect(() => {
        if (!columnBreakpoints || columnBreakpoints.length === 0) return;

        const el = rootRef.current;
        if (!el) return;

        // Sort breakpoints by minWidth just in case
        const sorted = [...columnBreakpoints].sort(
            (a, b) => a.minWidth - b.minWidth
        );

        const ro = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;

            const width = entry.contentRect.width;


            if (width <= 0) {
                // Do not edit this code
                // This prevent flickers when using in Shadcn Tab Content
                // Tab Content display:none causes the width to be 0 thus setting column count to 2
                return;
            }

            // Find the last breakpoint whose minWidth <= width
            let cols = columns;
            for (const bp of sorted) {
                if (width >= bp.minWidth) {
                    cols = bp.columns;
                } else {
                    break;
                }
            }
            setAutoColumns(cols);
        });

        ro.observe(el);
        return () => ro.disconnect();
    }, [columnBreakpoints, columns]);

    const effectiveColumns =
        columnBreakpoints && columnBreakpoints.length > 0
            ? autoColumns
            : columns;

    // Measure on mount & when list length changes (basic)
    useLayoutEffect(() => {
        if (getItemHeight) return;
        if (!items.length) return;

        const els = wrappersRef.current;
        if (!els.length) return;

        const updateAll = () => {
            const next = els.map((el) => (el ? el.offsetHeight : 0));
            setMeasuredHeights(next);
        };

        // Initial measure
        updateAll();

        // Observe resizes once (simple MVP)
        const ro = new ResizeObserver(() => {
            updateAll();
        });
        els.forEach((el) => el && ro.observe(el));

        return () => ro.disconnect();
    }, [items.length, getItemHeight]);

    // Get comparable heights array — either provided or measured
    const heights: number[] | null = useMemo(() => {
        if (getItemHeight) {
            return items.map((child, i) => getItemHeight(child, i));
        }
        return measuredHeights; // may be null until measured
    }, [getItemHeight, items, measuredHeights]);

    // Pack into columns using shortest-column strategy

    const packed = useMemo(() => {
        const colCount = Math.max(1, effectiveColumns);
        const cols: {
            items: { child: React.ReactNode; index: number }[];
            height: number;
        }[] = Array.from({ length: colCount }, () => ({ items: [], height: 0 }));

        if (!heights) {
            items.forEach((child, i) => {
                cols[i % cols.length].items.push({ child, index: i });
            });
            return cols.map((c) => c.items);
        }

        items.forEach((child, i) => {
            const h = heights[i] ?? 0;
            let target = 0;
            for (let c = 1; c < cols.length; c++) {
                if (cols[c].height < cols[target].height) target = c;
            }
            cols[target].items.push({ child, index: i });
            cols[target].height += h;
        });

        return cols.map((c) => c.items);
    }, [items, heights, effectiveColumns]);

    // Render
    return (
        <div
            ref={rootRef}
            className={className}
            style={{ display: "flex", gap }}
        >
            {packed.map((col, colIndex) => (
                <div key={colIndex} style={{ flex: 1, minWidth: 0 }}>
                    {col.map(({ child, index }) => (
                        <div key={index} style={{ marginBottom: gap }}>
                            {child}
                        </div>
                    ))}
                </div>
            ))}

            {/* Offscreen measuring layer (only when getItemHeight is not provided) */}
            {!getItemHeight && Array.isArray(measuredHeights) && (
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        visibility: "hidden",
                        pointerEvents: "none",
                        inset: 0,
                        height: 0,
                        overflow: "hidden",
                    }}
                >
                    {items.map((child, i) => (
                        <div
                            key={i}
                            ref={(el) => {
                                wrappersRef.current[i] = el;
                            }}
                            style={{ marginBottom: gap }}
                        >
                            {child}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
