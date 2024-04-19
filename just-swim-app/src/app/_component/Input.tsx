import './input.scss';

interface Props {
  label: string;
  defaultValue: string;
  type: string;
}

export default function Input({ label, defaultValue, type }: Props) {
  return (
    <>
      <label>{label}</label>
      <input type={type} defaultValue={defaultValue} />
    </>
  );
}
