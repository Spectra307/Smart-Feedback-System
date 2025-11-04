package com.smartfeedback.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class ApiKeyAuthFilter extends OncePerRequestFilter {

	private static final Logger logger = LoggerFactory.getLogger(ApiKeyAuthFilter.class);
	private static final AntPathMatcher pathMatcher = new AntPathMatcher();

	@Value("${app.api.keys:}")
	private String apiKeysProperty;

	private volatile Set<String> cachedKeys = Collections.emptySet();

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String path = request.getRequestURI();

		// Allow non-API paths and health checks without auth
		if (!pathMatcher.match("/api/**", path)
				|| pathMatcher.match("/api/*/health", path)) {
			filterChain.doFilter(request, response);
			return;
		}

		Set<String> validKeys = getConfiguredKeys();
		if (validKeys.isEmpty()) {
			// No keys configured: allow traffic but warn (dev-mode behavior)
			logger.warn("No API keys configured (app.api.keys empty). Allowing request to {}. Set APP_API_KEYS env var or app.api.keys property to enable API key auth.", path);
			filterChain.doFilter(request, response);
			return;
		}

		String providedKey = resolveApiKey(request);
		if (providedKey == null || !validKeys.contains(providedKey)) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
			response.getWriter().write("{\"error\":\"Unauthorized: missing or invalid API key\"}");
			return;
		}

		filterChain.doFilter(request, response);
	}

	private String resolveApiKey(HttpServletRequest request) {
		// Common header name for simple API key auth
		String header = request.getHeader("X-API-Key");
		if (StringUtils.hasText(header)) {
			return header.trim();
		}
		// Also allow query param fallback ?api_key=...
		String qp = request.getParameter("api_key");
		return StringUtils.hasText(qp) ? qp.trim() : null;
	}

	private Set<String> getConfiguredKeys() {
		// Cache after first parse (property can be updated at restart)
		Set<String> keys = cachedKeys;
		if (!keys.isEmpty() || (apiKeysProperty != null)) {
			// parse property
			cachedKeys = parseKeys(apiKeysProperty);
			return cachedKeys;
		}
		cachedKeys = Collections.emptySet();
		return cachedKeys;
	}

	private Set<String> parseKeys(String csv) {
		if (!StringUtils.hasText(csv)) return Collections.emptySet();
		String[] parts = csv.split(",");
		Set<String> set = new HashSet<>();
		Arrays.stream(parts)
				.map(String::trim)
				.filter(StringUtils::hasText)
				.forEach(set::add);
		return set;
	}
}
