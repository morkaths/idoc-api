package com.idoc.statistics.entity;

import com.idoc.statistics.core.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.DayOfWeek;

@Entity
@Table(name = "day_of_week_statistics")
public class DayOfWeekStatisticEntity extends BaseEntity {

    @Id
    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(name = "total_borrows", nullable = false)
    private long totalBorrows = 0;

    @Column(name = "total_returns", nullable = false)
    private long totalReturns = 0;

    @Column(name = "total_overdue", nullable = false)
    private long totalOverdue = 0;

    public DayOfWeekStatisticEntity() {
    }

    public DayOfWeekStatisticEntity(DayOfWeek dayOfWeek, long totalBorrows, long totalReturns, long totalOverdue) {
        this.dayOfWeek = dayOfWeek;
        this.totalBorrows = totalBorrows;
        this.totalReturns = totalReturns;
        this.totalOverdue = totalOverdue;
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
}
