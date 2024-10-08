import { Component } from "react";
import { TailSpin } from "react-loader-spinner";
import { MdOutlineSmsFailed } from "react-icons/md";

import TransactionsStatistics from "../Statistics/Statistics";
import { StatsChart } from "../StatsChart/startChart";
import CategoryChart from "../Pie Chart/pieChart";
import './index.css'
const monthsData = [
  { monthNo: 1, monthName: "January" },
  { monthNo: 2, monthName: "Febrary" },
  { monthNo: 3, monthName: "March" },
  { monthNo: 4, monthName: "April" },
  { monthNo: 5, monthName: "May" },
  { monthNo: 6, monthName: "June" },
  { monthNo: 7, monthName: "July" },
  { monthNo: 8, monthName: "August" },
  { monthNo: 9, monthName: "October" },
  { monthNo: 11, monthName: "November" },
  { monthNo: 12, monthName: "December" },
];

const apiStatusConstant = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inprogress: "IN_PROGRESS",
};

class Dashboard extends Component {
  state = {
    selectedMonth: 3,
    searchText: "",
    pageNo: 1,
    transactionsData: [],
    apiStatus: apiStatusConstant.initial,
    statistics: {},
    itemPriceRange: [],
    categories: {},
    apiStatusStatistics: apiStatusConstant.initial,
    expandedCardId: null, // Track which ccard is expanded
  };

  next = () => {
    const { pageNo } = this.state;
    if (pageNo >= 1) {
      this.setState(
        (prevState) => ({ pageNo: prevState.pageNo + 1 }),
        this.getTransactionData
      );
    }
  };

  prev = () => {
    const { pageNo } = this.state;
    if (pageNo >= 2) {
      this.setState(
        (prevState) => ({ pageNo: prevState.pageNo - 1 }),
        this.getTransactionData
      );
    }
  };

  changeMonth = (event) => {
    this.setState({ selectedMonth: event.target.value, pageNo: 1 }, () => {
      this.getTransactionData();
      this.getStatisticsData();
    });
  };

  updateSearch = (event) => {
    this.setState({ searchText: event.target.value }, this.getTransactionData);
  };

  getTransactionData = async () => {
    try {
      this.setState({ apiStatus: apiStatusConstant.inprogress });
      const { selectedMonth, searchText, pageNo } = this.state;
      const response = await fetch(
        `https://roxiller-shubham.onrender.com/api/transactions?month=${selectedMonth}&search=${searchText}&page=${pageNo}`
      );
      const data = await response.json();
      this.setState({ transactionsData: data });
      this.setState({ apiStatus: apiStatusConstant.success });
    } catch (error) {
      this.setState({ apiStatus: apiStatusConstant.failure });
      console.log(error.message);
    }
  };

  getStatisticsData = async () => {
    try {
      this.setState({ apiStatusStatistics: apiStatusConstant.inprogress });
      const { selectedMonth } = this.state;
      const response = await fetch(
        `https://roxiller-shubham.onrender.com/api/all?month=${selectedMonth}`
      );
      const data = await response.json();
      this.setState({
        statistics: data.statistics,
        itemPriceRange: data.barChart,
        categories: data.pieChart,
        apiStatusStatistics: apiStatusConstant.success,
      });
    } catch (error) {
      this.setState({ apiStatusStatistics: apiStatusConstant.failure });
      console.log(error.message);
    }
  };

  componentDidMount() {
    this.getTransactionData();
    this.getStatisticsData();
  }

  toggleReadMore = (id) => {
    this.setState((prevState) => ({
      expandedCardId: prevState.expandedCardId === id ? null : id,
    }));
  };

