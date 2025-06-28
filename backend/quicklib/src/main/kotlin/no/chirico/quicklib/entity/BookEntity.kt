package no.chirico.quicklib.entity

import jakarta.persistence.*
import java.time.Instant
import no.chirico.quicklib.entity.UserEntity

@Entity
@Table(name = "books")
data class BookEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    val user: UserEntity? = null,

    val title: String,
    val author: String,
    val series: String? = null,
    val sequenceNumber: Int? = null,
    val language: String,
    val isbn: String? = null,
    
    @Enumerated(EnumType.STRING)
    val collection: BookCollection,

    val timestamp: Instant? = Instant.now()
)

enum class BookCollection {
    LIBRARY, WISHLIST
}
