package com.kindercentrum.planner.features.planning.mapper

import com.kindercentrum.planner.features.planning.model.dto.PlanningDto
import com.kindercentrum.planner.features.planning.model.entity.Planning
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.factory.Mappers

@Mapper
fun interface PlanningMapper {
    companion object {
        val INSTANCE: PlanningMapper = Mappers.getMapper(PlanningMapper::class.java)
    }

    @Mapping(source = "location.id", target = "locationId")
    fun toDto(planning: Planning): PlanningDto
}
