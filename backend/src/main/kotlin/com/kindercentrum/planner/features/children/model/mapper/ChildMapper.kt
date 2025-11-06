package com.kindercentrum.planner.features.children.model.mapper

import com.kindercentrum.planner.features.children.model.dto.ChildDto
import com.kindercentrum.planner.features.children.model.entity.Child
import org.mapstruct.Mapper
import org.mapstruct.factory.Mappers

@Mapper
fun interface ChildMapper {
    companion object {
        val INSTANCE: ChildMapper = Mappers.getMapper(ChildMapper::class.java)
    }

    fun toDto(child: Child): ChildDto
}
