package no.chirico.quicklib.books

import jakarta.persistence.*
import java.time.Instant
import no.chirico.quicklib.users.UserEntity
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction

@Entity
@Table(name = "books")
data class BookEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    var user: UserEntity? = null,

    var title: String,
    var author: String,
    var series: String? = null,
    var sequenceNumber: Int? = null,
    var language: String,
    var isbn: String? = null,
    
    @Enumerated(EnumType.STRING)
    var collection: BookCollection
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    val createdAt: Instant = Instant.now()
}

enum class BookCollection {
    READ, UNREAD, WISHLIST
}
