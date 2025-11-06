package com.kindercentrum.planner.features.children.service.import

class ImportProcessor<T, K>(private val importStrategy: ImportStrategy<T, K>) {
    fun read(data: T): K {
        return importStrategy.read(data)
    }
}
