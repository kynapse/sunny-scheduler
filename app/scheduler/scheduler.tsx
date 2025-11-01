import chibiSunny from "./chibi_sunny.png";
import { scheduleData } from "./data";
import React, { useState, useCallback, useRef } from "react";
import { toPng } from "@jpinsonneau/html-to-image";
import { PickerPanel } from "rc-picker";
import type { Moment } from "moment";
import moment from "moment";
import enUS from "rc-picker/lib/locale/en_US";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import 'rc-picker/assets/index.css';
import { ColorPicker } from "./ColorPicker";

type ScheduleItem = { date: Moment; title: string; color: string };

export function Scheduler() {
  const [items, setItems] = useState(scheduleData);
  const ref = useRef<HTMLDivElement>(null);
  const [bgFromColor, setBgFromColor] = useState("hsl(63, 79%, 79%, 1.0)");
  const [bgToColor, setBgToColor] = useState("120");
  const [isRelative, setIsRelative] = useState(true);

  const handleDownload = useCallback(() => {
    if (ref.current) {
      toPng(ref.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "schedule.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error("Error generating PNG:", err);
        });
    }
  }, [ref]);

  return (
    <main className="flex items-center justify-center pt-16 pb-4 text-black">
      <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            <h1 className="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-blue-200 font-bold text-center">
              Welcome to the Sunny Scheduler
            </h1>
          </div>
        </header>
        <div>
          <Editor data={items} setItems={setItems} />
          <div>
            <label className="font-semibold">BG Color 1:</label>
            <ColorPicker
              value={bgFromColor}
              onChange={setBgFromColor}
            />
          </div>
          <label className="font-semibold">BG Color 2:</label>
          <div className="flex flex-row">
            <p className="mr-2">Relative Background Color: </p>
            <input type="checkbox" aria-label="relative background color" checked={isRelative} onChange={e => {setIsRelative(e.target.checked); setBgToColor("60")}} />
          </div>
            {isRelative ? (
              <>
                <label htmlFor="hueRotation">Hue Rotation</label>
                <input className="mx-2" id="hueRotation" type="range" min={0} max={365} value={bgToColor} onChange={e => setBgToColor(e.target.value)} />
                <input type="text" aria-label="Hue rotation value" value={bgToColor} onChange={e => setBgToColor(e.target.value)} />
              </>
            ) : (
              <ColorPicker
                value={bgToColor}
                onChange={setBgToColor}
              />
            )}
        </div>
        <div className="flex flex-col items-center">
          <div ref={ref}>
            <div className="p-4 bg-white">
              <Schedule data={items} bgFromColor={bgFromColor} bgToColor={bgToColor} isRelative={isRelative} />
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </main>
  );
}

function Schedule({data, bgFromColor, bgToColor, isRelative}: {data: ScheduleItem[]; bgFromColor: string; bgToColor: string; isRelative: boolean}) {
  return <div className="rounded-xl" style={{ background: `linear-gradient(to bottom, ${bgFromColor}, ${isRelative ? `oklch(from ${bgFromColor} L C calc(H + ${bgToColor}))` : bgToColor})` }}>
    <div className="flex flex-row bg-[url(/background.png)] bg-cover">
      <img
        src={chibiSunny}
        alt="Chibi Sunny"
        className="object-contain h-[30rem] place-self-center m-lg p-4" />
      <div className="bg-neutral-50/30 m-4 mr-6 p-4 rounded-xl">
        <p className="text-8xl pb-8 text-center text-stroke-16 [-webkit-text-stroke-color:transparent] text-white bg-clip-text bg-gradient-to-b from-pink-300 to-blue-200 z-10">
          Schedule
        </p>
        {data.map(({ date, title, color }) => (
          <div key={title} className={`flex-1 text-stroke-color-yellow-900`}>
            <h2 className="text-5xl font-semibold text-stroke-1 text-white">
                {date.format("dddd, MMMM Do")}
            </h2>
            <div className={"flex flex-row pl-3 text-center"}>
              <div className="grid-row text-4xl text-yellow-900">
                <p>
                    {date.format("h A")}
                </p>
                <p>
                  PST
                </p>
              </div>
              <p
                className="pl-2 text-4xl text-stroke-2 content-center"
                style={{ color: color }}
              >
              {title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>;
}
function Editor({ data, setItems }: { data: ScheduleItem[]; setItems: React.Dispatch<React.SetStateAction<ScheduleItem[]>> }) {
  const handleDelete = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
    if (editIndex === idx) {
      setForm({ date: moment(), title: "", color: "" });
      setEditIndex(null);
    }
  };
  const [form, setForm] = useState({
    date: moment() as Moment,
    title: "",
    color: ""
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Moment | Moment[]) => {
    setForm(prev => ({ ...prev, date: Array.isArray(date) ? date[1] : date }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.title || !form.color) {
      setError("All fields are required.");
      return;
    }
    if (editIndex !== null) {
      setItems(prev => prev.map((item, idx) => idx === editIndex ? { ...form } : item));
    } else {
      setItems(prev => [...prev, { ...form }]);
    }
    setForm({ date: moment(), title: "", color: "" });
    setEditIndex(null);
    setError(null);
  };

  const handleEdit = (idx: number) => {
    setForm({ ...data[idx] });
    setEditIndex(idx);
    setError(null);
  };

  return (
    <div className="bg-white/70 rounded-xl p-4 w-[800px] max-w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <PickerPanel<Moment> generateConfig={momentGenerateConfig} value={form.date ? form.date : moment()} onChange={handleDateChange} locale={enUS} showTime={{ showSecond: false, minuteStep: 15, use12Hours: true }} />
        <input
          name="title"
          type="text"
          className="border rounded p-2 w-full"
          placeholder="Title (e.g. Gamin!)"
          value={form.title}
          onChange={handleChange}
        />
        <ColorPicker
          value={form.color}
          onChange={color => setForm(prev => ({ ...prev, color }))}
        />
        <button type="submit" className="bg-blue-500 text-white rounded p-2 mt-2">
          {editIndex !== null ? "Save Changes" : "Add Schedule Item"}
        </button>
      </form>
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
      <p className="text-sm text-gray-600 mt-2">
        {editIndex !== null ? "Editing existing entry." : "Fill out the form to add a new schedule item."}
      </p>
      <div className="mt-4">
        <p className="mb-2 text-gray-600">Edit or delete an existing entry:</p>
        <ul className="space-y-2">
          {data.map((item, idx) => (
            <li key={item.title + idx} className="flex items-center justify-between bg-gray-200 text-gray-800 rounded p-2">
              <span>{item.date.format("YYYY-MM-DD HH:mm")} - &lt;t:{item.date.format("X")}:F&gt; - {item.title}</span>
              <div className="flex gap-2">
                <button
                  className="px-2 py-1 bg-yellow-400 rounded text-xs"
                  onClick={() => handleEdit(idx)}
                >Edit</button>
                <button
                  className="px-2 py-1 bg-red-500 text-gray-800 rounded text-xs"
                  onClick={() => handleDelete(idx)}
                >Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
