package com.idoc.statistics.entity;

import com.idoc.statistics.core.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "category_statistics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryStatisticEntity extends BaseEntity {

    @Id
    @Column(name = "category_id", nullable = false)
    private String categoryId;

    @Column(name = "total_borrows", nullable = false)
    private long totalBorrows = 0;
}
