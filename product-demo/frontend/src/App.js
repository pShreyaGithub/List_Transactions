import { useState } from "react";
import "./App.css";
import { BarChart, TransactionsTable } from "./components";

const App = () => {
  const [month, setMonth] = useState("March");
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <div className="transactions-page">
      <h1 className="head">Transaction Dashboard</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearch}
        />
        <select value={month} onChange={handleMonthChange}>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>
      <TransactionsTable month={month} searchText={searchText} />
      <BarChart month={month} />
    </div>
  );
};

export default App;
