package com.kindercentrum.planner.features.planning.model.dto

import com.kindercentrum.planner.features.assignments.model.dto.AssignmentDto

data class PlanningWithAssignmentDto(
    val id: String,
    val year: Int,
    val month: Int,
    val locationId: String,
    val label: String,
    val assignments: List<AssignmentDto>,
)
