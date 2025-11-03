package com.kindercentrum.planner.features.children.repository

import com.kindercentrum.planner.features.children.model.entity.Child
import org.springframework.data.repository.CrudRepository
import java.util.*

interface ChildRepository : CrudRepository<Child, UUID> {
    fun findAllByDeletedAtIsNull(): List<Child>
}
