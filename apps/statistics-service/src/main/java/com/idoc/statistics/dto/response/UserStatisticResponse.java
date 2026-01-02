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
public class UserStatisticResponse {
    private String userId;
    private long totalBorrows;
    private LocalDate lastActiveDate;
}
