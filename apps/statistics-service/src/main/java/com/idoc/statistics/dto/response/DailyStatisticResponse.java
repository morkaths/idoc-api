package com.idoc.statistics.dto.response;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyStatisticResponse {
    private LocalDate date;
    private long totalBorrows;
    private long totalReturns;
    private long totalOverdue;
}
