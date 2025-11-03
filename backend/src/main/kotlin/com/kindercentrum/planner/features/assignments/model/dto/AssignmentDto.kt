package com.kindercentrum.planner.features.assignments.model.dto

data class AssignmentDto(
    var id: String,
    var locationId: String,
    var dayOfWeek: Int,
    var childId: String,
    var planningId: String,
    val note: String,
)
