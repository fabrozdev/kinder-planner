package com.kindercentrum.planner.features.assignments.model.mapper

import com.kindercentrum.planner.features.assignments.model.dto.AssignmentDto
import com.kindercentrum.planner.features.assignments.model.entity.Assignment
import com.kindercentrum.planner.features.children.model.mapper.ChildMapper
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.factory.Mappers

@Mapper(uses = [ChildMapper::class])
abstract class AssignmentMapper {
    companion object {
        val INSTANCE: AssignmentMapper = Mappers.getMapper(AssignmentMapper::class.java)
    }

    @Mapping(source = "location.id", target = "locationId")
    @Mapping(source = "child.id", target = "childId")
    @Mapping(source = "child", target = "child")
    @Mapping(source = "planning.id", target = "planningId")
    @Mapping(target = "dayOfWeek", expression = "java(assignment.getDayOfWeek().ordinal())")
    abstract fun toDto(assignment: Assignment): AssignmentDto
}
