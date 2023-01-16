import cx from "classnames";
import {
  ChangeEventHandler,
  ClipboardEventHandler,
  FC,
  FocusEventHandler,
  KeyboardEventHandler,
  useRef,
  useState,
} from "react";

import { InputElements, OtpInputProps } from "./types";
import {
  KeyboardKeys,
} from "./constants";
import styles from "./styles.module.css";

const updatedValues = (values: string[], index: number, value: string) => {
  const inputValue = value.split("").pop() || "";
  return values.map((value, idx) => {
    // Find a replace the existing value with the new input
    if (idx === index) return inputValue;
    return value;
  });
};

export const OtpInput: FC<OtpInputProps> = ({
  numberOfInputs,
  handleCurrentValue,
  inputCompleteCustomClass,
  inputCustomClass,
  inputsContainerCustomClass,
}) => {
  const inputs: InputElements = [...new Array(numberOfInputs)];
  const inputRefs = useRef<InputElements>(inputs);
  const [activeInput, setActiveInput] = useState(0);
  const [inputValues, setInputValues] = useState(inputs.map(() => ""));

  inputRefs.current[activeInput]?.focus();

  handleCurrentValue?.(inputValues.join(""));

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
    setInputValues(updatedValues(inputValues, activeInput, value));
  };

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    changeCodeAtFocus(value);
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

    otpInputs = inputValues;
    nextActiveInput = activeInput;

    const pastedData = e.clipboardData
      .getData("text/plain")
      .slice(0, numberOfInputs - activeInput)
      .split("");

    // For each current input, insert the next lowest occuring number.
    // Since otp inputs numbers aren't large enough to be worried about array.shift optimization
    let currentInputValues = inputValues;
    otpInputs.forEach((_, index) => {
      if (
        index >= activeInput &&
        pastedData.length > 0 &&
        index < numberOfInputs
      ) {
        // THe aim of this code is to replace the item in this array at a particular location with the current first item
        // on pasted data
        // shift removes the first item on the string on each iteration.

        currentInputValues = updatedValues(
          currentInputValues,
          index,
          pastedData.shift() ?? ""
        );

        // If the input element at the last postion, set the active index to be array last position
        if (index + 1 === numberOfInputs) {
          nextActiveInput = index;
        } else {
          nextActiveInput = nextActiveInput + 1;
        }
      }
    });

    setInputValues(currentInputValues);
    setActiveInput(nextActiveInput);
    inputRefs.current[nextActiveInput]?.focus();
  };

  const handleRefCallback = (idx: number) => {
    return (el: HTMLInputElement | null) => (inputRefs.current[idx] = el);
  };

  return (
    <div
      className={cx({
        [styles["otp__container"]]: !inputsContainerCustomClass,
        [inputCompleteCustomClass ?? ""]: inputsContainerCustomClass,
      })}
    >
      {inputs.map((_, idx) => {
        return (
          <input
            key={idx}
            ref={handleRefCallback(idx)}
            data-id={idx}
            aria-label={`number input ${idx + 1}`}
            className={cx({
              [styles.otp__input]: !inputCustomClass,
              [inputCustomClass ?? ""]: inputCustomClass,
              [inputCompleteCustomClass
                ? inputCompleteCustomClass
                : styles["otp__input--complete"]]: inputValues[idx] !== "",
            })}
            value={inputValues[idx]}
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
