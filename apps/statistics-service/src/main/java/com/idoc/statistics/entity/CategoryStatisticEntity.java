package com.idoc.statistics.entity;

import com.idoc.libs.common.core.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "category_statistics")

public class CategoryStatisticEntity extends BaseEntity {

    @Id
    @Column(name = "category_id", nullable = false)
    private String categoryId;

    @Column(name = "total_borrows", nullable = false)
    private long totalBorrows = 0;

    public CategoryStatisticEntity() {
    }

    public CategoryStatisticEntity(String categoryId, long totalBorrows) {
        this.categoryId = categoryId;
        this.totalBorrows = totalBorrows;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public long getTotalBorrows() {
        return totalBorrows;
    }

    public void setTotalBorrows(long totalBorrows) {
        this.totalBorrows = totalBorrows;
    }
}
