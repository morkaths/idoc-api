package com.idoc.statistics.dto.response;

import java.time.LocalDate;

public class UserStatisticResponse {
    private String userId;
    private long totalBorrows;
    private LocalDate lastActiveDate;

    public UserStatisticResponse() {
    }

    public UserStatisticResponse(String userId, long totalBorrows, LocalDate lastActiveDate) {
        this.userId = userId;
        this.totalBorrows = totalBorrows;
        this.lastActiveDate = lastActiveDate;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public long getTotalBorrows() {
        return totalBorrows;
    }

    public void setTotalBorrows(long totalBorrows) {
        this.totalBorrows = totalBorrows;
    }

    public LocalDate getLastActiveDate() {
        return lastActiveDate;
    }

    public void setLastActiveDate(LocalDate lastActiveDate) {
        this.lastActiveDate = lastActiveDate;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String userId;
        private long totalBorrows;
        private LocalDate lastActiveDate;

        public Builder userId(String userId) {
            this.userId = userId;
            return this;
        }

        public Builder totalBorrows(long totalBorrows) {
            this.totalBorrows = totalBorrows;
            return this;
        }

        public Builder lastActiveDate(LocalDate lastActiveDate) {
            this.lastActiveDate = lastActiveDate;
            return this;
        }

        public UserStatisticResponse build() {
            return new UserStatisticResponse(userId, totalBorrows, lastActiveDate);
        }
    }

    @Override
    public String toString() {
        return "UserStatisticResponse{" +
                "userId='" + userId + '\'' +
                ", totalBorrows=" + totalBorrows +
                ", lastActiveDate=" + lastActiveDate +
                '}';
    }
}
