/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";

import { OtpInput } from ".";

describe("OtpInput", () => {
  it("exists", () => {
    expect(OtpInput).toBeDefined();
  });

  it("renders the correct number of inputs", () => {
    const { getAllByLabelText } = render(
      <OtpInput numberOfInputs={6} handleCurrentValue={() => {}} />,
    );

    expect(getAllByLabelText(/input position/i).length).toEqual(6);
  });

  it("updates the proper input onChange", () => {
    const { getByLabelText } = render(
      <OtpInput numberOfInputs={6} handleCurrentValue={() => {}} />,
    );

    const firstInput = getByLabelText(/input position 1/i) as HTMLInputElement;
    const secondInput = getByLabelText(/input position 2/i) as HTMLInputElement;
    const thirdInput = getByLabelText(/input position 3/i) as HTMLInputElement;
    const fourthInput = getByLabelText(/input position 4/i) as HTMLInputElement;
    const fifthInput = getByLabelText(/input position 5/i) as HTMLInputElement;
    const sixthInput = getByLabelText(/input position 6/i) as HTMLInputElement;

    fireEvent.input(firstInput, { target: { value: "1" } });
    fireEvent.input(secondInput, { target: { value: "2" } });
    fireEvent.input(thirdInput, { target: { value: "4" } });
    fireEvent.input(fourthInput, { target: { value: "5" } });
    fireEvent.input(fifthInput, { target: { value: "3" } });
    fireEvent.input(sixthInput, { target: { value: "7" } });

    expect(firstInput.value).toEqual("1");
    expect(secondInput.value).toEqual("2");
    expect(thirdInput.value).toEqual("4");
    expect(fourthInput.value).toEqual("5");
    expect(fifthInput.value).toEqual("3");
    expect(sixthInput.value).toEqual("7");
  });

  it("only allows one digit per input and digit should be latest entered into an input", () => {
    const { getByLabelText } = render(
      <OtpInput numberOfInputs={6} handleCurrentValue={() => {}} />,
    );

    const firstInput = getByLabelText(/input position 1/i) as HTMLInputElement;
    const secondInput = getByLabelText(/input position 2/i) as HTMLInputElement;
    const thirdInput = getByLabelText(/input position 3/i) as HTMLInputElement;
    const fourthInput = getByLabelText(/input position 4/i) as HTMLInputElement;
    const fifthInput = getByLabelText(/input position 5/i) as HTMLInputElement;
    const sixthInput = getByLabelText(/input position 6/i) as HTMLInputElement;

    fireEvent.input(firstInput, { target: { value: "12" } });
    fireEvent.input(secondInput, { target: { value: "23" } });
    fireEvent.input(thirdInput, { target: { value: "44" } });
    fireEvent.input(fourthInput, { target: { value: "52" } });
    fireEvent.input(fifthInput, { target: { value: "65" } });
    fireEvent.input(sixthInput, { target: { value: "79" } });

    expect(firstInput.value).toEqual("2");
    expect(secondInput.value).toEqual("3");
    expect(thirdInput.value).toEqual("4");
    expect(fourthInput.value).toEqual("2");
    expect(fifthInput.value).toEqual("5");
    expect(sixthInput.value).toEqual("9");
  });

  it("fires the handleCurrentValue callback on input", () => {
    const handleCurrentValue = jest.fn();

    const { getByLabelText } = render(
      <OtpInput numberOfInputs={2} handleCurrentValue={handleCurrentValue} />,
    );

    expect(handleCurrentValue).toHaveBeenCalledTimes(1);

    const firstInput = getByLabelText(/input position 1/i) as HTMLInputElement;
    const secondInput = getByLabelText(/input position 2/i) as HTMLInputElement;

    fireEvent.input(firstInput, { target: { value: "1" } });

    expect(handleCurrentValue).toHaveBeenCalledTimes(3);
    expect(handleCurrentValue).toHaveBeenCalledWith("1");

    fireEvent.input(secondInput, { target: { value: "2" } });

    expect(handleCurrentValue).toHaveBeenCalledTimes(4);
    expect(handleCurrentValue).toHaveBeenCalledWith("12");
  });
});
