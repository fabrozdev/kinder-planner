package com.kindercentrum.planner.features.locations.repository

import com.kindercentrum.planner.features.locations.model.entity.Location
import org.springframework.data.repository.CrudRepository
import java.util.UUID

interface LocationRepository: CrudRepository<Location, UUID> {
    fun findByActiveIsTrue(): List<Location>
    fun findByIdAndActiveIsTrue(id: UUID): Location?
    fun findByNameAndActiveIsTrue(name: String): List<Location>
}
