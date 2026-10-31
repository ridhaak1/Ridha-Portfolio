import { useSyncExternalStore } from "react";
import { site } from "@/config/site";

// en-GB gives "CET"/"CEST" rather than "GMT+1"
const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZoneName: "short",
});

function formatNow() {
  const parts = Object.fromEntries(formatter.formatToParts(new Date()).map((p) => [p.type, p.value]));
  return `${parts.hour}:${parts.minute} ${parts.timeZoneName}`;
}

/** Re-renders on every minute boundary and when the tab becomes visible again */
function subscribe(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  const schedule = () => {
    timer = setTimeout(() => {
      onChange();
      schedule();
    }, 60_000 - (Date.now() % 60_000) + 50);
  };
  const onVisible = () => document.visibilityState === "visible" && onChange();

  schedule();
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisible);
  };
}

// Fills in the time as soon as the HTML is parsed, so the prerendered placeholder
// never shows, even before hydration (same format as formatNow)
const FILL_NOW = `(function(){try{var o={};new Intl.DateTimeFormat("en-GB",${JSON.stringify({
  timeZone: site.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZoneName: "short",
})}).formatToParts(new Date()).forEach(function(p){o[p.type]=p.value});document.currentScript.previousElementSibling.textContent=o.hour+":"+o.minute+" "+o.timeZoneName}catch(e){}})()`;

interface LocalTimeProps {
  className?: string;
  separator?: string;
}

export default function LocalTime({ className, separator = " — " }: LocalTimeProps) {
  // Unknown at prerender time: the static HTML gets a placeholder that FILL_NOW replaces
  const time = useSyncExternalStore(subscribe, formatNow, () => "--:--");

  return (
    <p className={className}>
      {site.city}
      {separator}
      <time suppressHydrationWarning>{time}</time>
      <script dangerouslySetInnerHTML={{ __html: FILL_NOW }} />
    </p>
  );
}
