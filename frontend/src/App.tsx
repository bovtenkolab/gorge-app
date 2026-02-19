import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

type LinkRecord = {
  id: string;
  name: string;
  link: string;
  comments: string[];
  editing?: boolean;
};

export default function App() {
  const [records, setRecords] = useState<LinkRecord[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await invoke<LinkRecord[]>("load_links");
    setRecords(data);
  }

  async function saveAll(updated: LinkRecord[]) {
    await invoke("save_links", {
      records: updated.map(r => ({
        id: r.id,
        name: r.name,
        link: r.link,
        comments: r.comments
      }))
    });
  }

  function handleEdit(id: string) {
    setRecords(prev =>
      prev.map(r =>
        r.id === id ? { ...r, editing: true } : r
      )
    );
  }

  async function handleSave(id: string) {
    const updated = records.map(r =>
      r.id === id ? { ...r, editing: false } : r
    );

    setRecords(updated);
    await saveAll(updated);
  }

  function handleChange(
    id: string,
    field: keyof LinkRecord,
    value: any
  ) {
    setRecords(prev =>
      prev.map(r =>
        r.id === id ? { ...r, [field]: value } : r
      )
    );
  }

  function addNew() {
    const newRecord: LinkRecord = {
      id: crypto.randomUUID(),
      name: "",
      link: "",
      comments: [],
      editing: true
    };
    setRecords([...records, newRecord]);
  }

  return (
    <div id="container">      

      <div id="divTable">
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Link</th>
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.id}>
              <td>
                {record.editing ? (
                  <input
                    value={record.name}
                    onChange={e =>
                      handleChange(record.id, "name", e.target.value)
                    }
                  />
                ) : (
                  record.name
                )}
              </td>

              <td>
                {record.editing ? (
                  <input
                    value={record.link}
                    onChange={e =>
                      handleChange(record.id, "link", e.target.value)
                    }
                  />
                ) : (
                  <a href={record.link}>{record.link}</a>
                )}
              </td>

              <td>
                {record.editing ? (
                  <input
                    value={record.comments.join(", ")}
                    onChange={e =>
                      handleChange(
                        record.id,
                        "comments",
                        e.target.value.split(",").map(s => s.trim())
                      )
                    }
                  />
                ) : (
                  record.comments.join(", ")
                )}
              </td>

              <td>
                {record.editing ? (
                  <button onClick={() => handleSave(record.id)}>
                    Save
                  </button>
                ) : (
                  <button onClick={() => handleEdit(record.id)}>
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div id="header">

        <div id="header-1">
          <h1>Link Manager</h1>
          <button onClick={addNew}>Add</button>
        </div>

        <div id="header-2">
          <div>
            <label>Name: </label>
            <input id="txtName" type="text"/>
          </div>
        </div>

      </div>

    </div>
  );
}
