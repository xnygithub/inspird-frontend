import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

type MasonryProps = {
    /** Number of columns to render */
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
};

/**
 * Minimal masonry:
 *  - Packs items by shortest column.
 *  - Either uses provided heights (getItemHeight) or auto-measures once.
 *  - No virtualization; just layout + gutters.
 */
export function MasonryGrid({
    columns,
    gap = 16,
    children,
    getItemHeight,
    className,
}: MasonryProps) {
    const items = React.Children.toArray(children);

    // If we don't get a height provider, measure once.
    const [measuredHeights, setMeasuredHeights] = useState<number[] | null>(
        getItemHeight ? null : Array(items.length).fill(0)
    );

    // Refs to wrappers for measuring
    const wrappersRef = useRef<(HTMLDivElement | null)[]>([]);

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
        const cols: { items: React.ReactNode[]; height: number }[] = Array.from(
            { length: Math.max(1, columns) },
            () => ({ items: [], height: 0 })
        );

        // If we don't have heights yet, do a naive round-robin to avoid layout shift flashes
        if (!heights) {
            items.forEach((child, i) => {
                cols[i % cols.length].items.push(child);
            });
            return cols.map((c) => c.items);
        }

        items.forEach((child, i) => {
            const h = heights[i] ?? 0;
            // find shortest
            let target = 0;
            for (let c = 1; c < cols.length; c++) {
                if (cols[c].height < cols[target].height) target = c;
            }
            cols[target].items.push(child);
            cols[target].height += h + gap; // include vertical gap cost
        });

        return cols.map((c) => c.items);
    }, [items, heights, columns, gap]);

    // Render
    return (
        <div
            className={className}
            style={{
                display: "flex",
                gap, // horizontal gap between columns
            }}
        >
            {packed.map((col, colIndex) => (
                <div key={colIndex} style={{ flex: 1, minWidth: 0 }}>
                    {col.map((child, i) => {
                        const globalIndex =
                            // reconstruct the original index for measuring refs
                            // (MVP: we instead just assign refs during the first flat render)
                            // For measurement to work, we need an initial flat render,
                            // so we add an offscreen measuring layer when measuring is enabled.
                            i;
                        return (
                            <div key={i} style={{ marginBottom: gap }}>
                                {child}
                            </div>
                        );
                    })}
                </div>
            ))}

            {/* Offscreen measuring layer (only when auto-measuring) */}
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
                            ref={(el) => (wrappersRef.current[i] = el)}
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

/** Tiny example
 *
 * <Masonry columns={3} gap={12}>
 *   {photos.map(p => (
 *     <img key={p.id} src={p.src} style={{ width: "100%", display: "block" }} />
 *   ))}
 * </Masonry>
 *
 * // Or, if you already know heights:
 * <Masonry
 *   columns={3}
 *   gap={12}
 *   getItemHeight={(_, i) => knownHeights[i]}
 * >
 *   {cards}
 * </Masonry>
 */
