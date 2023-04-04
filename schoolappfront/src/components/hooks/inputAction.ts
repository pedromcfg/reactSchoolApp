import { ChangeEvent, useReducer } from "react";

/* INTERFACES */
interface InputState {
  text: string;
  hasBeenTouched: boolean;
}
interface Action<T> {
  type: T;
  value?: string;
}

/* CONSTANTS */
const initialInputState: InputState = {
  text: "",
  hasBeenTouched: false,
};
const INPUT_ACTION_CHANGE = "CHANGE";
const INPUT_ACTION_BLUR = "BLUR";
const INPUT_ACTION_CLEAR = "CLEAR";

/* TYPES */
type InputActionType =
  | typeof INPUT_ACTION_CHANGE
  | typeof INPUT_ACTION_BLUR
  | typeof INPUT_ACTION_CLEAR;

type Validation = (
  text: string,
  options?: Object
) => { testResult: boolean; text: string };

/* THE REDUCER FUNCTION */
const inputReducer = (state: InputState, action: Action<InputActionType>) => {
  const { type, value = "" } = action;

  if (type === INPUT_ACTION_CHANGE) {
    return { text: value, hasBeenTouched: true };
  }
  if (type === INPUT_ACTION_BLUR) {
    return { text: value, hasBeenTouched: true };
  }
  if (type === INPUT_ACTION_CLEAR) {
    return { text: "", hasBeenTouched: false };
  }
  return { ...state };
};

/* THE VALIDATOR FUNCTIONS */

export const validateEmail: Validation = (email: string) => {
  const emailRegExp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  const test_email: boolean = emailRegExp.test(email);

  return {
    testResult: test_email,
    text: test_email ? "" : "Invalid email",
  };
};

export const validatePassword: Validation = (password: string) => {
  const passwordRegExp = [
    [new RegExp(/^.{8,}/).test(password), "8 Characters minimum "],
    [new RegExp(/^(?=.*[!@#$%^&*])/).test(password), "Symbol "],
    [new RegExp(/^(?=.*\d)/).test(password), "Number "],
    [new RegExp(/^(?=.*[A-Z])/).test(password), "Uppercase letter "], //and upper and lower case letters
  ];

  const test_password: boolean = passwordRegExp
    .map(function (x) {
      return x[0];
    })
    .reduce(function (sum, next) {
      return sum && next;
    }, true) as boolean;

  const passwordTexts = passwordRegExp
    .map(function (x) {
      return x[0] ? x[1] + "✔️" : x[1] + "❌";
    })
    .join("\n");

  return {
    testResult: test_password,
    text: test_password ? "" : passwordTexts,
  };
};

export const validateLength: Validation = (text: string) => {
  if (text.trim().length > 1) return { testResult: true, text: "" };
  return {
    testResult: false,
    text: "Please write a name with more than 1 character",
  };
};

export const validateDescLength: Validation = (text: string) => {
  if (text.trim().length > 1) return { testResult: true, text: "" };
  return {
    testResult: false,
    text: "Please write a description with at least 1 word",
  };
};

/* THE HOOK THAT USES THE REDUCER */
const useInput = (validator?: Validation) => {
  //text and hasBeenTouched come from state
  //const [state, dispatch] = useReducer(first, second, third)
  const [{ text, hasBeenTouched }, dispatch] = useReducer(
    inputReducer,
    initialInputState
  );

  let shouldDisplayError;
  let errorText;
  if (validator) {
    const validatorExec = validator(text);
    const isValid = validatorExec.testResult;
    errorText = validatorExec.text;
    shouldDisplayError = !isValid && hasBeenTouched;
  }

  const ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: INPUT_ACTION_CHANGE, value: e.target.value });
  };

  const ChangeDescHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: INPUT_ACTION_CHANGE, value: e.target.value });
  };

  const BlurHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch({ type: INPUT_ACTION_BLUR, value: e.target.value });
  };

  const ClearHandler = () => {
    dispatch({ type: INPUT_ACTION_CLEAR });
  };

  return {
    text,
    shouldDisplayError,
    errorText,
    ChangeHandler,
    ChangeDescHandler,
    BlurHandler,
    ClearHandler,
  };
};

export default useInput;
