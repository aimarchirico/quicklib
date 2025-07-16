package no.chirico.quicklib.security

import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.auth.oauth2.GoogleCredentials
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.io.File
import java.io.FileInputStream

@Configuration
class FirebaseConfig {
    companion object {
        private const val SERVICE_ACCOUNT_PATH = "/app/config/firebase-service-account.json"
    }

    @Bean
    fun firebaseApp(): FirebaseApp {
        // Firebase JSON is mounted from host via Docker volume
        val serviceAccount = FileInputStream(SERVICE_ACCOUNT_PATH)

        val options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .build()
        return FirebaseApp.initializeApp(options)
    }
}
