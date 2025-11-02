package com.kindercentrum.planner.features.users.model.entity

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.Instant
import java.util.*

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,
    val firstName: String,
    val lastName: String,
    val email: String,
    @CreatedDate
    @Column(nullable = false, updatable = false)
    var createdAt: Instant? = null,
    @LastModifiedDate
    var updatedAt: Instant? = null,
    val deletedAt: Instant? = null
)
