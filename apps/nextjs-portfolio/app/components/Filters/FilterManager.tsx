'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoAdd } from 'react-icons/io5';
import Chip from '../Chip/Chip';

type Tag = {
  _id: string;
  name: string;
  paintingsCount: number;
};

type FilterManagerProps = {
  tags: Tag[];
  currentFilters: string[];
};

const FilterManager = ({ tags, currentFilters }: FilterManagerProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter available tags (exclude already selected ones)
  const availableTags = tags.filter(tag => !currentFilters.includes(tag.name));

  // Filter tags based on search term
  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addFilter = (tagName: string) => {
    const newFilters = [...currentFilters, tagName];
    updateURL(newFilters);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const removeFilter = (tagName: string) => {
    const newFilters = currentFilters.filter(filter => filter !== tagName);
    updateURL(newFilters);
  };

  const updateURL = (filters: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filters.length > 0) {
      params.set('filter', filters.join(','));
    } else {
      params.delete('filter');
    }

    // Reset to page 1 when filters change
    params.delete('page');

    router.push(`/paintings?${params.toString()}`);
  };

  const clearAllFilters = () => {
    updateURL([]);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Filters:</h3>
        {currentFilters.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Current filters */}
        {currentFilters.map(filter => (
          <Chip
            key={filter}
            label={filter}
            onRemove={() => removeFilter(filter)}
            removable
            size="small"
          />
        ))}

        {/* Add filter button */}
        {currentFilters.length < 5 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm border border-dashed border-border rounded-full hover:border-secondary hover:bg-surface-elevated transition-colors"
            >
              <IoAdd className="w-4 h-4" />
              Add filter
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-surface border border-border rounded-lg shadow-lg z-10">
                {/* Search input */}
                <div className="p-3 border-b border-border">
                  <input
                    type="text"
                    placeholder="Search tags..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-border-focus bg-surface text-text-primary"
                    autoFocus
                  />
                </div>

                {/* Tags list */}
                <div className="max-h-48 overflow-y-auto">
                  {filteredTags.length > 0 ? (
                    filteredTags.map(tag => (
                      <button
                        key={tag._id}
                        onClick={() => addFilter(tag.name)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-surface-elevated flex items-center justify-between text-text-primary"
                      >
                        <span>{tag.name}</span>
                        <span className="text-xs text-text-tertiary">
                          {tag.paintingsCount} paintings
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-text-tertiary">
                      {searchTerm ? 'No tags found' : 'No available tags'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Max filters warning */}
        {currentFilters.length >= 5 && (
          <span className="text-xs text-text-tertiary">Maximum 5 filters reached</span>
        )}
      </div>

      {/* Filter info */}
      {currentFilters.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Showing paintings with <strong>all</strong> selected tags
        </div>
      )}
    </div>
  );
};

export default FilterManager;
