package com.kindercentrum.planner.features.capacities.model.dto

import com.kindercentrum.planner.features.assignments.model.enums.DayOfWeek
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import java.util.*

data class UpdateCapacityDto(
    val planningId: UUID?,
    val locationId: UUID?,
    val dayOfWeek: DayOfWeek?,

    @field:Min(value = 0, message = "Max children must be at least 0")
    @field:Max(value = 100, message = "Max children must not exceed 100")
    val maxChildren: Int?
)