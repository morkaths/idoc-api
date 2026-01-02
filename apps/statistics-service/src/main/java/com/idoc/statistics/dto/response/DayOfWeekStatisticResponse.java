package com.idoc.statistics.dto.response;

import java.time.DayOfWeek;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DayOfWeekStatisticResponse {
    private DayOfWeek dayOfWeek;
    private long totalBorrows;
}
