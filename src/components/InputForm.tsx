import * as React from 'react';

interface InputFormProps {
  onSubmit: (name: string) => void;
}

const InputForm: React.FunctionComponent<InputFormProps> = props => {
  const [value, setValue] = React.useState('');

  const handleChange: (event: React.SyntheticEvent) => void = event => {
    const target = event.target as HTMLInputElement;
    setValue(target.value);
  };

  const handleSubmit: () => void = () => {
    props.onSubmit(value);
    setValue('');
  };

  const onKeyPress: (event: React.KeyboardEvent) => void = event => {
    if (event.charCode === 13) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <React.Fragment>
      <form className="input-form">
        <input
          className="input-field form-control"
          type="text"
          onChange={handleChange}
          value={value}
          onKeyPress={onKeyPress}
        />
        <button
          className="btn btn-warning"
          type="button"
          onClick={handleSubmit}
        >
          Add
        </button>
      </form>
    </React.Fragment>
  );
};

export default InputForm;
