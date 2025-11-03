package com.kindercentrum.planner.features.assignments.model.dto

data class CreateAssignmentDto(
    var locationId: String,
    var dayOfWeek: Int,
    var childId: String,
    var planningId: String,
    val note: String,
)
