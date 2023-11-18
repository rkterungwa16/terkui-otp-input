
import { OtpInputState, OtpInputAction, OtpInputActions } from "./types";

export function otpInputReducer(state: OtpInputState, action: OtpInputAction) {
  // This ensures the latest value in an input is selected
  // It does this by selecting the last item in an array derived from the string
  const inputValue = action.payload.value.split("").pop() || "";

  switch (action.type) {
    case OtpInputActions.ADD_VALUE:
      return {
        ...state,
        value: state.value.map((value, idx) => {
          // Find a replace the existing value with the new input
          if (idx === action.payload.index)
            return inputValue;
          return value;
        }),
      };
    default:
      return state;
  }
}
