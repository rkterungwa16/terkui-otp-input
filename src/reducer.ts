import { OtpInputActions } from "./constants";
import { OtpInputState, OtpInputAction } from "./types";

export function otpInputReducer(state: OtpInputState, action: OtpInputAction) {
  const inputValue = action.payload.value.charAt(0);

  switch (action.type) {
    case OtpInputActions.ADD_VALUE:
      return {
        ...state,
        value: state.value.map((value, idx) => {
          if (idx === action.payload.index) return inputValue;
          return value;
        }),
      };
    default:
      return state;
  }
}
