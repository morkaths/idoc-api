package com.idoc.statistics.repository;

import com.idoc.statistics.entity.CategoryStatisticEntity;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryStatisticRepository extends JpaRepository<CategoryStatisticEntity, String> {
    List<CategoryStatisticEntity> findAllByOrderByTotalBorrowsDesc(Pageable pageable);
}
