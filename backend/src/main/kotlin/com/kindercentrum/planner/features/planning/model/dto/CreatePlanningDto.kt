package com.kindercentrum.planner.features.planning.model.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class CreatePlanningDto(
    @field:NotNull(message = "Year is required")
    @field:Min(value = 2000, message = "Year must be at least 2000")
    @field:Max(value = 2100, message = "Year must not exceed 2100")
    val year: Int,

    @field:NotNull(message = "Month is required")
    @field:Min(value = 1, message = "Month must be between 1 and 12")
    @field:Max(value = 12, message = "Month must be between 1 and 12")
    val month: Int,

    @field:NotBlank(message = "Label is required")
    @field:Size(min = 2, max = 100, message = "Label must be between 2 and 100 characters")
    val label: String,
)
