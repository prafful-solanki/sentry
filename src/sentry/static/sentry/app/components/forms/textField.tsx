import InputField from 'app/components/forms/inputField';

type Props = Omit<InputField['props'], 'onChange'> & {
  spellCheck?: string;
  onChange?: (value: string) => void;
};

class TextField extends InputField<Props> {
  getAttributes() {
    return {
      spellCheck: this.props.spellCheck,
    };
  }

  getType() {
    return 'text';
  }
}

export default TextField;
