package com.kindercentrum.planner.features.locations.repository

import com.kindercentrum.planner.features.locations.model.entity.Location
import org.springframework.data.repository.CrudRepository

interface LocationRepository: CrudRepository<Location, String> {
    fun findByActiveIsTrue(): List<Location>
    fun findByIdAndActiveIsTrue(id: String): Location?
    fun findByNameAndActiveIsTrue(name: String): List<Location>
}
