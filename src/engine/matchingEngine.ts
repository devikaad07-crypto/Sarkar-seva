import { Scheme } from '../data/schemes';
import { UserProfile } from '../store/userStore';

export interface MatchResult {
  scheme: Scheme;
  score: number;
  isEligible: boolean;
  reasons: string[];
}

export function calculateMatches(profile: UserProfile, schemes: Scheme[]): MatchResult[] {
  return schemes.map((scheme) => {
    let score = 100;
    const reasons: string[] = [];
    let isEligible = true;

    const { eligibility } = scheme;

    // Age matching
    if (eligibility.minAge && profile.age < eligibility.minAge) {
      isEligible = false;
      reasons.push(`Minimum age required is ${eligibility.minAge}`);
    }
    if (eligibility.maxAge && profile.age > eligibility.maxAge) {
      isEligible = false;
      reasons.push(`Maximum age allowed is ${eligibility.maxAge}`);
    }

    // Gender matching
    if (eligibility.gender && eligibility.gender.length > 0) {
      if (!eligibility.gender.includes(profile.gender)) {
        isEligible = false;
        reasons.push(`Only for ${eligibility.gender.join(', ')}`);
      }
    }

    // Income matching
    if (eligibility.incomeLimit && profile.income > eligibility.incomeLimit) {
      isEligible = false;
      reasons.push(`Income limit is ₹${eligibility.incomeLimit.toLocaleString()}`);
    }

    // Occupation matching
    if (eligibility.occupation && eligibility.occupation.length > 0) {
      if (!eligibility.occupation.includes(profile.occupation)) {
        score -= 30;
        reasons.push(`Primary benefits for ${eligibility.occupation.join(', ')}`);
      }
    }

    // Caste matching
    if (eligibility.caste && eligibility.caste.length > 0) {
      if (!eligibility.caste.includes(profile.caste)) {
        isEligible = false;
        reasons.push(`Criteria for ${eligibility.caste.join(', ')} category only`);
      }
    }

    // Default to success if no specific exclusions
    return {
      scheme,
      score: Math.max(0, isEligible ? score : score / 2),
      isEligible,
      reasons,
    };
  }).sort((a, b) => b.score - a.score);
}
