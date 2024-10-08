import React from 'react';

export default function TransactionsStatistics({ statistics, monthName }) {
  return (
    <section className="section">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            Statistics - <span style={{ color: 'green' }}> {monthName}</span>
          </p>
        </header>
        <div className="card-content">
          <div className="content">
            <div className="columns is-variable is-4">
              <div className="column">
                <p><strong>Total Sale</strong></p>
                <p>{statistics.totalSaleAmount}</p>
              </div>
              <div className="column">
                <p><strong>Total Sold Items</strong></p>
                <p>{statistics.soldItems}</p>
              </div>
              <div className="column">
                <p><strong>Total Unsold</strong></p>
                <p>{statistics.notSoldItems}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
