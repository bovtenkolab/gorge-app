import React, { useState, useMemo } from "react";
import rawData from "../data/links.json";

type PortfolioItem = {
  id: string;
  name: string;
  link: string;
  comments: string[];
};

const data: PortfolioItem[] = rawData;

const DataTable: React.FC = () => {
  const [sortKey, setSortKey] = useState<keyof PortfolioItem>("id");
  const [ascending, setAscending] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");

  const sortedData = useMemo(() => {
    let filtered = data.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return ascending ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return ascending ? 1 : -1;
      return 0;
    });
  }, [sortKey, ascending, filter]);

  const handleSort = (key: keyof PortfolioItem) => {
    if (key === sortKey) {
      setAscending(!ascending);
    } else {
      setSortKey(key);
      setAscending(true);
    }
  };

  return (
    <div>
      <input
        placeholder="Filter by name..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>ID</th>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("link")}>Link</th>
            <th onClick={() => handleSort("comments")}>Comment</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.link}</td>
              <td>{item.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
