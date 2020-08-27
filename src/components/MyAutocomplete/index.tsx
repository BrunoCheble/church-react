import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useField } from '@unform/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FiAlertCircle } from 'react-icons/fi';
import { Input, Error } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  containerStyle?: object;
  freeSolo?: number;
  options?: string[];
}

const MyAutocomplete: React.FC<InputProps> = ({
  name,
  label,
  containerStyle = {},
  options = [],
  freeSolo = 1,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  const [valueInput, setValueInput] = useState(() => {
    return defaultValue ? defaultValue : "";
  });

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
      onChange={(event, values) => setValueInput(values)}
      disableClearable={true}
      renderInput={params => (
        <>
        {error && (
          <Error title={error}>
            <FiAlertCircle color="#c53030" size={16} />
          </Error>
        )}
        <Input
          {...params}
          autoComplete="off"
          label={label}
          margin="normal"
          onChange={value => setValueInput(value.target.value)}
          variant="outlined"
        />
        <input
          style={{display: 'none'}}
          readOnly={true}
          value={valueInput}
          ref={inputRef}
        />
        </>
      )}
    />
  );
};

export default MyAutocomplete;
