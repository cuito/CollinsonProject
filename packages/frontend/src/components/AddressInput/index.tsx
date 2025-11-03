import { useEffect, useState } from "react";
import PlacesAutocomplete, {
  getLatLng,
  geocodeByAddress,
} from "react-places-autocomplete";
import type { IAddressInput } from "../../models/interfaces/IControls";
import "./Style.css";

export default function AddressInput({
  error = null,
  value,
  setParentAddressAndCoordinates,
}: IAddressInput) {
  const [address, setAddress] = useState<string>(value ?? "");

  const handleSelect = async (selection: string) => {
    const results = await geocodeByAddress(selection);
    const latLng = await getLatLng(results[0]);

    setAddress(selection);
    setParentAddressAndCoordinates(selection, latLng);
  };

  const handleChange = (val: string) => {
    if (val === "" || val === undefined || val === null) {
      setParentAddressAndCoordinates("", { lat: "" as any, lng: "" as any });
    }
    setAddress(val || "");
  };

  useEffect(() => {
    setAddress(value ?? "");
  }, [value]);

  return (
    <PlacesAutocomplete value={address} onChange={handleChange} onSelect={handleSelect}>
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <>
          <div className="address-input-wrapper">
            <input
              id="address-input"
              type="search"
              className={`address-input ${error ? "address-input--error" : ""}`}
              {...getInputProps({ placeholder: "" })}
              aria-invalid={!!error}
              aria-describedby={error ? "address-error" : undefined}
              autoComplete="off"
            />
            {error ? (
              <div id="address-error" className="address-error-text">
                {error}
              </div>
            ) : null}
          </div>

          <br />
          {suggestions.length > 0 && (
              <p>Suggestions:</p>
          )}
              <div className="suggestions">
                {loading ? <div className="suggestions-loading">Loading...</div> : null}
            {suggestions.map((suggestion) => {
              return (
                <div
                  key={suggestion.placeId}
                  {...getSuggestionItemProps(suggestion, {})}
                  className="suggestion-item"
                >
                  {suggestion.description}
                </div>
              );
            })}
          </div>
        </>
      )}
    </PlacesAutocomplete>
  );
}
