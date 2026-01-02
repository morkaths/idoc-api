package com.idoc.statistics.controller;

import com.idoc.statistics.dto.response.ApiResponse;
import com.idoc.statistics.dto.response.DailyStatisticResponse;
import com.idoc.statistics.dto.response.DayOfWeekStatisticResponse;
import com.idoc.statistics.dto.response.OverallStatisticResponse;
import com.idoc.statistics.dto.response.UserStatisticResponse;
import com.idoc.statistics.service.StatisticService;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.idoc.statistics.dto.response.BookStatisticResponse;
import com.idoc.statistics.dto.response.CategoryStatisticResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/statistics")
@Tag(name = "Statistics", description = "Endpoints for retrieving statistical data")
public class StatisticController {

    private final StatisticService statisticService;

    public StatisticController(StatisticService statisticService) {
        this.statisticService = statisticService;
    }

    @GetMapping("/daily")
    @Operation(summary = "Get daily statistics", description = "Retrieve statistics for a specific date range")
    public ResponseEntity<ApiResponse<List<DailyStatisticResponse>>> getDailyStatistics(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<DailyStatisticResponse> response = statisticService.getDailyStatistics(startDate, endDate);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/top-books")
    @Operation(summary = "Get top borrowed books", description = "Retrieve a list of the most borrowed books")
    public ResponseEntity<ApiResponse<List<BookStatisticResponse>>> getTopBooks(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(ApiResponse.success(statisticService.getTopBorrowedBooks(limit)));
    }

    @GetMapping("/top-users")
    @Operation(summary = "Get top active users", description = "Retrieve a list of users with the most borrows")
    public ResponseEntity<ApiResponse<List<UserStatisticResponse>>> getTopUsers(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(ApiResponse.success(statisticService.getTopUsers(limit)));
    }

    @GetMapping("/top-categories")
    @Operation(summary = "Get top categories", description = "Retrieve a list of the most popular book categories")
    public ResponseEntity<ApiResponse<List<CategoryStatisticResponse>>> getTopCategories(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(ApiResponse.success(statisticService.getTopCategories(limit)));
    }

    @GetMapping("/peak-days")
    @Operation(summary = "Get peak borrowing days", description = "Retrieve statistics on borrowing activity by day of the week")
    public ResponseEntity<ApiResponse<List<DayOfWeekStatisticResponse>>> getPeakBorrowingDays() {
        return ResponseEntity.ok(ApiResponse.success(statisticService.getPeakBorrowingDays()));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get overall summary", description = "Retrieve total borrows, returns, and overdue across all time")
    public ResponseEntity<ApiResponse<OverallStatisticResponse>> getOverallSummary() {
        return ResponseEntity.ok(ApiResponse.success(statisticService.getOverallSummary()));
    }
}
