package com.idoc.statistics.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.idoc.statistics.dto.event.BorrowEvent;
import com.idoc.statistics.service.StatisticService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class BorrowEventListener {

    private final ObjectMapper objectMapper;
    private final StatisticService statisticService;

    public void handleMessage(String message) {
        try {
            log.info("Received event from Redis: {}", message);
            BorrowEvent event = objectMapper.readValue(message, BorrowEvent.class);

            if ("BORROW".equalsIgnoreCase(event.getType())) {
                statisticService.incrementDailyBorrow(event.getEventDate(), event.getBookId(), event.getUserId(),
                        event.getCategoryIds());
            } else if ("RETURN".equalsIgnoreCase(event.getType())) {
                statisticService.incrementDailyReturn(event.getEventDate());
            } else {
                log.warn("Unknown event type: {}", event.getType());
            }

        } catch (Exception e) {
            log.error("Failed to process message from Redis: {}", message, e);
        }
    }
}
