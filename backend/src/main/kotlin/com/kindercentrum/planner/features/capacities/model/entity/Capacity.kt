package com.kindercentrum.planner.features.capacities.model.entity

import com.kindercentrum.planner.features.assignments.model.enums.DayOfWeek
import com.kindercentrum.planner.features.locations.model.entity.Location
import com.kindercentrum.planner.features.planning.model.entity.Planning
import jakarta.persistence.*
import org.hibernate.annotations.Check
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.OffsetDateTime
import java.util.UUID

@Entity
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

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: OffsetDateTime? = null,

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    var updatedAt: OffsetDateTime? = null
) {
    init {
        require(maxChildren >= 0) { "Max children must be greater than or equal to 0" }
    }
}
