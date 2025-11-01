package com.kindercentrum.planner.features.assignments.model.entity

import com.kindercentrum.planner.features.children.model.entity.Child
import com.kindercentrum.planner.features.locations.model.entity.Location
import com.kindercentrum.planner.features.users.model.entity.User
import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.Instant


@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "assignments")
data class Assignment(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "location_id", nullable = false, foreignKey = ForeignKey(name = "fk_assignment_location"))
    val location: Location,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_id", nullable = false, foreignKey = ForeignKey(name = "fk_assignment_child"))
    val child: Child,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", foreignKey = ForeignKey(name = "fk_assignment_created_by"))
    val createdBy: User? = null,

    @CreatedDate
    @Column(nullable = false, updatable = false)
    var createdAt: Instant? = null,
    @LastModifiedDate
    var updatedAt: Instant? = null,
)
