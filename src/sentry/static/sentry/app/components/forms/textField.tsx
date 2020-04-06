import InputField from 'app/components/forms/inputField';

type Props = {
  spellCheck?: string;
} & InputField['props'];

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
