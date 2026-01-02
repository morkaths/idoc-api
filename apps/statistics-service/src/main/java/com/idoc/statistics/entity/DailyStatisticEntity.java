package com.idoc.statistics.entity;

import com.idoc.statistics.core.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "daily_statistics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
}
