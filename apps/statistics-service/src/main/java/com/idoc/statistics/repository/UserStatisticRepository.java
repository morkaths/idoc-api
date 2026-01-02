package com.idoc.statistics.repository;

import com.idoc.statistics.entity.UserStatisticEntity;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserStatisticRepository extends JpaRepository<UserStatisticEntity, String> {
    List<UserStatisticEntity> findAllByOrderByTotalBorrowsDesc(Pageable pageable);
}
