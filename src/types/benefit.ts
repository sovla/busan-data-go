export interface Benefit {
  id: number;
  title: string;
  category: string;
  provider: string;
  amount: string;
  amountValue: number;
  description: string;
  how_to_apply: string;
  url: string;
  eligibility: {
    pregnancy?: boolean;
    min_children?: number;
    max_child_age?: number;
    child_ages?: number[];
    income_level?: string;
    district?: string;
    excludeWhenPregnant?: boolean;
    exclusionGroup?: string;
  };
}

export interface BenefitMatchRequest {
  pregnancy_week: number | null;
  district: string;
  children_count: number;
  children_ages: number[];
  income_level: string;
}
