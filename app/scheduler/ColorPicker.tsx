export function ColorPicker({ value, onChange }: { value: string; onChange: (color: string) => void; }) {
  var inputValue = value;
  if (value.startsWith("rgb")) {
    inputValue = "#" + value.replace("rgb(", "").replace(")", "").split(",").map(c => parseInt(c.trim()).toString(16).padStart(2, "0")).join("");
  }
  return (
    <div className="flex items-center gap-2 mb-2">
      <input
        aria-label="Color Picker"
        type="color"
        value={inputValue}
        onChange={e => onChange(e.target.value)}
        className="w-8 h-8 border rounded" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border rounded p-1 w-32"
        placeholder="#f0f4ff" />
    </div>
  );
}
