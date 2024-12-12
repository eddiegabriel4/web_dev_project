// main.ts
import { Auth, define, History, Switch } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { HeaderElement } from "./components/blazing-header";
import { TrailCard } from "./components/trail-card";
import { HomeViewElement } from "./views/home-view";
import { TrailViewElement } from "./views/trails-view";
import { GearView } from "./views/gear";
import { GroupsView } from "./views/groups";
import { ViewpointsView } from "./views/viewpoints";



class AppElement extends LitElement {
  static uses = define({
    "home-view": HomeViewElement,
    "trails-view": TrailViewElement,
    "gear-view": GearView,
    "groups-view": GroupsView,
    "viewpoints-view": ViewpointsView
  });

  protected render() {
    return html`
      <home-view></home-view>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // HeaderElement.initializeOnce();
  }
}

const routes = [
    {
      path: "/app",
      view: () => html`
        <home-view></home-view>
      `
    },
    {
        path: "/app/trails",
        view: () => html`
          <trails-view></trails-view>
        `
    },
    {
        path: "/app/gear",
        view: () => html`
          <gear-view></gear-view>
        `
    },
    {
        path: "/app/groups",
        view: () => html`
          <groups-view></groups-view>
        `
    },
    {
        path: "/app/viewpoints",
        view: () => html`
          <viewpoints-view></viewpoints-view>
        `
    },
    {
      path: "/",
      redirect: "/app"
    }
  ];

define({
  "mu-auth": Auth.Provider,
  "blazing-app": AppElement,
  "blazing-header": HeaderElement,
  "trail-card": TrailCard,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "blazing:history", "blazing:auth");
    }
  }
});