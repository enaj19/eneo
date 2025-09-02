// usePagination.ts
import { useMemo } from 'react';

export const DOTS = '...';

const range = (start: number, end: number) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};

type PaginationProps = {
    totalCount: number;
    pageSize: number;
    siblingCount?: number;
    currentPage: number;
};

export const usePagination = ({
    totalCount,
    pageSize,
    siblingCount = 1,
    currentPage,
}: PaginationProps) => {
    const paginationRange = useMemo(() => {
        const totalPageCount = Math.ceil(totalCount / pageSize);

        // Nombre de pages à afficher : siblingCount + première page + dernière page + page actuelle + 2*DOTS
        const totalPageNumbers = siblingCount + 5;

        // Cas 1: Si le nombre de pages est inférieur au nombre que nous voulons afficher, on affiche tout.
        if (totalPageNumbers >= totalPageCount) {
            return range(1, totalPageCount);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;

        // Cas 2: Pas de points à gauche, mais à droite oui.
        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = range(1, leftItemCount);
            return [...leftRange, DOTS, totalPageCount];
        }

        // Cas 3: Pas de points à droite, mais à gauche oui.
        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
            return [firstPageIndex, DOTS, ...rightRange];
        }

        // Cas 4: Points des deux côtés.
        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }

        // Fallback pour toute autre situation (ne devrait pas arriver)
        return [];

    }, [totalCount, pageSize, siblingCount, currentPage]);

    return paginationRange;
};