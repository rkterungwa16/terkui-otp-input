# OTP Input Component

A customizable, accessible One-Time Password (OTP) input component for React applications. This component provides a set of individual input fields that allows users to enter verification codes, PIN numbers, or any other segmented input data.

## Features

- Configurable number of input fields
- Auto-focus management
- Keyboard navigation support
- Clipboard paste support
- Customizable styling
- Accessibility compliant
- TypeScript support

## Installation

```bash
npm install terkui-otp-input
# or
yarn add terkui-otp-input
```

## API Reference

### Props

| Prop                       | Type                      | Required | Default | Description                                                                 |
|----------------------------|---------------------------|----------|---------|-----------------------------------------------------------------------------|
| `numberOfInputs`           | `number`                  | Yes      | -       | Number of input fields to render                                            |
| `handleCurrentValue`       | `(value: string) => void` | No       | -       | Callback function that receives the combined value from all inputs          |
| `inputCustomClass`         | `string`                  | No       | -       | CSS class to apply to each input field                                      |
| `inputCompleteCustomClass` | `string`                  | No       | -       | CSS class to apply to each filled input field                               |
| `inputsContainerCustomClass` | `string`                | No       | -       | CSS class to apply to the container div                                     |

## Usage Examples

### Basic Usage

```jsx
import { OtpInput } from 'terkui-otp-input';

function VerificationForm() {
  const handleOtpComplete = (otp) => {
    console.log('OTP entered:', otp);
    // Verify OTP with backend
  };

  return (
    <div>
      <h2>Enter Verification Code</h2>
      <OtpInput 
        numberOfInputs={6} 
        handleCurrentValue={handleOtpComplete} 
      />
      <button type="submit">Verify</button>
    </div>
  );
}
```

### With Custom Styling

```jsx
import { OtpInput } from 'terkui-otp-input';
import './custom-styles.css';

function CustomStyledOtp() {
  return (
    <OtpInput 
      numberOfInputs={4} 
      handleCurrentValue={(value) => console.log(value)} 
      inputCustomClass="custom-input"
      inputCompleteCustomClass="input-filled"
      inputsContainerCustomClass="otp-container"
    />
  );
}
```

## Behavior Specification

### Input Handling

- Each input field accepts a single character
- When a character is entered, focus automatically moves to the next empty input
- If multiple characters are entered in a single field, only the last character is retained

### Keyboard Navigation

| Key           | Behavior                                                        |
|---------------|----------------------------------------------------------------|
| Arrow Right   | Moves focus to the next input                                  |
| Arrow Left    | Moves focus to the previous input                              |
| Backspace     | Clears current input and moves focus to previous input         |
| Delete        | Clears current input but maintains focus position              |
| Space         | No action (prevented)                                          |
| Tab           | Standard browser tab behavior between inputs                   |

### Paste Functionality

- Pasting text will distribute characters across input fields
- Paste operation starts at the currently focused input
- If pasted content exceeds available inputs, extra characters are ignored
- If pasted content contains fewer characters than remaining inputs, only the corresponding inputs are filled

### Focus Management

- Component will initially focus the first input
- After a value is entered, focus moves to the next empty input
- When the last input is filled, focus remains on the last input
- Clicking on any input will focus that specific input

## Styling

The component comes with default styling but can be fully customized using the class props.

### Default Classes

- `.otp__container` - The container div that holds all inputs
- `.otp__input` - Applied to each input field
- `.otp__input--complete` - Applied to input fields that contain a value

### CSS Customization Example

```css
/* Custom styling for OTP input */
.custom-otp-container {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 20px 0;
}

.custom-otp-input {
  width: 50px;
  height: 60px;
  font-size: 24px;
  border: 2px solid #ccc;
  border-radius: 8px;
  text-align: center;
}

.custom-otp-filled {
  background-color: #e6f7ff;
  border-color: #1890ff;
}
```

## Accessibility

The component is built with accessibility in mind:

- Each input has an appropriate `aria-label` (e.g., "input position 1")
- Keyboard navigation is fully supported
- Focus states are visually indicated
- Component works with screen readers

## Browser Compatibility

The component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- IE11 (with appropriate polyfills)
- Mobile browsers on iOS and Android

## Best Practices

### When to Use

- Verification codes (2FA, email verification, etc.)
- PIN entry
- Serial number input
- Any segmented input where each character has equal importance

### Form Integration

When using with forms:

```jsx
import { useState } from 'react';
import { OtpInput } from 'terkui-otp-input';

function OtpForm() {
  const [otp, setOtp] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the OTP value
    console.log('Submitting OTP:', otp);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <OtpInput 
        numberOfInputs={6} 
        handleCurrentValue={setOtp} 
      />
      <button 
        type="submit" 
        disabled={otp.length !== 6}
      >
        Verify
      </button>
    </form>
  );
}
```

## Troubleshooting

### Common Issues

1. **Focus not moving to next input**
   - Ensure you're not preventing default behavior in a parent component

2. **Custom styles not applying**
   - Check that your CSS class names match exactly what you're passing to the component
   - Verify CSS specificity isn't being overridden

3. **Value callback not firing**
   - Ensure the `handleCurrentValue` prop is a valid function

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
