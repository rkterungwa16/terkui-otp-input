import { OtpInputActions } from './constants';

export interface OtpInputProps {
  numberOfInputs: number;
  onEntry: (value: string) => unknown;
}

export type OtpInputState = {
  value: string[];
  maxLength: number;
};

export type PinInputAction = {
  type: OtpInputActions;
  payload: {
    index: number;
    value: string;
  };
};

export type Maybe<T> = T | null;