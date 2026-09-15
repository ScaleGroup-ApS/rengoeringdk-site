import { useFetchers, useNavigation, useRouteLoaderData } from "react-router";
import { useEffect, useRef, useState } from "react";
import { ContactChallenge } from "./ContactChallenge";

export function ContactSpamProtection() {
  const root = useRouteLoaderData<{
    contactChallenge: {
      provider: string;
      siteKey: string | null;
      baseUrl: string | null;
    };
  }>("root");
  const fetchers = useFetchers();
  const navigation = useNavigation();
  const busy =
    navigation.state !== "idle" ||
    fetchers.some((fetcher) => fetcher.state !== "idle");
  const wasBusy = useRef(false);
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    if (wasBusy.current && !busy) setResetKey((value) => value + 1);
    wasBusy.current = busy;
  }, [busy]);
  return <ContactChallenge {...root?.contactChallenge} resetKey={resetKey} />;
}
