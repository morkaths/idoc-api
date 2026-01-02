package com.idoc.statistics.repository;

import com.idoc.statistics.entity.BookStatisticEntity;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookStatisticRepository extends JpaRepository<BookStatisticEntity, String> {
    List<BookStatisticEntity> findAllByOrderByTotalBorrowsDesc(Pageable pageable);
}
