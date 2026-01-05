package com.idoc.statistics.service;

import com.idoc.statistics.dto.response.BookStatisticResponse;
import com.idoc.statistics.dto.response.CategoryStatisticResponse;
import com.idoc.statistics.dto.response.DailyStatisticResponse;
import com.idoc.statistics.dto.response.DayOfWeekStatisticResponse;
import com.idoc.statistics.dto.response.OverallStatisticResponse;
import com.idoc.statistics.dto.response.UserStatisticResponse;
import com.idoc.statistics.entity.DailyStatisticEntity;
import com.idoc.statistics.entity.DayOfWeekStatisticEntity;
import com.idoc.statistics.mapper.StatisticMapper;
import com.idoc.statistics.repository.BookStatisticRepository;
import com.idoc.statistics.repository.CategoryStatisticRepository;
import com.idoc.statistics.repository.DailyStatisticRepository;
import com.idoc.statistics.repository.DayOfWeekStatisticRepository;
import com.idoc.statistics.repository.UserStatisticRepository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class StatisticService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(StatisticService.class);

    private final DailyStatisticRepository dailyStatisticRepository;
    private final BookStatisticRepository bookStatisticRepository;
    private final UserStatisticRepository userStatisticRepository;
    private final CategoryStatisticRepository categoryStatisticRepository;
    private final DayOfWeekStatisticRepository dayOfWeekStatisticRepository;
    private final StatisticMapper statisticMapper;

    public StatisticService(DailyStatisticRepository dailyStatisticRepository,
            BookStatisticRepository bookStatisticRepository,
            UserStatisticRepository userStatisticRepository,
            CategoryStatisticRepository categoryStatisticRepository,
            DayOfWeekStatisticRepository dayOfWeekStatisticRepository,
            StatisticMapper statisticMapper) {
        this.dailyStatisticRepository = dailyStatisticRepository;
        this.bookStatisticRepository = bookStatisticRepository;
        this.userStatisticRepository = userStatisticRepository;
        this.categoryStatisticRepository = categoryStatisticRepository;
        this.dayOfWeekStatisticRepository = dayOfWeekStatisticRepository;
        this.statisticMapper = statisticMapper;
    }

    @Transactional
    public void incrementDailyBorrow(LocalDate date, String bookId, String userId, java.util.List<String> categoryIds) {
        // 1. Update Daily Statistics
        log.info("Incrementing daily borrow stats for date: {}", date);
        DailyStatisticEntity dailyStat = dailyStatisticRepository.findByDateWithLock(date)
                .orElseGet(() -> {
                    DailyStatisticEntity newStat = new DailyStatisticEntity();
                    newStat.setDate(date);
                    return dailyStatisticRepository.save(newStat);
                });

        dailyStat.setTotalBorrows(dailyStat.getTotalBorrows() + 1);
        dailyStatisticRepository.save(dailyStat);
        log.info("Updated daily borrow stats: {}", dailyStat);

        // 2. Update Book Statistics
        if (bookId != null && !bookId.isEmpty()) {
            log.info("Incrementing borrow stats for bookId: {}", bookId);
            com.idoc.statistics.entity.BookStatisticEntity bookStat = bookStatisticRepository.findById(bookId)
                    .orElseGet(() -> {
                        com.idoc.statistics.entity.BookStatisticEntity newStat = new com.idoc.statistics.entity.BookStatisticEntity();
                        newStat.setBookId(bookId);
                        newStat.setTotalBorrows(0);
                        return bookStatisticRepository.save(newStat);
                    });
            bookStat.setTotalBorrows(bookStat.getTotalBorrows() + 1);
            bookStatisticRepository.save(bookStat);
        }

        // 3. Update User Statistics
        if (userId != null && !userId.isEmpty()) {
            log.info("Incrementing borrow stats for userId: {}", userId);
            com.idoc.statistics.entity.UserStatisticEntity userStat = userStatisticRepository.findById(userId)
                    .orElseGet(() -> {
                        com.idoc.statistics.entity.UserStatisticEntity newStat = new com.idoc.statistics.entity.UserStatisticEntity();
                        newStat.setUserId(userId);
                        newStat.setTotalBorrows(0);
                        return userStatisticRepository.save(newStat);
                    });
            userStat.setTotalBorrows(userStat.getTotalBorrows() + 1);
            userStat.setLastActiveDate(date);
            userStatisticRepository.save(userStat);
        }

        // 4. Update Category Statistics
        if (categoryIds != null && !categoryIds.isEmpty()) {
            for (String categoryId : categoryIds) {
                if (categoryId != null && !categoryId.isEmpty()) {
                    log.info("Incrementing borrow stats for categoryId: {}", categoryId);
                    com.idoc.statistics.entity.CategoryStatisticEntity categoryStat = categoryStatisticRepository
                            .findById(categoryId)
                            .orElseGet(() -> {
                                com.idoc.statistics.entity.CategoryStatisticEntity newStat = new com.idoc.statistics.entity.CategoryStatisticEntity();
                                newStat.setCategoryId(categoryId);
                                newStat.setTotalBorrows(0);
                                return categoryStatisticRepository.save(newStat);
                            });
                    categoryStat.setTotalBorrows(categoryStat.getTotalBorrows() + 1);
                    categoryStatisticRepository.save(categoryStat);
                }
            }
        }

        // 5. Update Day of Week Statistics
        java.time.DayOfWeek dayOfWeek = date.getDayOfWeek();
        log.info("Incrementing borrow stats for day of week: {}", dayOfWeek);
        DayOfWeekStatisticEntity dayStat = dayOfWeekStatisticRepository.findById(dayOfWeek)
                .orElseGet(() -> {
                    DayOfWeekStatisticEntity newStat = new DayOfWeekStatisticEntity();
                    newStat.setDayOfWeek(dayOfWeek);
                    newStat.setTotalBorrows(0);
                    newStat.setTotalReturns(0);
                    newStat.setTotalOverdue(0);
                    return dayOfWeekStatisticRepository.save(newStat);
                });
        dayStat.setTotalBorrows(dayStat.getTotalBorrows() + 1);
        dayStat.setTotalReturns(dayStat.getTotalReturns() + 1);
        dayStat.setTotalOverdue(dayStat.getTotalOverdue() + 1);
        dayOfWeekStatisticRepository.save(dayStat);
    }

    @Transactional
    public void incrementDailyReturn(LocalDate date) {
        log.info("Incrementing daily return stats for date: {}", date);
        DailyStatisticEntity dailyStat = dailyStatisticRepository.findByDateWithLock(date)
                .orElseGet(() -> {
                    DailyStatisticEntity newStat = new DailyStatisticEntity();
                    newStat.setDate(date);
                    return dailyStatisticRepository.save(newStat);
                });

        dailyStat.setTotalReturns(dailyStat.getTotalReturns() + 1);
        dailyStatisticRepository.save(dailyStat);
        log.info("Updated daily return stats: {}", dailyStat);
    }

    @Transactional
    public void incrementDailyOverdue(LocalDate date) {
        log.info("Incrementing daily overdue stats for date: {}", date);
        DailyStatisticEntity dailyStat = dailyStatisticRepository.findByDateWithLock(date)
                .orElseGet(() -> {
                    DailyStatisticEntity newStat = new DailyStatisticEntity();
                    newStat.setDate(date);
                    return dailyStatisticRepository.save(newStat);
                });

        dailyStat.setTotalOverdue(dailyStat.getTotalOverdue() + 1);
        dailyStatisticRepository.save(dailyStat);
        log.info("Updated daily overdue stats: {}", dailyStat);
    }

    public List<DailyStatisticResponse> getDailyStatistics(LocalDate startDate, LocalDate endDate) {
        return dailyStatisticRepository.findAll().stream()
                .filter(stat -> !stat.getDate().isBefore(startDate) && !stat.getDate().isAfter(endDate))
                .map(statisticMapper::toResponse)
                .toList();
    }

    public List<BookStatisticResponse> getTopBorrowedBooks(int limit) {
        return bookStatisticRepository.findAllByOrderByTotalBorrowsDesc(
                PageRequest.of(0, limit))
                .stream()
                .map(statisticMapper::toResponse)
                .toList();
    }

    public List<UserStatisticResponse> getTopUsers(int limit) {
        return userStatisticRepository.findAllByOrderByTotalBorrowsDesc(
                PageRequest.of(0, limit))
                .stream()
                .map(statisticMapper::toResponse)
                .toList();
    }

    public List<CategoryStatisticResponse> getTopCategories(int limit) {
        return categoryStatisticRepository.findAllByOrderByTotalBorrowsDesc(
                PageRequest.of(0, limit))
                .stream()
                .map(statisticMapper::toResponse)
                .toList();
    }

    public List<DayOfWeekStatisticResponse> getPeakBorrowingDays() {
        return dayOfWeekStatisticRepository.findAllByOrderByTotalBorrowsDesc()
                .stream()
                .map(statisticMapper::toResponse)
                .toList();
    }

    public OverallStatisticResponse getOverallSummary() {
        List<DailyStatisticEntity> allStats = dailyStatisticRepository.findAll();
        long totalBorrows = allStats.stream().mapToLong(DailyStatisticEntity::getTotalBorrows).sum();
        long totalReturns = allStats.stream().mapToLong(DailyStatisticEntity::getTotalReturns).sum();
        long totalOverdue = allStats.stream().mapToLong(DailyStatisticEntity::getTotalOverdue).sum();

        OverallStatisticResponse response = new OverallStatisticResponse();
        response.setTotalBorrows(totalBorrows);
        response.setTotalReturns(totalReturns);
        response.setTotalOverdue(totalOverdue);
        return response;
    }
}
