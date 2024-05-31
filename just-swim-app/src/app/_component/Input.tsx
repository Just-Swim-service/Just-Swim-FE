import './input.scss';

interface Props {
  label: string;
  defaultValue: string;
  type: string;
  require: boolean;
}

export default function Input({ label, defaultValue, type, require }: Props) {
  return (
    <div className="comp_input">
      <div className="require">
        <label>{label}</label>
        {require ? <span>(필수)</span> : null}
      </div>
      <input type={type} defaultValue={defaultValue} />
    </div>
  );
}
