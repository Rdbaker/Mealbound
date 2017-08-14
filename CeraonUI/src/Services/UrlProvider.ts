import * as QueryString from 'query-string';


export default class UrlProvider {

  static getHomePageUrl() : string {
    return '#/';
  }

  static get404Url(): string {
    return '#/404/';
  }

  static getLoadingUrl(): string {
    return '#/loading/';
  }

  static getLandingUrl(): string {
    return '#/landing/';
  }

  static getSearchUrl(filters: any): string {
    return '#/search/?' + this.queryifyFilters(filters);
  }

  static getViewMealUrl(mealId: string) : string {
    return '#/meal/' + mealId + '/';
  }

  static getCreateMealUrl() : string {
    return '#/new-meal/';
  }

  static getEditMealUrl(mealId: string) : string {
    return '#/edit-meal/' + mealId + '/';
  }

  static getSettingsUrl() : string {
    return '#/settings/';
  }

  static get403Url() : string {
    return '#/403/';
  }

  private static queryifyFilters(filters: any) : string {
    return QueryString.stringify({
      filters: JSON.stringify(filters),
    }, { arrayFormat: 'index'});
  }
}
