package com.kindercentrum.planner.features.planning.model.dto

data class PlanningDto(
    val id: String,
    val year: Int,
    val month: Int,
    val locationId: String,
    val label: String,
)
