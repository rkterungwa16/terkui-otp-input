import cx from "classnames";
import {
  ChangeEventHandler,
  ClipboardEventHandler,
  FC,
  FocusEventHandler,
  KeyboardEventHandler,
  useReducer,
  useRef,
  useState,
} from "react";

import { Maybe, OtpInputProps } from "./types";
import { otpInputReducer } from "./reducer";
import {
  DEFAULT_OTP_INPUT_STATE,
  KeyboardKeys,
  OtpInputActions,
} from "./constants";
import styles from "./styles.module.css";

export const OtpInput: FC<OtpInputProps> = ({
  numberOfInputs,
  handleCurrentValue,
  inputCompleteCustomClass,
  inputCustomClass,
  inputsContainerCustomClass,
}) => {
  const inputs = [...new Array(numberOfInputs)];
  const inputRefs = useRef<Array<Maybe<HTMLInputElement>>>(inputs);
  const [activeInput, setActiveInput] = useState(0);
  const parentInputRef = useRef<HTMLDivElement | null>(null);

  inputRefs.current[activeInput]?.focus();

  const [{ value }, dispatch] = useReducer(otpInputReducer, {
    ...DEFAULT_OTP_INPUT_STATE,
    value: inputs.map(() => ""),
    maxLength: numberOfInputs,
  });

  handleCurrentValue?.(value.join(""));

  const handleFocus: FocusEventHandler<HTMLInputElement> = (e) => {
    const {
      dataset: { id = "" },
    } = e.currentTarget;
    setActiveInput(Number(id));
  };

  const focusPrevInput = () => {
    if (activeInput > 0) {
      setActiveInput(activeInput - 1);
    }
  };
  const focusNextInput = () => {
    if (activeInput < numberOfInputs - 1) {
      setActiveInput(activeInput + 1);
    }
  };

  const changeCodeAtFocus = (value: string) => {
    dispatch({
      type: OtpInputActions.ADD_VALUE,
      payload: {
        index: activeInput,
        value,
      },
    });
  };

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    changeCodeAtFocus(value[0]);
    focusNextInput();
  };

  const handleOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === KeyboardKeys.BACKSPACE) {
      e.preventDefault();
      changeCodeAtFocus("");
      focusPrevInput();
    } else if (e.key === KeyboardKeys.DELETE) {
      e.preventDefault();
      changeCodeAtFocus("");
    } else if (e.key === KeyboardKeys.LEFT_ARROW) {
      e.preventDefault();
      focusPrevInput();
    } else if (e.key === KeyboardKeys.RIGHT_ARROW) {
      e.preventDefault();
      focusNextInput();
    } else if (
      e.key === " " ||
      e.key === KeyboardKeys.SPACEBAR ||
      e.key === KeyboardKeys.SPACE
    ) {
      e.preventDefault();
    }
  };

  const handleOnPaste: ClipboardEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    let otpInputs: string[];
    let nextActiveInput: number;

    otpInputs = value;
    nextActiveInput = activeInput;

    const pastedData = e.clipboardData
      .getData("text/plain")
      .slice(0, numberOfInputs - activeInput)
      .split("");

    // For each current input, insert the next lowest occuring number.
    // Since otp inputs numbers aren't large enough to be worried about array.shift optimization
    otpInputs.forEach((_, index) => {
      if (
        index >= activeInput &&
        pastedData.length > 0 &&
        index < numberOfInputs
      ) {
        // THe aim of this code is to replace the item in this array at a particular location with the current first item
        // on pasted data
        // shift removes the first item on the string on each iteration.
        dispatch({
          type: OtpInputActions.ADD_VALUE,
          payload: {
            index,
            value: pastedData.shift() ?? "",
          },
        });

        // If the input element at the last postion, set the active index to be array last position
        if (index + 1 === numberOfInputs) {
          nextActiveInput = index;
        } else {
          nextActiveInput = nextActiveInput + 1;
        }
      }
    });
    setActiveInput(nextActiveInput);
    inputRefs.current[nextActiveInput]?.focus();
  };

  return (
    <div
      className={cx({
        [styles["otp__container"]]: !inputsContainerCustomClass,
        [inputCompleteCustomClass ?? ""]: inputsContainerCustomClass,
      })}
      ref={parentInputRef}
    >
      {inputs.map((_, idx) => {
        return (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            data-id={idx}
            aria-label={`number input ${idx + 1}`}
            className={cx({
              [styles.otp__input]: !inputCustomClass,
              [inputCustomClass ?? ""]: inputCustomClass,
              [inputCompleteCustomClass
                ? inputCompleteCustomClass
                : styles["otp__input--complete"]]: value[idx] !== "",
            })}
            value={value[idx]}
            onFocus={handleFocus}
            onKeyDown={handleOnKeyDown}
            onChange={handleOnChange}
            onPaste={handleOnPaste}
          />
        );
      })}
    </div>
  );
};
