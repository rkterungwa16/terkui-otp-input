import cx from "classnames";
import {
  ChangeEventHandler,
  ClipboardEventHandler,
  FC,
  FocusEventHandler,
  KeyboardEventHandler,
  useEffect,
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

  const [{ value }, dispatch] = useReducer(otpInputReducer, {
    ...DEFAULT_OTP_INPUT_STATE,
    value: inputs.map(() => ""),
    maxLength: numberOfInputs,
  });

  useEffect(() => {
    handleCurrentValue?.(value.join(""));
  }, [value, handleCurrentValue]);

  useEffect(() => {
    if (parentInputRef.current) {
      Array.from(parentInputRef.current.children).forEach((el, index) => {
        if (index === activeInput) {
          inputRefs.current[index]?.focus();
        }
      });
    }
  }, [parentInputRef, activeInput]);

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

    const otpInputs = value;
    let nextActiveInput = activeInput;

    const pastedData = e.clipboardData
      .getData("text/plain")
      .slice(0, numberOfInputs - activeInput)
      .split("");

    otpInputs.forEach((_, index) => {
      if (index >= activeInput && pastedData.length > 0) {
        dispatch({
          type: OtpInputActions.ADD_VALUE,
          payload: {
            index,
            value: pastedData.shift() ?? "",
          },
        });
        nextActiveInput++;
      }
    });
    setActiveInput(nextActiveInput);
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
