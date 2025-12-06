package com.kindercentrum.planner.features.capacities.model.entity

import com.kindercentrum.planner.features.assignments.model.enums.DayOfWeek
import com.kindercentrum.planner.features.locations.model.entity.Location
import com.kindercentrum.planner.features.planning.model.entity.Planning
import jakarta.persistence.*
import org.hibernate.annotations.Check
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.Instant
import java.util.*

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(
    name = "capacities",
    uniqueConstraints = [
        UniqueConstraint(columnNames = ["planning_id", "location_id", "day_of_week"])
    ]
)
data class Capacity(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: UUID? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "planning_id", nullable = false)
    val planning: Planning,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "location_id", nullable = false)
    val location: Location,

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false, length = 3)
    val dayOfWeek: DayOfWeek,

    @Column(name = "max_children", nullable = false)
    @Check(constraints = "max_children >= 0")
    val maxChildren: Int,

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant?  = null,

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant?  = null
) {
    init {
        require(maxChildren >= 0) { "Max children must be greater than or equal to 0" }
    }
}
