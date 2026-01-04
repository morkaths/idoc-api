package com.idoc.statistics.config;

import java.util.Arrays;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    @Pointcut("execution(* com.idoc.statistics..controller..*(..)) || execution(* com.idoc.statistics..service..*(..))")
    public void applicationPackagePointcut() {
    }

    /**
     * Advice that logs when a method is entered and exited.
     *
     * @param joinPoint join point for advice
     * @return result
     * @throws Throwable throws IllegalArgumentException
     */
    @Around("applicationPackagePointcut()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        boolean isSensitive = methodName.toLowerCase().contains("login")
                || methodName.toLowerCase().contains("password");
        String argsToString = isSensitive ? "[PROTECTED]" : Arrays.toString(args);

        log.debug("Enter: {}.{}() with argument[s] = {}", className, methodName, argsToString);

        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        Object result;
        try {
            result = joinPoint.proceed();
        } catch (Throwable e) {
            log.error("Exception in {}.{}() with cause = {}", className, methodName,
                    e.getMessage() != null ? e.getMessage() : "NULL", e);
            throw e;
        } finally {
            stopWatch.stop();
        }

        log.debug("Exit: {}.{}() with result = {} (Execution time: {} ms)",
                className, methodName, result, stopWatch.getTotalTimeMillis());

        return result;
    }
}
