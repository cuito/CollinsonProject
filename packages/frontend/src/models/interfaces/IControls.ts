export interface IAddressInput {
  value: string;
  inputValue?: string;
  error?: any;
  onSelect: (e: any) => void;
  setParentAddressAndCoordinates: (x: string, y: any) => void;
  varient?: "standard" | "outlined" | "filled";
}
