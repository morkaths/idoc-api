package com.idoc.statistics.dto.response;

import java.time.LocalDate;

public class DailyStatisticResponse {
    private LocalDate date;
    private long totalBorrows;
    private long totalReturns;
    private long totalOverdue;

    public DailyStatisticResponse() {
    }

    public DailyStatisticResponse(LocalDate date, long totalBorrows, long totalReturns, long totalOverdue) {
        this.date = date;
        this.totalBorrows = totalBorrows;
        this.totalReturns = totalReturns;
        this.totalOverdue = totalOverdue;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public long getTotalBorrows() {
        return totalBorrows;
    }

    public void setTotalBorrows(long totalBorrows) {
        this.totalBorrows = totalBorrows;
    }

    public long getTotalReturns() {
        return totalReturns;
    }

    public void setTotalReturns(long totalReturns) {
        this.totalReturns = totalReturns;
    }

    public long getTotalOverdue() {
        return totalOverdue;
    }

    public void setTotalOverdue(long totalOverdue) {
        this.totalOverdue = totalOverdue;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private LocalDate date;
        private long totalBorrows;
        private long totalReturns;
        private long totalOverdue;

        public Builder date(LocalDate date) {
            this.date = date;
            return this;
        }

        public Builder totalBorrows(long totalBorrows) {
            this.totalBorrows = totalBorrows;
            return this;
        }

        public Builder totalReturns(long totalReturns) {
            this.totalReturns = totalReturns;
            return this;
        }

        public Builder totalOverdue(long totalOverdue) {
            this.totalOverdue = totalOverdue;
            return this;
        }

        public DailyStatisticResponse build() {
            return new DailyStatisticResponse(date, totalBorrows, totalReturns, totalOverdue);
        }
    }

    @Override
    public String toString() {
        return "DailyStatisticResponse{" +
                "date=" + date +
                ", totalBorrows=" + totalBorrows +
                ", totalReturns=" + totalReturns +
                ", totalOverdue=" + totalOverdue +
                '}';
    }
}
