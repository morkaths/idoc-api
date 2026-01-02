package com.idoc.statistics.repository;

import com.idoc.statistics.entity.DayOfWeekStatisticEntity;
import java.time.DayOfWeek;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DayOfWeekStatisticRepository extends JpaRepository<DayOfWeekStatisticEntity, DayOfWeek> {
    List<DayOfWeekStatisticEntity> findAllByOrderByTotalBorrowsDesc();
}
