package com.idoc.statistics.listener;

import com.fasterxml.jackson.core.type.TypeReference;
import com.idoc.statistics.dto.event.EventMessage;
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
            log.info("Received raw event from Redis: {}", message);

            // Deserialize into Envelope
            EventMessage<BorrowEvent> envelope = objectMapper.readValue(
                    message,
                    new TypeReference<EventMessage<BorrowEvent>>() {
                    });

            log.info("Processing event id: {}, type: {}, source: {}", envelope.getId(), envelope.getType(),
                    envelope.getSource());

            BorrowEvent event = envelope.getPayload();

            if ("BORROW".equalsIgnoreCase(envelope.getType())) {
                statisticService.incrementDailyBorrow(event.getEventDate(), event.getBookId(), event.getUserId(),
                        event.getCategoryIds());
            } else if ("RETURN".equalsIgnoreCase(envelope.getType())) {
                statisticService.incrementDailyReturn(event.getEventDate());
            } else {
                log.warn("Unknown event type: {}", envelope.getType());
            }

        } catch (Exception e) {
            log.error("Failed to process message from Redis: {}", message, e);
        }
    }
}
