'use client';

import { GetAllPaintingsandTagsResult } from '@/sanity.types';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import Chip from '../Chip/Chip';
import { Dialog, Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';

type FiltersProps = {
  tags: GetAllPaintingsandTagsResult['tags'];
};

const Filters = ({ tags }: FiltersProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const sortParam = searchParams.get('sort') || 'random';
  const [selectedSort, setSelectedSort] = useState(sortParam);

  const [selectedFilters, setSelectedFilters] = useState(
    searchParams.getAll('filter')
  );

  const sortingOptions = [
    { value: 'random', label: 'Random' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'most-viewed', label: 'Most Viewed' },
  ];

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Update the 'filter' parameters
    params.delete('filter');
    selectedFilters.forEach((value) => {
      params.append('filter', value);
    });

    // Update the 'sort' parameter
    params.set('sort', selectedSort);

    // Navigate to the new URL with all updated parameters
    router.push(`${pathname}?${params.toString()}`);

    setIsModalOpen(false);
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      {/* Button to open the modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Filters & Sort
      </button>

      {/* Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalOpen(false)}
        >
          {/* The backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>

          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            {/* Panel */}
            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-300 transform"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-200 transform"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle bg-white rounded-lg shadow-xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Filters & Sorting
                </Dialog.Title>

                {/* Sorting Options */}
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Sort By
                  </label>
                  <Listbox
                    value={selectedSort}
                    onChange={(value) => {
                      setSelectedSort(value);
                    }}
                  >
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus:ring-2 focus:ring-opacity-75 focus:ring-blue-500 sm:text-sm">
                        <span className="block truncate">
                          {
                            sortingOptions.find(
                              (option) => option.value === selectedSort
                            )?.label
                          }
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          ▼
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {sortingOptions.map((option) => (
                            <Listbox.Option
                              key={option.value}
                              value={option.value}
                              className={({ active }) =>
                                `cursor-default select-none relative py-2 pl-10 pr-4 ${
                                  active
                                    ? 'text-blue-900 bg-blue-100'
                                    : 'text-gray-900'
                                }`
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? 'font-medium' : 'font-normal'
                                    }`}
                                  >
                                    {option.label}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                      ✓
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>

                {/* Filter Chips */}
                <div className="mt-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Filters
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(({ _id, name, paintingsCount }) => {
                      const filterValue = name.toLowerCase();
                      const isActive = selectedFilters.includes(filterValue);

                      return (
                        <button
                          key={_id}
                          type="button"
                          onClick={() => {
                            setSelectedFilters((prevFilters) => {
                              if (isActive) {
                                return prevFilters.filter(
                                  (filter) => filter !== filterValue
                                );
                              } else {
                                return [...prevFilters, filterValue];
                              }
                            });
                          }}
                        >
                          <Chip
                            label={name}
                            additionalText={paintingsCount.toString()}
                            selected={isActive}
                          />
                        </button>
                      );
                    })}
                  </div>
                  {/* Clear Filters Button */}
                  <button
                    onClick={clearFilters}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    Clear Filters
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end mt-6 space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                    onClick={applyFilters}
                  >
                    Apply
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Filters;
