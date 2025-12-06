package com.kindercentrum.planner.features.capacities.model.dto

import com.kindercentrum.planner.features.assignments.model.enums.DayOfWeek
import java.time.Instant
import java.time.OffsetDateTime
import java.util.UUID

data class CapacityDto(
    val id: UUID,
    val planningId: UUID,
    val locationId: UUID,
    val dayOfWeek: DayOfWeek,
    val maxChildren: Int,
    val createdAt: Instant,
    val updatedAt: Instant
)
