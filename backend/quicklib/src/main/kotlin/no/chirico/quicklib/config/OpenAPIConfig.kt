package no.chirico.quicklib.config

import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.servers.Server
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OpenAPIConfig {

    @Value("\${APP_URL}")
    private lateinit var appUrl: String

    @Bean
    fun customOpenAPI(): OpenAPI {
        val server = Server()
            .url("$appUrl/api")
            .description("Server URL")
        
        return OpenAPI().servers(listOf(server))
    }
}
