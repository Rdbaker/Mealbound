

export enum MealSearchFilterType {
  Time,
}

export default abstract class MealSearchFilter {
  abstract getFriendlyDescription(): string;
  abstract getFilterType(): MealSearchFilterType;
  
  equals(otherFilter: MealSearchFilter): boolean {
    if (otherFilter.getFilterType() !== this.getFilterType()) {
      return false;
    }

    return otherFilter.getFriendlyDescription() === this.getFriendlyDescription();
  }
}
