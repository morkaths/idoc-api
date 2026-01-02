package com.idoc.statistics.repository;

import com.idoc.statistics.entity.DailyStatisticEntity;
import jakarta.persistence.LockModeType;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DailyStatisticRepository extends JpaRepository<DailyStatisticEntity, Long> {

    Optional<DailyStatisticEntity> findByDate(LocalDate date);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT d FROM DailyStatisticEntity d WHERE d.date = :date")
    Optional<DailyStatisticEntity> findByDateWithLock(LocalDate date);
}
