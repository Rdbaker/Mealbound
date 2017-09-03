const _mixpanel = window['mixpanel'];


class Mixpanel {
  track(name, obj?) {
    try {
      _mixpanel.track(name, obj);
    } catch (e) {
      this.fallback(arguments);
    }
  }

  track_links() {
    try {
      _mixpanel.track_links(arguments);
    } catch (e) {
      this.fallback(arguments);
    }
  }

  track_forms() {
    try {
      _mixpanel.track_forms(arguments);
    } catch (e) {
      this.fallback(arguments);
    }
  }

  register() {
    try {
      _mixpanel.track_forms(arguments);
    } catch (e) {
      this.fallback(arguments);
    }
  }

  register_once() {
    try {
      _mixpanel.register_once(arguments);
    } catch (e) {
      this.fallback(arguments);
    }
  }

  identify() {
    try {
      _mixpanel.identify(arguments);
    } catch (e) {
      this.fallback(arguments);
    }
  }

  alias() {
    try {
      _mixpanel.alias(arguments);
    } catch (e) {
      this.fallback(arguments);
    }
  }

  public people = new class {
    constructor(public superThis: Mixpanel) {}

    increment() {
      try {
        _mixpanel.people.increment(arguments);
      } catch (e) {
        this.superThis.fallback(arguments);
      }
    }

    set_once() {
      try {
        _mixpanel.people.set_once(arguments);
      } catch (e) {
        this.superThis.fallback(arguments);
      }
    }

    append() {
      try {
        _mixpanel.people.append(arguments);
      } catch (e) {
        this.superThis.fallback(arguments);
      }
    }

    union() {
      try {
        _mixpanel.people.union(arguments);
      } catch (e) {
        this.superThis.fallback(arguments);
      }
    }

    track_charge() {
      try {
        _mixpanel.people.track_charge(arguments);
      } catch (e) {
        this.superThis.fallback(arguments);
      }
    }

  }(this);

  fallback(mixpanelArgs) {
    console.warn("Mixpanel call failed (perhaps it's not loaded). Called with arguments:");
    console.warn(mixpanelArgs);
  }
}

const mixpanel = new Mixpanel();

export default mixpanel;
