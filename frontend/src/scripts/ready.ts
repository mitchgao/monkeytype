import * as ManualRestart from "./test/manual-restart-tracker";
import Config, * as UpdateConfig from "./config";
import * as Misc from "./utils/misc";
import * as VerificationController from "./controllers/verification-controller";
import * as RouteController from "./controllers/route-controller";
import * as PageController from "./controllers/page-controller";
import * as MonkeyPower from "./elements/monkey-power";
import * as NewVersionNotification from "./elements/version-check";
import * as Notifications from "./elements/notifications";
import * as Focus from "./test/focus";

ManualRestart.set();
UpdateConfig.loadFromLocalStorage();

if (window.location.hostname === "localhost") {
  $("#bottom .version .text").text("localhost");
  $("#bottom .version").css("opacity", 1);
} else {
  Misc.getReleasesFromGitHub().then((v) => {
    NewVersionNotification.show(v[0].name);
  });
}

Focus.set(true, true);
RouteController.handleInitialPageClasses(window.location.pathname);
$(document).ready(() => {
  if (window.location.pathname === "/") {
    // $("#top .config").removeClass("hidden");
  }
  $("body").css("transition", "all .25s, transform .05s");
  if (Config.quickTab) {
    $("#restartTestButton").addClass("hidden");
  }
  if (!window.localStorage.getItem("merchbannerclosed")) {
    Notifications.addBanner(
      `Checkout our merchandise, available at <a target="_blank" href="https://monkeytype.store/">monkeytype.store</a>`,
      1,
      "images/merchdropwebsite2.png",
      false,
      () => {
        window.localStorage.setItem("merchbannerclosed", "true");
      }
    );
  }
  $("#centerContent")
    .css("opacity", "0")
    .removeClass("hidden")
    .stop(true, true)
    .animate({ opacity: 1 }, 250, () => {
      if (window.location.pathname === "/verify") {
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        if (fragment.has("access_token")) {
          const accessToken = fragment.get("access_token") as string;
          const tokenType = fragment.get("token_type") as string;
          VerificationController.set({
            accessToken: accessToken,
            tokenType: tokenType,
          });
          history.replaceState("/", "", "/");
        }
        const page = window.location.pathname.replace(
          "/",
          ""
        ) as MonkeyTypes.Page;
        PageController.change(page);
      } else if (window.location.pathname === "/account") {
        // history.replaceState("/", null, "/");
      } else if (/challenge_.+/g.test(window.location.pathname)) {
        //do nothing
        // }
      } else if (window.location.pathname !== "/") {
        // let page = window.location.pathname.replace("/", "");
        // PageController.change(page);
      }
    });
  // Settings.settingsFillPromise.then(Settings.update);
  MonkeyPower.init();
});
