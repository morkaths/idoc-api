package com.idoc.statistics.entity;

import com.idoc.libs.common.core.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "daily_statistics")
public class DailyStatisticEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date", nullable = false, unique = true)
    private LocalDate date;

    @Column(name = "total_borrows", nullable = false)
    private long totalBorrows = 0;

    @Column(name = "total_returns", nullable = false)
    private long totalReturns = 0;

    @Column(name = "total_overdue", nullable = false)
    private long totalOverdue = 0;

    public DailyStatisticEntity() {
    }

    public DailyStatisticEntity(Long id, LocalDate date, long totalBorrows, long totalReturns, long totalOverdue) {
        this.id = id;
        this.date = date;
        this.totalBorrows = totalBorrows;
        this.totalReturns = totalReturns;
        this.totalOverdue = totalOverdue;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
