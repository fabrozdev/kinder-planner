package com.kindercentrum.planner.features.users.model.mapper

import com.kindercentrum.planner.features.users.model.dto.UserDto
import com.kindercentrum.planner.features.users.model.entity.User
import org.mapstruct.Mapper
import org.mapstruct.factory.Mappers
import kotlin.jvm.java

@Mapper
interface UserMapper {
    companion object {
        val INSTANCE: UserMapper = Mappers.getMapper(UserMapper::class.java)
    }

    fun toDto(user: User): UserDto
    fun toEmployee(employee: UserDto): User
}
