'use client';

import { GetAllPaintingsandTagsResult } from '@/sanity.types';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import Chip from '../Chip/Chip';

type FiltersProps = {
  tags: GetAllPaintingsandTagsResult['tags'];
};

const Filters = ({ tags }: FiltersProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentFilters = params.getAll(name);

      if (currentFilters.includes(value)) {
        // Remove the filter
        const newFilters = currentFilters.filter((filter) => filter !== value);
        params.delete(name); // Remove all existing filters
        newFilters.forEach((filter) => {
          params.append(name, filter);
        });
      } else {
        // Add the filter
        params.append(name, value);
      }

      return params.toString();
    },
    [searchParams]
  );

  const activeFilters = searchParams.getAll('filter');

  return (
    <div className="flex flex-wrap gap-2 py-4">
      {tags.map(({ _id, name, paintingsCount }) => {
        const filterValue = name.toLowerCase();
        const isActive = activeFilters.includes(filterValue);

        return (
          <Link
            key={_id}
            href={`${pathname}?${createQueryString('filter', filterValue)}`}
          >
            <Chip
              label={name}
              additionalText={paintingsCount.toString()}
              selected={isActive} // Pass this prop to style active filters
            />
          </Link>
        );
      })}
    </div>
  );
};

export default Filters;
