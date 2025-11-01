package com.kindercentrum.planner.features.locations.model.mapper

import com.kindercentrum.planner.features.locations.model.dto.LocationDto
import com.kindercentrum.planner.features.locations.model.entity.Location
import com.kindercentrum.planner.features.users.model.dto.UserDto
import com.kindercentrum.planner.features.users.model.entity.User
import org.mapstruct.Mapper
import org.mapstruct.factory.Mappers
import kotlin.jvm.java

@Mapper
interface LocationMapper {
    companion object {
        val INSTANCE: LocationMapper = Mappers.getMapper(LocationMapper::class.java)
    }

    fun toDto(location: Location): LocationDto
    fun toLocation(location: LocationDto): Location
}
