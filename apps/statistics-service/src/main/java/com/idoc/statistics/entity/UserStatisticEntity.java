package com.idoc.statistics.entity;

import com.idoc.statistics.core.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "user_statistics")
public class UserStatisticEntity extends BaseEntity {

    @Id
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "total_borrows", nullable = false)
    private long totalBorrows = 0;

    @Column(name = "last_active_date")
    private LocalDate lastActiveDate;

    public UserStatisticEntity() {
    }

    public UserStatisticEntity(String userId, long totalBorrows, LocalDate lastActiveDate) {
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
}
