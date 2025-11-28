package com.kindercentrum.planner.features.capacities.model.dto

import com.kindercentrum.planner.features.assignments.model.enum.DayOfWeek
import jakarta.validation.Valid
import jakarta.validation.constraints.NotNull
import java.util.UUID

data class CreatePlanningCapacityDto(
    @field:NotNull(message = "Planning ID is required")
    val planningId: UUID,

    @field:NotNull(message = "Location ID is required")
    val locationId: UUID,

    @field:NotNull(message = "Capacities map is required")
    val capacities: Map<DayOfWeek, @Valid DayCapacityDto>
)