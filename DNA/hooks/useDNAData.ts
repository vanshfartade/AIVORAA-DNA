import { useState, useEffect, useCallback } from 'react';
import type {
  OriginNodeData,
  GoalNodeData,
  RungData,
  DNADashboardApiResponse,
  ApiResponse,
} from '../types/dna';

// ── Configuration ────────────────────────────
const API_BASE = '/api/dna';

// ── Hook State Interface ─────────────────────

interface DNADataState {
  originData: OriginNodeData[];
  goalData: GoalNodeData[];
  rungData: RungData[];
  isLoading: boolean;
  error: string | null;
}

interface UseDNADataReturn extends DNADataState {
  refetch: () => void;
}

// ── Custom Hook ──────────────────────────────

/**
 * Fetches DNA dashboard data from the backend API.
 * 
 * - Handles loading, error, and empty states
 * - Provides a refetch function for manual refresh
 * - Falls back to empty arrays on failure (helix renders blank)
 */
export function useDNAData(): UseDNADataReturn {
  const [state, setState] = useState<DNADataState>({
    originData: [],
    goalData: [],
    rungData: [],
    isLoading: true,
    error: null,
  });

  const fetchDNA = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(API_BASE);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const json: ApiResponse<DNADashboardApiResponse> = await response.json();

      if (!json.success) {
        throw new Error(json.message || 'API returned an error');
      }

      const { originNodes, goalNodes, rungNodes } = json.data;

      setState({
        originData: originNodes,
        goalData: goalNodes,
        rungData: rungNodes,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load DNA data';
      console.error('[useDNAData]', message);

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
    }
  }, []);

  useEffect(() => {
    void fetchDNA();
  }, [fetchDNA]);

  return {
    ...state,
    refetch: () => void fetchDNA(),
  };
}
