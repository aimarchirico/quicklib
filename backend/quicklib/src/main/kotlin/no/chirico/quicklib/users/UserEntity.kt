package no.chirico.quicklib.users

import jakarta.persistence.*
import java.time.Instant
import org.hibernate.annotations.CreationTimestamp

@Entity
@Table(name = "users")
class UserEntity(
  @Column(unique = true, nullable = false)
  val firebaseUid: String
) {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  val id: Long? = null

  @Column(nullable = false, updatable = false)
  @CreationTimestamp
  val createdAt: Instant = Instant.now()
}