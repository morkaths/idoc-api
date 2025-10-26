package com.idoc.user.filter;

import java.io.IOException;

import com.idoc.user.context.UserContextHolder;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

public class UserContextFilter implements Filter {
  
  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    try {
      HttpServletRequest req = (HttpServletRequest) request;
      String userId = req.getHeader("User");
      if (userId != null) {
        UserContextHolder.setUserId(userId);
      }
      chain.doFilter(request, response);
    } finally {
      UserContextHolder.clear();
    }
  }
}
