package com.kindercentrum.planner.features.capacities.model.mapper

import com.kindercentrum.planner.features.capacities.model.dto.CapacityDto
import com.kindercentrum.planner.features.capacities.model.entity.Capacity
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.factory.Mappers

@Mapper
abstract class CapacityMapper {
    companion object {
        val INSTANCE: CapacityMapper = Mappers.getMapper(CapacityMapper::class.java)
    }

    @Mapping(source = "planning.id", target = "planningId")
    @Mapping(source = "location.id", target = "locationId")
    abstract fun toDto(capacity: Capacity): CapacityDto
}