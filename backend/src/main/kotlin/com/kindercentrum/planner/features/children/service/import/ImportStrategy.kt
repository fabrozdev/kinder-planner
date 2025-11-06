package com.kindercentrum.planner.features.children.service.import

fun interface ImportStrategy<T, K> {
    fun read(data: T): K
}
