import { OtpInputActions } from "./constants";

export interface OtpInputProps {
  numberOfInputs: number;
  handleCurrentValue?: (value: string) => void;
  inputCustomClass?: string;
  inputCompleteCustomClass?: string;
  inputsContainerCustomClass?: string;
}

export type OtpInputState = {
  value: string[];
  maxLength: number;
};

export type OtpInputAction = {
  type: OtpInputActions;
  payload: {
    index: number;
    value: string;
  };
};

export type Maybe<T> = T | null;

export type InputElements = Array<HTMLInputElement | null>;

export { OtpInputActions };
