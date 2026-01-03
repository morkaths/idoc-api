package com.idoc.statistics.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.idoc.statistics.dto.event.BorrowEvent;
import com.idoc.statistics.service.StatisticService;

import org.springframework.stereotype.Component;

@Component
public class BorrowEventListener {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(BorrowEventListener.class);

    private final ObjectMapper objectMapper;
    private final StatisticService statisticService;

    public BorrowEventListener(ObjectMapper objectMapper, StatisticService statisticService) {
        this.objectMapper = objectMapper;
        this.statisticService = statisticService;
    }

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
