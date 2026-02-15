package no.chirico.quicklib.security

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse

@Component
class ProxyValidationFilter : OncePerRequestFilter() {
    private val logger: Logger = LoggerFactory.getLogger(ProxyValidationFilter::class.java)
    
    @Value("\${client.proxy-secret:}")
    private lateinit var proxySecret: String

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        logger.info("ProxyValidationFilter: Processing request to ${request.requestURI}")
        logger.info("ProxyValidationFilter: proxySecret configured: '${proxySecret}' (isNotBlank: ${proxySecret.isNotBlank()})")
        
        if (proxySecret.isNotBlank()) {
            val headerValue = request.getHeader("X-Proxy-Secret")
            logger.info("ProxyValidationFilter: X-Proxy-Secret header value: '${headerValue}'")
            
            if (headerValue != proxySecret) {
                logger.warn("ProxyValidationFilter: Proxy secret validation FAILED - header '${headerValue}' does not match expected '${proxySecret}'")
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied: Invalid proxy header")
                return
            }
            logger.info("ProxyValidationFilter: Proxy secret validation PASSED")
        } else {
            logger.info("ProxyValidationFilter: Proxy secret not configured, skipping validation")
        }
        
        filterChain.doFilter(request, response)
    }
}