import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { useField } from '@unform/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Input } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  containerStyle?: object;
  freeSolo?: number;
  options?: any[];
}

const MyAutocomplete: React.FC<InputProps> = ({
  name,
  label,
  containerStyle = {},
  options = [],
  freeSolo = 1,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Autocomplete
      freeSolo={!!freeSolo}
      options={options}
      defaultValue={defaultValue}
      style={containerStyle}
      ref={inputRef}
      renderInput={params => (
        <Input
          {...params}
          autoComplete="off"
          label={label}
          margin="normal"
          variant="outlined"
        />
      )}
    />
  );
};

export default MyAutocomplete;
