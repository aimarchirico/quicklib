package no.chirico.quicklib.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.security.core.Authentication

@RestController
@RequestMapping("/api/test-auth")
class TestAuthController {
    @GetMapping("")
    fun testAuth(authentication: Authentication?): Map<String, Any?> {
        println("Controller authentication: $authentication")
        return mapOf(
            "authenticated" to (authentication != null),
            "principal" to authentication?.principal
        )
    }
}
