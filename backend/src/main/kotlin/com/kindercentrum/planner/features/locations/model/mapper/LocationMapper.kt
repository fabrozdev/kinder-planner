package com.kindercentrum.planner.features.locations.model.mapper

import com.kindercentrum.planner.features.locations.model.dto.LocationDto
import com.kindercentrum.planner.features.locations.model.entity.Location
import org.mapstruct.Mapper
import org.mapstruct.factory.Mappers

@Mapper
interface LocationMapper {
    companion object {
        val INSTANCE: LocationMapper = Mappers.getMapper(LocationMapper::class.java)
    }

    fun toDto(location: Location): LocationDto
    fun toLocation(location: LocationDto): Location
}
