import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

let mapsPromise: Promise<typeof google> | null = null;

export async function loadGoogleMaps(apiKey: string) {
  // Already loaded?
  if (typeof window !== "undefined" && (window as any).google?.maps) {
    return (window as any).google as typeof google;
  }

  if (!mapsPromise) {
    setOptions({
      key: apiKey,
      libraries: ["places"], // add more if you need them
    });

    // Load the core Maps library first
    mapsPromise = importLibrary("maps").then(() => (window as any).google as typeof google);

    // Preload Places too (optional but useful if you’ll use it right away)
    await importLibrary("places");
  }

  return mapsPromise;
}
