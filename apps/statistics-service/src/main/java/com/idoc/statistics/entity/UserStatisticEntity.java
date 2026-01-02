package com.idoc.statistics.entity;

import com.idoc.statistics.core.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_statistics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserStatisticEntity extends BaseEntity {

    @Id
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "total_borrows", nullable = false)
    private long totalBorrows = 0;

    @Column(name = "last_active_date")
    private LocalDate lastActiveDate;
}
