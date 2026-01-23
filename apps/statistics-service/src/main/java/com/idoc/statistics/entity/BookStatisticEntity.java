package com.idoc.statistics.entity;

import com.idoc.libs.common.core.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "book_statistics")
public class BookStatisticEntity extends BaseEntity {

    @Id
    @Column(name = "book_id", nullable = false)
    private String bookId;

    @Column(name = "total_borrows", nullable = false)
    private long totalBorrows = 0;

    public BookStatisticEntity() {
    }

    public BookStatisticEntity(String bookId, long totalBorrows) {
        this.bookId = bookId;
        this.totalBorrows = totalBorrows;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public long getTotalBorrows() {
        return totalBorrows;
    }

    public void setTotalBorrows(long totalBorrows) {
        this.totalBorrows = totalBorrows;
    }
}
