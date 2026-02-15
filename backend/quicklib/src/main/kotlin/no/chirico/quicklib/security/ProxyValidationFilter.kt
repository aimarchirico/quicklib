package no.chirico.quicklib.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse

@Component
class ProxyValidationFilter : OncePerRequestFilter() {
    @Value("\${client.proxy-secret:}")
    private lateinit var proxySecret: String

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        if (proxySecret.isNotBlank()) {
            val headerValue = request.getHeader("X-Proxy-Secret")
            if (headerValue != proxySecret) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied: Invalid proxy header")
                return
            }
        }
        filterChain.doFilter(request, response)
    }
}