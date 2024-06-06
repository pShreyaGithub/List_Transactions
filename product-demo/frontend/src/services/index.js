import axios from "axios";

const baseURL = "http://localhost:4000/api";

const getTransactions = (month, currentPage, perPage, search) =>
  axios.get(
    `${baseURL}/transactions?month=${month}&page=${currentPage}&perPage=${perPage}&search=${search}`
  );
const getStats = (month) => axios.get(`${baseURL}/stats?month=${month}`);

const getPriceStats = (month) =>
  axios.get(`${baseURL}/priceStats?month=${month}`);

const getCategoryStats = (month) =>
  axios.get(`${baseURL}/categoryStats?month=${month}`);

export { getTransactions, getStats, getPriceStats, getCategoryStats };
