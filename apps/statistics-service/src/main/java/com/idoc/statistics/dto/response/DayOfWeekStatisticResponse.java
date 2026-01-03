package com.idoc.statistics.dto.response;

import java.time.DayOfWeek;

public class DayOfWeekStatisticResponse {
    private DayOfWeek dayOfWeek;
    private long totalBorrows;

    public DayOfWeekStatisticResponse() {
    }

    public DayOfWeekStatisticResponse(DayOfWeek dayOfWeek, long totalBorrows) {
        this.dayOfWeek = dayOfWeek;
        this.totalBorrows = totalBorrows;
    }

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(DayOfWeek dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public long getTotalBorrows() {
        return totalBorrows;
    }

    public void setTotalBorrows(long totalBorrows) {
        this.totalBorrows = totalBorrows;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private DayOfWeek dayOfWeek;
        private long totalBorrows;

        public Builder dayOfWeek(DayOfWeek dayOfWeek) {
            this.dayOfWeek = dayOfWeek;
            return this;
        }

        public Builder totalBorrows(long totalBorrows) {
            this.totalBorrows = totalBorrows;
            return this;
        }

        public DayOfWeekStatisticResponse build() {
            return new DayOfWeekStatisticResponse(dayOfWeek, totalBorrows);
        }
    }

    @Override
    public String toString() {
        return "DayOfWeekStatisticResponse{" +
                "dayOfWeek=" + dayOfWeek +
                ", totalBorrows=" + totalBorrows +
                '}';
    }
}
