package com.idoc.statistics.dto.response;

public class OverallStatisticResponse {
    private Long totalBorrows;
    private Long totalReturns;
    private Long totalOverdue;

    public Long getTotalBorrows() {
        return totalBorrows;
    }

    public void setTotalBorrows(Long totalBorrows) {
        this.totalBorrows = totalBorrows;
    }

    public Long getTotalReturns() {
        return totalReturns;
    }

    public void setTotalReturns(Long totalReturns) {
        this.totalReturns = totalReturns;
    }

    public Long getTotalOverdue() {
        return totalOverdue;
    }

    public void setTotalOverdue(Long totalOverdue) {
        this.totalOverdue = totalOverdue;
    }
}
