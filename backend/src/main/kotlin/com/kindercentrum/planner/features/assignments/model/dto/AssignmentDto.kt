package com.kindercentrum.planner.features.assignments.model.dto

import com.kindercentrum.planner.features.children.model.dto.ChildDto

data class AssignmentDto(
    var id: String,
    var locationId: String,
    var dayOfWeek: Int,
    var childId: String,
    var child: ChildDto,
    var planningId: String,
    val note: String,
)
