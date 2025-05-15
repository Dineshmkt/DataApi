
import { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://api.spacexdata.com/v3/capsules")
      .then((res) => res.json())
      .then((capsules) => {
        setData(capsules);
        setFilteredData(capsules);
        setLoading(false);
      });
  }, []);

  const handleSearch = (term: string) => {
    setSearch(term);
    const result = data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(term.toLowerCase())
    );
    setFilteredData(result);
  };

  const columns = filteredData.length > 0 ? Object.keys(filteredData[0]) : [];

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-white shadow flex justify-between items-center px-6 py-4 sticky top-0 z-10">
        <div className="text-xl font-semibold text-gray-800">
          {loading ? "Loading..." : "🚀 SpaceX Capsules"}
        </div>
        <input
          type="text"
          placeholder="Search capsules..."
          className="p-2 border rounded w-full max-w-md"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </nav>

      <div className="p-4 overflow-auto">
        {filteredData.length > 0 ? (
          <table className="w-full bg-white shadow-md rounded table-auto">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-4 py-2 border text-sm">
                    {col.replace(/_/g, " ").toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-2 border text-xs">
                      {col === "missions" ? (
                        Array.isArray(item[col]) && item[col].length > 0 ? (
                          item[col].map((m: any, i: number) =>
                            m?.name && m?.flight ? (
                              <div key={i}>
                                {m.name} (Flight {m.flight})
                              </div>
                            ) : null
                          )
                        ) : (
                          "Unknown Data"
                        )
                      ) : item[col] === null || item[col] === undefined || item[col] === "" ? (
                        "Unknown Data"
                      ) : (
                        item[col].toString()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 mt-10">No data found.</p>
        )}
      </div>
    </div>
  );
};

export default App;
