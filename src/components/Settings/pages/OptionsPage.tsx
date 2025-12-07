import { Option } from "../Option";

export const OptionsPage = () => {
  return (
    <div className="flex flex-col gap-3 text-white/80">
      <h2 className="text-lg font-semibold text-white">Options</h2>

      <Option label="im gooning" value={true} onChange={() => {}} />
      <Option label="im gooning 2" value={true} onChange={() => {}} />
    </div>
  );
};
