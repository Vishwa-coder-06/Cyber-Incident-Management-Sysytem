package com.secureops.assignmentservice.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        
        System.out.println("REQUEST: " + request.getMethod() + " " + request.getRequestURI());
        System.out.println("AUTH HEADER: " + header);



        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            try {

                if (jwtUtil.isTokenValid(token)) {

                    String email = jwtUtil.extractEmail(token);
                    String role = jwtUtil.extractRole(token);

                    System.out.println("JWT VALID");
                    System.out.println("EMAIL: " + email);
                    System.out.println("ROLE: " + role);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    List.of(
                                        new SimpleGrantedAuthority("ROLE_" + role)
                                    )
                            );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);

                } else {

                    System.out.println("JWT EXPIRED");

                }

            } catch (Exception e) {

                System.out.println("JWT INVALID: " + e.getMessage());

            }
        }

        filterChain.doFilter(request, response);
    }
}
