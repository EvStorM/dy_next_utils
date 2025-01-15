import React, { forwardRef } from 'react';
import { InputProps, useInput } from '@nextui-org/react';

const CloseFilledIcon = (props: any) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M12 2a10 10 0 1010 10A10.016 10.016 0 0012 2zm3.36 12.3a.754.754 0 010 1.06.748.748 0 01-1.06 0l-2.3-2.3-2.3 2.3a.748.748 0 01-1.06 0 .754.754 0 010-1.06l2.3-2.3-2.3-2.3A.75.75 0 019.7 8.64l2.3 2.3 2.3-2.3a.75.75 0 011.06 1.06l-2.3 2.3z"
      fill="currentColor"
    />
  </svg>
);

const styles = {
  label: 'text-black/50 dark:text-white/90',
  input: [
    '!bg-white',
    'font-extrabold text-3xl',
    'h-14',
    'text-black/90 dark:text-white/90',
    'hover:!bg-white',
    'placeholder:text-default-700/50  placeholder:text-lg placeholder:leading-[30px] dark:placeholder:text-white/60',
    'noStyleInput',
    // 'placeholder:-translate-y-1',
  ],
  innerWrapper: 'bg-white focus-within:bg-white rounded-full hover:bg-white',
  inputWrapper: [
    'shadow-none',
    'rounded-full',
    'h-14',
    '!bg-white',
    'focus:!bg-white',
    'backdrop-blur-xl',
    'data-[hover=ture]:!bg-white group-data-[focus=true]:!bg-white',
    'backdrop-saturate-200',
    'hover:!bg-white',
    'focus-within:bg-white',
    '!cursor-text',
    'pl-6',
  ],
};

const EvInput = forwardRef((props: InputProps, ref: any) => {
  const {
    Component,
    label,
    domRef,
    description,
    isClearable,
    startContent,
    endContent,
    shouldLabelBeOutside,
    shouldLabelBeInside,
    errorMessage,
    getBaseProps,
    getLabelProps,
    getInputProps,
    getInnerWrapperProps,
    getInputWrapperProps,
    getDescriptionProps,
    getErrorMessageProps,
    getClearButtonProps,
  } = useInput({
    ...props,
    ref,
    // custom styles
    classNames: {
      ...styles,
    },
  });

  const labelContent = <label {...getLabelProps()}>{label}</label>;

  const end = React.useMemo(() => {
    if (isClearable) {
      return (
        <span {...getClearButtonProps()}>
          {endContent || <CloseFilledIcon />}
        </span>
      );
    }

    return endContent;
  }, [isClearable, getClearButtonProps]);

  const innerWrapper = React.useMemo(() => {
    if (startContent || end) {
      return (
        <div {...getInnerWrapperProps()}>
          {startContent}
          <input {...getInputProps()} />
          {end}
        </div>
      );
    }

    return <input {...getInputProps()} />;
  }, [startContent, end, getInputProps, getInnerWrapperProps]);

  return (
    <Component {...getBaseProps()}>
      {shouldLabelBeOutside ? labelContent : null}
      <div
        {...getInputWrapperProps()}
        role="button"
        style={{
          background: '#ffffff !important',
        }}
        onClick={() => {
          domRef.current?.focus();
        }}
      >
        {shouldLabelBeInside ? labelContent : null}
        {innerWrapper}
      </div>
      {description && <div {...getDescriptionProps()}>{description}</div>}
      {errorMessage && (
        <div
          {...getErrorMessageProps()}
          style={{
            fontSize: '10px',
            padding: '0 12px 0 12px',
            position: 'absolute',
            bottom: '-10px',
          }}
        >
          {errorMessage}
        </div>
      )}
    </Component>
  );
});

EvInput.displayName = 'MyInput';

export default EvInput;
