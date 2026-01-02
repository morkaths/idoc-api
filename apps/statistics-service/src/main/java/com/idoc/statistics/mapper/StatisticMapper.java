package com.idoc.statistics.mapper;

import com.idoc.statistics.dto.response.BookStatisticResponse;
import com.idoc.statistics.entity.BookStatisticEntity;
import com.idoc.statistics.dto.response.DailyStatisticResponse;
import com.idoc.statistics.entity.DailyStatisticEntity;
import com.idoc.statistics.dto.response.UserStatisticResponse;
import com.idoc.statistics.entity.UserStatisticEntity;
import com.idoc.statistics.dto.response.CategoryStatisticResponse;
import com.idoc.statistics.entity.CategoryStatisticEntity;
import com.idoc.statistics.dto.response.DayOfWeekStatisticResponse;
import com.idoc.statistics.entity.DayOfWeekStatisticEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StatisticMapper {
    DailyStatisticResponse toResponse(DailyStatisticEntity entity);

    BookStatisticResponse toResponse(BookStatisticEntity entity);

    UserStatisticResponse toResponse(UserStatisticEntity entity);

    CategoryStatisticResponse toResponse(CategoryStatisticEntity entity);

    DayOfWeekStatisticResponse toResponse(DayOfWeekStatisticEntity entity);
}
