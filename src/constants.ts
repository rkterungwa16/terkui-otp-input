import { OtpInputState } from './types';

export const DEFAULT_OTP_INPUT_STATE: OtpInputState = {
  value: [''],
  maxLength: 1,
};

export enum KeyboardKeys {
  BACKSPACE = 'Backspace',
  LEFT_ARROW = 'ArrowLeft',
  RIGHT_ARROW = 'ArrowRight',
  DELETE = 'Delete',
  SPACEBAR = 'Spacebar',
  SPACE = 'space',
}
