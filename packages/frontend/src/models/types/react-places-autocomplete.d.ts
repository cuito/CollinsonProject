declare module "react-places-autocomplete" {
  import * as React from "react";

  interface GeocodeResult {
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
  }

  interface LatLng {
    lat: number;
    lng: number;
  }

  export interface PlacesAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect: (address: string) => void;
    children: (props: {
      getInputProps: (options: object) => object;
      suggestions: Array<{
        active: boolean;
        description: string;
        placeId: string;
      }>;
      getSuggestionItemProps: (
        suggestion: any,
        options: object
      ) => object;
      loading: boolean;
    }) => React.ReactNode;
  }

  export default class PlacesAutocomplete extends React.Component<PlacesAutocompleteProps> {}

  export function geocodeByAddress(address: string): Promise<GeocodeResult[]>;
  export function getLatLng(result: GeocodeResult): Promise<LatLng>;
}
