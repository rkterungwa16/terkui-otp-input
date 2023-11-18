/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom/extend-expect";

import { otpInputReducer } from "./reducer";
import { DEFAULT_OTP_INPUT_STATE } from "./constants";
import { OtpInputActions } from "./types";

describe("otpInputReducer", () => {
  it("exists", () => {
    expect(otpInputReducer).toBeDefined();
  });

  describe(OtpInputActions.ADD_VALUE, () => {
    it("returns the new value when adding initial value", () => {
      const state = otpInputReducer(DEFAULT_OTP_INPUT_STATE, {
        type: OtpInputActions.ADD_VALUE,
        payload: {
          index: 0,
          value: "1",
        },
      });

      expect(state.value).toEqual(["1"]);
    });

    it("appends values to the end of state", () => {
      const stateOne = otpInputReducer(
        { value: ["", "", ""], maxLength: 3 },
        {
          type: OtpInputActions.ADD_VALUE,
          payload: {
            index: 0,
            value: "1",
          },
        }
      );

      expect(stateOne.value).toEqual(["1", "", ""]);

      const stateTwo = otpInputReducer(stateOne, {
        type: OtpInputActions.ADD_VALUE,
        payload: {
          index: 1,
          value: "2",
        },
      });

      expect(stateTwo.value).toEqual(["1", "2", ""]);

      const stateThree = otpInputReducer(stateTwo, {
        type: OtpInputActions.ADD_VALUE,
        payload: {
          index: 2,
          value: "2",
        },
      });

      expect(stateThree.value).toEqual(["1", "2", "2"]);
    });

    it("enforces the maxLength", () => {
      const stateOne = otpInputReducer(
        { value: ["", ""], maxLength: 2 },
        {
          type: OtpInputActions.ADD_VALUE,
          payload: {
            index: 0,
            value: "1",
          },
        }
      );

      const stateTwo = otpInputReducer(stateOne, {
        type: OtpInputActions.ADD_VALUE,
        payload: {
          index: 1,
          value: "2",
        },
      });

      expect(stateTwo.value).toEqual(["1", "2"]);

      const stateThree = otpInputReducer(stateTwo, {
        type: OtpInputActions.ADD_VALUE,
        payload: {
          index: 2,
          value: "2",
        },
      });

      expect(stateThree.value).toEqual(["1", "2"]);

      const stateFour = otpInputReducer(stateThree, {
        type: OtpInputActions.ADD_VALUE,
        payload: {
          index: 3,
          value: "2",
        },
      });

      expect(stateFour.value).toEqual(["1", "2"]);
    });

    it("removes value when passed empty string for index", () => {
      const stateOne = otpInputReducer(
        { value: ["", ""], maxLength: 2 },
        {
          type: OtpInputActions.ADD_VALUE,
          payload: {
            index: 0,
            value: "1",
          },
        }
      );

      expect(stateOne.value).toEqual(["1", ""]);

      const stateTwo = otpInputReducer(stateOne, {
        type: OtpInputActions.ADD_VALUE,
        payload: {
          index: 1,
          value: "2",
        },
      });

      expect(stateTwo.value).toEqual(["1", "2"]);

      const stateThree = otpInputReducer(stateTwo, {
        type: OtpInputActions.ADD_VALUE,
        payload: {
          index: 1,
          value: "",
        },
      });

      expect(stateThree.value).toEqual(["1", ""]);
    });

    // it("does not allow for two digits in one input", () => {
    //   const state = otpInputReducer(
    //     { value: ["", ""], maxLength: 2 },
    //     {
    //       type: OtpInputActions.ADD_VALUE,
    //       payload: {
    //         index: 0,
    //         value: "12",
    //       },
    //     }
    //   );

    //   expect(state.value).toEqual(["1", ""]);
    // });
  });
});
