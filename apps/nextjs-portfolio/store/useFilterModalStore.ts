import { create } from 'zustand';

interface FilterState {
  isOpen: boolean;
  selectedFilters: string[];
  selectedSort: string;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleFilter: (filter: string, pathname: string, router: any) => void;
  setSort: (sort: string, pathname: string, router: any) => void;
  clearFilters: (pathname: string, router: any) => void;
}

const useFilterSidebarStore = create<FilterState>(set => ({
  isOpen: false,
  selectedFilters: [],
  selectedSort: 'newest',
  openSidebar: () => set({ isOpen: true }),
  closeSidebar: () => set({ isOpen: false }),
  toggleFilter: (filter, pathname, router) => {
    set(state => {
      const updatedFilters = state.selectedFilters.includes(filter)
        ? state.selectedFilters.filter(f => f !== filter)
        : [...state.selectedFilters, filter];

      const params = new URLSearchParams();
      updatedFilters.forEach(f => params.append('filter', f));
      params.set('sort', state.selectedSort);

      router.push(`${pathname}?${params.toString()}`);
      return { selectedFilters: updatedFilters };
    });
  },
  setSort: (sort, pathname, router) => {
    set(state => {
      const params = new URLSearchParams();
      state.selectedFilters.forEach(f => params.append('filter', f));
      params.set('sort', sort);

      router.push(`${pathname}?${params.toString()}`);
      return { selectedSort: sort };
    });
  },
  clearFilters: (pathname, router) => {
    set(() => {
      const params = new URLSearchParams();
      params.set('sort', 'random');
      router.push(`${pathname}?${params.toString()}`);
      return { selectedFilters: [], selectedSort: 'random' };
    });
  },
}));

export default useFilterSidebarStore;