  getTransactionCards = () => {
    const { transactionsData, expandedCardId } = this.state;
    if (transactionsData.length === 0)
      return (
        <div className="empty-view">
          <h2>No Transactions Found</h2>
        </div>
      );

    return (
      <div className="columns">
        {transactionsData.map((each) => (
          <div className="column" key={each._id}>
            <div className="ccard card column"  >
              <div className="card-content">
                <div className="columns">
                  <div className="column">
                    <figure className="ccard-image-container">
                      <img
                        src={each.image}
                        alt={each.title}
                        className="ccard-image"
                      />
                    </figure>

                  </div>
                  <div className="column">
                    <h2 className="has-text-weight-bold">{each.title}</h2>
                    <p className="has-text-weight-semibold has-text-success"> ₹ {(each.price).toFixed(2)}</p>
                    <p className="ccard-category">Category: {each.category}</p>
                    <p className="ccard-sold-status">
                      {each.sold ? "Sold" : "Available"}
                    </p>
                  </div>
                </div>
                <p className="ccard-description">
                  {expandedCardId === each._id
                    ? each.description
                    : each.description.length > 100
                      ? each.description.slice(0, 100) + "..."
                      : each.description}
                  {each.description.length > 100 && (
                    <button
                      className="read-more"
                      onClick={() => this.toggleReadMore(each._id)}
                    >
                      {expandedCardId === each._id ? "Read Less" : "Read More"}
                    </button>
                  )}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>
    );
  };

  loadingView = () => {
    return (
      <div className="loading-view">
        <TailSpin
          height="50"
          width="50"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  };

  failureView = (func) => {
    return (
      <div className="failure-view">
        <MdOutlineSmsFailed size={40} />
        <h2>Oops! Something Went Wrong</h2>
        <button className="retry-button" type="button" onClick={() => func()}>
          Try again
        </button>
      </div>
    );
  };

  getStatisticsSuccessView = () => {
    const { itemPriceRange, statistics, selectedMonth, categories } = this.state;
    const name = monthsData.find(
      (each) => String(each.monthNo) === String(selectedMonth)
    ).monthName;

    return (
      <div>
        <StatsChart monthName={name} itemPriceRange={itemPriceRange} />
        <div className="columns">
          <div className="column is-6">
            <TransactionsStatistics
              monthNo={selectedMonth}
              monthName={name}
              statistics={statistics}
            />
          </div>
          <div className="column is-6">
            <CategoryChart monthName={name} categories={categories} />
          </div>
        </div>
      </div>
    );
  };

  getStatisticsView = () => {
    const { apiStatusStatistics } = this.state;
    switch (apiStatusStatistics) {
      case apiStatusConstant.inprogress:
        return this.loadingView();
      case apiStatusConstant.success:
        return this.getStatisticsSuccessView();
      case apiStatusConstant.failure:
        return this.failureView(this.getStatisticsData);
      default:
        return null;
    }
  };

  getTransactionView = () => {
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case apiStatusConstant.inprogress:
        return this.loadingView();
      case apiStatusConstant.success:
        return this.getTransactionCards();
      case apiStatusConstant.failure:
        return this.failureView(this.getTransactionData);
      default:
        return null;
    }
  };

  render() {
    const { selectedMonth, pageNo } = this.state;
    return (
      <div className="box mb-5 mt-5">
        <h1 className="is-size-3 has-text-centered has-text-weight-bold">Transaction Dashboard</h1>

        <section className="input-section mt-5">
          <div className="is-flex mb-5">
            <input
              type="search"
              placeholder="Search Transactions"
              className="input"
              onChange={this.updateSearch}
            />
            <div className="select mx-2">
              <select
                type="search"
                onChange={this.changeMonth}
                value={selectedMonth}
              >
                {monthsData.map((each) => (
                  <option key={each.monthNo} value={each.monthNo}>
                    {each.monthName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
        <div>
          {this.getTransactionView()}
        </div>
        <hr />
        <div className="is-flex is-justify-content-space-between">
          <p className="has-text-weight-bold">Page No: {pageNo}</p>
          <div className="buttons">
            <button type="button" className="button button-primary" onClick={this.prev} disabled={pageNo === 1}>
              Prev
            </button>
            &nbsp;-&nbsp;
            <button type="button" onClick={this.next} className="button button">
              Next
            </button>
          </div>
        </div>
        {this.getStatisticsView()}
      </div>
    );
  }
}

export default Dashboard;
