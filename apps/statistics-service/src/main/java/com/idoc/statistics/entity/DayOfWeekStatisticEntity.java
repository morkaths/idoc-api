package com.idoc.statistics.entity;

import com.idoc.statistics.core.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.DayOfWeek;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "day_of_week_statistics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DayOfWeekStatisticEntity extends BaseEntity {

    @Id
    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(name = "total_borrows", nullable = false)
    private long totalBorrows = 0;
}
