import { Benefit, BenefitMatchRequest } from "@/types/benefit";

function scoreMatch(benefit: Benefit, request: BenefitMatchRequest): number {
  const { eligibility } = benefit;
  let score = 0;

  if (eligibility.pregnancy !== undefined) {
    const isPregnant = request.pregnancy_week !== null && request.pregnancy_week > 0;
    if (eligibility.pregnancy && !isPregnant) return -1;
    if (eligibility.pregnancy) score += 10;
  }

  if (eligibility.min_children !== undefined) {
    if (request.children_count < eligibility.min_children) return -1;
    score += 5;
  }

  if (eligibility.max_child_age !== undefined) {
    const hasEligibleChild = request.children_ages.some(
      (age) => age <= eligibility.max_child_age!
    );
    if (!hasEligibleChild) return -1;
    score += 5;
  }

  if (eligibility.child_ages !== undefined && eligibility.child_ages.length > 0) {
    const hasEligibleAge = request.children_ages.some((age) =>
      eligibility.child_ages!.includes(age)
    );
    if (!hasEligibleAge) return -1;
    score += 8;
  }

  if (eligibility.income_level !== undefined) {
    const incomeOrder = ["low", "middle", "high"];
    const requiredIdx = incomeOrder.indexOf(eligibility.income_level);
    const userIdx = incomeOrder.indexOf(request.income_level);
    if (userIdx > requiredIdx) return -1;
    score += 3;
  }

  if (eligibility.district !== undefined) {
    if (eligibility.district !== request.district) return -1;
    score += 5;
  }

  return score;
}

export function matchBenefits(benefits: Benefit[], request: BenefitMatchRequest): Benefit[] {
  const scored = benefits.map((benefit) => ({
    benefit,
    score: scoreMatch(benefit, request),
  }));

  return scored
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score)
    .map(({ benefit }) => benefit);
}
