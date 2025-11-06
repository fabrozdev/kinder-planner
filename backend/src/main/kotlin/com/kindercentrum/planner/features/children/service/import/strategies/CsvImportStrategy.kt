package com.kindercentrum.planner.features.children.service.import.strategies

import com.kindercentrum.planner.features.children.model.dto.CreateChildDto
import com.kindercentrum.planner.features.children.service.import.ImportStrategy
import java.io.InputStream

class CsvImportStrategy : ImportStrategy<InputStream, List<CreateChildDto>> {
    override fun read(data: InputStream): List<CreateChildDto> {
        val reader = data.bufferedReader()
        //val header = reader.readLine()
        return reader.lineSequence()
            .filter { it.isNotBlank() }
            .map {
                val (firstName, lastName) = it.split(',', ignoreCase = false, limit = 2)
               CreateChildDto(firstName, lastName);
            }.toList()
    }
}
