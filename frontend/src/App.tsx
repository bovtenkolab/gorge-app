import React from "react";
import Header from "./components/Header";
import DataTable from "./components/Datatable";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="container">
      <Header />

      <main className="main">
        <h3>
          Take notes on the web.
        </h3>

        <DataTable />
      </main>
    </div>
  );
};

export default App;
