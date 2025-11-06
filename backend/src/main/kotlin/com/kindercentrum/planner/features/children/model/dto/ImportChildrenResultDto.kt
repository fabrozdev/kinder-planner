package com.kindercentrum.planner.features.children.model.dto

data class ImportChildrenResultDto(
    val importedCount: Int,
    val duplicates: List<CreateChildDto>
)