package no.chirico.quicklib.auth

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseToken
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse

@Component
class FirebaseAuthenticationFilter : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val header = request.getHeader("Authorization")
        println("[FirebaseAuthFilter] Authorization header: $header")
        if (header != null && header.startsWith("Bearer ")) {
            val token = header.substring(7)
            try {
                println("[FirebaseAuthFilter] Verifying token...")
                val decodedToken: FirebaseToken = FirebaseAuth.getInstance().verifyIdToken(token)
                println("[FirebaseAuthFilter] Token verified. UID: ${decodedToken.uid}")
                val auth = UsernamePasswordAuthenticationToken(
                    decodedToken.uid, null, emptyList()
                )
                auth.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = auth
            } catch (e: Exception) {
                println("[FirebaseAuthFilter] Token verification failed: ${e.message}")
            }
        } else {
            println("[FirebaseAuthFilter] No Bearer token found in Authorization header.")
        }
        filterChain.doFilter(request, response)
    }
}
