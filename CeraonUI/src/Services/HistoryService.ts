import CeraonState from '../State/CeraonState';
import CeraonDispatcher from '../Store/CeraonDispatcher';
import CeraonAction from '../Actions/CeraonAction';
import * as QueryString from 'query-string';
import * as Actions from '../Actions/Index';

class HistoryService {
  constructor() {
    this.onPopState = this.onPopState.bind(this);

    window.onpopstate = (event) => {
      if (event.state) {
        this.onPopState(event.state);
      } else {
        window.location.reload();
      }
    };
  }

  getInitialActions() : CeraonAction[] {
    let historyRouter = new HistoryRouter(new HistoryRouteParser(window.location.hash));
    return historyRouter.getActions();
  }

  onPageNavigation(appState: CeraonState) {
    history.pushState(appState, appState.pageTitle, appState.pageUrl);

    document.title = appState.pageTitle;
  }

  onPageStateUpdated(appState: CeraonState) {
    history.replaceState(appState, appState.pageTitle, appState.pageUrl);
    document.title = appState.pageTitle;
  }

  private onPopState(appState: CeraonState) {
    document.title = appState.pageTitle;
    CeraonDispatcher(Actions.createLoadStateAction(appState));
  }
}

class HistoryRouter {
  private _actions: CeraonAction[] = [];
  constructor(private _parser: HistoryRouteParser) {
    this.followRoute();
  }

  getActions() : CeraonAction[] {
    return this._actions;
  }

  private followRoute() {
    switch (this._parser.getRootPath()) {
      case 'meal':
        this._actions = this.handleMealPath();
        break;
      case 'search':
        this._actions = this.handleSearchPath();
        break;
      case 'landing':
        this._actions = this.handleLandingPath();
        break;
      case 'new-meal':
        this._actions = this.handleNewMealPath();
        break;
      case 'edit-meal':
        this._actions = this.handleEditMealPath();
        break;
      case 'settings':
        this._actions = this.handleSettingsPath();
        break;
      case '403':
        this._actions = this.handle403Path();
        break;
      case '':
        this._actions = this.handleHomePath();
        break;
      default:
        this._actions = [Actions.createPageNotFoundAction()];
    }
  }

  private handleMealPath() : CeraonAction[] {
    // ['', 'meal', 'id', '']
    if (this._parser.getNumberSections() != 4) {
      return [Actions.createPageNotFoundAction()];
    }

    // meal id should be section 3 [ '', 'meal', 'id', '' ]
    return [ Actions.createViewMealAction(this._parser.getSections()[2]) ];
  }

  private handleSearchPath() : CeraonAction[] {
    // ['', 'search', 'querystr']
    if (this._parser.getNumberSections() != 3) {
      return [Actions.createPageNotFoundAction()];
    }

    let queryString = this._parser.getQueryParams();

    if (typeof queryString !== 'object') {
      return [Actions.createPageNotFoundAction()];
    }

    if (!queryString.filters) {
      return [Actions.createPageNotFoundAction()];
    }
    let restoredFilter = JSON.parse(queryString.filters);

    if (!restoredFilter) {
      return [Actions.createPageNotFoundAction()];
    } else {
      return [ Actions.createMealSearchAction(restoredFilter)];
    }
  }

  private handleHomePath() : CeraonAction[] {
    if (this._parser.getNumberSections() != 0) {
      return [Actions.createPageNotFoundAction()];
    }

    return [Actions.createGoHomeAction()];
  }

  private handleLandingPath() : CeraonAction[] {
    return [Actions.createLandingAction()];
  }

  private handleNewMealPath() : CeraonAction[] {
    return [Actions.createGoToCreateMealAction()];
  }

  private handleEditMealPath(): CeraonAction[] {
    // ['', 'edit-meal', 'id', '']
    if (this._parser.getNumberSections() != 4) {
      return [Actions.createPageNotFoundAction()];
    }

    // meal id should be section 3 [ '', 'edit-meal', 'id', '' ]
    return [ Actions.createGoToEditMealAction(this._parser.getSections()[2]) ];
  }

  private handleSettingsPath(): CeraonAction[] {
    return [Actions.createGoToSettingsAction()];
  }

  private handle403Path(): CeraonAction[] {
    return [Actions.createNotAuthorizedAction()];
  }
}

class HistoryRouteParser {
  private _sections: string[] = [];
  private _queryParams: any = {};

  constructor(private _locationHash: string) {
    if (this._locationHash.length <= 2) {
      this._sections = [];
      this._queryParams = {};
    } else {
      // Remove hash
      if (this._locationHash.charAt(0) == '#') {
        this._locationHash = this._locationHash.substr(1, this._locationHash.length - 1);
      }

      this._sections = this._locationHash.split('/');

      if (this._sections.length > 0) {
        let lastSection = this._sections[this._sections.length - 1];
        if (lastSection.length > 0 && lastSection.charAt(0) == '?') {
          this._queryParams = QueryString.parse(lastSection, {arrayFormat: 'index'});
        }
      }
    }
  }

  getSections(): string[] {
    return this._sections;
  }

  getRootPath(): string {
    return this._sections.length > 1 ? this._sections[1] : '';
  }

  getQueryParams(): any {
    return this._queryParams;
  }

  getNumberSections(): number {
    return this._sections.length;
  }
}

const HistoryServiceStatic = new HistoryService();

export default HistoryServiceStatic;
