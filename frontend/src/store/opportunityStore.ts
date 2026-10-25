import { create } from 'zustand'
import { opportunitiesApi } from '@/lib/api'
import type { Opportunity, FilterState, PaginatedResponse } from '@/types'

interface OpportunityState {
  opportunities: Opportunity[]
  total: number
  totalPages: number
  filters: FilterState
  isLoading: boolean
  error: string | null
  fetchOpportunities: (filters?: Partial<FilterState>) => Promise<void>
  setFilter: (key: keyof FilterState, value: FilterState[keyof FilterState]) => void
  clearFilters: () => void
}

const defaultFilters: FilterState = {
  search: '',
  opportunity_type: [],
  work_arrangement: [],
  is_paid: null,
  trust_status: [],
  experience_level: [],
  page: 1,
}

export const useOpportunityStore = create<OpportunityState>((set, get) => ({
  opportunities: [],
  total: 0,
  totalPages: 1,
  filters: defaultFilters,
  isLoading: false,
  error: null,

  fetchOpportunities: async (filters) => {
    const currentFilters = { ...get().filters, ...filters }
    set({ isLoading: true, error: null })
    try {
      const data: PaginatedResponse<Opportunity> = await opportunitiesApi.list(currentFilters)
      set({
        opportunities: data.items,
        total: data.total,
        totalPages: data.total_pages,
        isLoading: false,
      })
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to fetch opportunities.'
      set({ error: message, isLoading: false, opportunities: [] })
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: 1 },
    }))
  },

  clearFilters: () => {
    set({ filters: defaultFilters })
  },
}))
