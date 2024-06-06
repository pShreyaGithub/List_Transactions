import { getStats, getTransactions } from "../services";
import React, { useState, useEffect } from "react";

const TransactionsTable = ({ month, searchText }) => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(3);
  const [totalPage, setTotalPage] = useState(0);
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions(
        month,
        currentPage,
        perPage,
        searchText
      );
      setTransactions(response.data?.products ?? []);
      setTotalPage(Math.ceil(response.data?.total / perPage));
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await getStats(month);
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
  }, [month, currentPage, searchText]);

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <h2>Transaction Statistics</h2>
      <div className="statistics-container">
        <div className="statistics-box">
          <div>Total Sale Amount: ${statistics.totalSaleAmount}</div>
          <div>Total Sold Items: {statistics.totalSoldItems}</div>
          <div>Total Not Sold Items: {statistics.totalNotSoldItems}</div>
        </div>
      </div>

      <h2>Transaction Table</h2>
      <div className="transactions-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Description</th>
              <th>Category</th>
              <th>Image</th>
              <th>Sold</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.title}</td>
                <td>{transaction.price}</td>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td>{transaction.image}</td>
                <td>{transaction.sold ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-container">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPage}</span>
          <button onClick={handleNextPage} disabled={currentPage >= totalPage}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export { TransactionsTable };
