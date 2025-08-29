import chibiSunny from "./chibi_sunny.png";
import { data } from "./data";
import React, { useState, useCallback, useRef } from "react";
import { toPng } from "html-to-image";

export function Scheduler() {
  const [items, setItems] = useState(data);
  const ref = useRef<HTMLDivElement>(null);

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
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            <h1 className="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-blue-200 font-bold text-center">
              Welcome to the Sunny Scheduler
            </h1>
          </div>
        </header>
        <div >
          <Editor data={items} setItems={setItems} />
        </div>
        <div className="flex flex-col items-center">
          <div ref={ref}>
            <div className="p-4 bg-white">
              <Schedule data={items} />
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

type ScheduleItem = { date: string; time: string; title: string; color: string };

function Schedule({data}: {data: ScheduleItem[]}) {
  return <div className="bg-gradient-to-b from-sky-200 to-pink-200 rounded-xl">
    <div className="flex flex-row bg-[url(/background.png)] bg-cover">
      <img
        src={chibiSunny}
        alt="Chibi Sunny"
        className="object-contain h-[30rem] place-self-center m-lg p-4" />
      <div className="bg-neutral-50/30 m-4 mr-6 p-4 rounded-xl">
        <p className="text-8xl pb-8 text-center text-stroke-16 [-webkit-text-stroke-color:transparent] text-white bg-clip-text bg-gradient-to-b from-pink-300 to-blue-200 z-10">
          Schedule
        </p>
        {data.map(({ date, time, title, color }) => (
          <div key={title} className={`flex-1 text-stroke-1 text-stroke-color-yellow-900`}>
            <h2 className="text-5xl font-semibold text-white">
              {date}
            </h2>
            <div className={"flex flex-row pl-3 text-center"}>
              <div className="grid-row text-4xl text-yellow-900">
                <p>
                  {time}
                </p>
                <p>
                  PST
                </p>
              </div>
              <p
                className="pl-2 text-4xl content-center"
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
      setForm({ date: "", time: "", title: "", color: "" });
      setEditIndex(null);
    }
  };
  const [form, setForm] = useState({
    date: "",
    time: "",
    title: "",
    color: ""
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.time || !form.title || !form.color) {
      setError("All fields are required.");
      return;
    }
    if (editIndex !== null) {
      setItems(prev => prev.map((item, idx) => idx === editIndex ? { ...form } : item));
    } else {
      setItems(prev => [...prev, { ...form }]);
    }
    setForm({ date: "", time: "", title: "", color: "" });
    setEditIndex(null);
    setError(null);
  };

  const handleEdit = (idx: number) => {
    setForm({ ...data[idx] });
    setEditIndex(idx);
    setError(null);
  };

  return (
    <div className="bg-white/70 rounded-xl p-4 w-[500px] max-w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="date"
          type="text"
          className="border rounded p-2 w-full text-black"
          placeholder="Date (e.g. Saturday September 20th)"
          value={form.date}
          onChange={handleChange}
        />
        <input
          name="time"
          type="text"
          className="border rounded p-2 w-full text-black"
          placeholder="Time (e.g. 9 AM)"
          value={form.time}
          onChange={handleChange}
        />
        <input
          name="title"
          type="text"
          className="border rounded p-2 w-full text-black"
          placeholder="Title (e.g. Gamin!)"
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="color"
          type="text"
          className="border rounded p-2 w-full text-black"
          placeholder="Color (e.g. red, hsl(30deg 82% 43%), oklch(97.3% 0.071 103.193), #009900)"
          value={form.color}
          onChange={handleChange}
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
              <span>{item.date} - {item.time} - {item.title}</span>
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
