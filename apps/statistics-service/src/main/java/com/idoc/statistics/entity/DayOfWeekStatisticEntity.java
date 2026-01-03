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

    public DayOfWeekStatisticEntity() {
    }

    public DayOfWeekStatisticEntity(DayOfWeek dayOfWeek, long totalBorrows) {
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
}
