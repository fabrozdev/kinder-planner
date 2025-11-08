package com.kindercentrum.planner.features.planning.model.entity

import com.kindercentrum.planner.features.locations.model.entity.Location
import jakarta.persistence.*
import org.hibernate.annotations.Check
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.Instant
import java.util.*


@Entity
@Table(
    name = "planning",
    uniqueConstraints = [
        UniqueConstraint(columnNames = ["year", "month", "location_id"])
    ]
)
data class Planning(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @Column(nullable = false)
    @Check(constraints = "year >= 2000 AND year <= 2100")
    val year: Int,

    @Column(nullable = false)
    @Check(constraints = "month >= 1 AND month <= 12")
    val month: Int,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "location_id", nullable = false, foreignKey = ForeignKey(name = "fk_planning_location"))
    val location: Location,

    @Column(nullable = false)
    val label: String,

    @Column(name = "deleted_at")
    val deletedAt: Instant? = null,

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant? = null,

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant? = null
) {
    init {
        require(year in 2000..2100) { "Year must be between 2000 and 2100" }
        require(month in 1..12) { "Month must be between 1 and 12" }
    }
}
