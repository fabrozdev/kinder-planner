package com.kindercentrum.planner

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching

@SpringBootApplication
@EnableCaching
class PlanningSystemApplication

fun main(args: Array<String>) {
	runApplication<PlanningSystemApplication>(*args)
}
