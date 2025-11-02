package com.kindercentrum.planner.features.capacities.model.dto

import com.kindercentrum.planner.features.assignments.model.enum.DayOfWeek
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import java.util.*

data class CreateCapacityDto(
    @field:NotNull(message = "Month ID is required")
    val planningId: UUID,

    @field:NotNull(message = "Location ID is required")
    val locationId: UUID,

    @field:NotNull(message = "Day of week is required")
    val dayOfWeek: DayOfWeek,

    @field:NotNull(message = "Max children is required")
    @field:Min(value = 0, message = "Max children must be at least 0")
    @field:Max(value = 100, message = "Max children must not exceed 100")
    val maxChildren: Int
)
