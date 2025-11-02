package com.kindercentrum.planner.features.planning.mapper

import com.kindercentrum.planner.features.planning.model.dto.PlanningDto
import com.kindercentrum.planner.features.planning.model.entity.Planning
import org.mapstruct.Mapper
import org.mapstruct.factory.Mappers

@Mapper
interface PlanningMapper {
    companion object {
        val INSTANCE: PlanningMapper = Mappers.getMapper(PlanningMapper::class.java)
    }

    fun toDto(planning: Planning): PlanningDto
    fun toPlanning(planningDto: PlanningDto): PlanningDto
}
