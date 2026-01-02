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
@Table(name = "book_statistics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookStatisticEntity extends BaseEntity {

    @Id
    @Column(name = "book_id", nullable = false)
    private String bookId;

    @Column(name = "total_borrows", nullable = false)
    private long totalBorrows = 0;
}
