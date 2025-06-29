package no.chirico.quicklib.entity

import jakarta.persistence.*
import java.time.Instant
import no.chirico.quicklib.entity.UserEntity
import org.hibernate.annotations.CreationTimestamp

@Entity
@Table(name = "books")
data class BookEntity(
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
    val collection: BookCollection
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    val createdAt: Instant = Instant.now()
}

enum class BookCollection {
    LIBRARY, WISHLIST
}
