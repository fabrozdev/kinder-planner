package com.kindercentrum.planner.features.capacities.model.dto

import com.kindercentrum.planner.features.assignments.model.enum.DayOfWeek
import java.time.Instant
import java.util.*

data class CapacityDto(
    val id: UUID?,
    val monthId: UUID,
    val locationId: UUID,
    val dayOfWeek:DayOfWeek,
    val maxChildren: Int,
    val createdAt: Instant?,
    val updatedAt: Instant?
)
